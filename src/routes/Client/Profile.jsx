import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    kelurahan: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    negara: '',
    kodePos: '',
  });

  const [formUser, setFormUser] = useState({
    email: '',
    username: '',
    no_hp: '',
    birthday: '',
  });

  const toggleSubMenu = (subMenu) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  const toggleAddAddressForm = () => {
    setShowAddAddressForm(!showAddAddressForm);
  };

  const toggleEditUserForm = () => {
    setShowEditUserForm(!showEditUserForm);
  };

  const toggleEditAddressForm = (addressId) => {
    setEditAddressId(addressId);
    setShowEditAddressForm(true);
  };

  const toggleCloseEditAddressForm = () => {
    setShowEditAddressForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setFormUser({
      ...formUser,
      [name]: value,
    });
  };

  useEffect(() => {
    setActiveSubMenu(null);
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, [id]);

  const fetchAddresses = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/getAddress/${id}`, { headers });
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    }
  };

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/detail/${id}`, { headers });
      setUserData(response.data.message);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      const { address, kelurahan, kecamatan, kabupatenKota, provinsi, negara, kodePos } = formData;
      const combinedAddress = `${address}, ${kelurahan}, ${kecamatan}, ${kabupatenKota}, ${provinsi}, ${negara}, ${kodePos}`;
      const requestData = {
        address: combinedAddress,
      };
      await axios.post(`${backendUrl}/addAddress/${id}`, requestData, { headers });
      fetchAddresses();
      toggleAddAddressForm();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      const { email, username, no_hp, birthday } = formUser;
      const requestData = {
        email,
        username,
        no_hp,
        birthday,
      };
      await axios.put(`${backendUrl}/update/${id}`, requestData, { headers });
      fetchUserData();
      toggleEditUserForm();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      const { address, kelurahan, kecamatan, kabupatenKota, provinsi, negara, kodePos } = formData;
      const combinedAddress = `${address}, ${kelurahan}, ${kecamatan}, ${kabupatenKota}, ${provinsi}, ${negara}, ${kodePos}`;
      const requestData = {
        newAddress: combinedAddress,
      };
      await axios.put(`${backendUrl}/updateAddress/${id}/${editAddressId}`, requestData, { headers });
      fetchAddresses();
      setShowEditAddressForm(false);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md mx-3 md:max-w-md w-full space-y-2">
        <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">My Account</h2>
        <ul className="space-y-2 w-full border border-gray-200 px-8 py-3 flex flex-col justify-center">
          <li>
            <button className="flex justify-between w-full mb-2" onClick={() => toggleSubMenu('accountDetails')}>
              <span className="block text-lg font-garamond font-bold text-gray-800 hover:text-gray-900">Account Details</span>
              <span className="block text-xl font-garamond font-bold text-gray-800 hover:text-gray-900">{activeSubMenu === 'accountDetails' ? '-' : '+'}</span>
            </button>
            <ul className={`${activeSubMenu === 'accountDetails' ? 'block' : 'hidden'} pl-4 space-y-2`}>
              <li className="block text-md text-[#333333] font-overpass">
                Email Address:
                <br /> {userData.email}
              </li>
              <li className="block text-md text-[#333333] font-overpass">
                Username:
                <br /> {userData.username}
              </li>
              <li className="block text-md text-[#333333] font-overpass">
                No. Handphone:
                <br /> {userData.no_hp}
              </li>
              <li className="block text-md text-[#333333] font-overpass">
                Birthday:
                <br /> {formatDate(userData.birthday)}
              </li>
              <button className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2" onClick={toggleEditUserForm}>
                Edit Profile
              </button>
              {showEditUserForm && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Edit Profile</h2>
                    <form onSubmit={handleEditUser} className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="email" className="font-overpass font-semibold">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formUser.email}
                          onChange={handleChangeUser}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="username" className="font-overpass font-semibold">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formUser.username}
                          onChange={handleChangeUser}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="no_hp" className="font-overpass font-semibold">
                          No. Handphone
                        </label>
                        <input
                          type="text"
                          id="no_hp"
                          name="no_hp"
                          value={formUser.no_hp}
                          onChange={handleChangeUser}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="birthday" className="font-overpass font-semibold">
                          Birthday
                        </label>
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          value={formUser.birthday}
                          onChange={handleChangeUser}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        {/* Cancel Button */}
                        <button type="button" onClick={toggleEditUserForm} className="bg-white text-[#333] transition-colors py-2 px-4 font-garamond font-bold mr-2">
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
            </ul>
          </li>
        </ul>
        <ul className="space-y-2 w-full border border-gray-200 px-8 py-3 flex flex-col justify-center">
          <li>
            <button className="flex justify-between w-full mb-2" onClick={() => toggleSubMenu('manageAddress')}>
              <span className="block text-lg font-garamond font-bold text-gray-800 hover:text-gray-900">Manage Address</span>
              <span className="block text-xl font-garamond font-bold text-gray-800 hover:text-gray-900">{activeSubMenu === 'manageAddress' ? '-' : '+'}</span>
            </button>
            <ul className={`${activeSubMenu === 'manageAddress' ? 'block' : 'hidden'} pl-4 space-y-2`}>
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <div key={address.id} className="flex w-full justify-between">
                    <li className="block text-md text-[#333333] font-overpass">{address.address}</li>
                    <button className="font-overpass font-bold" onClick={() => toggleEditAddressForm(address.id)}>
                      Edit Data
                    </button>
                  </div>
                ))
              ) : (
                <li className="block text-md text-[#333333] font-overpass">No addresses found.</li>
              )}
              {addresses.length === 0 && (
                <button className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2" onClick={toggleAddAddressForm}>
                  Add Address
                </button>
              )}
              {showAddAddressForm && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Add Address</h2>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="address" className="font-overpass font-semibold">
                          Alamat
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kelurahan" className="font-overpass font-semibold">
                          Kelurahan
                        </label>
                        <input
                          type="text"
                          id="kelurahan"
                          name="kelurahan"
                          value={formData.kelurahan}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kecamatan" className="font-overpass font-semibold">
                          Kecamatan
                        </label>
                        <input
                          type="text"
                          id="kecamatan"
                          name="kecamatan"
                          value={formData.kecamatan}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kabupatenKota" className="font-overpass font-semibold">
                          Kabupaten/Kota
                        </label>
                        <input
                          type="text"
                          id="kabupatenKota"
                          name="kabupatenKota"
                          value={formData.kabupatenKota}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="provinsi" className="font-overpass font-semibold">
                          Provinsi
                        </label>
                        <input
                          type="text"
                          id="provinsi"
                          name="provinsi"
                          value={formData.provinsi}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="negara" className="font-overpass font-semibold">
                          Negara
                        </label>
                        <input
                          type="text"
                          id="negara"
                          name="negara"
                          value={formData.negara}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kodePos" className="font-overpass font-semibold">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          id="kodePos"
                          name="kodePos"
                          value={formData.kodePos}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex justify-end">
                        {/* Cancel Button */}
                        <button type="button" onClick={toggleAddAddressForm} className="bg-white text-[#333] transition-colors py-2 px-4 font-garamond font-bold mr-2">
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
              {/* Edit Address Form */}
              {showEditAddressForm && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Edit Address</h2>
                    <form onSubmit={handleEditAddress} className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="address" className="font-overpass font-semibold">
                          Alamat
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kelurahan" className="font-overpass font-semibold">
                          Kelurahan
                        </label>
                        <input
                          type="text"
                          id="kelurahan"
                          name="kelurahan"
                          value={formData.kelurahan}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kecamatan" className="font-overpass font-semibold">
                          Kecamatan
                        </label>
                        <input
                          type="text"
                          id="kecamatan"
                          name="kecamatan"
                          value={formData.kecamatan}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kabupatenKota" className="font-overpass font-semibold">
                          Kabupaten/Kota
                        </label>
                        <input
                          type="text"
                          id="kabupatenKota"
                          name="kabupatenKota"
                          value={formData.kabupatenKota}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="provinsi" className="font-overpass font-semibold">
                          Provinsi
                        </label>
                        <input
                          type="text"
                          id="provinsi"
                          name="provinsi"
                          value={formData.provinsi}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="negara" className="font-overpass font-semibold">
                          Negara
                        </label>
                        <input
                          type="text"
                          id="negara"
                          name="negara"
                          value={formData.negara}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="kodePos" className="font-overpass font-semibold">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          id="kodePos"
                          name="kodePos"
                          value={formData.kodePos}
                          onChange={handleChange}
                          className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={toggleCloseEditAddressForm} className="bg-white text-[#333] transition-colors py-2 px-4 font-garamond font-bold mr-2">
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
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
