import React from 'react';

const MultiLink = () => {
  return (
    <div className="h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-lg px-8 md:px-4 flex flex-col">
        <div className="text-center mb-6">
          <a href="https://six6street.co.id" target="_blank" rel="noopener noreferrer">
            <img src="/logo_s.svg" alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          </a>
          <h1 className="text-3xl font-semibold text-[#333333] font-garamond tracking-widest mt-4">SIXSTREET</h1>
          <p className="text-gray-500 font-overpass">Sixstreet represents the essence of modern streetwear, characterized by minimalist design and refined craftsmanship.</p>
        </div>

        <div className="space-y-4">
          <a
            href="https://g.co/kgs/P7sYKAL"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold"
          >
            Our Store
          </a>
          <a
            href="https://wa.me/c/6281990106666"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold"
          >
            Whatsapp Catalog
          </a>
          <a
            href="https://shopee.co.id/sixstreetsneakerstore"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold"
          >
            Shopee
          </a>
          <a
            href="https://www.tokopedia.com/sixstreet"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 border border-gray-300 bg-white text-[#333333] hover:bg-gray-50 hover:border-gray-400 transition font-overpass font-semibold"
          >
            Tokopedia
          </a>
        </div>
      </div>
    </div>
  );
};

export default MultiLink;
