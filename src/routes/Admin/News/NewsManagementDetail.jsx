import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsManagementDetail = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { judulberita } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [formEdit, setFormEdit] = useState({
    judulberita: '',
    isi_berita: '',
    gambar: '',
    newImage: null, // state untuk menyimpan gambar baru yang dipilih
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getnewsbyjudul/${encodeURIComponent(judulberita)}`);
        setNews(response.data);
        setFormEdit({
          judulberita: response.data.judulberita,
          isi_berita: response.data.isi_berita,
          gambar: response.data.gambar,
        });
      } catch (error) {
        setError('Failed to fetch news details');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [backendUrl, judulberita]);

  const handleEdit = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('judulberita', formEdit.judulberita);
      formData.append('isi_berita', formEdit.isi_berita);
      formData.append('gambar', formEdit.newImage);

      const response = await axios.put(`${backendUrl}/updatenews/${news.id}`, formData, { headers });
      setShowFormEdit(false);
      setNews(response.data);
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormEdit({ ...formEdit, newImage: selectedFile });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <img src={`${backendUrl}/${news.gambar.replace(/\\/g, '/')}`} alt={news.judulberita} className="w-[38rem] object-cover" />
        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <div>
            <h1 className="text-2xl font-bold font-garamond text-[#333333] text-justify">{news.judulberita}</h1>
            <p className="text-md font-medium font-overpass text-[#333333]">{formatDate(news.createdAt)}</p>
          </div>
          <p className="text-lg font-overpass text-[#333333] text-justify">{news.isi_berita}</p>
          {/* Edit button */}
          <button onClick={() => setShowFormEdit(true)} className="px-4 py-3 bg-[#333333] text-white mt-4  font-overpass">
            Edit News
          </button>
        </div>
      </div>

      {/* Edit Form Pop-up */}
      {showFormEdit && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#333333] bg-opacity-50 z-50">
          <div className="bg-white p-8 shadow-md w-[65rem] space-y-8">
            <h2 className="text-xl font-bold mb-4 font-overpass">Edit News</h2>
            <div className="flex gap-x-5 justify-between w-full">
              <div>
                <label htmlFor="gambar" className="block mb-2 font-overpass font-bold">
                  Gambar
                </label>
                <input type="file" id="gambar" accept="image/*" onChange={handleImageChange} className="border border-gray-300 px-8 py-2 w-full font-overpass" />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="judulberita" className="block mb-2 font-overpass font-bold">
                  Judul Berita
                </label>
                <input type="text" id="judulberita" value={formEdit.judulberita} onChange={(e) => setFormEdit({ ...formEdit, judulberita: e.target.value })} className="border border-gray-300 px-3 py-2 w-full mb-5 font-overpass" />
                <label htmlFor="isi_berita" className="block mb-2 font-overpass font-bold">
                  Isi Berita
                </label>
                <textarea id="isi_berita" value={formEdit.isi_berita} onChange={(e) => setFormEdit({ ...formEdit, isi_berita: e.target.value })} className="border border-gray-300 px-3 py-2 w-full font-overpass" rows={6} />
              </div>
            </div>
            <div className="flex gap-x-2">
              <button onClick={handleEdit} className="px-4 py-2 bg-[#333333] text-white font-overpass">
                Save Changes
              </button>
              <button onClick={() => setShowFormEdit(false)} className="px-4 py-2 bg-gray-300 font-overpass">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagementDetail;
