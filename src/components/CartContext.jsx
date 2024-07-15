import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;

  function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  function getUserId(key) {
    const encryptedItem = sessionStorage.getItem(key);
    if (!encryptedItem) {
      return null;
    }
    const itemStr = decryptData(encryptedItem);
    const item = JSON.parse(itemStr);
    return item.user_id;
  }

  const fetchCartItems = async () => {
    const token = Cookies.get('accessToken');
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Check if userId is valid before making the API call
    if (userId) {
      try {
        const response = await axios.get(`${backendUrl}/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
  };

  const addToCart = async (product) => {
    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!userId) {
      return;
    }

    const existingItem = cartItems.find((item) => item.product_id === product.product_id && item.size === product.size);

    if (existingItem) {
      try {
        await axios.put(
          `${backendUrl}/cart/${userId}/${existingItem.id}`,
          {
            product_id: product.product_id,
            quantity: existingItem.quantity + product.quantity,
            price: product.price,
            name: product.name,
            size: product.size,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Update state after successful update
        setCartItems((prevItems) => prevItems.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + product.quantity } : item)));
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    } else {
      // Add new item to cart
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: product.quantity, id: product.product_id }]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return <CartContext.Provider value={{ cartItems, fetchCartItems, addToCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
