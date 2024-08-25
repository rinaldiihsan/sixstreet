import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const OrderDetail = () => {
  const { user_id, transaction_uuid } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-white my-[5rem] md:my-0">
      {transactionData ? (
        <div className="bg-white p-8 shadow-md mx-3  md:max-w-[50rem] w-full space-y-10">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Order Detail</h2>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Transaction Date</p>
              <p className="font-overpass md:text-end">{formatDate(transactionData.createdAt)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaction</p>
              <p className="font-overpass md:text-end">{transactionData.transaction_uuid}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Name</p>
              <p className="font-overpass md:text-end">{transactionData.product_name}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Size</p>
              <p className="font-overpass md:text-end">{transactionData.product_size}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Quantity</p>
              <p className="font-overpass md:text-end">{transactionData.quantity}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Total</p>
              <p className="font-overpass md:text-end">{formatCurrency(transactionData.total)}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Name</p>
              <p className="font-overpass md:text-end">{transactionData.name}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Address</p>
              <p className="font-overpass max-w-md md:text-end">{transactionData.address}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Status</p>
              <p className="font-overpass md:text-end">{transactionData.status}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No transaction details available.</p>
      )}
    </div>
  );
};

export default OrderDetail;
