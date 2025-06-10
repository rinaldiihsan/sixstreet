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
  const [statusFilter, setStatusFilter] = useState(''); // New state for status filter

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Status options based on your EditTransaction component
  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

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
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?');

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

        // Adjust current page if needed after deletion
        const newTotalPages = Math.ceil((filteredTransactions.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else {
        console.error('Failed to delete transaction. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Gagal menghapus transaksi');
    }
  };

  // Function to get status display label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'PAID':
        return 'Paid';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  // Function to get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
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

  // Updated filteredTransactions to include status filter
  const filteredTransactions = groupedArray.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      transaction.transaction_uuid?.toLowerCase().includes(searchLower) ||
      transaction.name?.toLowerCase().includes(searchLower) ||
      transaction.address?.toLowerCase().includes(searchLower) ||
      transaction.product_id?.toString().toLowerCase().includes(searchLower) ||
      transaction.product_name?.join(', ').toLowerCase().includes(searchLower) ||
      transaction.product_size?.join(', ').toLowerCase().includes(searchLower) ||
      transaction.product_price?.toString().toLowerCase().includes(searchLower) ||
      transaction.total?.toString().toLowerCase().includes(searchLower) ||
      transaction.status?.toLowerCase().includes(searchLower) ||
      new Date(transaction.createdAt).toLocaleString().toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === '' || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when search term or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Count transactions by status for display
  const getStatusCounts = () => {
    const counts = statusOptions.reduce((acc, option) => {
      if (option.value === '') {
        acc[option.value] = groupedArray.length;
      } else {
        acc[option.value] = groupedArray.filter((transaction) => transaction.status === option.value).length;
      }
      return acc;
    }, {});
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">Transaction Management</h1>

      {/* Status Summary Cards */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statusOptions.map((option) => (
          <div
            key={option.value}
            className={`p-4  border ${statusFilter === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} 
              cursor-pointer hover:shadow-sm transition-all duration-200`}
            onClick={() => setStatusFilter(option.value)}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold ${statusFilter === option.value ? 'text-blue-600' : 'text-gray-800'}`}>{statusCounts[option.value] || 0}</div>
              <div className={`text-sm ${statusFilter === option.value ? 'text-blue-600' : 'text-gray-600'}`}>{option.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 flex flex-col md:flex-row w-full items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="search"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass"
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

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select value={statusFilter} onChange={handleStatusFilterChange} className="pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass bg-white">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({statusCounts[option.value] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter) && (
            <button onClick={handleClearFilters} className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-overpass transition-colors duration-300">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || statusFilter) && (
        <div className="w-full mt-4 p-3 bg-blue-50 border border-blue-200 ">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs ">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs ">
                Status: {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                <button onClick={() => setStatusFilter('')} className="ml-1 text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Data info */}
      <div className="mt-5 w-full flex justify-between items-center text-sm font-overpass text-[#666666]">
        <div>
          Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
          {(searchTerm || statusFilter) && ` (filtered from ${groupedArray.length} total)`}
        </div>
        <div>
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-center font-overpass text-[#333333] text-lg">
              <th className="py-3 px-4 bg-gray-100">Tanggal</th>
              <th className="py-3 px-4 bg-gray-100">ID Transaksi</th>
              <th className="py-3 px-4 bg-gray-100">User ID</th>
              <th className="py-3 px-4 bg-gray-100">Nama Produk</th>
              <th className="py-3 px-4 bg-gray-100">Ukuran</th>
              <th className="py-3 px-4 bg-gray-100">Jumlah</th>
              <th className="py-3 px-4 bg-gray-100">Total</th>
              <th className="py-3 px-4 bg-gray-100">Nama Penerima</th>
              <th className="py-3 px-4 bg-gray-100">Kota</th>
              <th className="py-3 px-4 bg-gray-100">Kecamatan</th>
              <th className="py-3 px-4 bg-gray-100">Alamat Detail</th>
              <th className="py-3 px-4 bg-gray-100">Ekspedisi</th>
              <th className="py-3 px-4 bg-gray-100">Layanan</th>
              <th className="py-3 px-4 bg-gray-100">Estimasi</th>
              <th className="py-3 px-4 bg-gray-100">No. Resi</th>
              <th className="py-3 px-4 bg-gray-100">Status</th>
              <th className="py-3 px-4 bg-gray-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-center font-overpass text-[#333333]">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.transaction_uuid} className="border-b border-gray-200">
                  <td className="py-3 px-4">{formatDate(transaction.createdAt)}</td>
                  <td className="py-3 px-4">{transaction.transaction_uuid}</td>
                  <td className="py-3 px-4">{transaction.user_id}</td>
                  <td className="py-3 px-4">{transaction.product_name.join(', ')}</td>
                  <td className="py-3 px-4">{transaction.product_size.join(', ')}</td>
                  <td className="py-3 px-4">{transaction.quantity.join(', ')}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(transaction.total)}</td>
                  <td className="py-3 px-4">{transaction.name}</td>
                  <td className="py-3 px-4">{transaction.city || '-'}</td>
                  <td className="py-3 px-4">{transaction.sub_district || '-'}</td>
                  <td className="py-3 px-4">{transaction.detail_address || '-'}</td>
                  <td className="py-3 px-4">{transaction.expedition || '-'}</td>
                  <td className="py-3 px-4">{transaction.expedition_services || '-'}</td>
                  <td className="py-3 px-4">{transaction.etd ? `${transaction.etd} hari` : '-'}</td>
                  <td className="py-3 px-4">{transaction.resi || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold -full ${getStatusStyle(transaction.status)}`}>{getStatusLabel(transaction.status)}</span>
                  </td>
                  <td className="py-3 px-4 gap-3 flex justify-center items-center">
                    <button onClick={() => handleEdit(transaction)} className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(transaction)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 font-overpass">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="17" className="py-8 text-center text-gray-500">
                  {searchTerm || statusFilter ? 'Tidak ada transaksi yang sesuai dengan filter yang dipilih' : 'Tidak ada transaksi'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          {/* Previous button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-overpass ${
              currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
            } transition-colors duration-300`}
          >
            Previous
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
              disabled={pageNumber === '...'}
              className={`px-3 py-2 text-sm font-overpass ${
                pageNumber === currentPage ? 'bg-[#333333] text-white' : pageNumber === '...' ? 'bg-white text-gray-400 cursor-default' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
              } transition-colors duration-300`}
            >
              {pageNumber}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-overpass ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
            } transition-colors duration-300`}
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination info */}
      {totalPages > 1 && (
        <div className="mt-4 text-center text-sm font-overpass text-[#666666]">
          Total {filteredTransactions.length} transaksi, {totalPages} halaman
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
