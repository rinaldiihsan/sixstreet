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
import PointsSection from '../../components/User/Profile/PointsSection';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();

  // State Management
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [activeManagementTab, setActiveManagementTab] = useState('detail_account');

  // Form Display States
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  // Form Data States
  const [formUser, setFormUser] = useState({
    email: '',
    fullName: '',
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
        fullName: response.data.message.fullName,
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

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      await axios.put(`${backendUrl}/update/${id}`, formUser, { headers });

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

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // Loader Pretty
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 py-24 px-5 md:px-0">
      <div className="md:max-w-2xl w-full flex gap-x-3 mb-3">
        <button
          id="detail_account"
          className={`bg-white p-8 shadow-md w-full text-lg font-bold text-center font-garamond ${activeManagementTab === 'detail_account' ? 'text-[#333333] border-b-4 border-[#333333]' : 'text-gray-500'}`}
          onClick={() => setActiveManagementTab('detail_account')}
        >
          Detail Account
        </button>
        <button
          id="point-voucher"
          className={`bg-white p-8 shadow-md w-full text-lg font-bold text-center font-garamond ${activeManagementTab === 'point-voucher' ? 'text-[#333333] border-b-4 border-[#333333]' : 'text-gray-500'}`}
          onClick={() => setActiveManagementTab('point-voucher')}
        >
          Point & Voucher
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeManagementTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 md:p-8 shadow-md mx-3 md:max-w-2xl w-full space-y-4"
        >
          <h1 className="text-3xl font-bold text-center font-garamond text-[#333333] mb-8">{activeManagementTab === 'detail_account' ? 'My Account' : 'Points & Voucher'}</h1>

          {activeManagementTab === 'detail_account' ? (
            <>
              <AccordionSection title="Account Details" isActive={activeSection === 'account'} onToggle={() => toggleSection('account')}>
                <UserDetails userData={userData} toggleEditUserForm={() => setShowEditUserForm(true)} />
              </AccordionSection>

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
            </>
          ) : (
            <>
              <AccordionSection title="Points" isActive={activeSection === 'points'} onToggle={() => toggleSection('points')}>
                <PointsSection user_id={id} />
              </AccordionSection>

              <AccordionSection title="Vouchers" isActive={activeSection === 'vouchers'} onToggle={() => toggleSection('vouchers')}>
                <div className="bg-gray-100 p-4 font-garamond">
                  <p className="text-gray-500">Belum ada voucher tersedia</p>
                </div>
              </AccordionSection>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Modal Forms - tetap sama */}
      {showEditUserForm && <EditUserForm formUser={formUser} handleChangeUser={handleChangeUser} onCancel={() => setShowEditUserForm(false)} handleEditUser={handleEditUser} />}
      {showAddAddressForm && <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddAddressForm(false)} title="Tambah Alamat Baru" />}
      {showEditAddressForm && <AddressForm onSubmit={handleEditAddress} onCancel={() => setShowEditAddressForm(false)} title="Edit Alamat" />}
    </div>
  );
};

export default Profile;
