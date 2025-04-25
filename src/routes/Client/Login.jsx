import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const Login = ({ setIsLoggedIn }) => {
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Effect untuk memeriksa apakah ada kredensial tersimpan saat komponen dimuat
  useEffect(() => {
    const savedCredentials = localStorage.getItem('rememberedCredentials');

    if (savedCredentials) {
      try {
        const decryptedCredentials = decryptData(savedCredentials);
        const { email, rememberMe } = JSON.parse(decryptedCredentials);

        // Hanya isi email jika rememberMe sebelumnya diaktifkan
        if (rememberMe) {
          setEmail(email);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
        localStorage.removeItem('rememberedCredentials');
      }
    }
  }, []);

  function encryptData(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  function setItemWithExpiry(key, user_id, role, ttl) {
    const now = new Date();

    const item = {
      user_id,
      role,
      expiry: now.getTime() + ttl,
    };
    const encryptedItem = encryptData(JSON.stringify(item));
    sessionStorage.setItem(key, encryptedItem);
  }

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${backendUrl}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Jika remember me dicentang, simpan email dengan enkripsi
        if (rememberMe) {
          const credentials = JSON.stringify({ email, rememberMe });
          localStorage.setItem('rememberedCredentials', encryptData(credentials));
        } else {
          // Hapus item jika "Remember me" tidak dicentang
          localStorage.removeItem('rememberedCredentials');
        }

        const accessToken = response.data.accessToken;
        const detailUser = response.data.detailData;
        const user_id = detailUser.user_id;
        const role = detailUser.role;
        setItemWithExpiry('DetailUser', user_id, role, 3000000);
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + 3000);
        Cookies.set('accessToken', accessToken, { expires: expiryDate });
        setIsLoggedIn(true);

        if (role === 1) {
          navigate('/dashboard-admin');
        } else {
          navigate('/');
        }
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          limit: 1,
          className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      } else {
        console.error('Error during login:', error);
        toast.error('Gagal melakukan login', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          limit: 1,
          className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md mx-3 md:max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Sign - In</h2>
        <div className="mb-4">
          <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
            required
          />
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={handleRememberMeChange} className="mr-2 h-4 w-4 text-[#333333] focus:ring-0 focus:outline-none border-gray-300" />
            <label htmlFor="rememberMe" className="text-[#333333] text-md font-garamond">
              Remember Me
            </label>
          </div>
          <div className="flex">
            <Link to="/forgot-password" className="text-[#333333] text-md font-garamond hover:underline focus:outline-none focus:ring-0">
              Forgot Password?
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button type="submit" className="bg-[#333333] hover:bg-[#ffffff] text-white hover:text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-garamond w-full transition-colors duration-300 focus:ring-0">
            Login
          </button>
        </div>
        <div className="flex items-center justify-center mt-4 gap-x-2">
          <p className="text-[#333333] text-lg font-garamond">You don't have an account?</p>
          <Link to="/register" className="text-[#333333] text-lg font-garamond font-bold hover:underline focus:outline-none focus:ring-0">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
