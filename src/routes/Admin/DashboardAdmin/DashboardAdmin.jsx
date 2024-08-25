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
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

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

  const fetchProducts = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/inventory/items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      const data = response.data;

      const productsWithThumbnails = data.data.map((item) => {
        item.variants = item.variants.map((variant) => ({
          ...variant,
          parentThumbnail: item.thumbnail,
          last_modified: item.last_modified,
        }));
        return item;
      });

      setProducts(productsWithThumbnails);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAndFetchProducts = async () => {
    const email = import.meta.env.VITE_API_EMAIL;
    const password = import.meta.env.VITE_API_PASSWORD;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!email || !password) {
      setError('Missing email or password in environment variables.');
      setLoginStatus('error');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        Cookies.set('pos_token', data.token, { expires: 1 });
        setLoginStatus('success');
        fetchProducts(data.token);
      } else {
        setError(data.message);
        setLoginStatus('error');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoginStatus('error');
    }
  };

  useEffect(() => {
    loginAndFetchProducts();
  }, []);

  useEffect(() => {
    const token = Cookies.get('pos_token');
    if (token) {
      fetchProducts(token);
    }
  }, []);

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

      // Total users
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
      setTotalTransactions(transactions.length);

      // Calculate monthly transactions
      const monthlyData = calculateTransaction(transactions);
      setMonthlyTransactions(monthlyData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateMonthlyRegistrations = (users) => {
    const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
      const monthYear = `${index + 1}/${new Date().getFullYear()}`;
      return { monthYear, Registered: 0 };
    });

    users.forEach((user) => {
      if (user.role !== 1) {
        const createdAt = new Date(user.createdAt);
        const month = createdAt.getMonth();
        monthlyCounts[month].Registered++;
      }
    });

    return monthlyCounts;
  };

  const calculateTransaction = (transactions) => {
    const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
      const monthYear = `${index + 1}/${new Date().getFullYear()}`;
      return { monthYear, Transactions: 0 };
    });

    transactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const month = createdAt.getMonth();
      monthlyCounts[month].Transactions++;
    });

    return monthlyCounts;
  };

  useEffect(() => {
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
            <input type="search" placeholder="Search" className="block md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass" />
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
        <Link to="/user-management" className="bg-white shadow-lg p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Users in Website</h2>
          <p className="font-overpass text-[#333333] text-lg mt-2">{totalUsers}</p>
        </Link>
        <Link to="/news-management" className="bg-white shadow-lg p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total News in Website</h2>
          <p className="font-overpass text-[#333333] text-lg mt-2">{totalNews}</p>
        </Link>
        <Link to="/transaction-management" className="bg-white shadow-lg p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Transactions</h2>
          <p className="font-overpass text-[#333333] text-lg mt-2">{totalTransactions.length > 0 ? totalTransactions.length : 0}</p>
        </Link>
        <div className="bg-white shadow-lg p-6">
          <h2 className="font-overpass text-[#333333] font-semibold text-xl">Total Products in Website</h2>
          <p className="font-overpass text-[#333333] text-lg mt-2">{products.flatMap((item) => item.variants).length}</p>
        </div>
      </div>
      <div className="mt-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart User */}
        <div className="bg-white shadow-lg p-6 flex flex-col flex-wrap justify-center items-center">
          <h2 className="font-overpass text-[#333333] font-semibold text-lg mb-5">Monthly User Registrations</h2>
          <ResponsiveContainer width="100%" height={432}>
            <LineChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="monthYear" interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotoneY" dataKey="Registered" stroke="#333333" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Chart Transactions */}
        <div className="bg-white shadow-lg p-6 flex flex-col flex-wrap justify-center items-center">
          <h2 className="font-overpass text-[#333333] font-semibold text-lg mb-5">Monthly Transactions</h2>
          <ResponsiveContainer width="100%" height={432}>
            <LineChart data={monthlyTransactions}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="monthYear" interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotoneY" dataKey="Transactions" stroke="#333333" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
