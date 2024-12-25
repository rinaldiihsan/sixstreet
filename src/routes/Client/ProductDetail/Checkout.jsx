import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { expeditionOptions } from '../../../constans/expedition';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { user_id, transaction_uuid } = useParams();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [selectedExpedition, setSelectedExpedition] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [shippingCosts, setShippingCosts] = useState([]);
  const [totalWithShipping, setTotalWithShipping] = useState(0);
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchSubdistricts(selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`${backendUrl}/transaction/${user_id}/${transaction_uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactionData(response.data);
      } catch (err) {
        setError('Failed to fetch transaction data.');
        toast.error('Gagal memuat data transaksi', { autoClose: 1500 });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [user_id, transaction_uuid, backendUrl]);

  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/rajacity`);
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Gagal memuat daftar kota', { autoClose: 1500 });
    }
  };

  const fetchSubdistricts = async (cityId) => {
    try {
      const response = await axios.get(`${backendUrl}/rajasubdistrict/${cityId}`);
      setSubdistricts(response.data.rajaongkir.results);
      setSelectedSubdistrict('');
      setSelectedExpedition('');
      setSelectedProvider('');
      setShippingCosts([]);
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      toast.error('Gagal memuat daftar kecamatan', { autoClose: 1500 });
    }
  };

  const handleExpeditionChange = (e) => {
    const expedition = e.target.value;
    setSelectedExpedition(expedition);
    setSelectedProvider('');
    if (selectedSubdistrict) {
      calculateShipping(selectedSubdistrict, expedition);
    } else {
      toast.warning('Silakan pilih kecamatan terlebih dahulu', { autoClose: 1500 });
    }
  };

  const calculateShipping = async (subdistrictId, courier) => {
    try {
      const response = await axios.post(`${backendUrl}/rajacost`, {
        origin: '3917',
        originType: 'subdistrict',
        destination: subdistrictId,
        destinationType: 'subdistrict',
        weight: 1000,
        courier: courier,
      });
      setShippingCosts(response.data.rajaongkir.results[0].costs);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast.error('Gagal menghitung biaya pengiriman', { autoClose: 1500 });
    }
  };

  const updateTotalWithShipping = (shippingCost) => {
    const subtotal = transactionData.reduce((acc, transaction) => {
      return acc + transaction.product_price * transaction.quantity;
    }, 0);
    setTotalWithShipping(subtotal + shippingCost);
  };

  const handleProviderChange = (e) => {
    const service = shippingCosts.find((s) => s.service === e.target.value);
    setSelectedProvider(e.target.value);
    if (service) {
      updateTotalWithShipping(service.cost[0].value);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
  };

  const handlePayment = async () => {
    if (!selectedCity || !selectedSubdistrict || !selectedExpedition || !selectedProvider || !detailAddress) {
      toast.error('Mohon lengkapi semua data pengiriman', { autoClose: 1500 });
      return;
    }

    const selectedService = shippingCosts.find((s) => s.service === selectedProvider);
    const shippingCost = selectedService ? selectedService.cost[0].value : 0;
    const selectedCityData = cities.find((city) => city.city_id === selectedCity);
    const selectedSubdistrictData = subdistricts.find((sub) => sub.subdistrict_id === selectedSubdistrict);

    try {
      const token = Cookies.get('accessToken');

      // Pastikan semua data terisi
      const updateData = {
        user_id,
        transaction_uuid, // Tambahkan ini
        name: transactionData[0].name,
        city: selectedCityData ? `${selectedCityData.type} ${selectedCityData.city_name}` : '',
        sub_district: selectedSubdistrictData ? selectedSubdistrictData.subdistrict_name : '',
        detail_address: detailAddress,
        expedition: selectedExpedition,
        expedition_services: selectedProvider,
        etd: selectedService ? selectedService.cost[0].etd || '1-7' : '',
        resi: '',
        product_id: transactionData[0].product_id,
        product_name: transactionData[0].product_name,
        product_price: transactionData[0].product_price,
        product_size: transactionData[0].product_size,
        quantity: transactionData[0].quantity,
        total: totalWithShipping,
        status: 'PENDING',
      };

      // Update transaction in database
      await axios.put(`${backendUrl}/transaction/${user_id}/${transaction_uuid}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Proceed with payment gateway
      const paymentData = {
        transaction_id: transaction_uuid,
        name: transactionData[0].name,
        city: updateData.city,
        sub_district: updateData.sub_district,
        detail_address: detailAddress,
        expedition: selectedExpedition,
        expedition_services: selectedProvider,
        etd: updateData.etd,
        resi: '',
        items: transactionData.map((transaction) => ({
          id: transaction.product_id,
          price: transaction.product_price,
          quantity: transaction.quantity,
          name: transaction.product_name,
        })),
        shipping_cost: shippingCost,
      };

      const response = await axios.post(`${backendUrl}/payment`, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (window.snap && response.data.token) {
        window.snap.pay(response.data.token, {
          onSuccess: function (result) {
            toast.success('Pembayaran berhasil!', { autoClose: 1500 });
            navigate('/thank-you');
          },
          onPending: function (result) {
            toast.info('Pembayaran dalam proses', { autoClose: 1500 });
          },
          onError: function (result) {
            console.error('Payment error:', result);
            toast.error('Pembayaran gagal');
          },
          onClose: function () {
            toast.warning('Pembayaran dibatalkan', { autoClose: 1500 });
          },
        });
      } else {
        console.error('Snap not available or token missing');
        toast.error('Terjadi kesalahan pada sistem pembayaran', { autoClose: 1500 });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Gagal memproses pembayaran', { autoClose: 1500 });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const productNames = transactionData.map((transaction) => transaction.product_name).join(', ');
  const productSizes = transactionData.map((transaction) => transaction.product_size).join(', ');
  const quantities = transactionData.map((transaction) => transaction.quantity).join(', ');
  const total = transactionData.length > 0 ? transactionData[0].total : 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white my-[5rem] lg:my-[7rem]">
      {transactionData.length > 0 ? (
        <div className="bg-white p-8 shadow-md mx-3 md:max-w-[50rem] w-full space-y-10">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Detail Transaksi</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Tanggal Transaksi</p>
              <p className="font-overpass md:text-end">{formatDate(transactionData[0].createdAt)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaksi</p>
              <p className="font-overpass md:text-end">{transaction_uuid}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Produk</p>
              <p className="font-overpass md:text-end">{productNames}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Ukuran Produk</p>
              <p className="font-overpass md:text-end">{productSizes}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Jumlah</p>
              <p className="font-overpass md:text-end">{quantities}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Total Pembelian</p>
              <p className="font-overpass md:text-end">{formatCurrency(total)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Penerima</p>
              <p className="font-overpass md:text-end">{transactionData[0].name}</p>
            </div>
            {/* City Selection */}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Kota/Kabupaten Tujuan</p>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                }}
                className="font-overpass md:text-end p-2 border rounded"
              >
                <option value="">Pilih kota/kabupaten</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.type} {city.city_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Subdistrict Selection */}
            {selectedCity && (
              <div className="flex flex-col md:flex-row justify-between">
                <p className="font-overpass font-semibold">Kecamatan</p>
                <select
                  value={selectedSubdistrict}
                  onChange={(e) => {
                    setSelectedSubdistrict(e.target.value);
                    if (selectedExpedition) {
                      calculateShipping(e.target.value, selectedExpedition);
                    }
                  }}
                  className="font-overpass md:text-end p-2 border rounded"
                >
                  <option value="">Pilih kecamatan</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict.subdistrict_id} value={subdistrict.subdistrict_id}>
                      {subdistrict.subdistrict_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSubdistrict && (
              <div className="flex flex-col md:flex-row justify-between">
                <p className="font-overpass font-semibold">Alamat Detail</p>
                <textarea value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="Masukkan alamat lengkap" className="font-overpass md:text-end p-2 border rounded w-full md:w-1/2" rows="3" />
              </div>
            )}

            {/* Expedition Section */}
            {selectedSubdistrict && (
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-overpass font-bold text-lg">Pilihan Ekspedisi</h3>
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Pilih Ekspedisi</p>
                  <select value={selectedExpedition} onChange={handleExpeditionChange} className="font-overpass md:text-end p-2 border rounded">
                    <option value="">Pilih ekspedisi</option>
                    {expeditionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Provider Section */}
            {selectedExpedition && shippingCosts.length > 0 && (
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-overpass font-bold text-lg">Layanan Pengiriman</h3>
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Pilih Layanan</p>
                  <select value={selectedProvider} onChange={handleProviderChange} className="font-overpass md:text-end p-2 border rounded w-full md:w-auto">
                    <option value="">Pilih layanan</option>
                    {shippingCosts.map((service) => {
                      const etdText = service.cost[0].etd === '' ? '1-7' : service.cost[0].etd;
                      return (
                        <option key={service.service} value={service.service}>
                          {service.service} - {formatCurrency(service.cost[0].value)} - {etdText} hari
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedProvider && (
                  <div className="mt-2 space-y-2">
                    {shippingCosts
                      .filter((service) => service.service === selectedProvider)
                      .map((service) => {
                        const etdText = service.cost[0].etd === '' ? '1-7' : service.cost[0].etd;
                        return (
                          <div key={service.service} className="text-sm font-overpass">
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-gray-600">Estimasi pengiriman: {etdText} hari</p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {selectedProvider && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Subtotal Produk</p>
                  <p className="font-overpass md:text-end">{formatCurrency(transactionData.reduce((acc, item) => acc + item.product_price * item.quantity, 0))}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Biaya Pengiriman ({selectedProvider})</p>
                  <p className="font-overpass md:text-end">{formatCurrency(shippingCosts.find((s) => s.service === selectedProvider)?.cost[0].value || 0)}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between font-bold">
                  <p className="font-overpass">Total Pembayaran</p>
                  <p className="font-overpass md:text-end">{formatCurrency(totalWithShipping)}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Status</p>
              <p className="font-overpass md:text-end">{transactionData[0].status}</p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!selectedSubdistrict || !selectedExpedition || !selectedProvider}
            className={`w-full py-2 px-4 rounded font-overpass capitalize ${!selectedSubdistrict || !selectedExpedition || !selectedProvider ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
          >
            Bayar Sekarang
          </button>
        </div>
      ) : (
        <p>Data transaksi tidak tersedia.</p>
      )}
    </div>
  );
};

export default Checkout;
