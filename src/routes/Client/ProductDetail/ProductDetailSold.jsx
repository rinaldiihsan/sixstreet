import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductDetailSold = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const formatDescription = (str) => {
    if (!str) return '';

    // Mengganti <br> dengan newline
    let formattedText = str.replace(/<br\s*\/?>/gi, '\n');

    // Mengganti <p> dengan dua newline untuk membuat paragraf
    formattedText = formattedText.replace(/<\/?p>/gi, '\n\n');

    // Membersihkan tag HTML lainnya
    formattedText = formattedText.replace(/<\/?[^>]+(>|$)/g, '');

    // Membersihkan multiple newlines berlebih
    formattedText = formattedText.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Trim whitespace di awal dan akhir
    formattedText = formattedText.trim();

    return formattedText;
  };

  const fetchProductDetail = async () => {
    try {
      setLoading(true);

      // Fetch product detail from local API (no auth required)
      const response = await axios.get(`${backendUrl}/products/group/${itemId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const productData = response.data.data;

        // Set product basic info
        setProduct({
          item_group_name: productData.item_group_name,
          description: formatDescription(productData.description || ''),
        });

        // Set product images
        if (productData.images && productData.images.length > 0) {
          setProductImages(productData.images);
        } else {
          // Set default image if no images available
          setProductImages([{ url: '/dummy-product.png', thumbnail: '/dummy-product.png' }]);
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button onClick={onClick} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#333333] hover:bg-[#333333]/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button onClick={onClick} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#333333] hover:bg-[#333333]/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: 'relative',
  };

  useEffect(() => {
    if (itemId) {
      fetchProductDetail();
    } else {
      setError('Invalid item ID');
    }
  }, [itemId]);

  const getWhatsAppLink = () => {
    const phoneNumber = '6281990106666';
    const productName = product?.item_group_name || '';
    const message = `Halo, saya tertarik dengan produk berikut:\n\nNama: ${productName}\n*Status: SOLD OUT - Available for Pre-Order*\n\nMohon informasi mengenai:\n- Estimasi waktu Pre-Order\n- Sistem pembayaran\n- Harga Pre-Order\n\nTerima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/dummy-product.png') {
      return '/dummy-product.png';
    }

    // Check if it's already a full URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a relative path, prepend backend URL
    return `${backendUrl}/${imageUrl}`;
  };

  const renderSkeleton = () => (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center">
        <Skeleton className="lg:w-[40rem]" height={400} />
        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <Skeleton height={40} />
          <Skeleton count={5} />
        </div>
      </div>
    </div>
  );

  if (loading || error) {
    return renderSkeleton();
  }

  if (!product) {
    return renderSkeleton();
  }

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center overflow-x-hidden">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <div className="w-full lg:w-[40rem] relative flex flex-col gap-y-4">
          {/* Main Slider */}
          <div className="w-full">
            <Slider ref={setSlider} {...settings}>
              {productImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={getImageUrl(image.url)}
                    alt={`${product?.item_group_name} - ${index + 1}`}
                    className="w-[28rem] h-[28rem] md:w-full md:h-full lg:w-[40rem] lg:h-[40rem] object-cover"
                    onError={(e) => {
                      e.target.src = '/dummy-product.png';
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Thumbnails - Only show if more than one image */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 mt-4 px-2">
              {productImages.map((image, index) => (
                <div key={`thumb-${index}`} className="cursor-pointer rounded overflow-hidden border-2 hover:border-gray-400" onClick={() => slider?.slickGoTo(index)}>
                  <img
                    src={getImageUrl(image.thumbnail || image.url)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.target.src = '/dummy-product.png';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold font-overpass text-[#333333] uppercase">{product?.item_group_name}</h1>
            <p className="text-lg font-semibold font-overpass text-red-600">SOLD OUT</p>
          </div>

          <p className="text-sm font-overpass whitespace-pre-wrap text-justify">{product?.description}</p>

          <Link
            to={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fff] text-[#333] font-semibold py-3 px-8 hover:bg-[#333] hover:text-[#fff] focus:outline-none focus:shadow-outline font-overpass text-center border border-[#333] transition-colors duration-300 mt-4"
          >
            Chat Via Whatsapp for Pre-Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSold;
