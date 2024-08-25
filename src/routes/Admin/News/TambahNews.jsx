import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const TambahNews = () => {
  const backendUrl = 'http://localhost:3000'; // Sesuaikan dengan URL backend Anda
  const [judulBerita, setJudulBerita] = useState('');
  const [isiBerita, setIsiBerita] = useState('');
  const [gambar, setGambar] = useState(null); // State untuk menyimpan file gambar

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = Cookies.get('accessToken');
      const formData = new FormData();
      formData.append('judulberita', judulBerita);
      formData.append('isi_berita', isiBerita);
      formData.append('gambar', gambar); // Menambahkan file gambar ke FormData

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data', // Perlu menetapkan Content-Type ini untuk pengunggahan file
      };

      const response = await axios.post(`${backendUrl}/createnews`, formData, { headers });

      // Handle successful response (e.g., show success message, redirect, etc.)
      console.log('News added successfully:', response.data);

      // Clear input fields after submission
      setJudulBerita('');
      setIsiBerita('');
      setGambar(null);
    } catch (error) {
      console.error('Error adding news:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
  };

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center ">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md mx-3 w-full md:w-[45rem]" encType="multipart/form-data">
        <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">Tambah News</h1>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label htmlFor="judulBerita" className="block uppercase tracking-wide text-gray-700  font-overpass mb-2">
              Judul Berita
            </label>
            <input
              type="text"
              id="judulBerita"
              className="block w-full text-gray-700 border border-gray-300  py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-[#333333]"
              placeholder="Masukkan judul berita"
              value={judulBerita}
              onChange={(e) => setJudulBerita(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label htmlFor="isiBerita" className="block uppercase tracking-wide text-gray-700  font-overpass mb-2">
              Isi Berita
            </label>
            <textarea
              id="isiBerita"
              className="block w-full text-gray-700 border border-gray-300  py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-[#333333]"
              placeholder="Masukkan isi berita"
              value={isiBerita}
              onChange={(e) => setIsiBerita(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label htmlFor="gambar" className="block uppercase tracking-wide text-gray-700  font-overpass mb-2">
              Gambar Berita
            </label>
            <input type="file" id="gambar" className="block w-full text-gray-700 border border-gray-300  py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-[#333333]" accept="image/*" onChange={handleFileChange} required />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button type="submit" className="bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass px-8 py-3">
            Tambah News
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahNews;
