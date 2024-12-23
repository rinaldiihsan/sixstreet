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
  const { cartItems, setCartItems, fetchCartItems, removeFromCart, userAddress } = useCart();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
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
    // Cek terlebih dahulu apakah ada alamat
    if (!userAddress || userAddress.length === 0) {
      toast.error('Please add your address first', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const addressData = userAddress[0];

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      // Validasi data sebelum melakukan request
      if (!userId || !token || !addressData.username || !addressData.address) {
        throw new Error('Missing required checkout information');
      }

      // Create transaction
      const transactionResponse = await axios.post(
        `${backendUrl}/transaction`,
        {
          user_id: userId,
          name: addressData.username,
          address: addressData.address,
          cartItems: cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Clear cart items
      await axios.delete(`${backendUrl}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Cart cleared');

      const transactionId = transactionResponse.data.transaction_uuid;
      navigate(`/checkout/${userId}/${transactionId}`);
      showCart(false);
    } catch (error) {
      console.error('Error during checkout:', error);

      // Tampilkan pesan error yang lebih spesifik
      let errorMessage = 'Failed to complete checkout';
      if (error.message === 'Missing required checkout information') {
        errorMessage = 'Please complete your address information';
      }

      toast.error(errorMessage, {
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

  const handleLoginClick = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  useEffect(() => {
    if (!cartOpen) {
      setShowLoginPopup(false);
    }
  }, [cartOpen]);

  useEffect(() => {
    if (isLoggedIn && cartOpen) {
      fetchCartItems();
    }
  }, [isLoggedIn, cartOpen, fetchCartItems]);

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
      <div key={`${product.product_id}`} className="flex flex-col md:flex-row gap-y-3 md:gap-y-0 md:items-center justify-between mb-4" style={{ marginBottom: index < cartItems.length - 1 ? '30px' : '0' }}>
        <div className="flex items-center">
          <img
            src={product.image || '/dummy-product.png'}
            alt={product.name}
            className="w-[5rem] h-[5rem] mr-4 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/dummy-product.png';
            }}
          />
          <div className="flex flex-col">
            <h4 className="md:text-lg font-overpass mb-2 font-medium">{product.product_name}</h4>
            <div className="flex gap-x-5 mb-2">
              {product.size && <h4 className="md:text-lg font-overpass">Size: {product.product_size}</h4>}
              <p className="md:text-lg text-[#333333] font-overpass">Quantity: {product.quantity}</p>
            </div>
            <div className="flex gap-x-2 mb-2">
              <button className="quantity-btn border border-[#333333] px-3 py-1 font-overpass">Edit Items</button>
              <button className="quantity-btn border border-[#333333] px-3 py-1 font-overpass" onClick={() => handleRemoveItem(product)}>
                Remove
              </button>
            </div>
            <p className="block md:hidden font-overpass">{formatPrice(product.product_price * product.quantity)}</p>
          </div>
        </div>
        <p className="hidden md:block text-lg font-overpass">{formatPrice(product.product_price * product.quantity)}</p>
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
              <div className="mt-5 px-8 space-y-2">{cartItems.length > 0 ? renderCartItems() : <p className="text-lg text-gray-600 font-overpass">Your cart is currently empty.</p>}</div>
              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              {cartItems.length > 0 && (
                <div className="mt-5 px-8">
                  <button onClick={handleCheckout} className="block w-full bg-[#333333] text-white py-3 text-center font-semibold rounded font-overpass" type="button">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
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
    </>
  );
};

export default Cart;
