import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import heroSixStreet from '../../../assets/banner/SIXSTREET.webp';

const AllProductsSixstreet = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSoldProducts, setIsSoldProducts] = useState(10);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper function to get SIXSTREET products
  const getSixstreetProducts = (products) => {
    // Group products by base name first
    const groupedProducts = products.reduce((acc, product) => {
      // Filter only SIXSTREET products
      if (!product.nama_produk.toUpperCase().includes('SIXSTREET')) {
        return acc;
      }

      const baseName = product.nama_produk.split(' - ')[0].trim();

      if (!acc[baseName]) {
        acc[baseName] = {
          base_name: baseName,
          item_group_id: product.item_group_id,
          category_id: product.category_id,
          category_name: product.category_name,
          thumbnail: product.thumbnail,
          images_folder: product.images_folder,
          price: parseFloat(product.harga),
          total_stock: 0,
          variants: [],
          updated_at: product.updated_at,
          // Additional properties for compatibility
          item_name: product.nama_produk,
          sell_price: parseFloat(product.harga),
          available_qty: product.stok,
          last_modified: product.updated_at,
        };
      }

      acc[baseName].total_stock += product.stok;
      acc[baseName].variants.push({
        id: product.id,
        name: product.nama_produk,
        price: parseFloat(product.harga),
        stock: product.stok,
        size: product.nama_produk.split(' - ')[1] || 'One Size',
      });

      return acc;
    }, {});

    return Object.values(groupedProducts);
  };

  // Fetch products from local API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${backendUrl}/products`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const sixstreetProducts = getSixstreetProducts(response.data.data);
        setProducts(sixstreetProducts);
      } else {
        setError('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Error fetching products: ${error.message}`);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleBrandChange = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prevState) => (checked ? [...prevState, value] : prevState.filter((brand) => brand !== value)));
  };

  const handleSoldOutClick = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get image URL for products
  const getProductImageUrl = (product) => {
    if (product.thumbnail) {
      return `${backendUrl}/${product.thumbnail}`;
    }
    return '/dummy-product.png';
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (selectedOption === 'Harga Tertinggi') {
      return b.price - a.price;
    } else if (selectedOption === 'Harga Terendah') {
      return a.price - b.price;
    } else if (selectedOption === 'Alphabet') {
      return a.base_name.localeCompare(b.base_name);
    } else if (selectedOption === 'Product Terbaru') {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }
    return 0;
  });

  // Separate available and sold out products
  const availableProducts = sortedProducts.filter((product) => product.total_stock > 0);
  const soldOutProducts = sortedProducts.filter((product) => product.total_stock <= 0).slice(0, isSoldProducts);

  return (
    <>
      <div className="mt-20 max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex flex-col justify-center items-center overflow-x-hidden">
        {showAlert && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[999]">
            <div className="bg-red-100 border border-red-500 text-red-500 px-8 py-3 rounded-lg shadow-lg">Maaf, produk ini sedang tidak tersedia (Sold Out)</div>
          </div>
        )}

        <img src={heroSixStreet} alt="Hero SIXSTREET" className="w-full h-full md:h-auto mb-6" />
        <h1 className="text-center text-xs font-overpass lg:max-w-7xl md:block md:text-base">
          SIXSTREET is an exclusive haven where street-luxury wear converges. Aiming to be Indonesia's finest luxury streetwear brand, SIXSTREET blends sports, music, arts, serenity, and automotive cultures with fashion. With a focus on
          modesty and simplicity, SIXSTREET represents the epitome of sophisticated, high-end streetwear.
        </h1>

        {/* Filter */}
        <div className="w-full flex justify-between mb-6 sticky top-[70px] bg-white z-[997] py-1 md:py-4">
          <div className="flex flex-grow">
            <div className="border border-[#E5E5E5] hidden items-center justify-center w-[10rem] md:w-[17rem] px-4 md:px-10 py-5 gap-x-5 md:gap-x-14">
              <p className="font-overpass text-lg hidden md:block">Filter</p>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleSidebar}>
                <path d="M18.3335 5.41666H13.3335" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.99984 5.41666H1.6665" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
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
            <div className="border-t border-b border-r border-l lg:border-r-0 border-[#E5E5E5] flex-grow flex items-center px-4 md:px-10 py-5">
              <p className="font-overpass capitalize">{products.length} Result</p>
            </div>
            <div className="relative border border-[#E5E5E5] hidden md:flex items-center justify-center w-full md:w-[25rem] px-4 md:px-10 py-5 gap-x-5">
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
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Product Terbaru')}>
                    Product Terbaru
                  </p>
                  <p className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer" onClick={() => handleOptionSelect('Alphabet')}>
                    Alphabet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between gap-x-3 overflow-x-hidden">
          <div className="w-[15%] border border-[#E5E5E5] flex-col px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto hidden md:py-5">
            {/* Filter Size */}
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
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="price" id="price5" />
                  <label className="font-overpass" htmlFor="price5">
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
                  <input type="checkbox" className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0" name="brand" id="brand5" />
                  <label className="font-overpass" htmlFor="brand5">
                    T-Shirts
                  </label>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-4 mb-10 overflow-y-auto h-[calc(100vh-4rem)] md:px-5 overflow-x-hidden scroll-hidden">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
                  <div className="flex flex-col text-center gap-y-2">
                    <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
                    <Skeleton className="md:text-xl" />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="uppercase font-overpass font-bold text-xl text-red-500">{error}</p>
            ) : (
              <>
                {/* Available Products */}
                {availableProducts.map((product, index) => (
                  <div key={`available-${product.item_group_id}-${index}`} className="flex flex-col gap-y-5 items-center">
                    <Link to={`/product-detail/${product.item_group_id}`}>
                      <img
                        src={getProductImageUrl(product)}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                        alt={product.base_name}
                        onError={(e) => {
                          e.target.src = '/dummy-product.png';
                        }}
                      />
                    </Link>
                    <div className="flex flex-col items-center text-center w-full px-2">
                      <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center">
                        {product.base_name}
                      </h2>
                      <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-gray-700">{formatPrice(product.price)}</h2>
                    </div>
                  </div>
                ))}

                {/* Sold Out Products */}
                {soldOutProducts.map((product, index) => (
                  <div key={`soldout-${product.item_group_id}-${index}`} className="flex flex-col gap-y-5 items-center">
                    <Link to={`/product-detail-sold/${product.item_group_id}`} className="cursor-pointer transition-opacity duration-300 hover:opacity-75">
                      <img
                        src={getProductImageUrl(product)}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover opacity-50"
                        alt={product.base_name}
                        onError={(e) => {
                          e.target.src = '/dummy-product.png';
                        }}
                      />
                    </Link>
                    <div className="flex flex-col items-center text-center w-full px-2">
                      <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center text-red-700">
                        {product.base_name}
                      </h2>
                      <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-red-600">Sold Out</h2>
                    </div>
                  </div>
                ))}

                {/* No products message */}
                {products.length === 0 && !isLoading && <p className="uppercase font-overpass font-bold text-xl text-center w-full col-span-full">No SIXSTREET products found</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProductsSixstreet;
