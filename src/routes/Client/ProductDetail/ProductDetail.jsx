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
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [productImage, setProductImage] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [productSkus, setProductSkus] = useState([]);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [selectedSku, setSelectedSku] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [slider, setSlider] = useState(null);

  const formatDescription = (str) => {
    if (!str) return '';

    // Mengganti <br> dengan newline
    let formattedText = str.replace(/<br\s*\/?>/gi, '\n');

    // Mengganti <p> dengan dua newline untuk membuat paragraf
    formattedText = formattedText.replace(/<\/?p>/gi, '\n\n');

    // Membersihkan tag HTML lainnyaf
    formattedText = formattedText.replace(/<\/?[^>]+(>|$)/g, '');

    // Membersihkan multiple newlines berlebih
    formattedText = formattedText.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Trim whitespace di awal dan akhir
    formattedText = formattedText.trim();

    return formattedText;
  };

  const fetchProductGroup = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      // Fetch basic info first
      const groupResponse = await axios.get(`${apiUrl}/inventory/catalog/for-listing/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (groupResponse.status === 200 && groupResponse.data.length > 0) {
        const productData = groupResponse.data[0];
        console.log('Product image detail:', productData); // Debugging
        // Set basic product info
        if (productData.images && productData.images.length > 0) {
          setProductImage(productData.images[0].thumbnail);
          setProductImages(productData.images);
        }

        setProduct({
          item_group_name: productData.item_group_name,
          description: formatDescription(productData.description || ''),
        });

        // Get item_id from variations and fetch SKU details
        if (productData.variations && productData.variations.length > 0) {
          const itemId = productData.variations[0].item_id;

          // Fetch SKU details
          const skuResponse = await axios.get(`${apiUrl}/inventory/items/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (skuResponse.status === 200) {
            const skuData = skuResponse.data;

            // Set SKUs and quantities
            if (skuData.product_skus && skuData.product_skus.length > 0) {
              setProductSkus(skuData.product_skus);

              // Set available quantities
              const quantities = {};
              skuData.product_skus.forEach((sku) => {
                if (sku.variation_values && sku.variation_values[0]) {
                  quantities[sku.variation_values[0].value] = sku.end_qty;
                }
              });
              setAvailableQuantities(quantities);

              // Set initial size and selected SKU
              const firstSku = skuData.product_skus[0];
              if (firstSku.variation_values && firstSku.variation_values[0]) {
                setSelectedSize(firstSku.variation_values[0].value);
                setSelectedSku(firstSku);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to fetch product details');
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

  const loginAndFetchProduct = async () => {
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
        await fetchProductGroup(data.token);
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
    if (itemId) {
      loginAndFetchProduct();
    } else {
      setError('Invalid item ID');
    }
  }, [itemId]);

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

    const selectedSku = productSkus?.find((sku) => sku?.variation_values?.[0]?.value === selectedSize);

    if (!selectedSku) {
      toast.error('SKU tidak ditemukan', {
        position: 'top-right',
        autoClose: 1500,
      });
      return;
    }

    const productToCart = {
      product_id: selectedSku.item_id,
      quantity,
      price: selectedSku.sell_price,
      name: product.item_group_name,
      size: selectedSize,
    };

    // Validasi kuantitas menggunakan end_qty
    if (quantity > selectedSku.end_qty) {
      toast.error(`Kuantitas melebihi stok yang tersedia (${selectedSku.end_qty})`, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        limit: 1,
        className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
      });
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = Cookies.get('accessToken');
      const existingItem = cartItems.find((item) => item.product_id === productToCart.product_id && item.size === productToCart.size);

      if (existingItem) {
        const newQuantity = existingItem.quantity + productToCart.quantity;
        if (newQuantity > availableQuantities[selectedSize]) {
          toast.error(`Total kuantitas melebihi stok yang tersedia (${availableQuantities[selectedSize]})`, {
            position: 'top-right',
            autoClose: 1500,
          });
          return;
        }

        const response = await axios.put(
          `${backendUrl}/cart/${userId}/${existingItem.id}`,
          {
            ...productToCart,
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          addToCart(productToCart);
          toast.success('Produk diperbarui di keranjang', {
            position: 'top-right',
            autoClose: 1500,
          });
        }
      } else {
        const response = await axios.post(`${backendUrl}/cart/${userId}`, productToCart, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 || response.status === 201) {
          addToCart(productToCart);
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

  if (error) {
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
    const phoneNumber = '6282284423150';
    const productName = product?.item_group_name || '';
    const productSize = selectedSize || '';
    const productPrice = getCurrentPrice();

    const message = `Halo, saya tertarik dengan produk berikut:\n\nNama: ${productName}\nUkuran: ${productSize}\nHarga: ${productPrice}\n\nApakah stok masih tersedia?`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center overflow-x-hidden">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <div className="w-full lg:w-[40rem] relative flex flex-col gap-y-4">
          {/* Main Slider */}
          <div className="w-full">
            <Slider ref={setSlider} {...settings}>
              {productImages.map((image, index) => (
                <div key={image.group_image_id}>
                  <img src={image.url == null ? '/dummy-product.png' : image.url} alt={`${product?.item_group_name} - ${index + 1}`} className="w-[28rem] h-[28rem] md:w-full md:h-full lg:w-[40rem] lg:h-[40rem] object-cover" />
                </div>
              ))}
            </Slider>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 mt-4 px-2">
            {productImages.map((image, index) => (
              <div key={`thumb-${image.group_image_id}`} className="cursor-pointer rounded overflow-hidden border-2 hover:border-gray-400" onClick={() => slider?.slickGoTo(index)}>
                <img src={image.thumbnail == null ? '/dummy-product.png' : image.thumbnail} alt={`Thumbnail ${index + 1}`} className="w-full h-20 object-cover" />
              </div>
            ))}
          </div>
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
