import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import assetBannerWallet from '../../../assets/banner/wallets & card holder.webp';

// ✅ CATEGORY IDS GLOBAL
const categoryIds = [12611, 12610];

const Wallets = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isSoldProducts, setIsSoldProducts] = useState(10);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${backendUrl}/products`, { headers: { 'Content-Type': 'application/json' } });
      if (res.data.success) {
        const grouped = res.data.data.reduce((acc, product) => {
          if (!categoryIds.includes(product.category_id)) return acc;
          const baseName = product.nama_produk.split(' - ')[0].trim();
          if (!acc[baseName]) {
            acc[baseName] = {
              base_name: baseName,
              item_group_id: product.item_group_id,
              category_id: product.category_id,
              thumbnail: product.thumbnail,
              price: parseFloat(product.harga),
              total_stock: 0,
              variants: [],
              updated_at: product.updated_at,
            };
          }
          acc[baseName].total_stock += product.stok;
          acc[baseName].variants.push(product);
          return acc;
        }, {});
        setProducts(Object.values(grouped));
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };
  const getImageUrl = (product) => (product.thumbnail ? `${backendUrl}/${product.thumbnail}` : '/dummy-product.png');

  const sortedProducts = [...products].sort((a, b) => {
    if (selectedOption === 'Harga Tertinggi') return b.price - a.price;
    if (selectedOption === 'Harga Terendah') return a.price - b.price;
    if (selectedOption === 'Alphabet') return a.base_name.localeCompare(b.base_name);
    if (selectedOption === 'Product Terbaru') return new Date(b.updated_at) - new Date(a.updated_at);
    return 0;
  });

  const available = sortedProducts.filter((p) => p.total_stock > 0);
  const soldOut = sortedProducts.filter((p) => p.total_stock <= 0).slice(0, isSoldProducts);
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="mt-20 max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex flex-col justify-center items-center">
      {showAlert && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[999]">
          <div className="bg-red-100 border border-red-500 text-red-500 px-8 py-3 rounded-lg shadow-lg">Maaf, produk ini sedang tidak tersedia (Sold Out)</div>
        </div>
      )}
      <img src={assetBannerWallet} alt="Hero" className="w-full h-auto mb-6" />
      <div className="w-full flex justify-between mb-6 sticky top-[72px] bg-white z-[997] py-4">
        <div className="border border-[#E5E5E5] flex-grow px-4 md:px-10 py-5">
          <p className="font-overpass capitalize">{products.length} Result</p>
        </div>
        <div className="relative border border-[#E5E5E5] hidden md:flex items-center justify-center w-full md:w-[25rem] px-4 md:px-10 py-5 gap-x-5">
          <p className="font-overpass capitalize cursor-pointer" onClick={handleDropdownToggle}>
            {selectedOption}
          </p>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border z-10">
              {['Relevance', 'Harga Tertinggi', 'Harga Terendah', 'Product Terbaru', 'Alphabet'].map((opt) => (
                <p key={opt} className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect(opt)}>
                  {opt}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-4 mb-10 overflow-y-auto h-[calc(100vh-4rem)] md:px-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-y-5 items-center">
              <Skeleton className="w-[8rem] h-[8rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem]" />
              <Skeleton className="text-sm md:text-lg w-[8rem] md:w-[18rem]" />
            </div>
          ))
        ) : error ? (
          <p className="text-red-500 font-bold col-span-full text-center">{error}</p>
        ) : (
          <>
            {[...available, ...soldOut].map((p, i) => (
              <div key={i} className="flex flex-col gap-y-5 items-center">
                <Link to={p.total_stock > 0 ? `/product-detail/${p.item_group_id}` : `/product-detail-sold/${p.item_group_id}`}>
                  <img src={getImageUrl(p)} alt={p.base_name} className={`object-cover ${p.total_stock <= 0 ? 'opacity-50' : ''} w-[8rem] h-[8rem] md:w-[18rem] md:h-[18rem]`} onError={(e) => (e.target.src = '/dummy-product.png')} />
                </Link>
                <div className="text-center">
                  <h2 className={`uppercase font-overpass ${p.total_stock > 0 ? '' : 'text-red-700'} text-sm md:text-lg`}>{p.base_name}</h2>
                  <h2 className={`text-sm md:text-lg ${p.total_stock > 0 ? 'text-gray-700' : 'text-red-600'}`}>{p.total_stock > 0 ? formatPrice(p.price) : 'Sold Out'}</h2>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Wallets;
