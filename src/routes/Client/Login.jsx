import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === '123') {
      setIsLoggedIn(true);
      toast.success('Login berhasil', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        limit: 1,
        className: 'font-garamond font-bold text-[#333333]  px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
      navigate('/');
    } else {
      toast.error('Email atau password salah', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        limit: 1,
        className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
    }
  };

  return (
    <>
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
          <div className="mb-6">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-[#333333] hover:bg-[#ffffff] text-white hover:text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-garamond w-full transition-colors duration-300 focus:ring-0">
              Login
            </button>
          </div>
          {/* You dont Have Account? */}
          <div className="flex items-center justify-center mt-4 gap-x-2">
            <p className="text-[#333333] text-lg font-garamond">You dont have account?</p>
            <Link to="/register" className="text-[#333333] text-lg font-garamond font-bold hover:underline focus:outline-none focus:ring-0">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
