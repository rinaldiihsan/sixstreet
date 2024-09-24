import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Home = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

      productsWithThumbnails.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));

      setProducts(productsWithThumbnails);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
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
      <div className="relative">
        <img src="/hero1.webp" alt="Hero" className="w-full object-cover" style={{ height: windowHeight }} />
        <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
          <div className="md:max-w-[40rem] mb-2 text-center md:text-left">
            <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet apparel</h1>
            <p className="capitalize font-garamond font-medium text-lg md:text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="relative mb-10">
        <img src="/hero2.webp" alt="Hero2" className="w-full object-cover" style={{ height: windowHeight }} />
        <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
          <div className="md:max-w-[40rem] mb-2 text-center md:text-left">
            <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet apparel</h1>
            <p className="capitalize font-garamond font-medium text-lg md:text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-y-8 flex-row flex-wrap justify-between mb-10">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-y-5 items-center">
              <Skeleton className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover" />
              <div className="flex flex-col text-center gap-y-2">
                <Skeleton className=" md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]" />
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
                <Link to={`/product-detail/${variant.item_id}`}>
                  {variant.parentThumbnail ? (
                    <img src={variant.parentThumbnail} alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  ) : (
                    <img src="/dummy-product.png" alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  )}
                </Link>
                <div className="flex flex-col md:text-center gap-y-2">
                  <h2 className="uppercase font-overpass font-extrabold md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]">{variant.item_name}</h2>
                  <h2 className="uppercase font-overpass text-sm mobile:text-base md:text-xl">{formatPrice(variant.sell_price)}</h2>
                </div>
              </div>
            ))
        ) : (
          <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
        )}
      </div>
      <div className="relative mb-10">
        <img src="/hero3.webp" alt="Hero" className="w-full object-cover" style={{ height: windowHeight }} />
        <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
          <div className="md:max-w-[40rem] mb-2 text-center md:text-left">
            <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet sneakers</h1>
            <p className="capitalize font-garamond font-medium text-lg md:text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-y-8 flex-row flex-wrap justify-between mb-10">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-y-5 items-center">
              <Skeleton className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover" />
              <div className="flex flex-col text-center gap-y-2">
                <Skeleton className=" md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]" />
                <Skeleton className="md:text-xl" />
              </div>
            </div>
          ))
        ) : loginStatus === 'success' && products.some((item) => [5472, 999, 1013, 12780, 12803].includes(item.item_category_id)) ? (
          Object.values(
            products
              .filter((item) => [5472, 999, 1013, 12780, 12803].includes(item.item_category_id))
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
                <Link to={`/product-detail/${variant.item_id}`}>
                  {variant.parentThumbnail ? (
                    <img src={variant.parentThumbnail} alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  ) : (
                    <img src="/dummy-product.png" alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  )}
                </Link>
                <div className="flex flex-col md:text-center gap-y-2">
                  <h2 className="uppercase font-overpass font-extrabold md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]">{variant.item_name}</h2>
                  <h2 className="uppercase font-overpass text-sm mobile:text-base md:text-xl">{formatPrice(variant.sell_price)}</h2>
                </div>
              </div>
            ))
        ) : (
          <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
        )}
      </div>
      <div className="relative mb-10">
        <img src="/hero4.webp" alt="Hero" className="w-full object-cover" style={{ height: windowHeight }} />
        <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
          <div className="md:max-w-[40rem] mb-2 text-center md:text-left">
            <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet accessories</h1>
            <p className="capitalize font-garamond font-medium text-lg md:text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-y-8 flex-row flex-wrap justify-between mb-10">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-y-5 items-center">
              <Skeleton className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover" />
              <div className="flex flex-col text-center gap-y-2">
                <Skeleton className=" md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]" />
                <Skeleton className="md:text-xl" />
              </div>
            </div>
          ))
        ) : loginStatus === 'success' && products.some((item) => item.item_category_id === 17866 || item.item_category_id === 7332) ? (
          Object.values(
            products
              .filter((item) => item.item_category_id === 17866 || item.item_category_id === 7332)
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
                <Link to={`/product-detail/${variant.item_id}`}>
                  {variant.parentThumbnail ? (
                    <img src={variant.parentThumbnail} alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  ) : (
                    <img src="/dummy-product.png" alt={variant.item_name} className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover" />
                  )}
                </Link>
                <div className="flex flex-col md:text-center gap-y-2">
                  <h2 className="uppercase font-overpass font-extrabold md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]">{variant.item_name}</h2>
                  <h2 className="uppercase font-overpass text-sm mobile:text-base md:text-xl">{formatPrice(variant.sell_price)}</h2>
                </div>
              </div>
            ))
        ) : (
          <p>{error ? `Login failed: ${error}` : 'No products found in this category'}</p>
        )}
      </div>
      {/* News */}
      <div className="max-w-[115rem] items-center justify-center mx-5 md:mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10">
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
    </>
  );
};

export default Home;
