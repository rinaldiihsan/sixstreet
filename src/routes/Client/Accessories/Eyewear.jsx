import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Eyewear = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/inventory/items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      const data = response.data;

      // Menggabungkan thumbnail dari objek utama produk ke dalam variants
      const productsWithThumbnails = data.data.map((item) => {
        item.variants = item.variants.map((variant) => ({
          ...variant,
          parentThumbnail: item.thumbnail,
        }));
        return item;
      });

      setProducts(productsWithThumbnails);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAndFetchProducts = async () => {
    const email = import.meta.env.VITE_API_EMAIL;
    const password = import.meta.env.VITE_API_PASSWORD;
    const ApiLogin = import.meta.env.VITE_LOGIN_JUBELIO;

    if (!email || !password) {
      setError('Missing email or password in environment variables.');
      setLoginStatus('error');
      return;
    }

    try {
      const response = await axios.post(`${ApiLogin}/loginjubelio`);

      const data = response.data;

      if (response.status === 200) {
        Cookies.set('pos_token', data.token, { expires: 1 });
        setLoginStatus('success');
        fetchProducts(data.token);
      } else {
        setError(data.message);
        setLoginStatus('error');
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      setLoginStatus('error');
    }
  };
  useEffect(() => {
    loginAndFetchProducts();
  }, []);

  useEffect(() => {
    const token = Cookies.get('pos_token');
    if (token) {
      fetchProducts(token);
    }
  }, [selectedOption]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="mt-20 max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex flex-col justify-center items-center">
        <img src="/hero-eyewear.png" alt="Hero Eyewear" className="w-full h-auto mb-6" />
        {/* Filter  */}
        <div className="w-full flex justify-between mb-6 sticky top-[72px] bg-white z-[997] py-4">
          <div className="flex flex-grow">
            <div className="border border-[#E5E5E5] flex items-center justify-center w-[17rem] px-10 py-5 gap-x-14">
              <p className="font-overpass text-lg">Filter</p>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3335 5.41666H13.3335" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.1143.41666H1.6665" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M8.33317 8.33333C9.944 8.33333 11.2498 7.0275 11.2498 5.41667C11.2498 3.80584 9.944 2.5 8.33317 2.5C6.72234 2.5 5.4165 3.80584 5.4165 5.41667C5.4165 7.0275 6.72234 8.33333 8.33317 8.33333Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M18.3333 14.5833H15" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.6665 14.5833H1.6665" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M11.6667 17.5C13.2775 17.5 14.5833 16.1942 14.5833 14.5833C14.5833 12.9725 13.2775 11.6667 11.6667 11.6667C10.0558 11.6667 8.75 12.9725 8.75 14.5833C8.75 16.1942 10.0558 17.5 11.6667 17.5Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="border-t border-b border-[#E5E5E5] flex-grow flex items-center px-10 py-5">
              <p className="font-overpass capitalize">{products.filter((item) => [7332, 1143].includes(item.item_category_id)).flatMap((item) => item.variants).length} Hasil</p>
            </div>
            <div className="relative border border-[#E5E5E5] flex items-center justify-center w-[25rem] px-10 py-5 gap-x-5">
              <p className="font-overpass capitalize cursor-pointer" onClick={handleDropdownToggle}>
                {selectedOption}
              </p>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#E5E5E5] z-10">
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Relevance')}>
                    Relevance
                  </p>
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Harga Tertinggi')}>
                    Harga Tertinggi
                  </p>
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Harga Terendah')}>
                    Harga Terendah
                  </p>
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Alphabet')}>
                    Alphabet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between gap-x-3">
          {/* Sidebar Filter */}
          <div className="w-[15%] border border-[#E5E5E5] flex flex-col px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Gender</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="category" id="category1" />
                  <label className="font-overpass" htmlFor="category1">
                    Unisex
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="category" id="category2" />
                  <label className="font-overpass" htmlFor="category2">
                    Men
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="category" id="category3" />
                  <label className="font-overpass" htmlFor="category3">
                    Women
                  </label>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Size</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price1" />
                  <label className="font-overpass" htmlFor="price1">
                    S
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price2" />
                  <label className="font-overpass" htmlFor="price2">
                    M
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price3" />
                  <label className="font-overpass" htmlFor="price3">
                    L
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price4" />
                  <label className="font-overpass" htmlFor="price4">
                    XL
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price4" />
                  <label className="font-overpass" htmlFor="price4">
                    XXL
                  </label>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Categories</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand1" />
                  <label className="font-overpass" htmlFor="brand1">
                    Bags
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand2" />
                  <label className="font-overpass" htmlFor="brand2">
                    Hats
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand3" />
                  <label className="font-overpass" htmlFor="brand3">
                    Hoodie
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand4" />
                  <label className="font-overpass" htmlFor="brand4">
                    Socks
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand4" />
                  <label className="font-overpass" htmlFor="brand4">
                    T-Shirts
                  </label>
                </li>
              </ul>
            </div>
          </div>
          {/* Product */}
          <div className="w-[85%] flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10 overflow-y-auto h-[calc(100vh-4rem)] px-5">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Skeleton className="w-[30rem] h-[30rem]" />
                  <div className="flex flex-col text-center gap-y-2">
                    <Skeleton className="text-xl md:w-[24rem]" />
                    <Skeleton className="text-xl" />
                  </div>
                </div>
              ))
            ) : loginStatus === 'success' && products.some((item) => [7332, 1143].includes(item.item_category_id)) ? (
              <>
                {/* Produk yang tersedia */}
                {Object.values(
                  products
                    .filter((item) => [7332, 1143].includes(item.item_category_id))
                    .flatMap((item) => item.variants)
                    .reduce((uniqueVariants, variant) => {
                      if (!uniqueVariants[variant.item_name]) {
                        uniqueVariants[variant.item_name] = variant;
                      }
                      return uniqueVariants;
                    }, {})
                )
                  .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && variant.available_qty !== null && variant.available_qty > 1)
                  .sort((a, b) => {
                    if (selectedOption === 'Harga Tertinggi') {
                      return b.sell_price - a.sell_price;
                    } else if (selectedOption === 'Harga Terendah') {
                      return a.sell_price - b.sell_price;
                    } else if (selectedOption === 'Alphabet') {
                      return a.item_name.localeCompare(b.item_name);
                    }
                    return 0;
                  })
                  .map((variant, index) => (
                    <div key={index} className="flex flex-col gap-y-5 items-center">
                      <Link to="/">{variant.parentThumbnail ? <img src={variant.parentThumbnail} alt={variant.item_name} className="w-[30rem]" /> : <img src="/dummy-product.png" alt={variant.item_name} className="w-[30rem]" />}</Link>
                      <div className="flex flex-col text-center gap-y-2">
                        <h2 className="uppercase font-overpass font-extrabold text-xl md:w-[24rem]">{variant.item_name}</h2>
                        <h2 className="uppercase font-overpass text-xl">Rp. {variant.sell_price.toLocaleString()}</h2>
                      </div>
                    </div>
                  ))}
                {/* Produk yang habis */}
                {Object.values(
                  products
                    .filter((item) => [7332, 1143].includes(item.item_category_id))
                    .flatMap((item) => item.variants)
                    .reduce((uniqueVariants, variant) => {
                      if (!uniqueVariants[variant.item_name]) {
                        uniqueVariants[variant.item_name] = variant;
                      }
                      return uniqueVariants;
                    }, {})
                )
                  .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && (variant.available_qty === null || variant.available_qty <= 1))
                  .map((variant, index) => (
                    <div key={index} className="flex flex-col gap-y-5 items-center">
                      <Link to="/">{variant.parentThumbnail ? <img src={variant.parentThumbnail} alt={variant.item_name} className="w-[30rem]" /> : <img src="/dummy-product.png" alt={variant.item_name} className="w-[30rem]" />}</Link>
                      <div className="flex flex-col text-center gap-y-2">
                        <h2 className="uppercase font-overpass font-extrabold text-xl md:w-[24rem] text-red-600">{variant.item_name}</h2>
                        <h2 className="uppercase font-overpass text-xl text-red-600">Sold Out</h2>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <p className="uppercase font-overpass font-bold text-xl]">{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Eyewear;
