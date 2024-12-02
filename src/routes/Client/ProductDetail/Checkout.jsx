import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Checkout = () => {
  const { user_id, transaction_uuid } = useParams();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const rajaOngkirUrl = import.meta.env.VITE_RAJA_ONGKIR;
  const rajaOngkirKey = import.meta.env.VITE_RAJA_ONGKIR_API_KEY;
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExpedition, setSelectedExpedition] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [shippingCosts, setShippingCosts] = useState([]);

  const expeditionOptions = [
    { value: 'jne', label: 'JNE' },
    { value: 'tiki', label: 'Tiki' },
    { value: 'pos', label: 'Pos Indonesia' },
  ];

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${rajaOngkirUrl}/city`, {
        headers: {
          key: rajaOngkirKey,
        },
      });
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleExpeditionChange = (e) => {
    const expedition = e.target.value;
    setSelectedExpedition(expedition);
    setSelectedProvider('');
    if (selectedCity) {
      calculateShipping(selectedCity, expedition);
    }
  };

  const calculateShipping = async (cityId, courier) => {
    try {
      const response = await axios.post(
        `${rajaOngkirUrl}/cost`,
        {
          origin: '153',
          destination: cityId,
          weight: 1000,
          courier: courier,
        },
        {
          headers: {
            key: rajaOngkirKey,
          },
        }
      );
      setShippingCosts(response.data.rajaongkir.results[0].costs);
    } catch (error) {
      console.error('Error calculating shipping:', error);
    }
  };

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
    const items = transactionData.map((transaction) => ({
      id: transaction.product_id,
      price: transaction.product_price,
      quantity: transaction.quantity,
      name: transaction.product_name,
    }));

    const data = {
      transaction_id: transactionData[0].transaction_uuid,
      name: transactionData[0].name,
      address: transactionData[0].address,
      items: items,
      total: transactionData.reduce((acc, transaction) => acc + transaction.total, 0),
    };

    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post(`${backendUrl}/payment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (window.snap && response.data.token) {
        window.snap.pay(response.data.token, {
          onSuccess: function (result) {
            console.log('Payment success:', result);
            navigate('/thank-you');
          },
          onPending: function (result) {
            console.log('Payment pending:', result);
          },
          onError: function (result) {
            console.error('Payment error:', result);
          },
          onClose: function () {
            console.log('Payment closed');
          },
        });
      } else {
        console.error('Snap not available or token missing');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const productNames = transactionData.map((transaction) => transaction.product_name).join(', ');
  const productSizes = transactionData.map((transaction) => transaction.product_size).join(', ');
  const quantities = transactionData.map((transaction) => transaction.quantity).join(', ');
  const total = transactionData.length > 0 ? transactionData[0].total : 0;

  return (
    <div className="flex justify-center items-center h-screen bg-white my-[5rem] md:my-0">
      {transactionData.length > 0 ? (
        <div className="bg-white p-8 shadow-md mx-3 md:max-w-[50rem] w-full space-y-10">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Transaction Detail</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Transaction Date</p>
              <p className="font-overpass md:text-end">{formatDate(transactionData[0].createdAt)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaction</p>
              <p className="font-overpass md:text-end">{transaction_uuid}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Name</p>
              <p className="font-overpass md:text-end">{productNames}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Size</p>
              <p className="font-overpass md:text-end">{productSizes}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Quantity</p>
              <p className="font-overpass md:text-end">{quantities}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Total</p>
              <p className="font-overpass md:text-end">{formatCurrency(total)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Customer Name</p>
              <p className="font-overpass md:text-end">{transactionData[0].name}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Detail Address</p>
              <p className="font-overpass md:text-end">{transactionData[0].address}</p>
            </div>

            {/* City Selection */}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">City</p>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  if (selectedExpedition) {
                    calculateShipping(e.target.value, selectedExpedition);
                  }
                }}
                className="font-overpass md:text-end p-2 border rounded"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.type} {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Expedition Section */}
            {selectedCity && (
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-overpass font-bold text-lg">Expedition Selection</h3>
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Select Expedition</p>
                  <select value={selectedExpedition} onChange={handleExpeditionChange} className="font-overpass md:text-end p-2 border rounded">
                    <option value="">Select an expedition</option>
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
                <h3 className="font-overpass font-bold text-lg">Shipping Service</h3>
                <div className="flex flex-col md:flex-row justify-between">
                  <p className="font-overpass font-semibold">Select Service</p>
                  <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} className="font-overpass md:text-end p-2 border rounded">
                    <option value="">Select a service</option>
                    {shippingCosts.map((service) => (
                      <option key={service.service} value={service.service}>
                        {service.service} - {formatCurrency(service.cost[0].value)}
                      </option>
                    ))}
                  </select>
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
            disabled={!selectedCity || !selectedExpedition || !selectedProvider}
            className={`w-full py-2 px-4 rounded font-overpass capitalize ${!selectedCity || !selectedExpedition || !selectedProvider ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
          >
            Pay for this item
          </button>
        </div>
      ) : (
        <p>No transaction details available.</p>
      )}
    </div>
  );
};

export default Checkout;
