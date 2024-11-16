import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

// Import komponen-komponen
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './routes/Home';
import Login from './routes/Client/Login';
import Register from './routes/Client/Register';
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
import MultiLink from './routes/Client/MultiLink';
import Lock from './routes/Client/Lock/Lock';
import Adidas from './routes/Client/FeaturesBrand/Adidas';
import Converse from './routes/Client/FeaturesBrand/Converse';
import Jordan from './routes/Client/FeaturesBrand/Jordan';
import Nike from './routes/Client/FeaturesBrand/Nike';
import NewBalance from './routes/Client/FeaturesBrand/NewBalance';
import On from './routes/Client/FeaturesBrand/On';
import Supreme from './routes/Client/FeaturesBrand/Supreme';
import WaterThePlant from './routes/Client/FeaturesBrand/WaterThePlants';
import Yeezy from './routes/Client/FeaturesBrand/Yeezy';
import NameAllBrand from './routes/Client/NameAllBrands';
import AapeBrand from './routes/Client/AllBrand/AapeBrand';
import AdidasBrand from './routes/Client/AllBrand/AdidasBrand';
import Alexander from './routes/Client/AllBrand/Alexander';
import Adlv from './routes/Client/AllBrand/Adlv';
import Aime from './routes/Client/AllBrand/Aime';
import Ambler from './routes/Client/AllBrand/Ambler';
import Ambush from './routes/Client/AllBrand/Ambush';
import AmiParis from './routes/Client/AllBrand/AmiParis';
import Amiri from './routes/Client/AllBrand/Amiri';
import Asics from './routes/Client/AllBrand/Asics';
import AwakeNy from './routes/Client/AllBrand/AwakeNy';
import Balenciaga from './routes/Client/AllBrand/Balenciaga';
import Bape from './routes/Client/AllBrand/Bape';
import Bearbrick from './routes/Client/AllBrand/Bearbrick';
import BetterGoods from './routes/Client/AllBrand/BetterGoods';
import Billionare from './routes/Client/AllBrand/Billionare';
import Burberry from './routes/Client/AllBrand/Burberry';
import Christian from './routes/Client/AllBrand/Christian';
import Coach from './routes/Client/AllBrand/Coach';
import ConverseBrand from './routes/Client/AllBrand/ConverseBrand';
import Cpfm from './routes/Client/AllBrand/Cpfm';
import Crep from './routes/Client/AllBrand/Crep';
import DoubleSchool from './routes/Client/AllBrand/DoubleSchool';
import DrMartens from './routes/Client/AllBrand/DrMartens';
import Fendi from './routes/Client/AllBrand/Fendi';
import Fierdemoi from './routes/Client/AllBrand/Fierdemoi';
import Fog from './routes/Client/AllBrand/Fog';
import FogEssentials from './routes/Client/AllBrand/FogEssentials';
import Fredperry from './routes/Client/AllBrand/Fredperry';
import Givenchy from './routes/Client/AllBrand/Givenchy';
import Gucci from './routes/Client/AllBrand/Gucci';
import Hanaka from './routes/Client/AllBrand/Hanaka';
import Hugoboss from './routes/Client/AllBrand/Hugoboss';
import JordanBrand from './routes/Client/AllBrand/JordanBrand';
import Kenzo from './routes/Client/AllBrand/Kenzo';
import Kith from './routes/Client/AllBrand/Kith';
import Lacoste from './routes/Client/AllBrand/Lacoste';
import Laphont from './routes/Client/AllBrand/Laphont';
import Lifework from './routes/Client/AllBrand/Lifework';
import Louisvuitton from './routes/Client/AllBrand/Louisvuitton';
import Marceloburlon from './routes/Client/AllBrand/Marceloburlon';
import Marithegirbaud from './routes/Client/AllBrand/Marithegirbaud';
import Mlb from './routes/Client/AllBrand/Mlb';
import Mnml from './routes/Client/AllBrand/Mnml';
import Moschino from './routes/Client/AllBrand/Moschino';
import Mschf from './routes/Client/AllBrand/Mschf';
import NewbalanceBrand from './routes/Client/AllBrand/NewbalanceBrand';
import NikeBrand from './routes/Client/AllBrand/NikeBrand';
import Nudie from './routes/Client/AllBrand/Nudie';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
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

    if (now.getTime() > item.expiry) {
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
        setIsUnlocked(true);

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
            setIsUnlocked(false);
            sessionStorage.removeItem('DetailUser');
            Cookies.remove('accessToken');
          }, timeLeft);
        }
      }
    }
  }, [setUserId, setRole, setIsLoggedIn, secretKey]);

  const renderRoutes = () => {
    if (role === 1) {
      return (
        <>
          <AdminNavbar userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/user-management/tambah-data-user" element={<TambahDataUser />} />
            <Route path="/news-management" element={<NewsManagement />} />
            <Route path="/news-management/:judulberita" element={<NewsManagementDetail />} />
            <Route path="/news-management/tambah-news" element={<TambahNews />} />
            <Route path="/transaction-management" element={<TransactionManagement />} />
            <Route path="*" element={<NotFoundAdmin />} />
          </Routes>
        </>
      );
    } else {
      return (
        <CartProvider>
          <Navbar userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />

            {/* Featured Brand */}
            <Route path="/allbrand" element={<NameAllBrand />} />
            <Route path="/featured/brand/adidas" element={<Adidas />} />
            <Route path="/featured/brand/converse" element={<Converse />} />
            <Route path="/featured/brand/jordan" element={<Jordan />} />
            <Route path="/featured/brand/nike" element={<Nike />} />
            <Route path="/featured/brand/newbalance" element={<NewBalance />} />
            <Route path="/featured/brand/on" element={<On />} />
            <Route path="/featured/brand/supreme" element={<Supreme />} />
            <Route path="/featured/brand/watertheplants" element={<WaterThePlant />} />
            <Route path="/featured/brand/yeezy" element={<Yeezy />} />

            {/* All Brand */}

            {/* A */}
            <Route path="/allbrand/aape" element={<AapeBrand />} />
            <Route path="/allbrand/adidas" element={<AdidasBrand />} />
            <Route path="/allbrand/adlv" element={<Adlv />} />
            <Route path="/allbrand/aime-leon-dore" element={<Aime />} />
            <Route path="/allbrand/alexander-mcqueen" element={<Alexander />} />
            <Route path="/allbrand/ambler" element={<Ambler />} />
            <Route path="/allbrand/ambush" element={<Ambush />} />
            <Route path="/allbrand/ami-paris" element={<AmiParis />} />
            <Route path="/allbrand/amiri" element={<Amiri />} />
            <Route path="/allbrand/asics" element={<Asics />} />
            <Route path="/allbrand/awake-ny" element={<AwakeNy />} />
            {/* B */}
            <Route path="/allbrand/balenciaga" element={<Balenciaga />} />
            <Route path="/allbrand/bape" element={<Bape />} />
            <Route path="/allbrand/bearbrick" element={<Bearbrick />} />
            <Route path="/allbrand/better-goods" element={<BetterGoods />} />
            <Route path="/allbrand/billionaire-boys-club" element={<Billionare />} />
            <Route path="/allbrand/burberry" element={<Burberry />} />
            {/* C */}
            <Route path="/allbrand/christian-louboutin" element={<Christian />} />
            <Route path="/allbrand/coach" element={<Coach />} />
            <Route path="/allbrand/converse" element={<ConverseBrand />} />
            <Route path="/allbrand/cpfm" element={<Cpfm />} />
            <Route path="/allbrand/crep-protect" element={<Crep />} />
            {/* D */}
            <Route path="/allbrand/double-school" element={<DoubleSchool />} />
            <Route path="/allbrand/dr-martens" element={<DrMartens />} />
            {/* F */}
            <Route path="/allbrand/fendi" element={<Fendi />} />
            <Route path="/allbrand/fier-de-moi" element={<Fierdemoi />} />
            <Route path="/allbrand/fear-of-god" element={<Fog />} />
            <Route path="/allbrand/fear-of-god-essentials" element={<FogEssentials />} />
            <Route path="/allbrand/fred-perry" element={<Fredperry />} />
            {/* G */}
            <Route path="/allbrand/givenchy" element={<Givenchy />} />
            <Route path="/allbrand/gucci" element={<Gucci />} />
            {/* H */}
            <Route path="/allbrand/hanaka" element={<Hanaka />} />
            <Route path="/allbrand/hugo-boss" element={<Hugoboss />} />
            {/* J */}
            <Route path="/allbrand/jordan" element={<JordanBrand />} />
            {/* K */}
            <Route path="/allbrand/kenzo" element={<Kenzo />} />
            <Route path="/allbrand/kith" element={<Kith />} />
            {/* L */}
            <Route path="/allbrand/lacoste" element={<Lacoste />} />
            <Route path="/allbrand/laphont-montreal" element={<Laphont />} />
            <Route path="/allbrand/lifework" element={<Lifework />} />
            <Route path="/allbrand/louis-vuitton" element={<Louisvuitton />} />
            {/* M */}
            <Route path="/allbrand/marcelo-burlon" element={<Marceloburlon />} />
            <Route path="/allbrand/marithe-girbaud" element={<Marithegirbaud />} />
            <Route path="/allbrand/mlb" element={<Mlb />} />
            <Route path="/allbrand/mnml" element={<Mnml />} />
            <Route path="/allbrand/moschino" element={<Moschino />} />
            <Route path="/allbrand/mschf" element={<Mschf />} />
            {/* N */}
            <Route path="/allbrand/new-balance" element={<NewbalanceBrand />} />
            <Route path="/allbrand/nike" element={<NikeBrand />} />
            <Route path="/allbrand/nudie-jeans" element={<Nudie />} />

            {/* Cloth */}
            <Route path="/clothing/shirt" element={<Shirt />} />
            <Route path="/clothing/polo" element={<Polo />} />
            <Route path="/clothing/jacket" element={<Jacket />} />
            <Route path="/clothing/pants" element={<Pants />} />
            <Route path="/clothing/jeans" element={<Jeans />} />
            <Route path="/footware/sneakers" element={<Sneakers />} />
            <Route path="/footware/sandals" element={<Sandals />} />
            <Route path="/footware/boots" element={<Boots />} />
            <Route path="/footware/slipon" element={<Slipon />} />
            <Route path="/accessories/eyewear" element={<Eyewear />} />
            <Route path="/accessories/hats" element={<Hats />} />
            <Route path="/accessories/wallets" element={<Wallets />} />
            <Route path="/accessories/belts" element={<Belts />} />
            <Route path="/accessories/facemask" element={<Facemask />} />
            <Route path="/accessories/bag" element={<Bag />} />
            <Route path="/sixstreet/tshirt" element={<TshirtSixstreet />} />
            <Route path="/collaboration/wukong" element={<Wukong />} />
            <Route path="/collaboration/jameson" element={<Jameson />} />
            <Route path="/product-detail/:itemId" element={<ProductDetail userId={userId} isLoggedIn={isLoggedIn} />} />
            <Route path="/checkout/:user_id/:transaction_uuid" element={<Checkout isLoggedIn={isLoggedIn} />} />
            <Route path="/thank-you" element={<FinishTransaction />} />
            <Route path="/order-detail/:user_id/:transaction_uuid" element={<OrderDetail isLoggedIn={isLoggedIn} />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/profile/:id" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/news/:judulberita" element={<NewsDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </CartProvider>
      );
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/multi-link" element={<MultiLink />} />
        <Route path="*" element={isUnlocked ? renderRoutes() : <Lock setIsUnlocked={setIsUnlocked} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
