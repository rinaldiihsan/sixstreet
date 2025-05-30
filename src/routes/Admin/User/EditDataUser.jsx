import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditDataUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formUser, setFormUser] = useState({
    email: '',
    fullName: '',
    no_hp: '',
    birthday: '',
    kode_user: '',
    referd_kode: '',
    role: '',
    membership: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data by ID
  const fetchUserById = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/detail/${id}`, { headers });
      const user = response.data.data; // Akses data dari response.data.data

      setFormUser({
        email: user.email || '',
        fullName: user.fullName || '',
        no_hp: user.no_hp || '',
        birthday: user.birthday || '',
        kode_user: user.kode_user || '',
        referd_kode: user.referd_kode || '',
        role: user.role || '',
        membership: user.membership || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Gagal mengambil data user');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserById();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUser({
      ...formUser,
      [name]: value,
    });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      await axios.put(`${backendUrl}/update/${id}`, formUser, { headers });

      // Redirect back to user management page
      navigate('/user-management');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Gagal mengupdate data user');
    }
  };

  const handleCancel = () => {
    navigate('/user-management');
  };

  if (loading) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg font-overpass text-[#333333]">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg font-overpass text-red-500">{error}</div>
          <button onClick={() => navigate('/user-management')} className="mt-4 px-5 py-3 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
            Kembali ke User Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">Edit Data User</h1>

      <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-6 mt-10">
        <form onSubmit={handleEditUser} className="w-full space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center font-garamond text-[#333333]">Edit Profile</h2>

          <div className="flex flex-col">
            <label htmlFor="fullName" className="font-overpass font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formUser.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-overpass font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="no_hp" className="font-overpass font-semibold mb-1">
              No HP
            </label>
            <input
              type="text"
              name="no_hp"
              value={formUser.no_hp}
              onChange={handleInputChange}
              placeholder="No HP"
              required
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="birthday" className="font-overpass font-semibold mb-1">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formUser.birthday ? formUser.birthday.split('T')[0] : ''}
              onChange={handleInputChange}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="kode_user" className="font-overpass font-semibold mb-1">
              Kode User
            </label>
            <input
              type="text"
              name="kode_user"
              value={formUser.kode_user}
              onChange={handleInputChange}
              placeholder="Kode User"
              required
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="referd_kode" className="font-overpass font-semibold mb-1">
              Referral Kode
            </label>
            <input
              type="text"
              name="referd_kode"
              value={formUser.referd_kode}
              onChange={handleInputChange}
              placeholder="Referral Kode"
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="membership" className="font-overpass font-semibold mb-1">
              Membership
            </label>
            <select name="membership" value={formUser.membership} onChange={handleInputChange} required className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent">
              <option value="">Pilih Membership</option>
              <option value="0">Basic</option>
              <option value="1">Premium</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="role" className="font-overpass font-semibold mb-1">
              Role
            </label>
            <select name="role" value={formUser.role} onChange={handleInputChange} required className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent">
              <option value="">Pilih Role</option>
              <option value="0">User / Client</option>
              <option value="1">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-x-2 pt-4">
            <button type="button" onClick={handleCancel} className="bg-white border border-[#333] text-[#333] hover:bg-[#333] hover:text-white transition-colors py-2 px-4 font-garamond font-bold">
              Cancel
            </button>
            <button type="submit" className="bg-[#333] hover:bg-white hover:border hover:border-[#333] text-white hover:text-[#333] transition-colors py-2 px-4 font-garamond font-bold">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataUser;
