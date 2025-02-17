import React, { useState, useEffect } from 'react';
import bannerAwal from '../../assets/banner/banner-awal.webp';

const AutoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[999] flex items-center justify-center">
      <div className="bg-white overflow-hidden w-[90%] max-w-7xl my-6 sm:my-8 md:my-10 lg:my-12">
        {/* Grid container dengan responsif */}
        <div className="grid lg:grid-cols-2 md:grid-cols-1">
          {/* Bagian kiri - Gambar */}
          <div className="h-[300px] sm:h-[350px] md:h-[450px] lg:h-[600px]">
            <img src={bannerAwal} alt="Banner Awal" className="w-full h-full object-cover" />
          </div>

          {/* Bagian kanan - Konten */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 relative">
            {/* Tombol close */}
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col justify-center h-full space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-overpass">Selamat Datang!</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-overpass">Silakan login untuk mengakses semua fitur yang tersedia di platform kami.</p>

              <button
                className="w-full mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-[#333333] text-white py-2 sm:py-3 md:py-3.5 lg:py-4 px-4 sm:px-5 md:px-6 hover:bg-white hover:text-[#333333] transition-colors border border-[#333333] font-overpass font-bold text-sm sm:text-base md:text-lg"
                onClick={() => {
                  console.log('Login clicked');
                }}
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPopup;
