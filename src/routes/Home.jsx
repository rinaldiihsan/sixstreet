import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import heroSixstreet from '/hero-sixstreet.webp';
import heroApparel from '/hero-apparel.webp';
import heroAccessories from '/hero-accessories.webp';
import AutoPopup from '../components/User/AutoPopup';

const Home = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper Functions
  const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Get top products per category
  const getFilteredProducts = (products, categoryIds, limit = 8) => {
    return Object.values(
      products
        .filter((item) => categoryIds.includes(item.item_category_id))
        .flatMap((item) =>
          item.variants.map((variant) => ({
            ...variant,
            item_group_id: item.item_group_id,
            last_modified: item.last_modified,
            category_id: item.item_category_id,
          }))
        )
        .reduce((uniqueVariants, variant) => {
          if (!uniqueVariants[variant.item_name]) {
            uniqueVariants[variant.item_name] = variant;
          }
          return uniqueVariants;
        }, {})
    )
      .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && variant.available_qty !== null && variant.available_qty >= 1)
      .sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified))
      .slice(0, limit);
  };

  const fetchProducts = async (token) => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;

      // 1. Fetch initial products
      const response = await axios.get(`${apiUrl}/inventory/items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = response.data.data || [];

        // 2. Get filtered products for each category
        const apparelProducts = getFilteredProducts(data, [18200]);
        const footwearProducts = getFilteredProducts(data, [5472, 999, 1013, 12780, 12803]);
        const accessoriesProducts = getFilteredProducts(data, [17866, 7332]);

        // Set initial products with basic data
        setProducts(data.filter((item) => [18200, 5472, 999, 1013, 12780, 12803, 17866, 7332].includes(item.item_category_id)));

        // 3. Get unique group IDs from filtered products
        const neededGroupIds = [...new Set([...apparelProducts.map((p) => p.item_group_id), ...footwearProducts.map((p) => p.item_group_id), ...accessoriesProducts.map((p) => p.item_group_id)])].filter(Boolean);

        // 4. Process each group ID individually
        for (const groupId of neededGroupIds) {
          try {
            const groupDetail = await fetchProductGroup(token, groupId);

            if (groupDetail && groupDetail.thumbnail) {
              // Update products state immediately for this group
              setProducts((prevProducts) => {
                const updatedProducts = [...prevProducts];
                const productIndex = updatedProducts.findIndex((item) => item.item_group_id === groupId);

                if (productIndex !== -1) {
                  updatedProducts[productIndex] = {
                    ...updatedProducts[productIndex],
                    thumbnail: groupDetail.thumbnail,
                    images: groupDetail.images,
                    variants: Array.isArray(updatedProducts[productIndex].variants)
                      ? updatedProducts[productIndex].variants.map((variant) => ({
                          ...variant,
                          parentThumbnail: groupDetail.thumbnail,
                          item_group_id: groupId,
                        }))
                      : [],
                  };
                }

                return updatedProducts.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch group ${groupId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductGroup = async (token, group_id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await axios.get(`${apiUrl}/inventory/catalog/for-listing/${group_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        const productData = response.data[0];

        if (productData.images && productData.images.length > 0) {
          return {
            groupId: group_id,
            thumbnail: productData.images[0].url,
            images: productData.images,
          };
        }
      }

      return null;
    } catch (error) {
      console.warn(`Failed to fetch group ${group_id}:`, error.message);
      return null;
    }
  };

  // Login and initialize
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
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    const mediaQuery = window.matchMedia('(min-width: 1098px)');

    if (mediaQuery.matches) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (mediaQuery.matches) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    loginAndFetchProducts();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getnews`);
        const sortedNews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestNews = sortedNews.slice(0, 3);
        setNews(latestNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const getImageUrl = (item) => {
    return `${backendUrl}/${item.gambar.replace(/\\/g, '/')}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <AutoPopup />
      <main className="overflow-x-hidden">
        <div className="relative">
          <img src={heroSixstreet} alt="Hero" className="w-full object-cover h-[30rem] lg:h-screen" />
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
            <div className="md:max-w-[55rem] mb-2 text-center md:text-left">
              <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet apparel</h1>
              <p className="capitalize font-garamond font-medium text-base md:text-xl text-center lg:text-justify leading-tight">
                Sixstreet Apparel represents the essence of modern streetwear, characterized by minimalist design and refined craftsmanship. Each piece is meticulously created to convey a sense of understated elegance, offering a timeless
                expression of contemporary sophistication
              </p>
            </div>
            <Link to="/sixstreet/tshirt" className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300">
              Buy Now
            </Link>
          </div>
        </div>

        <div className="relative mb-10">
          <img src={heroApparel} alt="Hero2" className="w-full object-cover lg:h-screen" />
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col justify-center items-center md:items-start">
            <div className="md:max-w-[55rem] mb-2 text-center md:text-left">
              <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">apparel</h1>
              <p className="capitalize font-garamond font-medium text-lg md:text-xl text-center lg:text-justify">Elevate your wardrobe with our latest arrivals.</p>
            </div>
            <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/tops/t-shirts">
              Buy Now
            </Link>
          </div>
        </div>
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-y-5 items-center">
                <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
                <div className="flex flex-col text-c laptopM:w-[17rem] laptopM:h-[17rem]enter gap-y-2">
                  <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
                  <Skeleton className="md:text-xl" />
                </div>
              </div>
            ))
          ) : loginStatus === 'success' && products.some((item) => item.item_category_id === 18200) ? (
            Object.values(
              products
                .filter((item) => item.item_category_id === 18200)
                .flatMap((item) => item.variants)
                .reduce((uniqueVariants, variant) => {
                  if (!uniqueVariants[variant.item_name]) {
                    uniqueVariants[variant.item_name] = variant;
                  }
                  return uniqueVariants;
                }, {})
            )
              .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && variant.available_qty !== null && variant.available_qty >= 1)
              .slice(0, 8)
              .map((variant, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Link to={`/product-detail/${variant.item_group_id}`}>
                    {variant.parentThumbnail ? (
                      <img
                        src={variant.parentThumbnail}
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    ) : (
                      <img
                        src="/dummy-product.png"
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-col md:text-center gap-y-2">
                    <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center">
                      {variant.item_name}
                    </h2>
                    <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-gray-700">{formatPrice(variant.sell_price)}</h2>
                  </div>
                </div>
              ))
          ) : (
            <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
          )}
        </div>
        <div className="relative mb-10">
          <img src="/hero3.webp" alt="Hero" className="w-full object-cover lg:h-screen" />
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
            <div className="md:max-w-[55rem] mb-2 text-center md:text-left">
              <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sneakers</h1>
              <p className="capitalize font-garamond font-medium text-lg md:text-xl text-center lg:text-justify">Elevate every step – browse our sneaker collection now.</p>
            </div>
            <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/footwear/sneakers">
              Buy Now
            </Link>
          </div>
        </div>
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-y-5 items-center">
                <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
                <div className="flex flex-col text-c laptopM:w-[17rem] laptopM:h-[17rem]enter gap-y-2">
                  <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
                  <Skeleton className="md:text-xl" />
                </div>
              </div>
            ))
          ) : loginStatus === 'success' && products.some((item) => [5472, 999, 1013, 12780, 12803].includes(item.item_category_id)) ? (
            Object.values(
              products
                .filter((item) => [5472, 999, 1013, 12780, 12803].includes(item.item_category_id))
                .flatMap((item) => ({
                  ...item.variants[0],
                  item_group_id: item.item_group_id,
                  parentThumbnail: item.thumbnail,
                  last_modified: item.last_modified,
                }))
                .reduce((uniqueVariants, variant) => {
                  if (!uniqueVariants[variant.item_name]) {
                    uniqueVariants[variant.item_name] = variant;
                  }
                  return uniqueVariants;
                }, {})
            )
              .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && variant.available_qty !== null && variant.available_qty >= 1)
              .slice(0, 8)
              .map((variant, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Link to={`/product-detail/${variant.item_group_id}`}>
                    {variant.parentThumbnail ? (
                      <img
                        src={variant.parentThumbnail}
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    ) : (
                      <img
                        src="/dummy-product.png"
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-col md:text-center gap-y-2">
                    <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center">
                      {variant.item_name}
                    </h2>
                    <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-gray-700">{formatPrice(variant.sell_price)}</h2>
                  </div>
                </div>
              ))
          ) : (
            <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
          )}
        </div>
        <div className="relative mb-10">
          <img src={heroAccessories} alt="Hero" className="w-full object-cover lg:h-screen" />
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
            <div className="md:max-w-[55rem] mb-2 text-center md:text-left">
              <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">accessories</h1>
              <p className="capitalize font-garamond font-medium text-lg md:text-xl text-center lg:text-justify">Accessorize your life – shop now for the perfect pieces.</p>
            </div>
            <Link
              className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300"
              to="/accessories/all-products-accessories"
            >
              Buy Now
            </Link>
          </div>
        </div>
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-y-5 items-center">
                <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
                <div className="flex flex-col text-c laptopM:w-[17rem] laptopM:h-[17rem]enter gap-y-2">
                  <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
                  <Skeleton className="md:text-xl" />
                </div>
              </div>
            ))
          ) : loginStatus === 'success' && products.some((item) => item.item_category_id === 17866 || item.item_category_id === 7332) ? (
            Object.values(
              products
                .filter((item) => item.item_category_id === 17866 || item.item_category_id === 7332)
                .flatMap((item) => ({
                  ...item.variants[0],
                  item_group_id: item.item_group_id,
                  parentThumbnail: item.thumbnail,
                  last_modified: item.last_modified,
                }))
                .reduce((uniqueVariants, variant) => {
                  if (!uniqueVariants[variant.item_name]) {
                    uniqueVariants[variant.item_name] = variant;
                  }
                  return uniqueVariants;
                }, {})
            )
              .filter((variant) => variant.sell_price !== null && variant.sell_price !== 0 && variant.available_qty !== null && variant.available_qty >= 1)
              .slice(0, 8)
              .map((variant, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Link to={`/product-detail/${variant.item_group_id}`}>
                    {variant.parentThumbnail ? (
                      <img
                        src={variant.parentThumbnail}
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    ) : (
                      <img
                        src="/dummy-product.png"
                        alt={variant.item_name}
                        className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-col md:text-center gap-y-2">
                    <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center">
                      {variant.item_name}
                    </h2>
                    <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-gray-700">{formatPrice(variant.sell_price)}</h2>
                  </div>
                </div>
              ))
          ) : (
            <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
          )}
        </div>
        {/* News */}
        <div className="max-w-[115rem] items-center justify-center mx-5 md:mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10 md:px-8">
          {news.map((item) => (
            <div key={item.id} className="flex flex-col gap-y-3 ">
              {/* Tambahkan mx-auto di sini */}
              <Link to={`/news/${encodeURIComponent(item.judulberita)}`} className="mb-5">
                <img src={getImageUrl(item)} alt={item.judulberita} className="w-[38rem] object-cover" />
              </Link>
              <div className="flex flex-col gap-y-2 items-center">
                {/* Tambahkan items-center di sini */}
                <h2 className="capitalize font-garamond font-extrabold text-xl max-w-[37rem] text-center md:text-left md:self-start">{item.judulberita}</h2>
                <Link to={`/news/${encodeURIComponent(item.judulberita)}`} className="w-full md:w-auto text-center md:text-left md:self-start font-garamond py-1 md:py-2 px-11 md:px-10 border border-[#333333] text-xl">
                  View Blog
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
