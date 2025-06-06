import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { useCart } from '../../../components/CartContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductDetail = ({ userId, isLoggedIn }) => {
  const { group_id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [productImage, setProductImage] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [productSkus, setProductSkus] = useState([]);
  const [variations, setVariations] = useState([]); // Add this state for variations
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [selectedSku, setSelectedSku] = useState(null);
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
      const response = await axios.get(`${backendUrl}/products/group/${group_id}`, {
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

        // Set variations data
        if (productData.variations) {
          setVariations(productData.variations);
        }

        // Set product images
        if (productData.images && productData.images.length > 0) {
          setProductImages(productData.images);
          setProductImage(productData.images[0].url);
        } else {
          // Set default image if no images available
          setProductImages([{ url: '/dummy-product.png', thumbnail: '/dummy-product.png' }]);
          setProductImage('/dummy-product.png');
        }

        // Set SKUs and quantities
        if (productData.product_skus && productData.product_skus.length > 0) {
          setProductSkus(productData.product_skus);

          // Set available quantities
          const quantities = {};
          productData.product_skus.forEach((sku) => {
            if (sku.variation_values && sku.variation_values[0]) {
              quantities[sku.variation_values[0].value] = sku.end_qty;
            }
          });
          setAvailableQuantities(quantities);

          // Set initial size and selected SKU
          const availableSku = productData.product_skus.find((sku) => sku.end_qty > 0);
          if (availableSku?.variation_values?.[0]) {
            setSelectedSize(availableSku.variation_values[0].value);
            setSelectedSku(availableSku);
          }
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
    if (group_id) {
      fetchProductDetail();
    } else {
      setError('Invalid item ID');
    }
  }, [group_id]);

  useEffect(() => {
    if (availableQuantities[selectedSize]) {
      setQuantity(1);
    }
  }, [selectedSize, availableQuantities]);

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    console.log('Changing size to:', newSize); // Debugging
    setSelectedSize(newSize);

    // Find matching SKU
    const sku = productSkus.find((sku) => sku?.variation_values?.[0]?.value === newSize);
    console.log('Found SKU:', sku); // Debugging

    if (sku) {
      setSelectedSku(sku);
      setQuantity(1); // Reset quantity when size changes
    }
  };

  // Update useEffect untuk set initial selectedSku
  useEffect(() => {
    if (productSkus.length > 0 && selectedSize) {
      const sku = productSkus.find((sku) => sku.variation_values[0].value === selectedSize);
      setSelectedSku(sku);
    }
  }, [productSkus, selectedSize]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentPrice = () => {
    const selectedSku = productSkus?.find((sku) => sku?.variation_values?.[0]?.value === selectedSize);
    return selectedSku ? formatPrice(selectedSku.sell_price) : '-';
  };

  const getAvailableSKUs = () => {
    return productSkus?.filter((sku) => sku.end_qty > 0) || [];
  };

  useEffect(() => {
    if (productSkus.length > 0) {
      const availableSkus = getAvailableSKUs();
      if (availableSkus.length > 0) {
        const firstAvailableSku = availableSkus[0];
        if (firstAvailableSku.variation_values && firstAvailableSku.variation_values[0]) {
          setSelectedSize(firstAvailableSku.variation_values[0].value);
          setSelectedSku(firstAvailableSku);
        }
      }
    }
  }, [productSkus]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    // Find selected variant dari variations state (bukan dari product.variations)
    const selectedVariant = variations?.find((variation) => variation.variation_1_value === selectedSize);

    if (!selectedVariant) {
      console.error('Variant not found for selected size:', selectedSize);
      toast.error('Variant tidak ditemukan', {
        position: 'top-right',
        autoClose: 1500,
      });
      return;
    }

    // Validasi database ID
    if (!selectedVariant.database_id) {
      toast.error('Product ID tidak valid', {
        position: 'top-right',
        autoClose: 1500,
      });
      return;
    }

    // PERBAIKAN: Gunakan database_id sebagai product_id untuk cart
    const productToCart = {
      product_id: selectedVariant.database_id, // Database ID (primary key)
      product_group_id: group_id, // Group ID untuk reference
      jubelio_item_id: selectedVariant.item_id, // Jubelio item_id untuk reference
      quantity,
      price: selectedVariant.sell_price,
      name: product.item_group_name,
      size: selectedSize,
    };


    // Validasi kuantitas menggunakan available_qty dari Jubelio
    if (quantity > selectedVariant.available_qty) {
      toast.error(`Kuantitas melebihi stok yang tersedia (${selectedVariant.available_qty})`, {
        position: 'top-right',
        autoClose: 1500,
      });
      return;
    }

    try {
      const token = Cookies.get('accessToken');

      // Check existing item berdasarkan database product_id dan size
      const existingItem = cartItems.find((item) => item.product_id === productToCart.product_id && (item.size === productToCart.size || item.product_size === productToCart.size));

      if (existingItem) {
        const newQuantity = existingItem.quantity + productToCart.quantity;
        if (newQuantity > selectedVariant.available_qty) {
          toast.error(`Total kuantitas melebihi stok yang tersedia (${selectedVariant.available_qty})`, {
            position: 'top-right',
            autoClose: 1500,
          });
          return;
        }

        // Update backend dengan database ID
        const response = await axios.put(
          `${backendUrl}/cart/${userId}/${existingItem.id}`,
          {
            product_id: productToCart.product_id, // Database ID
            product_group_id: productToCart.product_group_id, // Group ID
            jubelio_item_id: productToCart.jubelio_item_id, // Jubelio item_id
            quantity: newQuantity,
            price: productToCart.price,
            name: productToCart.name,
            size: productToCart.size,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          await addToCart({
            ...productToCart,
            quantity: productToCart.quantity,
          });

          toast.success('Produk diperbarui di keranjang', {
            position: 'top-right',
            autoClose: 1500,
          });
        }
      } else {
        // Add new item to backend dengan database ID
        const response = await axios.post(
          `${backendUrl}/cart/${userId}`,
          {
            product_id: productToCart.product_id, // Database ID
            product_group_id: productToCart.product_group_id, // Group ID
            jubelio_item_id: productToCart.jubelio_item_id, // Jubelio item_id
            quantity: productToCart.quantity,
            price: productToCart.price,
            name: productToCart.name,
            size: productToCart.size,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          await addToCart(productToCart);

          toast.success('Produk ditambahkan ke keranjang', {
            position: 'top-right',
            autoClose: 1500,
          });
        }
      }
    } catch (error) {
      console.error('Error menambahkan produk ke keranjang:', error);
      toast.error('Gagal menambahkan produk ke keranjang', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
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

  if (!product || !productSkus || productSkus.length === 0) {
    return renderSkeleton();
  }

  const handleLoginClick = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  const getWhatsAppLink = () => {
    const phoneNumber = '6281990106666';
    const productName = product?.item_group_name || '';
    const productSize = selectedSize || '';
    const productPrice = getCurrentPrice();

    const message = `Halo, saya tertarik dengan produk berikut:\n\nNama: ${productName}\nUkuran: ${productSize}\nHarga: ${productPrice}\n\nApakah stok masih tersedia?`;
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
            <p className="text-lg font-semibold font-overpass text-[#333333]">{getCurrentPrice()}</p>
          </div>
          <p className="text-sm font-overpass whitespace-pre-wrap text-justify">{product?.description}</p>

          {/* Modified Size Selection */}
          {getAvailableSKUs().length > 0 ? (
            <div className="w-full flex justify-between items-center">
              <p className="text-lg font-semibold font-overpass text-[#333333]">Select A Size</p>
              <select value={selectedSize} onChange={handleSizeChange} className="bg-[#ffffff] text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-overpass text-sm">
                {getAvailableSKUs().map((sku, index) => (
                  <option key={index} value={sku.variation_values[0].value}>
                    {sku.variation_values[0].value}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-lg font-semibold font-overpass text-[#333333] text-center">Out of Stock</p>
          )}

          {/* Show quantity selection only if sizes are available */}
          {getAvailableSKUs().length > 0 && (
            <div className="w-full flex justify-between items-center">
              <p className="text-lg font-semibold font-overpass text-[#333333]">Quantity</p>
              <select value={quantity} onChange={handleQuantityChange} className="bg-[#ffffff] text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-overpass text-sm">
                {selectedSku &&
                  [...Array(selectedSku.end_qty)].map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Modify Add to Cart button to be disabled when no sizes available */}
          <button
            onClick={handleAddToCart}
            disabled={getAvailableSKUs().length === 0}
            className={`${
              getAvailableSKUs().length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#333333] hover:bg-[#fff] hover:text-[#333] hover:border hover:border-[#333]'
            } text-[#ffffff] font-semibold py-3 px-8 focus:outline-none focus:shadow-outline font-overpass transition-colors duration-300`}
          >
            {getAvailableSKUs().length === 0 ? 'Out of Stock' : 'Add To Cart'}
          </button>

          {/* Call to Whatsapp */}
          <Link
            to={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fff] text-[#333] font-semibold py-3 px-8 hover:bg-[#333] hover:text-[#fff] focus:outline-none focus:shadow-outline font-overpass text-center border border-[#333] transition-colors duration-300"
          >
            Chat Via Whatsapp
          </Link>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[99991] flex items-center justify-center bg-black bg-opacity-50 px-5">
          <div className="bg-white p-6">
            <h3 className="text-xl mb-4 font-garamond">You need to be logged in to proceed to checkout.</h3>
            <div className="flex justify-end">
              <button onClick={handleLoginClick} className="bg-[#333333] text-white py-2 px-6 font-garamond mr-2">
                Login
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="bg-gray-200 py-2 px-4 font-garamond">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
