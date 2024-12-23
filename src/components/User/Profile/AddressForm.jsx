import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressForm = ({ onSubmit, onCancel, title }) => {
  // State for location data
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  // State for selected values
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');

  // State for form inputs
  const [formData, setFormData] = useState({
    address: '',
    kelurahan: '',
    kodePos: '',
  });

  // State for loading
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingSubdistricts, setIsLoadingSubdistricts] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch cities when component mounts
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch subdistricts when city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchSubdistricts(selectedCity);
    }
  }, [selectedCity]);

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await axios.get(`${backendUrl}/rajaprovince`);
      setProvinces(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const fetchCities = async () => {
    setIsLoadingCities(true);
    try {
      const response = await axios.get(`${backendUrl}/rajacity`);
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSubdistricts = async (cityId) => {
    setIsLoadingSubdistricts(true);
    try {
      const response = await axios.get(`${backendUrl}/rajasubdistrict/${cityId}`);
      setSubdistricts(response.data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
    } finally {
      setIsLoadingSubdistricts(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedProvinceData = provinces.find((p) => p.province_id === selectedProvince);
    const selectedCityData = cities.find((c) => c.city_id === selectedCity);
    const selectedSubdistrictData = subdistricts.find((s) => s.subdistrict_id === selectedSubdistrict);

    // Format alamat sesuai dengan format yang diterima database
    const combinedAddress = `${formData.address}, ${formData.kelurahan}, ${selectedSubdistrictData?.subdistrict_name || ''}, ${selectedCityData ? `${selectedCityData.type} ${selectedCityData.city_name}` : ''}, ${
      selectedProvinceData?.province || ''
    }, Indonesia, ${formData.kodePos}`;

    const requestData = {
      address: combinedAddress,
    };

    console.log('Request data:', requestData);

    onSubmit(requestData);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Province Selection */}
          <div className="flex flex-col">
            <label htmlFor="province" className="font-overpass font-semibold mb-1">
              Provinsi
            </label>
            <select
              id="province"
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity('');
                setSelectedSubdistrict('');
              }}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded"
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="flex flex-col">
            <label htmlFor="city" className="font-overpass font-semibold mb-1">
              Kota/Kabupaten
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedSubdistrict('');
              }}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded"
              required
              disabled={!selectedProvince}
            >
              <option value="">Pilih Kota/Kabupaten</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.type} {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subdistrict/Kecamatan Selection */}
          <div className="flex flex-col">
            <label htmlFor="subdistrict" className="font-overpass font-semibold mb-1">
              Kecamatan
            </label>
            <select
              id="subdistrict"
              value={selectedSubdistrict}
              onChange={(e) => setSelectedSubdistrict(e.target.value)}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded"
              required
              disabled={!selectedCity}
            >
              <option value="">Pilih Kecamatan</option>
              {subdistricts.map((subdistrict) => (
                <option key={subdistrict.subdistrict_id} value={subdistrict.subdistrict_id}>
                  {subdistrict.subdistrict_name}
                </option>
              ))}
            </select>
          </div>

          {/* Kelurahan Input */}
          <div className="flex flex-col">
            <label htmlFor="kelurahan" className="font-overpass font-semibold mb-1">
              Kelurahan
            </label>
            <input
              type="text"
              id="kelurahan"
              name="kelurahan"
              value={formData.kelurahan}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded"
              required
              placeholder="Masukkan kelurahan"
            />
          </div>

          {/* Detailed Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="font-overpass font-semibold mb-1">
              Alamat Lengkap
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded h-24"
              required
              placeholder="Contoh: Jalan Kebon Jeruk Raya No.27, RT.1/RW.9"
            />
          </div>

          {/* Postal Code */}
          <div className="flex flex-col">
            <label htmlFor="kodePos" className="font-overpass font-semibold mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              id="kodePos"
              name="kodePos"
              value={formData.kodePos}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent rounded"
              required
              placeholder="Masukkan kode pos"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onCancel} className="bg-white text-[#333] border border-[#333] transition-colors py-2 px-4 font-garamond font-bold mr-2 hover:bg-gray-100">
              Batal
            </button>
            <button type="submit" className="bg-[#333] hover:bg-[#444] text-white transition-colors py-2 px-4 font-garamond font-bold">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
