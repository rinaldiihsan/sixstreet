import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const TransactionManagement = () => {
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      const response = await axios.get(`${backendUrl}/transaction`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
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

  const handleEdit = (transaction) => {
    navigate(`/transaction-management/edit-transaction/${transaction.user_id}/${transaction.transaction_uuid}`);
  };

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');

    if (!confirmed) return;

    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      const response = await axios.delete(`${backendUrl}/transaction/${transaction.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        console.log('Transaction deleted successfully');
        await fetchTransactions();
      } else {
        console.error('Failed to delete transaction. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Kelompokkan transaksi berdasarkan transaction_uuid (sama seperti OrderHistory)
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.transaction_uuid]) {
      acc[transaction.transaction_uuid] = {
        ...transaction,
        product_name: [],
        product_size: [],
        quantity: [],
        total: transaction.total,
        city: transaction.city || '',
        sub_district: transaction.sub_district || '',
        detail_address: transaction.detail_address || '',
        expedition: transaction.expedition || '',
        expedition_services: transaction.expedition_services || '',
        etd: transaction.etd || '',
        resi: transaction.resi || '',
      };
    }
    acc[transaction.transaction_uuid].product_name.push(transaction.product_name);
    acc[transaction.transaction_uuid].product_size.push(transaction.product_size);
    acc[transaction.transaction_uuid].quantity.push(transaction.quantity);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedTransactions);

  const filteredTransactions = groupedArray.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.transaction_uuid?.toLowerCase().includes(searchLower) ||
      transaction.name?.toLowerCase().includes(searchLower) ||
      transaction.address?.toLowerCase().includes(searchLower) ||
      transaction.product_id?.toString().toLowerCase().includes(searchLower) ||
      transaction.product_name?.join(', ').toLowerCase().includes(searchLower) ||
      transaction.product_size?.join(', ').toLowerCase().includes(searchLower) ||
      transaction.product_price?.toString().toLowerCase().includes(searchLower) ||
      transaction.total?.toString().toLowerCase().includes(searchLower) ||
      transaction.status?.toLowerCase().includes(searchLower) ||
      new Date(transaction.createdAt).toLocaleString().toLowerCase().includes(searchLower)
    );
  });

  // Menghitung index transaksi yang akan ditampilkan berdasarkan pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Menghitung jumlah halaman berdasarkan jumlah transaksi yang difilter
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-4 md:px-6 lg:px-8 font-overpass min-h-screen">
      <h1 className="font-garamond text-[#333333] text-3xl font-semibold text-center mb-8">Transaction Management</h1>

      <div className="mb-6 flex w-full items-center justify-start">
        <div className="relative">
          <input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.66659 14C11.1644 14 13.9999 11.1644 13.9999 7.66665C13.9999 4.16884 11.1644 1.33331 7.66659 1.33331C4.16878 1.33331 1.33325 4.16884 1.33325 7.66665C1.33325 11.1644 4.16878 14 7.66659 14Z"
              stroke="#AAAAAA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M14.6666 14.6666L13.3333 13.3333" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transaksi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Penerima</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kota</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat Detail</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ekspedisi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimasi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Resi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <tr key={transaction.transaction_uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(transaction.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transaction_uuid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.product_name.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.product_size.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(transaction.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.city || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.sub_district || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.detail_address || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.expedition || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.expedition_services || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.etd ? `${transaction.etd} hari` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.resi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : transaction.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 gap-3 flex justify-center items-center">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(transaction)} className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(transaction)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 font-overpass">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="px-6 py-10 text-center text-sm text-gray-500">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center space-x-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionManagement;
