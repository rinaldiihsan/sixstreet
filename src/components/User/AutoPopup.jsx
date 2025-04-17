import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown untuk autoclose

  useEffect(() => {
    // Check if popup should be shown
    const popupData = localStorage.getItem('dontShowWelcomePopup');
    if (popupData) {
      const { value, expiry } = JSON.parse(popupData);
      if (expiry > new Date().getTime()) {
        // If the expiry time hasn't passed, don't show popup
        if (value === 'true') {
          setIsOpen(false);
          return;
        }
      } else {
        // If expired, remove the item
        localStorage.removeItem('dontShowWelcomePopup');
      }
    }
    setIsOpen(true);
  }, []);

  // Effect untuk countdown setelah success
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      handleClose();
    }
    return () => clearTimeout(timer);
  }, [success, countdown]);

  const handleClose = () => {
    setIsOpen(false);
    if (dontShow) {
      // Set expiry to 1 hour from now
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const expiryTime = new Date().getTime() + oneHour;
      const data = {
        value: 'true',
        expiry: expiryTime,
      };
      localStorage.setItem('dontShowWelcomePopup', JSON.stringify(data));
    }
  };

  const handleDontShowChange = (e) => {
    setDontShow(e.target.checked);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError('');
    setSuccess(false);

    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the newsletter API
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newsletter`, { email });

      console.log('Newsletter API response:', response.data);
      setSuccess(true);
      setEmail('');
      setCountdown(5); // Reset countdown to 5 seconds
    } catch (error) {
      console.error('Newsletter subscription error:', error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[999] flex items-center justify-center p-4">
      <div className="bg-white overflow-hidden w-full max-w-xl">
        <div className="p-8 sm:p-10 relative">
          {/* Tombol close */}
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold font-overpass tracking-wide">EXCLUSIVE WELCOME GIFT</h2>

            <p className="text-lg font-overpass">Sign up & get your first voucher!</p>

            <div className="text-2xl font-bold text-[#333333] font-overpass">Discount up to 50% OFF</div>

            <p className="text-sm text-gray-600 font-overpass">*min. Purchase Rp 990.000</p>

            {success ? (
              <div className="w-full space-y-3">
                <div className="p-3 bg-green-100 text-green-700 rounded">
                  <p className="font-medium">Success! Check your email for your exclusive voucher.</p>
                  <p className="text-sm mt-1">If you don't see the email in your inbox, please check your spam folder.</p>
                </div>
                <p className="text-sm text-gray-500">This popup will close in {countdown} seconds...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full mt-2">
                <div className="flex flex-row space-x-2">
                  <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" className="flex-grow border border-gray-300 p-3 focus:ring-1 focus:ring-[#333333] focus:border-[#333333] outline-none" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`whitespace-nowrap bg-[#333333] text-white py-3 px-6 font-overpass font-bold text-base ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white hover:text-[#333333] transition-colors border border-[#333333]'
                    }`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'CLAIM NOW'}
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm text-left mt-2">{error}</p>}
              </form>
            )}

            {/* Don't show again checkbox */}
            <div className="flex items-center space-x-2 mt-4">
              <input type="checkbox" id="dontShow" checked={dontShow} onChange={handleDontShowChange} className="form-checkbox h-4 w-4 text-[#333333] rounded border-gray-300 focus:ring-[#333333]" />
              <label htmlFor="dontShow" className="text-sm text-gray-600 font-overpass">
                Don't show this again
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPopup;
