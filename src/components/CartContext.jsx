import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const [fullName, setFullName] = useState('Guest');
  const [isInitialized, setIsInitialized] = useState(false);

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

  const fetchFullName = async () => {
    const token = Cookies.get('accessToken');
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!token || !userId) {
      setFullName('Guest');
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/getAddress/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.addresses && response.data.addresses.length > 0) {
        setFullName(response.data.addresses[0].fullName);
      } else {
        toast.warning('Silahkan tambahkan alamat pengiriman', {
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error('Error fetching fullName:', error);
      toast.error('Gagal memuat data alamat, Silahkan Isi Alamat Terlebih Dahulu', {
        autoClose: 1500,
      });
    }
  };

  // Helper function to remove invalid cart items from backend
  const removeInvalidCartItem = async (cartItemId) => {
    const userId = getUserId('DetailUser');
    const token = Cookies.get('accessToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!userId || !token) return;

    try {
      await axios.delete(`${backendUrl}/cart/${userId}/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(`Successfully removed invalid cart item ${cartItemId}`);
    } catch (error) {
      console.error(`Failed to remove invalid cart item ${cartItemId}:`, error);
    }
  };

  // Fetch product details using group_id
  const fetchProductDetails = async (groupId) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.get(`${backendUrl}/products/group/${groupId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const productData = response.data.data;

        // Get product image
        let productImage = '/dummy-product.png';
        if (productData.images && productData.images.length > 0) {
          const imageUrl = productData.images[0].url;
          if (imageUrl && imageUrl.startsWith('http')) {
            productImage = imageUrl;
          } else if (imageUrl) {
            productImage = `${backendUrl}/${imageUrl}`;
          }
        }

        return {
          item_group_name: productData.item_group_name,
          image: productImage,
          found: true,
        };
      }
    } catch (error) {
      console.warn(`Product group ${groupId} not found in database.`);
    }

    return {
      item_group_name: `Product ${groupId}`,
      image: '/dummy-product.png',
      found: false,
    };
  };

  // Function to sync cart with backend when needed
  const syncCartWithBackend = async () => {
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = Cookies.get('accessToken');

    if (!userId || !token) return;

    try {
      const cartResponse = await axios.get(`${backendUrl}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update only items with temporary IDs
      setCartItems((prevItems) => {
        const backendItems = cartResponse.data;

        return prevItems.map((item) => {
          // If item has temporary ID, find corresponding backend item
          if (typeof item.id === 'string' && item.id.startsWith('temp_')) {
            const matchingBackendItem = backendItems.find((backendItem) => backendItem.product_id === item.product_id && (backendItem.size === item.size || backendItem.product_size === item.size));

            if (matchingBackendItem) {
              return {
                ...item,
                id: matchingBackendItem.id, // Use real backend ID
              };
            }
          }
          return item;
        });
      });
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  };

  // Function to fetch cart items from backend
  const fetchCartItems = async () => {
    const userId = getUserId('DetailUser');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!userId) {
      setCartItems([]);
      setIsInitialized(true);
      return;
    }

    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setCartItems([]);
        setIsInitialized(true);
        return;
      }

      const cartResponse = await axios.get(`${backendUrl}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const itemsWithDetails = await Promise.all(
        cartResponse.data.map(async (item) => {
          try {
            // PERBAIKAN: product_id sekarang adalah database ID
            // Group ID untuk fetch product details
            let groupId = item.product_group_id || item.item_group_id;

            if (!groupId) {
              console.warn('No group ID found for cart item:', item);
              return {
                ...item,
                image: '/dummy-product.png',
                product_name: item.product_name || item.name || 'Unknown Product',
                product_found: false,
              };
            }

            const productDetails = await fetchProductDetails(groupId);

            return {
              ...item,
              image: productDetails.image,
              product_name: productDetails.item_group_name || item.product_name || item.name,
              product_found: productDetails.found,
              // Pastikan ada group_id untuk navigasi ke product detail
              product_group_id: groupId,
              item_group_id: groupId, // Backup
            };
          } catch (error) {
            console.error('Error processing cart item:', error);
            return {
              ...item,
              image: '/dummy-product.png',
              product_name: item.product_name || item.name || 'Unknown Product',
              product_found: false,
            };
          }
        })
      );

      // Filter out items that couldn't be found and clean them up
      const validItems = [];
      const invalidItems = [];

      itemsWithDetails.forEach((item) => {
        if (!item.product_found) {
          invalidItems.push(item);
        } else {
          validItems.push(item);
        }
      });

      // Remove invalid items from backend if any found
      if (invalidItems.length > 0 && !isInitialized) {
        invalidItems.forEach((item) => {
          removeInvalidCartItem(item.id);
        });

        toast.warning(`${invalidItems.length} outdated item(s) were removed from your cart`, {
          autoClose: 3000,
        });
      }

      setCartItems(validItems);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
      setIsInitialized(true);
    }
  };

  const addToCart = async (product) => {
    const userId = getUserId('DetailUser');

    if (!userId) {
      return;
    }

    try {
      // Validasi database ID
      if (!product.product_id) {
        console.error('Database product_id is required for cart');
        throw new Error('Product database ID is required');
      }

      const groupId = product.product_group_id || product.group_id;
      if (!groupId) {
        console.error('No group_id provided for cart item');
        throw new Error('Product group ID is required');
      }

      const productDetails = await fetchProductDetails(groupId);

      // PERBAIKAN: Struktur data cart menggunakan database ID
      const cartData = {
        product_id: product.product_id, // Database ID (primary key)
        product_group_id: groupId, // Group ID untuk navigasi
        jubelio_item_id: product.jubelio_item_id, // Jubelio item_id untuk reference
        quantity: product.quantity,
        price: product.price,
        name: product.name,
        size: product.size,
        image: productDetails.image,
        product_name: productDetails.item_group_name,
      };

      // Check existing item berdasarkan database product_id dan size
      const existingItem = cartItems.find((item) => item.product_id === product.product_id && (item.size === product.size || item.product_size === product.size));

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + product.quantity;

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  image: productDetails.image,
                  product_name: productDetails.item_group_name,
                }
              : item
          )
        );
      } else {
        // Add new item
        setCartItems((prevItems) => [
          ...prevItems,
          {
            ...cartData,
            id: `temp_${Date.now()}`,
            product_found: true,
          },
        ]);

        // Sync untuk mendapatkan real ID
        setTimeout(() => {
          syncCartWithBackend();
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding/updating cart item:', error);
      throw error;
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
      throw error; // Re-throw to handle in calling component
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchFullName();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        syncCartWithBackend,
        addToCart,
        removeFromCart,
        setCartItems,
        fullName,
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
