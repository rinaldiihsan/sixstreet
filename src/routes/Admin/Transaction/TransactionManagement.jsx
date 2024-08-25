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
  const transactionsPerPage = 10; // Batasan jumlah transaksi per halaman

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

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.transaction_uuid?.toLowerCase().includes(searchLower) ||
      transaction.name?.toLowerCase().includes(searchLower) ||
      transaction.address?.toLowerCase().includes(searchLower) ||
      transaction.product_id?.toString().toLowerCase().includes(searchLower) ||
      transaction.quantity?.toString().toLowerCase().includes(searchLower) ||
      transaction.product_price?.toString().toLowerCase().includes(searchLower) ||
      transaction.product_name?.toLowerCase().includes(searchLower) ||
      transaction.product_size?.toLowerCase().includes(searchLower) ||
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

  const FormatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
  };

  const FormatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">Transaction Management</h1>
      <div className="mt-10 flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass"
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
      </div>
      <div className="mt-10 w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-center font-overpass text-[#333333] text-lg">
              <th className="py-3 px-4 bg-gray-100">Date</th>
              <th className="py-3 px-4 bg-gray-100">Transaction ID</th>
              <th className="py-3 px-4 bg-gray-100">User ID</th>
              <th className="py-3 px-4 bg-gray-100">Name</th>
              <th className="py-3 px-4 bg-gray-100">Address</th>
              <th className="py-3 px-4 bg-gray-100">Product ID</th>
              <th className="py-3 px-4 bg-gray-100">Product Name</th>
              <th className="py-3 px-4 bg-gray-100">Size</th>
              <th className="py-3 px-4 bg-gray-100">Quantity</th>
              <th className="py-3 px-4 bg-gray-100">Price</th>
              <th className="py-3 px-4 bg-gray-100">Total</th>
              <th className="py-3 px-4 bg-gray-100">Status</th>
              <th className="py-3 px-4 bg-gray-100">Action</th>
            </tr>
          </thead>
          <tbody className="text-center font-overpass text-[#333333]">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{FormatDate(transaction.createdAt)}</td>
                  <td className="py-3 px-4">{transaction.transaction_uuid}</td>
                  <td className="py-3 px-4">{transaction.user_id}</td>
                  <td className="py-3 px-4">{transaction.name}</td>
                  <td className="py-3 px-4">{transaction.address}</td>
                  <td className="py-3 px-4">{transaction.product_id}</td>
                  <td className="py-3 px-4">{transaction.product_name}</td>
                  <td className="py-3 px-4">{transaction.product_size}</td>
                  <td className="py-3 px-4">{transaction.quantity}</td>
                  <td className="py-3 px-4">{FormatPrice(transaction.product_price)}</td>
                  <td className="py-3 px-4">{FormatPrice(transaction.total)}</td>
                  <td className="py-3 px-4">{transaction.status}</td>
                  <td className="py-3 px-4 space-y-3">
                    <button className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">Edit</button>
                    <button className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 text-center">
                  No transactions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-5 flex justify-center items-center space-x-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-[#333333] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg font-overpass">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-[#333333] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionManagement;
