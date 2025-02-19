import React, { useState, useEffect } from 'react';

const AutoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

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

            <a
              href="/register"
              className="block w-full text-center mt-6 bg-[#333333] text-white py-3 px-6 hover:bg-white hover:text-[#333333] transition-colors border border-[#333333] font-overpass font-bold text-base"
              onClick={handleClose}
            >
              CLAIM NOW
            </a>

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
