import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { expeditionOptions } from '../../../constans/expedition';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CitySelector from '../../../components/CitySelector';

const Checkout = () => {
  const navigate = useNavigate();
  const { user_id, transaction_uuid } = useParams();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const jubelioUrl = import.meta.env.VITE_API_URL;

  // State untuk Alamat
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  // State untuk Seleksi Alamat
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // State untuk Pengiriman dan Pembayaran
  const [selectedExpedition, setSelectedExpedition] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [shippingCosts, setShippingCosts] = useState([]);
  const [totalWithShipping, setTotalWithShipping] = useState(0);

  // State untuk Points
  const [userPoints, setUserPoints] = useState({
    available_points: 0,
    points_value: 0,
  });
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  // State untuk Produk Jubelio
  const [productJubelio, setProductJubelio] = useState(null);
  const [productCategory, setProductCategory] = useState('');

  // State untuk Voucher
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherData, setVoucherData] = useState(null);
  const [voucherList, setVoucherList] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // State untuk Button
  const [buttonText, setButtonText] = useState('Bayar Sekarang');

  // Fetch Script Midtrans
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

  // Fetch data produk dari Jubelio
  const fetchJubelioProduct = async (productId) => {
    try {
      const pos_token = Cookies.get('pos_token');
      if (!pos_token) {
        throw new Error('POS Token tidak ditemukan');
      }

      const response = await axios.get(`${jubelioUrl}/inventory/items/${productId}`, {
        headers: {
          Authorization: `Bearer ${pos_token}`,
          'Content-Type': 'application/json',
        },
      });
      setProductJubelio(response.data);

      // Tentukan kategori produk
      const category_id = response.data.item_category_id;
      const apparel = [18215, 18218, 18210, 18216, 18199, 18198, 18209, 18217, 18200];
      const sneakers = [5472, 999, 1013, 12780, 12803, 1027, 18710, 7545, 17895];
      const accessories = [7339, 7340, 17860, 1147, 7332, 1143, 10217, 36, 5516];

      let category = '';
      if (apparel.includes(category_id)) {
        category = 'apparel';
      } else if (sneakers.includes(category_id)) {
        category = 'sneakers';
      } else if (accessories.includes(category_id)) {
        category = 'accessories';
      }
      setProductCategory(category);
    } catch (error) {
      console.error('Error fetching Jubelio product:', error);
      toast.error('Gagal memuat data produk dari Jubelio');
    }
  };

  // Fetch Data Transaksi
  const fetchTransaction = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/transaction/${user_id}/${transaction_uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactionData(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to fetch transaction data.');
      toast.error('Gagal memuat data transaksi', { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data awal
  useEffect(() => {
    if (user_id) {
      const fetchInitialData = async () => {
        try {
          const transactionResponse = await fetchTransaction();
          if (transactionResponse && transactionResponse.length > 0) {
            await fetchJubelioProduct(transactionResponse[0].product_id);
          }
          await Promise.all([fetchAddresses(), fetchCities(), fetchUserPoints(), fetchVoucherByUserId()]);
        } catch (error) {
          console.error('Error fetching initial data:', error);
          toast.error('Gagal memuat beberapa data');
        }
      };
      fetchInitialData();
    }
  }, [user_id]);

  // Fetch Voucher
  const fetchVoucherByUserId = async () => {
    try {
      const token = Cookies.get('accessToken');

      const response = await axios.get(`${backendUrl}/voucher/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVoucherList(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Gagal memuat data voucher');
    }
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/getAddress/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Gagal memuat alamat tersimpan');
    }
  };

  // Fetch Cities
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/rajacity`);
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Gagal memuat daftar kota');
    }
  };

  // Fetch User Points
  const fetchUserPoints = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/membership/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPoints({
        available_points: response.data.current_points || 0,
        points_value: response.data.points_value_idr || 0,
      });
    } catch (error) {
      console.error('Error fetching points:', error);
      toast.error('Gagal memuat data points');
    }
  };

  // Fetch Subdistricts when City is Selected
  useEffect(() => {
    if (selectedCity) {
      fetchSubdistricts(selectedCity);
    }
  }, [selectedCity]);

  // Fetch Subdistricts
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
      toast.error('Gagal memuat daftar kecamatan');
    }
  };

  // Implement Voucher
  const implementVoucher = async (productId, price) => {
    try {
      if (!productJubelio) {
        throw new Error('Data produk Jubelio tidak tersedia');
      }

      const token = Cookies.get('accessToken');
      let endpoint = `${backendUrl}/voucher/${user_id}`;
      const productName = productJubelio.item_group_name.toLowerCase();
      const isSixstreet = productName.includes('sixstreet');

      // Validasi kategori voucher
      if (!productCategory && !isSixstreet) {
        throw new Error('Kategori produk tidak valid');
      }

      if (isSixstreet) {
        endpoint = `${backendUrl}/voucher_sixstreet/${user_id}`;
      } else if (selectedVoucher.applicableProducts.toLowerCase() !== productCategory.toLowerCase()) {
        throw new Error(`Voucher hanya berlaku untuk produk ${selectedVoucher.applicableProducts}`);
      }

      const response = await axios.post(
        endpoint,
        {
          product_id: productId,
          price: price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVoucherData(response.data);
      setVoucherApplied(true);
      setVoucherError('');

      const newTotal = totalWithShipping - response.data.discountAmount;
      setTotalWithShipping(newTotal);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      console.error('Error implementing voucher:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setVoucherError(errorMessage);
      toast.error(errorMessage);
      setVoucherApplied(false);
      setVoucherData(null);
    }
  };

  // Handle Apply Voucher
  const handleApplyVoucher = async () => {
    if (!transactionData?.length || !productJubelio) {
      toast.error('Data transaksi atau produk tidak tersedia');
      return;
    }

    if (!selectedVoucher) {
      toast.error('Silakan pilih voucher terlebih dahulu');
      return;
    }

    const productId = transactionData[0].product_id;
    const price = transactionData[0].product_price * transactionData[0].quantity;
    const productName = productJubelio.item_group_name.toLowerCase();
    const isSixstreet = productName.includes('sixstreet');

    // Validasi voucher Sixstreet
    if (isSixstreet && selectedVoucher.applicableProducts !== 'sixstreet') {
      toast.error('Produk Sixstreet hanya bisa menggunakan voucher Sixstreet');
      return;
    }

    if (!isSixstreet && selectedVoucher.applicableProducts === 'sixstreet') {
      toast.error('Voucher Sixstreet hanya bisa digunakan untuk produk Sixstreet');
      return;
    }

    // Validasi kategori untuk non-Sixstreet
    if (!isSixstreet && selectedVoucher.applicableProducts.toLowerCase() !== productCategory.toLowerCase()) {
      toast.error(`Voucher ${selectedVoucher.code} hanya dapat digunakan untuk produk ${selectedVoucher.applicableProducts}`);
      return;
    }

    await implementVoucher(productId, price);
  };

  // Handle Expedition Change
  const handleExpeditionChange = (e) => {
    const expedition = e.target.value;
    setSelectedExpedition(expedition);
    setSelectedProvider('');
    calculateShipping(selectedAddress.subdistrict_id, expedition);
  };

  // Calculate Shipping
  const calculateShipping = async (subdistrictId, courier = 'jne') => {
    try {
      const response = await axios.post(`${backendUrl}/rajacost`, {
        origin: '3917',
        originType: 'subdistrict',
        destination: subdistrictId,
        destinationType: 'subdistrict',
        weight: 1000,
        courier: courier,
      });

      const shippingResults = response.data.rajaongkir.results[0].costs;
      setShippingCosts(shippingResults);

      if (shippingResults.length > 0) {
        const firstService = shippingResults[0];
        setSelectedProvider(firstService.service);
        updateTotalWithShipping(firstService.cost[0].value);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast.error('Gagal menghitung biaya pengiriman');
    }
  };

  // Update Total with Shipping
  const updateTotalWithShipping = (shippingCost) => {
    const subtotal = transactionData.reduce((acc, transaction) => {
      return acc + transaction.product_price * transaction.quantity;
    }, 0);
    setTotalWithShipping(subtotal + shippingCost);
  };

  // Handle Provider Change
  const handleProviderChange = (e) => {
    const service = shippingCosts.find((s) => s.service === e.target.value);
    setSelectedProvider(e.target.value);
    if (service) {
      updateTotalWithShipping(service.cost[0].value);
    }
  };

  // Handle Address Selection
  const handleAddressSelection = (addressId) => {
    const address = addresses.find((a) => a.id === parseInt(addressId));
    if (address) {
      setSelectedAddress(address);
      setSelectedCity(address.city_id);
      setSelectedSubdistrict(address.subdistrict_id);
      setDetailAddress(address.detail_address);
      calculateShipping(address.subdistrict_id);
    }
  };

  // Handle Add New Address
  const handleAddNewAddress = () => {
    navigate(`/profile/${user_id}?redirectToCheckout=true`);
  };

  // Format Currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format Date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
  };

  // Handle Payment
  const handlePayment = async () => {
    if (!selectedAddress || !selectedExpedition || !selectedProvider) {
      toast.error('Mohon lengkapi semua data pengiriman');
      return;
    }

    setButtonText('Pembayaran Sedang Diproses...');

    try {
      const token = Cookies.get('accessToken');
      const selectedService = shippingCosts.find((s) => s.service === selectedProvider);
      const shippingCost = selectedService ? selectedService.cost[0].value : 0;

      // Proses redeem points jika digunakan
      if (usePoints && pointsToUse > 0) {
        try {
          await axios.post(
            `${backendUrl}/points/redeem`,
            {
              user_id,
              points_to_use: pointsToUse,
              transaction_uuid,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error('Error redeeming points:', error);
          toast.error('Gagal menggunakan points');
          return;
        }
      }

      // Hitung total akhir setelah points dan voucher
      const pointsDiscount = pointsToUse * 1000;
      const voucherDiscount = voucherApplied && voucherData ? voucherData.discountAmount : 0;

      // Hitung final total sekaligus
      const finalTotal = Math.max(0, totalWithShipping - pointsDiscount - voucherDiscount);

      // Update data transaksi
      const updateData = {
        user_id,
        transaction_uuid,
        name: transactionData[0].name,
        city: `${selectedAddress.city_type} ${selectedAddress.city_name}`,
        sub_district: selectedAddress.subdistrict_name,
        detail_address: selectedAddress.detail_address,
        expedition: selectedExpedition,
        expedition_services: selectedProvider,
        etd: selectedService ? selectedService.cost[0].etd || '1-7' : '',
        product_id: transactionData[0].product_id,
        product_name: transactionData[0].product_name,
        product_price: transactionData[0].product_price,
        product_size: transactionData[0].product_size,
        quantity: transactionData[0].quantity,
        total: finalTotal,
        points_used: pointsToUse,
        points_value: pointsToUse * 1000,
        voucher_applied: voucherApplied,
        voucher_discount: voucherApplied ? voucherData.discountAmount : 0,
        final_total: finalTotal,
        status: 'PENDING',
      };

      await axios.put(`${backendUrl}/transaction/${user_id}/${transaction_uuid}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Persiapkan data pembayaran
      const paymentData = {
        transaction_id: transaction_uuid,
        name: transactionData[0].name,
        city: updateData.city,
        sub_district: updateData.sub_district,
        detail_address: selectedAddress.detail_address,
        expedition: selectedExpedition,
        expedition_services: selectedProvider,
        etd: updateData.etd,
        items: transactionData.map((transaction) => ({
          id: transaction.product_id,
          price: transaction.product_price,
          quantity: transaction.quantity,
          name: transaction.product_name,
        })),
        shipping_cost: shippingCost,
        points_discount: pointsToUse * 1000,
        voucher_discount: voucherApplied ? voucherData.discountAmount : 0,
        final_amount: finalTotal,
      };

      // Proses pembayaran
      const response = await axios.post(`${backendUrl}/payment`, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Midtrans Payment
      if (window.snap && response.data.token) {
        window.snap.pay(response.data.token, {
          onSuccess: async function (result) {
            try {
              const token = Cookies.get('accessToken');

              await axios.post(
                `${backendUrl}/points/process/${transaction_uuid}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              toast.success('Pembayaran berhasil!', { autoClose: 1500 });
              navigate('/thank-you');
            } catch (error) {
              console.error('Error processing points:', error);
              toast.error('Pembayaran berhasil, tetapi gagal memproses points');
              navigate('/thank-you');
            }
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
        toast.error('Terjadi kesalahan pada sistem pembayaran');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setButtonText('Bayar Sekarang');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white my-[5rem] lg:my-[7rem]">
      {transactionData.length > 0 ? (
        <div className="bg-white p-8 shadow-md mx-3 md:max-w-[50rem] w-full space-y-10">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Detail Transaksi</h2>

          <div className="flex flex-col space-y-4 font-overpass">
            {/* Transaction Basic Info */}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Tanggal Transaksi</p>
              <p className="font-overpass md:text-end">{formatDate(transactionData[0].createdAt)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Pembeli</p>
              <p className="font-overpass md:text-end">{transactionData[0].name}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaksi</p>
              <p className="font-overpass md:text-end">{transaction_uuid}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Produk</p>
              <p className="font-overpass md:text-end">{transactionData.map((transaction) => transaction.product_name).join(', ')}</p>
            </div>

            {/* Voucher Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-overpass font-bold text-lg">Voucher</h3>
              {productJubelio ? (
                voucherList.length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    <select
                      value={selectedVoucher ? selectedVoucher.id : ''}
                      onChange={(e) => {
                        const voucher = voucherList.find((v) => v.id === parseInt(e.target.value));
                        setSelectedVoucher(voucher);
                      }}
                      className="font-overpass p-2 border rounded"
                    >
                      <option value="">Pilih Voucher</option>
                      {voucherList
                        .filter((voucher) => {
                          if (voucher.isUsed) return false;

                          const productName = productJubelio.item_group_name.toLowerCase();
                          const isSixstreet = productName.includes('sixstreet');
                          if (isSixstreet) {
                            return voucher.applicableProducts.toLowerCase() === 'sixstreet';
                          }
                          return voucher.applicableProducts.toLowerCase() === productCategory.toLowerCase();
                        })
                        .map((voucher) => (
                          <option key={voucher.id} value={voucher.id}>
                            {voucher.code} - {voucher.discountPercentage}% ({voucher.applicableProducts})
                          </option>
                        ))}
                    </select>

                    {selectedVoucher && (
                      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                        <p>Voucher ini berlaku untuk produk {selectedVoucher.applicableProducts}</p>
                        <p>Diskon: {selectedVoucher.discountPercentage}%</p>
                        <p>Berlaku sampai: {formatDate(selectedVoucher.validUntil)}</p>
                      </div>
                    )}

                    <button
                      onClick={handleApplyVoucher}
                      disabled={!selectedVoucher || voucherApplied}
                      className={`px-4 py-2 rounded ${!selectedVoucher || voucherApplied ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#333] text-white hover:bg-[#444]'}`}
                    >
                      {voucherApplied ? 'Voucher DiGunakan' : 'Gunakan Voucher'}
                    </button>

                    {voucherError && <p className="text-red-500 text-sm">{voucherError}</p>}

                    {voucherApplied && voucherData && (
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-green-700">Voucher berhasil digunakan! Potongan: {formatCurrency(voucherData.discountAmount)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Tidak ada voucher tersedia</p>
                )
              ) : (
                <p className="text-gray-500">Memuat data produk...</p>
              )}
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-overpass font-bold text-lg">Pilih Alamat Pengiriman</h3>
              {addresses.length > 0 ? (
                <div className="flex flex-col space-y-2">
                  <select value={selectedAddress ? selectedAddress.id : ''} onChange={(e) => handleAddressSelection(e.target.value)} className="font-overpass p-2 border rounded">
                    <option value="">Pilih Alamat Tersimpan</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {`${address.city_type} ${address.city_name}, ${address.subdistrict_name}`}
                      </option>
                    ))}
                  </select>

                  <button onClick={handleAddNewAddress} className="text-blue-500 hover:underline text-sm self-start">
                    Tambah Alamat Baru
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Anda belum memiliki alamat tersimpan</p>
                  <button onClick={handleAddNewAddress} className="bg-[#333] text-white py-2 px-4 rounded">
                    Tambah Alamat
                  </button>
                </div>
              )}

              {selectedAddress && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p>
                    <strong>Detail Alamat:</strong> {selectedAddress.detail_address}
                  </p>
                  <p>
                    <strong>Kecamatan:</strong> {selectedAddress.subdistrict_name}
                  </p>
                  <p>
                    <strong>Kota:</strong> {selectedAddress.city_type} {selectedAddress.city_name}
                  </p>
                  <p>
                    <strong>Provinsi:</strong> {selectedAddress.province_name}
                  </p>
                  <p>
                    <strong>Kode Pos:</strong> {selectedAddress.postal_code}
                  </p>
                </div>
              )}
            </div>

            {/* Expedition Section */}
            {selectedAddress && (
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

            {/* Shipping Service Section */}
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

            {/* Points Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="font-overpass font-semibold">Points Tersedia</p>
                <p className="font-overpass">
                  {userPoints.available_points} Points (Rp {formatCurrency(userPoints.points_value)})
                </p>
              </div>

              {userPoints.available_points > 0 && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="usePoints"
                    checked={usePoints}
                    onChange={(e) => {
                      setUsePoints(e.target.checked);
                      if (!e.target.checked) setPointsToUse(0);
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor="usePoints" className="font-overpass">
                    Gunakan Points untuk Pembayaran
                  </label>
                </div>
              )}

              {usePoints && userPoints.available_points > 0 && (
                <div className="flex flex-col space-y-2">
                  <input
                    type="number"
                    min="0"
                    max={userPoints.available_points}
                    value={pointsToUse}
                    onChange={(e) => {
                      const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), userPoints.available_points);
                      setPointsToUse(value);
                    }}
                    className="border rounded p-2"
                    placeholder="Jumlah points yang ingin digunakan"
                  />
                  <p className="text-sm text-gray-600">Nilai Points: Rp {formatCurrency(pointsToUse * 1000)}</p>
                </div>
              )}
            </div>

            {/* Total Summary Section */}
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
                {voucherApplied && voucherData && (
                  <div className="flex flex-col md:flex-row justify-between">
                    <p className="font-overpass font-semibold">Potongan Voucher</p>
                    <p className="font-overpass md:text-end">- {formatCurrency(voucherData.discountAmount)}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="font-overpass font-semibold">Potongan Points</p>
                  <p className="font-overpass">- {formatCurrency(pointsToUse * 1000)}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between font-bold">
                  <p className="font-overpass">Total Pembayaran</p>
                  <p className="font-overpass md:text-end">{formatCurrency(Math.max(0, totalWithShipping - (voucherData?.discountAmount || 0) - pointsToUse * 1000))}</p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!selectedAddress || !selectedExpedition || !selectedProvider}
              className={`w-full py-2 px-4 rounded font-overpass capitalize ${!selectedAddress || !selectedExpedition || !selectedProvider ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      ) : (
        <p>Data transaksi tidak tersedia.</p>
      )}
    </div>
  );
};

export default Checkout;
