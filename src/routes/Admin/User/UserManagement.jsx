import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserManagement = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/user`, { headers });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const filteredUsers = userData.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.no_hp?.includes(searchLower) ||
      user.kode_user?.toLowerCase().includes(searchLower) ||
      (user.birthday && user.birthday.includes(searchLower)) ||
      user.referd_kode?.toLowerCase().includes(searchLower) ||
      user.role?.toString().includes(searchLower) ||
      new Date(user.createdAt).toLocaleString().includes(searchLower) ||
      new Date(user.updatedAt).toLocaleString().includes(searchLower)
    );
  });

  const handleEditClick = (userId) => {
    navigate(`/user-management/edit-data-user/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        const accessToken = Cookies.get('accessToken');
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        await axios.delete(`${backendUrl}/user/${userId}`, { headers });
        fetchUserData(); // Refresh data after delete
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Gagal menghapus user');
      }
    }
  };

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">User Management</h1>
      <div className="mt-10 flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block md:w-[30rem] pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.66659 14C11.1644 14 13.9999 11.1644 13.9999 7.66665C13.9999 4.16884 11.1644 1.33331 7.66659 1.33331C4.16878 1.33331 1.33325 4.16884 1.33325 7.66665C1.33325 11.1644 4.16878 14 7.66659 14Z"
                stroke="#AAAAAA"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M14.6666 14.6666L13.3333 13.3333" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <Link to="/user-management/tambah-data-user" className="px-5 py-3 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
          Tambah data user
        </Link>
      </div>

      <div className="mt-10 w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-center font-overpass text-[#333333] text-lg">
              <th className="py-3 px-4 bg-gray-100">ID</th>
              <th className="py-3 px-4 bg-gray-100">Username</th>
              <th className="py-3 px-4 bg-gray-100">No HP</th>
              <th className="py-3 px-4 bg-gray-100">Email</th>
              <th className="py-3 px-4 bg-gray-100">Membership</th>
              <th className="py-3 px-4 bg-gray-100">Birthday</th>
              <th className="py-3 px-4 bg-gray-100">Kode User</th>
              <th className="py-3 px-4 bg-gray-100">Refferal Kode</th>
              <th className="py-3 px-4 bg-gray-100">Role</th>
              <th className="py-3 px-4 bg-gray-100">Created At</th>
              <th className="py-3 px-4 bg-gray-100">Updated At</th>
              <th className="py-3 px-4 bg-gray-100">Action</th>
            </tr>
          </thead>
          <tbody className="text-center font-overpass text-[#333333]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.no_hp}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.membership}</td>
                <td className="py-3 px-4">{user.birthday ? new Date(user.birthday).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                <td className="py-3 px-4">{user.kode_user}</td>
                <td className="py-3 px-4">{user.referd_kode || '-'}</td>
                <td className="py-3 px-4">{user.role === 0 ? 'User / Client' : 'Admin'}</td>
                <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 gap-3 flex justify-center items-center">
                  <button onClick={() => handleEditClick(user.id)} className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 font-overpass">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
