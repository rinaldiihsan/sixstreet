import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const VoucherSection = ({ user_id }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [vouchers, setVouchers] = useState([]);

  const fetchVouchers = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/voucher/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter untuk memisahkan voucher yang sudah digunakan dan belum digunakan
      const usedVouchers = response.data.filter((v) => v.isUsed);
      const unusedVouchers = response.data.filter((v) => !v.isUsed);

      // Jika ada voucher yang sudah digunakan, ambil hanya 1
      const limitedUsedVouchers = usedVouchers.slice(0, 1);

      // Gabungkan voucher yang belum digunakan dengan 1 voucher yang sudah digunakan
      setVouchers([...unusedVouchers, ...limitedUsedVouchers]);
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

  return (
    <div className="font-overpass space-y-4">
      {vouchers.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Tidak ada voucher tersedia</div>
      ) : (
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="border border-gray-200 p-4 flex justify-between items-center">
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
