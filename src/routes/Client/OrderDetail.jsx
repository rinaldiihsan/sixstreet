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
        // Mengambil item pertama dari array
        setTransactionData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Failed to fetch transaction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [user_id, transaction_uuid, backendUrl]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';

      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeZone: 'Asia/Jakarta',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333]"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-overpass">{error}</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-white my-[5rem] lg:my-[7rem]">
      {transactionData ? (
        <div className="bg-white p-8 shadow-md mx-3 md:max-w-[50rem] w-full space-y-10">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Detail Transaksi</h2>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Tanggal Transaksi</p>
              <p className="font-overpass md:text-end">{formatDate(transactionData.createdAt)}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaksi</p>
              <p className="font-overpass md:text-end">{transactionData.transaction_uuid}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Produk</p>
              <p className="font-overpass md:text-end">{transactionData.product_name}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Ukuran Produk</p>
              <p className="font-overpass md:text-end">{transactionData.product_size}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Jumlah</p>
              <p className="font-overpass md:text-end">{transactionData.quantity}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Total Pembelian</p>
              <p className="font-overpass md:text-end">{formatCurrency(transactionData.total)}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Nama Penerima</p>
              <p className="font-overpass md:text-end">{transactionData.name}</p>
            </div>

            {/* New fields from checkout */}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Kota/Kabupaten</p>
              <p className="font-overpass md:text-end">{transactionData.city || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Kecamatan</p>
              <p className="font-overpass md:text-end">{transactionData.sub_district || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Alamat Detail</p>
              <p className="font-overpass md:text-end">{transactionData.detail_address || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Ekspedisi</p>
              <p className="font-overpass md:text-end">{transactionData.expedition || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Layanan</p>
              <p className="font-overpass md:text-end">{transactionData.expedition_services || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Estimasi Pengiriman</p>
              <p className="font-overpass md:text-end">{transactionData.etd ? `${transactionData.etd} hari` : '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">No. Resi</p>
              <p className="font-overpass md:text-end">{transactionData.resi || '-'}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Status</p>
              <span
                className={`font-overpass md:text-end px-2 inline-flex text-sm font-semibold rounded-full 
                ${transactionData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : transactionData.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {transactionData.status}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="font-overpass">Data transaksi tidak tersedia.</p>
      )}
    </div>
  );
};

export default OrderDetail;
