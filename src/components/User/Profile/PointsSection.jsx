import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const PointsSection = ({ user_id }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [pointsData, setPointsData] = useState({
    current_points: 0,
    points_value_idr: 0,
    total_points_earned: 0,
    total_points_used: 0,
    total_spent: 0,
    points_expiration: null,
    membership_level: '',
  });

  const fetchUserPoints = async () => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${backendUrl}/membership/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPointsData(response.data);
    } catch (error) {
      console.error('Error fetching points:', error);
      toast.error('Gagal memuat data points');
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [user_id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 font-overpass">
      {/* Points Overview */}
      <div className="bg-white border border-gray-200 p-3 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#333333]">Points Overview</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#333333] mr-2">{pointsData.current_points}</span>
            <span className="text-sm text-gray-600">Points</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 p-4 ">
            <p className="text-sm text-gray-600 mb-2">Points Value</p>
            <p className="text-lg font-bold text-[#333333]">{formatCurrency(pointsData.points_value_idr)}</p>
          </div>

          <div className="bg-white border border-gray-200 p-4 ">
            <p className="text-sm text-gray-600 mb-2">Total Points Earned</p>
            <p className="text-lg font-bold text-green-600">{pointsData.total_points_earned}</p>
          </div>

          <div className="bg-white border border-gray-200 p-4 ">
            <p className="text-sm text-gray-600 mb-2">Total Points Used</p>
            <p className="text-lg font-bold text-red-600">{pointsData.total_points_used}</p>
          </div>
        </div>

        {pointsData.points_expiration && (
          <div className="mt-4 bg-gray-50 border border-gray-200 p-3 ">
            <p className="text-sm text-[#333333]">Points Expiration: {formatDate(pointsData.points_expiration)}</p>
          </div>
        )}
      </div>

      {/* Total Spending */}
      <div className="bg-white border border-gray-200 p-6 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#333333]">Total Spending</h3>
        </div>

        <div className="bg-white border border-gray-200 p-4 ">
          <p className="text-sm text-gray-600 mb-2">Total Amount Spent</p>
          <p className="text-2xl font-bold text-[#333333]">{formatCurrency(pointsData.total_spent)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all purchases</p>
        </div>
      </div>
    </div>
  );
};

export default PointsSection;
