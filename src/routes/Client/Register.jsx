import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [referdKode, setReferdKode] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userData = {
      username,
      password,
      email,
      no_hp: noHp,
      birthday: birthday,
      referd_kode: referdKode || ' ',
    };

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long and contain both uppercase and lowercase letters.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success('Registration successful! Please check your email for the OTP.', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      } else {
        const errorData = await response.json();
        toast.error(`Registration failed: ${errorData.message}`, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase;
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${backendUrl}/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        toast.success('OTP verified successfully!', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
        setOtpSent(false);
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast.error(`OTP verification failed: ${errorData.message}`, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
        });
      }
    } catch (error) {
      toast.error('An error occurred during OTP verification. Please try again later.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: ' font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md mx-3 md:max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Sign - Up</h2>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
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
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="noHp">
              No HP
            </label>
            <input
              type="text"
              id="noHp"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="birthday">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
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
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
            {!validatePassword(password) && password && <p className="text-red-500 text-sm mt-2 font-garamond">Password must be at least 8 characters long and contain both uppercase and lowercase letters.</p>}
          </div>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="referdKode">
              Referd Kode
            </label>
            <input
              type="text"
              id="referdKode"
              value={referdKode}
              onChange={(e) => setReferdKode(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#333333] hover:bg-[#ffffff] text-white hover:text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-garamond w-full transition-colors duration-300 focus:ring-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          <div className="flex items-center justify-center mt-4 gap-x-2">
            <p className="text-[#333333] text-lg font-garamond">Already have an account?</p>
            <Link to="/login" className="text-[#333333] text-lg font-garamond font-bold hover:underline focus:outline-none focus:ring-0">
              Sign In
            </Link>
          </div>
        </form>
        {otpSent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-center font-garamond text-[#333333]">Verify OTP</h2>
              <div className="mb-4">
                <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
                  required
                />
              </div>
              <button onClick={handleVerifyOtp} className="px-6 py-2 bg-[#333333] text-white font-garamond">
                Verify OTP
              </button>
              <button onClick={() => setOtpSent(false)} className="px-6 py-2 bg-gray-300 text-black font-garamond ml-4">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
