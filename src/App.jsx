import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
import AdminNavbar from './components/Admin/AdminNavbar';
import DashboardAdmin from './routes/Admin/DashboardAdmin/DashboardAdmin';
import UserManagement from './routes/Admin/User/UserManagement';
import TambahDataUser from './routes/Admin/User/TambahDataUser';
import NotFound from './routes/Client/NotFound';
import NotFoundAdmin from './routes/Admin/NotFoundAdmin';
import NewsManagement from './routes/Admin/News/NewsManagement';
import NewsManagementDetail from './routes/Admin/News/NewsManagementDetail';
import TambahNews from './routes/Admin/News/TambahNews';
import OrderHistory from './routes/Client/OrderHistory';
import OrderDetail from './routes/Client/OrderDetail';
import TransactionManagement from './routes/Admin/Transaction/TransactionManagement';
import FinishTransaction from './routes/Client/FinishTransaction';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
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

    if (now.getTime > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }

    return item;
  }

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      const storedUser = getItemWithExpiry('DetailUser');
      if (storedUser) {
        setUserId(storedUser.user_id);
        setRole(storedUser.role);
        setIsLoggedIn(true);

        const now = new Date();
        const timeLeft = storedUser.expiry - now.getTime();
        if (timeLeft > 0) {
          setTimeout(() => {
            toast.error('Sesi Anda telah habis. Silakan login kembali.', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              limit: 1,
              className: 'font-garamond font-bold text-[#333333] px-4 py-2 sm:px-6 sm:py-3 sm:rounded-lg',
            });
            setIsLoggedIn(false);
            sessionStorage.removeItem('DetailUser');
            Cookies.remove('accessToken');
          }, timeLeft);
        }
      }
    }
  }, [setUserId, setRole, setIsLoggedIn, secretKey]);

  return (
    <BrowserRouter>
      {role !== 1 ? (
        <>
          <CartProvider>
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
              <Route path="/checkout/:user_id/:transaction_uuid" element={<Checkout isLoggedIn={isLoggedIn} />} />
              <Route path="/thank-you" element={<FinishTransaction />} />
              <Route path="/order-detail/:user_id/:transaction_uuid" element={<OrderDetail isLoggedIn={isLoggedIn} />} />
              <Route path="/order-history" element={<OrderHistory />} />

              {/* Profile User */}
              <Route path="/profile/:id" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              {/* News Detail */}
              <Route path="/news/:judulberita" element={<NewsDetail />} />
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </CartProvider>
        </>
      ) : (
        <>
          <ToastContainer limit={1} />
          <AdminNavbar userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            {/* User Management */}
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/user-management/tambah-data-user" element={<TambahDataUser />} />
            {/* News Management */}
            <Route path="/news-management" element={<NewsManagement />} />
            <Route path="/news-management/:judulberita" element={<NewsManagementDetail />} />
            <Route path="/news-management/tambah-news" element={<TambahNews />} />
            {/* Transaction Management */}
            <Route path="/transaction-management" element={<TransactionManagement />} />
            {/* Not Found */}
            <Route path="*" element={<NotFoundAdmin />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
