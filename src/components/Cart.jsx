import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './CartContext';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import './Cart.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const Cart = ({ cartOpen, showCart, isLoggedIn }) => {
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const { cartItems, setCartItems, fetchCartItems, removeFromCart, fullName } = useCart();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const navigate = useNavigate();

  function getUserId(key) {
    const encryptedItem = sessionStorage.getItem(key);
    if (!encryptedItem) {
      return null;
    }

    const itemStr = decryptData(encryptedItem);
    const item = JSON.parse(itemStr);
    return item.user_id;
  }

  function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const handleRemoveItem = async (product) => {
    try {
      await removeFromCart(product);
      toast.success('Item removed from cart', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty', {
        position: 'top-right',
        autoClose: 1500,
      });
      return;
    }

    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!userId || !token) {
      toast.error('Please login to continue', {
        position: 'top-right',
        autoClose: 1500,
      });
      setShowLoginPopup(true);
      return;
    }

    setIsProcessing(true);

    try {
      // PERBAIKAN: Struktur data transaksi menggunakan database ID
      const transactionPayload = {
        user_id: userId,
        name: fullName,
        cartItems: cartItems.map((item) => ({
          product_id: item.product_id, // Database ID (primary key)
          product_group_id: item.product_group_id || item.item_group_id, // Group ID
          jubelio_item_id: item.jubelio_item_id, // Jubelio item_id untuk reference
          product_name: item.product_name,
          product_price: item.product_price || item.price,
          product_size: item.product_size || item.size,
          quantity: item.quantity,
        })),
        city: '',
        sub_district: '',
        detail_address: '',
        expedition: 'default',
        etd: '3-5',
        resi: 'pending',
      };
      // Create transaction
      const transactionResponse = await axios.post(`${backendUrl}/transaction`, transactionPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (transactionResponse.data && transactionResponse.data.transaction_uuid) {
        // Clear cart after successful transaction
        await axios.delete(`${backendUrl}/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local cart state
        setCartItems([]);

        // Navigate to checkout page
        const transactionId = transactionResponse.data.transaction_uuid;
        navigate(`/checkout/${userId}/${transactionId}`);
        showCart(false);

        toast.success('Proceeding to checkout', {
          position: 'top-right',
          autoClose: 1500,
        });
      } else {
        throw new Error('Invalid transaction response');
      }
    } catch (error) {
      console.error('Checkout error:', error);

      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Failed to process checkout';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product_price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
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
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return `${backendUrl}/${imageUrl}`;
  };

  useEffect(() => {
    if (!cartOpen) {
      setShowLoginPopup(false);
    }
  }, [cartOpen]);

  // PERBAIKAN: Hanya fetch cart items sekali saat pertama kali login
  useEffect(() => {
    if (isLoggedIn && !hasInitialLoad) {
      console.log('Initial cart load for logged in user');
      fetchCartItems();
      setHasInitialLoad(true);
    } else if (!isLoggedIn) {
      // Reset saat logout
      setHasInitialLoad(false);
      setCartItems([]);
    }
  }, [isLoggedIn]); // Hanya depend pada isLoggedIn, bukan cartOpen

  // PERBAIKAN: Fetch cart hanya saat cart dibuka PERTAMA KALI setelah login
  useEffect(() => {
    if (isLoggedIn && cartOpen && cartItems.length === 0 && hasInitialLoad) {
      console.log('Cart opened with no items, refreshing...');
      fetchCartItems();
    }
  }, [cartOpen, isLoggedIn, cartItems.length, hasInitialLoad]);

  const cartVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.1, ease: 'easeInOut' },
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.1, ease: 'easeInOut' },
    },
  };

  const renderCartItems = () => {
    return cartItems.map((product, index) => (
      <div
        key={`${product.id}-${product.product_size || product.size}-${index}`}
        className="flex flex-col md:flex-row gap-y-3 md:gap-y-0 md:items-center justify-between mb-4"
        style={{ marginBottom: index < cartItems.length - 1 ? '30px' : '0' }}
      >
        <div className="flex items-center">
          <img
            src={getImageUrl(product.image)}
            alt={product.product_name || product.name}
            className="w-[5rem] h-[5rem] mr-4 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/dummy-product.png';
            }}
          />
          <div className="flex flex-col">
            <h4 className="md:text-lg font-overpass mb-2 font-medium">{product.product_name || product.name}</h4>
            <div className="flex gap-x-5 mb-2">
              {(product.product_size || product.size) && <h4 className="md:text-lg font-overpass">Size: {product.product_size || product.size}</h4>}
              <p className="md:text-lg text-[#333333] font-overpass">Quantity: {product.quantity}</p>
            </div>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 mb-2">
                DB ID: {product.product_id} | Group: {product.product_group_id}
              </div>
            )}

            <div className="flex gap-x-2 mb-2">
              <button
                className="quantity-btn border border-[#333333] px-3 py-1 font-overpass hover:bg-[#333333] hover:text-white transition-colors duration-300"
                onClick={() => {
                  // Navigate to product detail page menggunakan group_id
                  const groupId = product.product_group_id || product.item_group_id;
                  if (groupId) {
                    navigate(`/product-detail/${groupId}`);
                    showCart(false);
                  } else {
                    toast.warning('Cannot edit this item - missing product information', {
                      position: 'top-right',
                      autoClose: 2000,
                    });
                  }
                }}
              >
                Edit Items
              </button>
              <button className="quantity-btn border border-red-500 text-red-500 px-3 py-1 font-overpass hover:bg-red-500 hover:text-white transition-colors duration-300" onClick={() => handleRemoveItem(product)} disabled={isProcessing}>
                Remove
              </button>
            </div>
            <p className="block md:hidden font-overpass">{formatPrice((product.product_price || product.price) * product.quantity)}</p>
          </div>
        </div>
        <p className="hidden md:block text-lg font-overpass">{formatPrice((product.product_price || product.price) * product.quantity)}</p>
      </div>
    ));
  };

  return (
    <>
      {cartOpen && (
        <div className={`cart ${cartOpen ? 'cart-open' : ''}`}>
          <div className={`overlay-cart ${cartOpen ? 'overlay-open' : ''}`} onClick={() => showCart(false)}>
            <div className="absolute inset-0 bg-[#333333] opacity-30"></div>
          </div>
          <motion.div className={`cart-content ${cartOpen ? 'cart-content-open' : ''}`} initial="closed" animate={cartOpen ? 'open' : 'closed'} variants={cartVariants}>
            <div className="flex-1 flex flex-col py-10 overflow-y-auto">
              <div className="flex items-center justify-between w-full px-10">
                <h2 className="font-garamond text-2xl font-semibold">Shopping Cart</h2>
                <button onClick={() => showCart(false)}>
                  <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4944 8.28577L7.49438 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.49438 8.28577L22.4944 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              <div className="mt-5 px-8 space-y-2">
                {cartItems.length > 0 ? (
                  renderCartItems()
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600 font-overpass mb-4">Your cart is currently empty.</p>
                    <button
                      onClick={() => {
                        navigate('/');
                        showCart(false);
                      }}
                      className="bg-[#333333] text-white py-2 px-4 font-overpass hover:bg-[#444444] transition-colors duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <>
                  <div className="mt-5 border-t border-gray-200 mx-8"></div>
                  <div className="mt-5 px-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-overpass font-semibold">Total:</span>
                      <span className="text-lg font-overpass font-bold">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className={`block w-full py-3 text-center font-semibold rounded font-overpass transition-colors duration-300 ${
                        isProcessing ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#333333] text-white hover:bg-[#444444]'
                      }`}
                      type="button"
                    >
                      {isProcessing ? 'Processing...' : 'Checkout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[99991] flex items-center justify-center bg-black bg-opacity-50 px-5">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4 font-garamond">You need to be logged in to proceed to checkout.</h3>
            <div className="flex justify-end">
              <button onClick={handleLoginClick} className="bg-[#333333] text-white py-2 px-6 font-garamond mr-2 hover:bg-[#444444] transition-colors duration-300">
                Login
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="bg-gray-200 py-2 px-4 font-garamond hover:bg-gray-300 transition-colors duration-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
