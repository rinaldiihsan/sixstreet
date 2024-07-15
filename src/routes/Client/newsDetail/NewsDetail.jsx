import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const { judulberita } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getnewsbyjudul/${encodeURIComponent(judulberita)}`);
        setNews(response.data);
      } catch (error) {
        setError('Failed to fetch news details');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [judulberita]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <img src={`${backendUrl}/${news.gambar.replace(/\\/g, '/')}`} alt={news.judulberita} className="w-[38rem]" />
        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <div>
            <h1 className="text-2xl font-bold font-garamond text-[#333333] text-justify">{news.judulberita}</h1>
            <p className="text-md font-medium font-overpass text-[#333333]">{formatDate(news.createdAt)}</p>
          </div>
          <p className="text-lg font-overpass text-[#333333] text-justify">{news.isi_berita}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
