import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { expeditionOptions } from '../../../constans/expedition';
import { toast } from 'react-toastify';

const EditTransaction = () => {
  const { user_id, transaction_uuid } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State untuk Address Management
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedSubdistrictId, setSelectedSubdistrictId] = useState('');

  // State untuk Shipping
  const [shippingCosts, setShippingCosts] = useState([]);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    sub_district: '',
    detail_address: '',
    expedition: '',
    expedition_services: '',
    etd: '',
    resi: '',
    status: '',
  });

  const statusOptions = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Fetch Cities from RajaOngkir API
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/rajacity`);
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Gagal memuat daftar kota');
    }
  };

  // Fetch Subdistricts when City is Selected
  const fetchSubdistricts = async (cityId) => {
    if (!cityId) return;

    try {
      const response = await axios.get(`${backendUrl}/rajasubdistrict/${cityId}`);
      setSubdistricts(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      toast.error('Gagal memuat daftar kecamatan');
    }
  };

  // Calculate Shipping Cost
  const calculateShipping = async (subdistrictId, courier = 'jne') => {
    if (!subdistrictId || !courier) return;

    setCalculatingShipping(true);
    try {
      const response = await axios.post(`${backendUrl}/rajacost`, {
        origin: '3917', // Your origin subdistrict ID
        originType: 'subdistrict',
        destination: subdistrictId,
        destinationType: 'subdistrict',
        weight: 1000, // Default weight in grams
        courier: courier,
      });

      const shippingResults = response.data.rajaongkir.results[0]?.costs || [];
      setShippingCosts(shippingResults);

      // Auto select first service if available
      if (shippingResults.length > 0 && !formData.expedition_services) {
        const firstService = shippingResults[0];
        setFormData((prev) => ({
          ...prev,
          expedition_services: firstService.service,
          etd: firstService.cost[0].etd || '1-7',
        }));
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast.error('Gagal menghitung biaya pengiriman');
      setShippingCosts([]);
    } finally {
      setCalculatingShipping(false);
    }
  };

  const fetchTransactionDetail = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${backendUrl}/transaction/${user_id}/${transaction_uuid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        const transactionData = response.data[0]; // Assuming first item contains the main transaction data
        setTransaction(response.data);

        // Find city and subdistrict IDs if they exist
        let cityId = '';
        let subdistrictId = '';

        if (transactionData.city && transactionData.sub_district) {
          // Try to find city ID from cities list
          const foundCity = cities.find((city) => `${city.type} ${city.city_name}`.toLowerCase() === transactionData.city.toLowerCase());
          if (foundCity) {
            cityId = foundCity.city_id;
            setSelectedCityId(cityId);

            // Fetch subdistricts for this city
            await fetchSubdistricts(cityId);
          }
        }

        setFormData({
          name: transactionData.name || '',
          city: transactionData.city || '',
          sub_district: transactionData.sub_district || '',
          detail_address: transactionData.detail_address || '',
          expedition: transactionData.expedition || '',
          expedition_services: transactionData.expedition_services || '',
          etd: transactionData.etd || '',
          resi: transactionData.resi || '',
          status: transactionData.status || '',
        });
      }
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      if (error.response?.status === 404) {
        alert('Transaction not found');
        navigate('/transaction-management');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle City Change
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCityId(cityId);

    if (cityId) {
      const selectedCity = cities.find((city) => city.city_id === cityId);
      if (selectedCity) {
        setFormData((prev) => ({
          ...prev,
          city: `${selectedCity.type} ${selectedCity.city_name}`,
        }));

        // Reset subdistrict and shipping when city changes
        setSelectedSubdistrictId('');
        setFormData((prev) => ({
          ...prev,
          sub_district: '',
          expedition_services: '',
          etd: '',
        }));
        setShippingCosts([]);

        // Fetch subdistricts for selected city
        fetchSubdistricts(cityId);
      }
    }
  };

  // Handle Subdistrict Change
  const handleSubdistrictChange = (e) => {
    const subdistrictId = e.target.value;
    setSelectedSubdistrictId(subdistrictId);

    if (subdistrictId) {
      const selectedSubdistrict = subdistricts.find((sub) => sub.subdistrict_id === subdistrictId);
      if (selectedSubdistrict) {
        setFormData((prev) => ({
          ...prev,
          sub_district: selectedSubdistrict.subdistrict_name,
        }));

        // Calculate shipping if expedition is selected
        if (formData.expedition) {
          calculateShipping(subdistrictId, formData.expedition);
        }
      }
    }
  };

  // Handle Expedition Change
  const handleExpeditionChange = (e) => {
    const expedition = e.target.value;
    setFormData((prev) => ({
      ...prev,
      expedition: expedition,
      expedition_services: '',
      etd: '',
    }));
    setShippingCosts([]);

    // Calculate shipping if subdistrict is selected
    if (selectedSubdistrictId && expedition) {
      calculateShipping(selectedSubdistrictId, expedition);
    }
  };

  // Handle Service Change
  const handleServiceChange = (e) => {
    const service = e.target.value;
    const selectedService = shippingCosts.find((s) => s.service === service);

    setFormData((prev) => ({
      ...prev,
      expedition_services: service,
      etd: selectedService ? selectedService.cost[0].etd || '1-7' : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${backendUrl}/transaction/${user_id}/${transaction_uuid}`,
        {
          name: formData.name,
          city: formData.city,
          sub_district: formData.sub_district,
          detail_address: formData.detail_address,
          expedition: formData.expedition,
          expedition_services: formData.expedition_services,
          etd: formData.etd,
          resi: formData.resi,
          status: formData.status,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        alert('Transaction updated successfully!');
        navigate('/transaction-management');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
  };

  useEffect(() => {
    fetchCities();
    fetchTransactionDetail();
  }, [user_id, transaction_uuid]);

  // Fetch subdistricts when cities are loaded and we have city data
  useEffect(() => {
    if (cities.length > 0 && formData.city && !selectedCityId) {
      const foundCity = cities.find((city) => `${city.type} ${city.city_name}`.toLowerCase() === formData.city.toLowerCase());
      if (foundCity) {
        setSelectedCityId(foundCity.city_id);
        fetchSubdistricts(foundCity.city_id);
      }
    }
  }, [cities, formData.city]);

  // Find subdistrict ID when subdistricts are loaded
  useEffect(() => {
    if (subdistricts.length > 0 && formData.sub_district && !selectedSubdistrictId) {
      const foundSubdistrict = subdistricts.find((sub) => sub.subdistrict_name.toLowerCase() === formData.sub_district.toLowerCase());
      if (foundSubdistrict) {
        setSelectedSubdistrictId(foundSubdistrict.subdistrict_id);

        // Calculate shipping if expedition is already set
        if (formData.expedition) {
          calculateShipping(foundSubdistrict.subdistrict_id, formData.expedition);
        }
      }
    }
  }, [subdistricts, formData.sub_district]);

  if (loading) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-4 md:px-6 lg:px-8 font-overpass min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading transaction details...</div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-4 md:px-6 lg:px-8 font-overpass min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Transaction not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-4 md:px-6 lg:px-8 font-overpass min-h-screen">
      <div className="mb-6">
        <button onClick={() => navigate('/transaction-management')} className="text-blue-500 hover:text-blue-700 font-medium">
          ← Back to Transaction Management
        </button>
      </div>

      <h1 className="font-garamond text-[#333333] text-3xl font-semibold text-center mb-8">Edit Transaction</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Transaction Summary */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Transaction ID:</span>
              <div className="text-gray-900">{transaction_uuid}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">User ID:</span>
              <div className="text-gray-900">{user_id}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <div className="text-gray-900">{formatDate(transaction[0]?.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
          <div className="space-y-3">
            {transaction.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div>
                  <div className="font-medium text-gray-900">{item.product_name}</div>
                  <div className="text-sm text-gray-600">
                    Size: {item.product_size} | Quantity: {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(item.product_price)}</div>
                  <div className="text-sm text-gray-600">Total: {formatCurrency(item.product_price * item.quantity)}</div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Transaction Total:</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(transaction[0]?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Transaction Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">Customer Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={selectedCityId} onChange={handleCityChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.type} {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub District</label>
                <select
                  value={selectedSubdistrictId}
                  onChange={handleSubdistrictChange}
                  disabled={!selectedCityId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Sub District</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict.subdistrict_id} value={subdistrict.subdistrict_id}>
                      {subdistrict.subdistrict_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Address</label>
                <textarea name="detail_address" value={formData.detail_address} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">Shipping Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expedition</label>
                <select value={formData.expedition} onChange={handleExpeditionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Expedition</option>
                  {expeditionOptions.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expedition Services
                  {calculatingShipping && <span className="text-blue-500 text-sm ml-2">(Calculating...)</span>}
                </label>
                <select
                  value={formData.expedition_services}
                  onChange={handleServiceChange}
                  disabled={!formData.expedition || !selectedSubdistrictId || calculatingShipping}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Service</option>
                  {shippingCosts.map((service) => {
                    const etdText = service.cost[0].etd === '' ? '1-7' : service.cost[0].etd;
                    return (
                      <option key={service.service} value={service.service}>
                        {service.service} - {formatCurrency(service.cost[0].value)} - {etdText} days
                      </option>
                    );
                  })}
                </select>
                {shippingCosts.length === 0 && formData.expedition && selectedSubdistrictId && !calculatingShipping && <p className="text-sm text-gray-500 mt-1">No shipping services available for this route</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ETD (Days)</label>
                <input
                  type="text"
                  name="etd"
                  value={formData.etd}
                  onChange={handleInputChange}
                  placeholder="e.g., 1-7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  readOnly={formData.expedition_services && shippingCosts.length > 0}
                />
                {formData.expedition_services && shippingCosts.length > 0 && <p className="text-sm text-gray-500 mt-1">ETD is automatically filled based on selected service</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number (Resi)</label>
                <input
                  type="text"
                  name="resi"
                  value={formData.resi}
                  onChange={handleInputChange}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Cost Information */}
              {formData.expedition_services && shippingCosts.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Shipping Information</h5>
                  {shippingCosts
                    .filter((service) => service.service === formData.expedition_services)
                    .map((service) => (
                      <div key={service.service} className="text-sm text-blue-800">
                        <p>
                          <strong>Service:</strong> {service.service}
                        </p>
                        <p>
                          <strong>Description:</strong> {service.description}
                        </p>
                        <p>
                          <strong>Cost:</strong> {formatCurrency(service.cost[0].value)}
                        </p>
                        <p>
                          <strong>ETD:</strong> {service.cost[0].etd || '1-7'} days
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/transaction-management')} className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
