import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './routes/Home';
import Login from './routes/Client/Login';
import Register from './routes/Client/Register';
import AllCategories from './routes/Client/AllCategories';
import Tshirt from './routes/Client/Clothing/Tshirt';
import Shirt from './routes/Client/Clothing/Shirt';
import Polo from './routes/Client/Clothing/Polo';
import Jacket from './routes/Client/Clothing/Jacket';
import Pants from './routes/Client/Clothing/Pants';
import Jeans from './routes/Client/Clothing/Jeans';
import Sneakers from './routes/Client/Footware/Sneakers';
import Sandals from './routes/Client/Footware/Sandals';
import Boots from './routes/Client/Footware/Boots';
import Slipon from './routes/Client/Footware/Slipon';
import Eyewear from './routes/Client/Accessories/Eyewear';
import Hats from './routes/Client/Accessories/Hats';
import Wallets from './routes/Client/Accessories/Wallets';
import Belts from './routes/Client/Accessories/Belts';
import Facemask from './routes/Client/Accessories/Facemask';
import Bag from './routes/Client/Accessories/Bag';
import TshirtSixstreet from './routes/Client/Sixstreet/TshirtSixstreet';
import Wukong from './routes/Client/Collaboration/Wukong';
import Jameson from './routes/Client/Collaboration/Jameson';
import ProductDetail from './routes/Client/ProductDetail/ProductDetail';
import Checkout from './routes/Client/ProductDetail/Checkout';
import Profile from './routes/Client/Profile';
import CryptoJS from 'crypto-js';
import NewsDetail from './routes/Client/newsDetail/NewsDetail';
import { CartProvider } from './components/CartContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;

  function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  function getItemWithExpiry(key) {
    const encryptedItem = sessionStorage.getItem(key);
    if (!encryptedItem) {
      return null;
    }

    const itemStr = decryptData(encryptedItem);
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }

    return item.user_id;
  }

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const storedUserId = getItemWithExpiry('DetailUser');
      if (storedUserId) {
        setUserId(storedUserId);
      }
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <ToastContainer limit={1} />
        <Navbar userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/allcategories" element={<AllCategories />} />
          {/* Clothing */}
          <Route path="/clothing/tshirt" element={<Tshirt />} />
          <Route path="/clothing/shirt" element={<Shirt />} />
          <Route path="/clothing/polo" element={<Polo />} />
          <Route path="/clothing/jacket" element={<Jacket />} />
          <Route path="/clothing/pants" element={<Pants />} />
          <Route path="/clothing/jeans" element={<Jeans />} />
          {/* Footware */}
          <Route path="/footware/sneakers" element={<Sneakers />} />
          <Route path="/footware/sandals" element={<Sandals />} />
          <Route path="/footware/boots" element={<Boots />} />
          <Route path="/footware/slipon" element={<Slipon />} />
          {/* Accessories */}
          <Route path="/accessories/eyewear" element={<Eyewear />} />
          <Route path="/accessories/hats" element={<Hats />} />
          <Route path="/accessories/wallets" element={<Wallets />} />
          <Route path="/accessories/belts" element={<Belts />} />
          <Route path="/accessories/facemask" element={<Facemask />} />
          <Route path="/accessories/bag" element={<Bag />} />
          {/* Sixstreet */}
          <Route path="/sixstreet/tshirt" element={<TshirtSixstreet />} />
          {/* Collab */}
          <Route path="/collaboration/wukong" element={<Wukong />} />
          <Route path="/collaboration/jameson" element={<Jameson />} />
          {/* Product Detail */}
          <Route path="/product-detail/:itemId" element={<ProductDetail userId={userId} isLoggedIn={isLoggedIn} />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Profile User */}
          <Route path="/profile/:id" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          {/* News Detail */}
          <Route path="/news/:judulberita" element={<NewsDetail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
