// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import EditUserForm from '../../components/User/Profile/EditUserForm';
import AddressForm from '../../components/User/Profile/AddressForm';
import UserDetails from '../../components/User/Profile/UserDetails';
import AddressList from '../../components/User/Profile/AddressList';
import AccordionSection from '../../components/User/Profile/AccordionSection';
import { toast } from 'react-toastify';

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();

  // State Management
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  // Form Display States
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  // Form Data States
  const [formUser, setFormUser] = useState({
    email: '',
    username: '',
    no_hp: '',
    birthday: '',
  });

  // API Calls
  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/detail/${id}`, {
        headers,
      });
      setUserData(response.data.message);

      // Pre-fill user form data
      setFormUser({
        email: response.data.message.email,
        username: response.data.message.username,
        no_hp: response.data.message.no_hp,
        birthday: response.data.message.birthday,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Gagal memuat data pengguna');
    }
  };

  const fetchAddresses = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/getAddress/${id}`, {
        headers,
      });
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Gagal memuat data alamat, Silahkan Isi Alamat Terlebih Dahulu', {
        autoClose: 1500,
      });
    }
  };

  // Event Handlers
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleEditUser = async (userData) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      await axios.put(`${backendUrl}/update/${id}`, userData, { headers });

      await fetchUserData();
      setShowEditUserForm(false);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Gagal memperbarui profil');
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.post(`${backendUrl}/addAddress/${id}`, addressData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        await fetchAddresses();
        setShowAddAddressForm(false);
        toast.success('Alamat berhasil ditambahkan');
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response data:', error.response?.data);
      toast.error(error.response?.data?.message || 'Gagal menambahkan alamat');
    }
  };

  const handleEditAddress = async (addressData) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      await axios.put(`${backendUrl}/updateAddress/${id}/${editAddressId}`, addressData, { headers });

      await fetchAddresses();
      setShowEditAddressForm(false);
      toast.success('Alamat berhasil diperbarui');
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Gagal memperbarui alamat');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      try {
        const accessToken = Cookies.get('accessToken');
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        await axios.delete(`${backendUrl}/deleteAddress/${id}/${addressId}`, { headers });

        await fetchAddresses();
        toast.success('Alamat berhasil dihapus');
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Gagal menghapus alamat');
      }
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.put(`${backendUrl}/setDefaultAddress/${id}/${addressId}`, {}, { headers });

      await fetchAddresses();
      toast.success('Alamat utama berhasil diperbarui');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Gagal mengatur alamat utama');
    }
  };

  // useEffect Hooks
  useEffect(() => {
    if (id) {
      fetchUserData();
      fetchAddresses();
    }
  }, [id]);

  // Loading State
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 shadow-md mx-3 md:max-w-2xl w-full space-y-4">
        <h1 className="text-3xl font-bold text-center font-garamond text-[#333333] mb-8">My Account</h1>

        {/* User Details Section */}
        <AccordionSection title="Account Details" isActive={activeSection === 'account'} onToggle={() => toggleSection('account')}>
          <UserDetails userData={userData} toggleEditUserForm={() => setShowEditUserForm(true)} />
        </AccordionSection>

        {/* Address Section */}
        <AccordionSection title="Manage Address" isActive={activeSection === 'address'} onToggle={() => toggleSection('address')}>
          <AddressList
            addresses={addresses}
            toggleEditAddressForm={(addressId) => {
              setEditAddressId(addressId);
              setShowEditAddressForm(true);
            }}
            toggleAddAddressForm={() => setShowAddAddressForm(true)}
            handleDeleteAddress={handleDeleteAddress}
            setDefaultAddress={setDefaultAddress}
          />
        </AccordionSection>
      </div>

      {/* Modal Forms */}
      {showEditUserForm && <EditUserForm formUser={formUser} onSubmit={handleEditUser} onCancel={() => setShowEditUserForm(false)} />}

      {showAddAddressForm && <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddAddressForm(false)} title="Tambah Alamat Baru" />}

      {showEditAddressForm && <AddressForm onSubmit={handleEditAddress} onCancel={() => setShowEditAddressForm(false)} title="Edit Alamat" />}
    </div>
  );
};

export default Profile;
