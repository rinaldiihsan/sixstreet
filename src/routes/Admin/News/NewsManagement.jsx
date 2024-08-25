import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchNews = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${backendUrl}/getnews`, { headers });
      const sortedNews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const modifiedNews = sortedNews.map((item) => ({
        ...item,
        isi_berita: truncateText(item.isi_berita, 3),
      }));
      setNews(modifiedNews);
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const truncateText = (text, sentences) => {
    const truncated = text.split('.').slice(0, sentences).join('.') + '...';
    return truncated;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNews = news.filter((newsItem) => newsItem.judulberita.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">News Management</h1>
        <div className="mt-10 flex w-full items-center justify-between">
          <div className="space-y-1">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
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
          <Link to="/news-management/tambah-news" className="px-5 py-3 bg-[#333333] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#333333] transition-colors duration-300 font-overpass">
            Tambah news
          </Link>
        </div>
        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNews.map((newsItem) => (
            <div key={newsItem.id} className="bg-white shadow-md overflow-hidden p-6">
              <Link to={`/news-management/${encodeURIComponent(newsItem.judulberita)}`} className="p-4">
                <h3 className="font-overpass text-[#333333] font-extrabold text-lg mb-2">{newsItem.judulberita}</h3>
                <p className="font-overpass text-[#333333] text-sm">{newsItem.isi_berita}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsManagement;
