import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const getGreetingTime = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Morning';
    } else if (currentHour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  };

  // Fetch products from internal backend (same as ProductManagement)
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      const response = await axios.get(`${backendUrl}/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        const products = response.data.data;

        // Group products by base name (same logic as ProductManagement)
        const groupedProducts = products.reduce((acc, product) => {
          const baseName = product.nama_produk.split(' - ')[0].trim();

          if (!acc[baseName]) {
            acc[baseName] = {
              base_name: baseName,
              item_group_id: product.item_group_id,
              variants: [],
            };
          }

          acc[baseName].variants.push({
            id: product.id,
            full_name: product.nama_produk,
            harga: parseFloat(product.harga),
            stok: product.stok,
          });

          return acc;
        }, {});

        const groupedArray = Object.values(groupedProducts);
        setTotalProducts(groupedArray.length); // Set the count of unique product groups
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setTotalProducts(0);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/user`, { headers });
      const users = response.data;

      // Calculate monthly registrations
      const monthlyData = calculateMonthlyRegistrations(users);
      setMonthlyRegistrations(monthlyData);

      // Total users (exclude admin role)
      const filteredUsers = users.filter((user) => user.role !== 1);
      setTotalUsers(filteredUsers.length);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchNewsData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/getnews`, { headers });
      const news = response.data;
      setTotalNews(news.length);
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/transaction`, { headers });
      const transactions = response.data;

      // Group transactions by transaction_uuid to get unique transactions
      const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.transaction_uuid]) {
          acc[transaction.transaction_uuid] = transaction;
        }
        return acc;
      }, {});

      const uniqueTransactions = Object.values(groupedTransactions);

      // Set total transactions count
      setTotalTransactions(uniqueTransactions.length);

      // Calculate monthly transactions using unique transactions
      const monthlyData = calculateTransaction(uniqueTransactions);
      setMonthlyTransactions(monthlyData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTotalTransactions(0);
    }
  };

  const calculateMonthlyRegistrations = (users) => {
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
      return {
        monthYear: `${monthNames[index]} ${currentYear}`,
        Registered: 0,
      };
    });

    users.forEach((user) => {
      if (user.role !== 1) {
        const createdAt = new Date(user.createdAt);
        const userYear = createdAt.getFullYear();

        // Only count registrations from current year
        if (userYear === currentYear) {
          const month = createdAt.getMonth();
          monthlyCounts[month].Registered++;
        }
      }
    });

    return monthlyCounts;
  };

  const calculateTransaction = (transactions) => {
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
      return {
        monthYear: `${monthNames[index]} ${currentYear}`,
        Transactions: 0,
      };
    });

    transactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const transactionYear = createdAt.getFullYear();

      // Only count transactions from current year
      if (transactionYear === currentYear) {
        const month = createdAt.getMonth();
        monthlyCounts[month].Transactions++;
      }
    });

    return monthlyCounts;
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
    fetchUserData();
    fetchNewsData();
    fetchTransactions();
  }, []);

  const greetingTime = getGreetingTime();

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="font-overpass text-[#333333] font-semibold text-3xl mt-4">Hello Admin, Good {greetingTime}</h1>
          <p className="font-overpass text-[#333333] text-lg mt-2">Welcome back to your dashboard, Have a nice day!</p>
        </div>
        {/* Search */}
        <div className="space-y-1">
          <div className="relative">
            <input type="search" placeholder="Search" className="block md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300  focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass" />
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
        {/* End Search */}
      </div>

      <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Link to="/user-management" className="bg-white shadow-lg  p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Users in Website</h2>
          <p className="font-overpass text-[#333333] text-3xl font-bold mt-2">{totalUsers}</p>
        </Link>

        <Link to="/news-management" className="bg-white shadow-lg  p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total News in Website</h2>
          <p className="font-overpass text-[#333333] text-3xl font-bold mt-2">{totalNews}</p>
        </Link>

        <Link to="/transaction-management" className="bg-white shadow-lg  p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Transactions</h2>
          <p className="font-overpass text-[#333333] text-3xl font-bold mt-2">{totalTransactions}</p>
        </Link>

        <Link to="/product-management" className="bg-white shadow-lg  p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Products in Website</h2>
          <p className="font-overpass text-[#333333] text-3xl font-bold mt-2">{isLoadingProducts ? 'Loading...' : totalProducts}</p>
        </Link>
      </div>

      <div className="mt-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart User */}
        <div className="bg-white shadow-lg  p-6 flex flex-col flex-wrap justify-center items-center">
          <h2 className="font-overpass text-[#333333] font-semibold text-lg mb-5">Monthly User Registrations ({new Date().getFullYear()})</h2>
          <ResponsiveContainer width="100%" height={432}>
            <LineChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="monthYear" interval={0} angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Registered" stroke="#333333" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Transactions */}
        <div className="bg-white shadow-lg  p-6 flex flex-col flex-wrap justify-center items-center">
          <h2 className="font-overpass text-[#333333] font-semibold text-lg mb-5">Monthly Transactions ({new Date().getFullYear()})</h2>
          <ResponsiveContainer width="100%" height={432}>
            <LineChart data={monthlyTransactions}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="monthYear" interval={0} angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Transactions" stroke="#333333" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
