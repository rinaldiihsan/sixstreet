import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { useCart } from '../../../components/CartContext';

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
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const stripHtmlTags = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const fetchProduct = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/inventory/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        response.data.description = stripHtmlTags(response.data.description);
        setProduct(response.data);
        setSelectedSize(response.data.variations[0].values[0]);

        const quantities = {};
        response.data.product_skus.forEach((sku) => {
          const size = sku.variation_values[0].value;
          quantities[size] = sku.end_qty;
        });

        setAvailableQuantities(quantities);
        if (response.data.images && response.data.images.length > 0) {
          setProductImage(response.data.images[0].thumbnail_url);
        } else {
          setProductImage('/dummy-product.png');
        }
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details');
    }
  };

  const loginAndFetchProduct = async () => {
    const email = import.meta.env.VITE_API_EMAIL;
    const password = import.meta.env.VITE_API_PASSWORD;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!email || !password) {
      setError('Missing email or password in environment variables.');
      setLoginStatus('error');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } });

      const data = response.data;

      if (response.status === 200) {
        Cookies.set('pos_token', data.token, { expires: 1 });
        setLoginStatus('success');
        fetchProduct(data.token);
      } else {
        setError(data.message);
        setLoginStatus('error');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
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
      setQuantity(availableQuantities[selectedSize] > 0 ? 1 : 0);
    }
  }, [selectedSize, availableQuantities]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

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

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const selectedSku = product.product_skus.find((sku) => sku.variation_values[0].value === selectedSize);

    // Validasi kuantitas
    if (quantity > availableQuantities[selectedSize]) {
      toast.error(`Kuantitas melebihi stok yang tersedia (${availableQuantities[selectedSize]})`, {
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

    const productToCart = {
      product_id: selectedSku.item_id,
      quantity,
      price: selectedSku.sell_price,
      name: product.item_group_name,
      size: selectedSize,
    };

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = Cookies.get('accessToken');
      const existingItem = cartItems.find((item) => item.product_id === productToCart.product_id && item.size === productToCart.size);

      if (existingItem) {
        const newQuantity = existingItem.quantity + productToCart.quantity;
        // Validasi jumlah total
        if (newQuantity > availableQuantities[selectedSize]) {
          toast.error(`Total kuantitas melebihi stok yang tersedia (${availableQuantities[selectedSize]})`, {
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

        const response = await axios.put(
          `${backendUrl}/cart/${userId}/${existingItem.id}`,
          {
            product_id: productToCart.product_id,
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
          addToCart(productToCart);
          toast.success('Produk diperbarui di keranjang', {
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
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            limit: 1,
            className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
          });
        }
      }
    } catch (error) {
      console.error('Error menambahkan produk ke keranjang:', error);
      toast.error('Gagal menambahkan produk ke keranjang', {
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

  if (!product) {
    return renderSkeleton();
  }

  const handleLoginClick = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <img src={productImage || '/dummy-product.png'} alt={product.item_group_name} className="w-[28rem] lg:w-[40rem] lg:h-[40rem] " />
        {/* Desc */}
        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold font-overpass text-[#333333] uppercase">{product.item_group_name}</h1>
            <p className="text-lg font-semibold font-overpass text-[#333333]">{formatPrice(product.product_skus[0].sell_price)}</p>
          </div>
          <p className="text-sm font-overpass whitespace-pre-wrap text-justify">{product.description}</p>
          <div className="w-full flex justify-between items-center">
            <p className="text-lg font-semibold font-overpass text-[#333333]">Select A Size</p>
            <select value={selectedSize} onChange={handleSizeChange} className="bg-[#ffffff] text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-overpass text-sm">
              {product.variations[0].values.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="text-lg font-semibold font-overpass text-[#333333]">Quantity</p>
            <select value={quantity} onChange={handleQuantityChange} className="bg-[#ffffff] text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-overpass text-sm">
              {[...Array(availableQuantities[selectedSize] || 1).keys()].map((qty) => (
                <option key={qty + 1} value={qty + 1}>
                  {qty + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#333333] text-[#ffffff] font-semibold py-3 px-8 hover:bg-[#fff] hover:text-[#333] focus:outline-none focus:shadow-outline font-overpass hover:border hover:border-[#333] transition-colors duration-300"
          >
            Add To Cart
          </button>
          <Link to="#" className="bg-[#fff] text-[#333] font-semibold py-3 px-8 hover:bg-[#333] hover:text-[#fff] focus:outline-none focus:shadow-outline font-overpass text-center border border-[#333] transition-colors duration-300">
            Chat Via Whatsapp
          </Link>
        </div>
      </div>
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
