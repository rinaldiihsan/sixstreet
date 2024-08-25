import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserManagement = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [formUser, setFormUser] = useState({
    email: '',
    username: '',
    no_hp: '',
    birthday: '',
    kode_user: '',
    referd_kode: '',
    role: '',
    membership: '',
  });

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
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.no_hp.includes(searchLower) ||
      user.kode_user.toLowerCase().includes(searchLower) ||
      (user.birthday && user.birthday.includes(searchLower)) ||
      user.referd_kode.toLowerCase().includes(searchLower) ||
      user.role.toString().includes(searchLower) ||
      new Date(user.createdAt).toLocaleString().includes(searchLower) ||
      new Date(user.updatedAt).toLocaleString().includes(searchLower)
    );
  });

  const handleEditClick = (user) => {
    setFormUser({
      email: user.email,
      username: user.username,
      no_hp: user.no_hp,
      birthday: user.birthday,
      kode_user: user.kode_user,
      referd_kode: user.referd_kode ?? '',
      role: user.role,
      membership: user.membership,
    });
    setSelectedUserId(user.id);
    setShowEditUserForm(true);
  };

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
      await axios.put(`${backendUrl}/update/${selectedUserId}`, formUser, { headers });
      fetchUserData();
      setShowEditUserForm(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const toggleCloseEditUserForm = () => {
    setShowEditUserForm(false);
    setSelectedUserId(null);
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

      {showEditUserForm && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-6">
            <form onSubmit={handleEditUser} className="w-full space-y-2">
              <h2 className="text-2xl font-bold mb-4 text-center font-garamond text-[#333333]">Edit Profile</h2>

              <div className="flex flex-col">
                <label htmlFor="username" className="font-overpass font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formUser.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  required
                  className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="no_hp" className="font-overpass font-semibold">
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
                <label htmlFor="email" className="font-overpass font-semibold">
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
                <label htmlFor="membership" className="font-overpass font-semibold">
                  Membership
                </label>
                <input
                  type="number"
                  name="membership"
                  value={formUser.membership}
                  onChange={handleInputChange}
                  placeholder="Membership"
                  required
                  className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="birthday" className="font-overpass font-semibold">
                  Birthday
                </label>
                <input type="date" name="birthday" value={formUser.birthday} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent" />
              </div>

              <div className="flex flex-col">
                <label htmlFor="kode_user" className="font-overpass font-semibold">
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
                <label htmlFor="referd_kode" className="font-overpass font-semibold">
                  Referral Kode
                </label>
                <input
                  type="text"
                  name="referd_kode"
                  value={formUser.referd_kode || ''}
                  onChange={handleInputChange}
                  placeholder="Referral Kode"
                  className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="role" className="font-overpass font-semibold">
                  Role
                </label>
                <input
                  type="number"
                  name="role"
                  value={formUser.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                  required
                  className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-x-2">
                <button type="button" onClick={toggleCloseEditUserForm} className="bg-white text-[#333] transition-colors py-2 px-4 font-garamond font-bold">
                  Cancel
                </button>
                <button type="submit" className="bg-[#333] hover:bg-white text-white hover:text-[#333] transition-colors py-2 px-4 font-garamond font-bold">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <td className="py-3 px-4">{user.birthday}</td>
                <td className="py-3 px-4">{user.kode_user}</td>
                <td className="py-3 px-4">{user.referd_kode}</td>
                <td className="py-3 px-4">{user.role === 0 ? 'User / Client' : 'Admin'}</td>
                <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 space-x-3">
                  <button onClick={() => handleEditClick(user)} className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">Delete</button>
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
