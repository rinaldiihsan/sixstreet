import React from 'react';

const MultiLink = () => {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <img src="/logo_s.svg" alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          <h1 className="text-3xl font-semibold text-[#333333] font-garamond tracking-widest mt-4">SIXSTREET</h1>
          <p className="text-gray-500">All Link in here</p>
        </div>

        <div className="space-y-4">
          <a href="#" className="block w-full text-center py-3 rounded-lg border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold">
            Link 1
          </a>
          <a href="#" className="block w-full text-center py-3 rounded-lg border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold">
            Link 2
          </a>
          <a href="#" className="block w-full text-center py-3 rounded-lg border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold">
            Link 3
          </a>
          <a href="#" className="block w-full text-center py-3 rounded-lg border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold">
            Link 4
          </a>
          <a href="#" className="block w-full text-center py-3 rounded-lg border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold">
            Link 4
          </a>
        </div>
      </div>
    </div>
  );
};

export default MultiLink;
