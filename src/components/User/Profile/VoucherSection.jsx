import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const VoucherSection = ({ user_id }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [vouchers, setVouchers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchVouchers = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/voucher/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Gagal memuat voucher');
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [user_id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filterVouchers = (category) => {
    if (category === 'all') return vouchers;
    return vouchers.filter((voucher) => JSON.parse(voucher.applicableProducts).includes(category));
  };

  const categories = [
    { key: 'all', label: 'Semua Voucher' },
    { key: 'apparel', label: 'Apparel' },
    { key: 'sneakers', label: 'Sneakers' },
    { key: 'Accessories', label: 'Accessories' },
    { key: 'Sixstreet', label: 'Sixstreet' },
  ];

  const displayedVouchers = filterVouchers(activeCategory);

  return (
    <div className="font-overpass space-y-4">
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {categories.map((category) => (
          <button key={category.key} onClick={() => setActiveCategory(category.key)} className={`px-4 py-2  text-sm whitespace-nowrap ${activeCategory === category.key ? 'bg-[#333333] text-white' : 'bg-gray-100 text-gray-600'}`}>
            {category.label}
          </button>
        ))}
      </div>

      {displayedVouchers.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Tidak ada voucher tersedia</div>
      ) : (
        <div className="space-y-4">
          {displayedVouchers.map((voucher) => (
            <div key={voucher.id} className="border border-gray-200  p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-[#333333]">{voucher.code}</p>
                <p className="text-sm text-gray-600">Diskon {voucher.discountPercentage}%</p>
                <p className="text-xs text-gray-500">Berlaku hingga {formatDate(voucher.validUntil)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${voucher.isUsed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{voucher.isUsed ? 'Sudah Digunakan' : 'Tersedia'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
