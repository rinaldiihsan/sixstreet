import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import assetBannerShorts from '../../../assets/banner/shorts.webp';

const ShortBottom = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isSoldProducts, setIsSoldProducts] = useState(10);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Category ID for t-shirts products
  const shortCategoryIds = [27114, 27115];

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper function to get T-shirts products by category ID
  const getShortProducts = (products) => {
    // Group products by base name first
    const groupedProducts = products.reduce((acc, product) => {
      // Filter only products with t-shirts category ID
      if (!shortCategoryIds.includes(product.category_id)) {
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
        const shortProducts = getShortProducts(response.data.data);
        setProducts(shortProducts);
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

  const handleSoldOutClick = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Get image URL for products
  const getProductImageUrl = (product) => {
    if (product.thumbnail) {
      return `${backendUrl}/${product.thumbnail}`;
    }
    return '/dummy-product.png';
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

        <img src={assetBannerShorts} alt="Hero T-Shirt" className="w-full h-full md:h-auto mb-6" />

        {/* Filter */}
        <div className="w-full flex justify-between mb-6 sticky top-[70px] bg-white z-[997] py-1 md:py-4">
          <div className="flex flex-grow">
            <div className="border lg:border-r-0 border-[#E5E5E5] flex-grow flex items-center px-4 md:px-10 py-5">
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

        <div className="w-full flex flex-col items-center justify-center lg:justify-between md:gap-x-3 overflow-x-hidden">
          {/* Product Grid */}
          <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-4 mb-10 overflow-y-auto h-[calc(100vh-4rem)] md:px-5 overflow-x-hidden scroll-hidden">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
                  <div className="flex flex-col text-center gap-y-2">
                    <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
                    <Skeleton className="md:text-xl" />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="uppercase font-overpass font-bold text-xl text-red-500 col-span-full text-center">{error}</p>
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
                {products.length === 0 && !isLoading && <p className="uppercase font-overpass font-bold text-xl text-center w-full col-span-full">No T-shirts products found</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortBottom;
