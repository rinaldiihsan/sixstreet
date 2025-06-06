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
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
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

  // Helper function to get products by category ID
  const getProductsByCategory = (products, categoryIds, limit = 8) => {
    // Group products by base name first
    const groupedProducts = products.reduce((acc, product) => {
      // Skip products without valid data
      if (!product.harga || product.harga <= 0 || !product.stok || product.stok <= 0) {
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

    // Filter by category ID and return unique products
    return Object.values(groupedProducts)
      .filter((product) => categoryIds.includes(product.category_id) && product.total_stock > 0)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, limit);
  };

  // Fetch products from local API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${backendUrl}/products`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Error fetching products: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch news
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
    fetchProducts();
    fetchNews();
  }, []);

  const getImageUrl = (item) => {
    return `${backendUrl}/${item.gambar.replace(/\\/g, '/')}`;
  };

  // Get image URL for products
  const getProductImageUrl = (product) => {
    if (product.thumbnail) {
      return `${backendUrl}/${product.thumbnail}`;
    }
    return '/dummy-product.png';
  };

  // Render product grid
  const renderProductGrid = (categoryIds, fallbackMessage = 'No products found in this category') => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-y-5 items-center">
          <Skeleton className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover" />
          <div className="flex flex-col text-center gap-y-2">
            <Skeleton className="text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem]" />
            <Skeleton className="md:text-xl" />
          </div>
        </div>
      ));
    }

    if (error) {
      return <p className="text-red-500 text-center w-full">{error}</p>;
    }

    const categoryProducts = getProductsByCategory(products, categoryIds, 8);

    if (categoryProducts.length === 0) {
      return <p className="text-center w-full">{fallbackMessage}</p>;
    }

    return categoryProducts.map((product, index) => (
      <div key={`${product.item_group_id}-${index}`} className="flex flex-col gap-y-5 items-center">
        <Link to={`/product-detail/${product.item_group_id}`}>
          <img
            src={getProductImageUrl(product)}
            alt={product.base_name}
            className="w-[8rem] h-[8rem] mobile:w-[10.5rem] mobile:h-[10.5rem] md:w-[18rem] md:h-[18rem] lg:w-[13rem] lg:h-[13rem] laptopM:w-[17rem] laptopM:h-[17rem] laptopL:w-[22rem] laptopL:h-[22rem] object-cover"
          />
        </Link>
        <div className="flex flex-col md:text-center gap-y-2">
          <h2 className="uppercase font-overpass font-medium lg:font-semibold text-sm md:text-lg lg:text-base laptopL:text-lg w-[8rem] mobile:w-[10rem] md:w-[18rem] lg:w-[13rem] laptopM:w-[17rem] laptopL:w-[22rem] text-center">
            {product.base_name}
          </h2>
          <h2 className="uppercase font-overpass text-sm md:text-lg text-center text-gray-700">{formatPrice(product.price)}</h2>
        </div>
      </div>
    ));
  };

  return (
    <>
      <AutoPopup />
      <main className="overflow-x-hidden">
        {/* Hero Section - Sixstreet */}
        <div className="relative">
          <img src={heroSixstreet} alt="Hero" className="w-full object-cover h-[30rem] lg:h-screen" />
          <div className="absolute bottom-[5%] md:bottom-[10%] left-0 text-white px-5 md:px-10 flex flex-col items-center md:items-start">
            <div className="md:max-w-[55rem] mb-2 text-center md:text-left">
              <h1 className="uppercase font-overpass tracking-[5px] md:tracking-[10px] font-extrabold text-xl md:text-3xl">sixstreet apparel</h1>
              <p className="capitalize font-garamond font-medium text-base md:text-xl text-center lg:text-justify leading-tight">
                Sixstreet Apparel represents the essence of modern streetwear, characterized by minimalist design and refined craftsmanship. Each piece is meticulously created to convey a sense of understated elegance, offering a timeless
                expression of contemporary sophistication
              </p>
            </div>
            <Link to="/sixstreet/tshirt" className="capitalize font-garamond font-medium text-xl md:text-2xl border border-white px-11 py-2 md:px-12 md:py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300">
              Buy Now
            </Link>
          </div>
        </div>

        {/* Hero Section - Apparel */}
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

        {/* Apparel Products Section */}
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">
          {renderProductGrid([18200, 18199, 18198, 7278, 18216, 18217, 18215, 18218], 'No apparel products found')}
        </div>

        {/* Hero Section - Sneakers */}
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

        {/* Sneakers Products Section */}
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">{renderProductGrid([5472, 12780, 18462, 12794, 18710, 15087], 'No footwear products found')}</div>

        {/* Hero Section - Accessories */}
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

        {/* Accessories Products Section */}
        <div className="max-w-[115rem] mx-5 md:mx-auto flex gap-8 flex-row flex-wrap justify-center mb-10 md:px-5 lg:px-8 lg:gap-8">
          {renderProductGrid([7332, 17866, 7339, 17860, 7340, 5515, 10230, 18225, 12632, 12611, 12610], 'No accessories found')}
        </div>

        {/* News Section */}
        <div className="max-w-[115rem] items-center justify-center mx-5 md:mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10 md:px-8">
          {news.map((item) => (
            <div key={item.id} className="flex flex-col gap-y-3 ">
              <Link to={`/news/${encodeURIComponent(item.judulberita)}`} className="mb-5">
                <img src={getImageUrl(item)} alt={item.judulberita} className="w-[38rem] object-cover" />
              </Link>
              <div className="flex flex-col gap-y-2 items-center">
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
