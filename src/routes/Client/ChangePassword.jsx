import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Password harus minimal 6 karakter', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3300/changePassword', {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success('Password berhasil diubah', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });

        // Redirect ke halaman login setelah berhasil
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      } else {
        console.error('Error changing password:', error);
        toast.error('Gagal mengubah password', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md mx-3 md:max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Change Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="mb-2">
            <label htmlFor="email" className="block text-[#333333] text-lg font-bold mb-2 font-garamond">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0 font-overpass"
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-[#333333] text-lg font-bold mb-2 font-garamond">
              Password Baru
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0 font-overpass"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-[#333333] text-lg font-bold mb-2 font-garamond">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0 font-overpass"
              placeholder="Re-enter new password"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#333333] hover:bg-[#ffffff] text-white hover:text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-garamond w-full transition-colors duration-300 focus:ring-0 border border-[#333333] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
