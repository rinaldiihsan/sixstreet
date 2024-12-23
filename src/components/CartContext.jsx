import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const [userName, setUserName] = useState('Guest');

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

  const fetchUserName = async () => {
    const token = Cookies.get('accessToken');
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (userId) {
      try {
        const response = await axios.get(`${backendUrl}/getAddress/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.addresses && response.data.addresses.length > 0) {
          setUserName(response.data.addresses[0].username || 'Guest');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('Guest');
      }
    }
  };

  const fetchCartItems = async () => {
    const token = Cookies.get('pos_token');
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (userId) {
      try {
        const cartResponse = await axios.get(`${backendUrl}/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        });

        const itemsWithDetails = await Promise.all(
          cartResponse.data.map(async (item) => {
            try {
              const skuResponse = await axios.get(`${apiUrl}/inventory/items/${item.product_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              const itemGroupId = skuResponse.data.item_group_id;
              const catalogResponse = await axios.get(`${apiUrl}/inventory/catalog/for-listing/${itemGroupId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              let productImage = '/dummy-product.png';
              if (catalogResponse.status === 200 && catalogResponse.data.length > 0 && catalogResponse.data[0].images?.length > 0) {
                productImage = catalogResponse.data[0].images[0].thumbnail;
              }

              return {
                ...item,
                item_group_id: itemGroupId,
                image: productImage,
                product_name: catalogResponse.data[0]?.item_group_name || item.name,
              };
            } catch (error) {
              console.error('Error fetching item details:', error);
              return { ...item, image: '/dummy-product.png' };
            }
          })
        );

        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    }
  };

  const addToCart = async (product) => {
    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!userId) {
      return;
    }

    try {
      // Fetch product image from catalog/for-listing
      const catalogResponse = await axios.get(`${apiUrl}/inventory/catalog/for-listing/${product.product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let productImage = '/dummy-product.png';
      if (catalogResponse.status === 200 && catalogResponse.data.length > 0 && catalogResponse.data[0].images && catalogResponse.data[0].images.length > 0) {
        productImage = catalogResponse.data[0].images[0].thumbnail;
      }

      const cartData = {
        product_id: product.product_id,
        quantity: product.quantity,
        price: product.price,
        name: product.name,
        size: product.size,
        image: productImage, // Add image to cart data
      };

      const existingItem = cartItems.find((item) => item.product_id === product.product_id && item.size === product.size);

      if (existingItem) {
        await axios.put(`${backendUrl}/cart/${userId}/${existingItem.id}`, cartData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: item.quantity + product.quantity,
                  image: productImage,
                }
              : item
          )
        );
      } else {
        const response = await axios.post(`${backendUrl}/cart/${userId}`, cartData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setCartItems((prevItems) => [...prevItems, { ...cartData, id: response.data.id }]);
      }
    } catch (error) {
      console.error('Error adding/updating cart item:', error);
    }
  };

  const removeFromCart = async (product) => {
    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!userId) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/cart/${userId}/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchUserName(); // Tambahkan ini
  }, []);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        setCartItems,
        userName,
        getUserId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
