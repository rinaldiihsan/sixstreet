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

// Auth Component
import Login from './routes/Client/Login';
import Register from './routes/Client/Register';
// End Auth Component

// Footware Component
import AllProductsFootwear from './routes/Client/Footware/AllProductsFootwear';
import Sneakers from './routes/Client/Footware/Sneakers';
import Sandals from './routes/Client/Footware/Sandals';
import Boots from './routes/Client/Footware/Boots';
import Slipon from './routes/Client/Footware/Slipon';
import Socks from './routes/Client/Footware/Socks';
import Heels from './routes/Client/Footware/Heels';
import Loafers from './routes/Client/Footware/Loafers';
// End Footware Component

// Accessories Component
import AllProductsAccessories from './routes/Client/Accessories/AllProductsAccessories';
import Eyewear from './routes/Client/Accessories/Eyewear';
import Wallets from './routes/Client/Accessories/Wallets';
import Belts from './routes/Client/Accessories/Belts';
import Bag from './routes/Client/Accessories/Bag';
import Headwear from './routes/Client/Accessories/Headwear';
import Jewelry from './routes/Client/Accessories/Jewelry';
import Lifestyle from './routes/Client/Accessories/Lifestyle';
import Collectibles from './routes/Client/Accessories/Collectibles';
import SocksAcc from './routes/Client/Accessories/SocksAcc';
import Watch from './routes/Client/Accessories/Watch';
// End Accessories Component

// Collaboration Component
import AllCollaborations from './routes/Client/Collaboration/AllCollaborations';
import Wukong from './routes/Client/Collaboration/Wukong';
import Jameson from './routes/Client/Collaboration/Jameson';
import Rajawali from './routes/Client/Collaboration/Rajawali';
// End Collaboration Component

// Product Detail Component
import ProductDetail from './routes/Client/ProductDetail/ProductDetail';
import ProductDetailSold from './routes/Client/ProductDetail/ProductDetailSold';
// End Product Detail Component

// Order Component
import Checkout from './routes/Client/ProductDetail/Checkout';
import FinishTransaction from './routes/Client/FinishTransaction';
import OrderDetail from './routes/Client/OrderDetail';
import OrderHistory from './routes/Client/OrderHistory';
// End Order Component

// Profile Component
import Profile from './routes/Client/Profile';
// End Profile Component

// News Component
import NewsDetail from './routes/Client/newsDetail/NewsDetail';
// End News Component

import NotFound from './routes/Client/NotFound';

// Import Admin Component
import { CartProvider } from './components/CartContext';
import AdminNavbar from './components/Admin/AdminNavbar';
import DashboardAdmin from './routes/Admin/DashboardAdmin/DashboardAdmin';
import UserManagement from './routes/Admin/User/UserManagement';
import TambahDataUser from './routes/Admin/User/TambahDataUser';
import NotFoundAdmin from './routes/Admin/NotFoundAdmin';
import NewsManagement from './routes/Admin/News/NewsManagement';
import NewsManagementDetail from './routes/Admin/News/NewsManagementDetail';
import TambahNews from './routes/Admin/News/TambahNews';
import TransactionManagement from './routes/Admin/Transaction/TransactionManagement';
import MultiLink from './routes/Client/MultiLink';
import ProductManagement from './routes/Admin/Product/ProductManagement';
import EditProduct from './routes/Admin/Product/EditProduct';
import DetailProductManagement from './routes/Admin/Product/DetailProductManagement';
// End Import Admin Component

// Featured Brand Component
import Adidas from './routes/Client/FeaturesBrand/Adidas';
import Converse from './routes/Client/FeaturesBrand/Converse';
import Jordan from './routes/Client/FeaturesBrand/Jordan';
import Nike from './routes/Client/FeaturesBrand/Nike';
import NewBalance from './routes/Client/FeaturesBrand/NewBalance';
import On from './routes/Client/FeaturesBrand/On';
import Supreme from './routes/Client/FeaturesBrand/Supreme';
import WaterThePlant from './routes/Client/FeaturesBrand/WaterThePlants';
import Yeezy from './routes/Client/FeaturesBrand/Yeezy';
// End Featured Brand Component

// All Brand Component
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
import Jovem from './routes/Client/AllBrand/Jovem';
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
import OffWhite from './routes/Client/AllBrand/OffWhite';
import OnBrand from './routes/Client/AllBrand/OnBrand';
import Palmangels from './routes/Client/AllBrand/Palmangels';
import Rickyisclown from './routes/Client/AllBrand/Rickyisclown';
import Ripndip from './routes/Client/AllBrand/Ripndip';
import Salvatore from './routes/Client/AllBrand/Salvatore';
import Sixstreet from './routes/Client/AllBrand/Sixstreet';
import Stayhoops from './routes/Client/AllBrand/Stayhoops';
import Stussy from './routes/Client/AllBrand/Stussy';
import SupremeBrand from './routes/Client/AllBrand/SupremeBrand';
import Valentino from './routes/Client/AllBrand/Valentino';
import VansBrand from './routes/Client/AllBrand/VansBrand';
import Veja from './routes/Client/AllBrand/Veja';
import Versace from './routes/Client/AllBrand/Versace';
import Vlone from './routes/Client/AllBrand/Vlone';
import Watertheplants from './routes/Client/AllBrand/Watertheplants';
import YeezyBrand from './routes/Client/AllBrand/YeezyBrand';
import Whocares from './routes/Client/AllBrand/Whocares';
// End All Brand Component

// Six Street Component
import AllProductsSixstreet from './routes/Client/Sixstreet/AllProductsSixstreet';
import TshirtSixstreet from './routes/Client/Sixstreet/TshirtSixstreet';
import HeadwearSixstreet from './routes/Client/Sixstreet/HeadwearSixstreet';
import HoodiesSixstreet from './routes/Client/Sixstreet/HoodiesSixstreet';
import JacketSixstreet from './routes/Client/Sixstreet/JacketSixstreet';
import LifestyleSixstreet from './routes/Client/Sixstreet/LifestyleSixstreet';
import ShirtSixstreet from './routes/Client/Sixstreet/ShirtSixstreet';
import ShortsSixstreet from './routes/Client/Sixstreet/ShortsSixstreet';
import SocksSixstreet from './routes/Client/Sixstreet/SocksSixstreet';
import SweatersSixstreet from './routes/Client/Sixstreet/SweatersSixstreet';
// End Six Street Component

// Tops Component
import AllProductsTops from './routes/Client/Tops/AllProductsTops';
import HoodiesTops from './routes/Client/Tops/HoodiesTops';
import JacketsTops from './routes/Client/Tops/JacketsTops';
import ShirtsTops from './routes/Client/Tops/ShirtsTops';
import TshirtsTops from './routes/Client/Tops/TshirtsTops';
import SweatersTops from './routes/Client/Tops/SweatersTops';
import PoloShirtsTops from './routes/Client/Tops/PoloShirtsTops';

// End Tops Component

// Bottoms Component
import AllProductsBottom from './routes/Client/Bottoms/AllProductsBottom';
import JeansBottoms from './routes/Client/Bottoms/JeansBottoms';
import TrouserBottom from './routes/Client/Bottoms/TrouserBottom';
import ShortBottom from './routes/Client/Bottoms/ShortBottom';
import SweatpantsBottom from './routes/Client/Bottoms/SweatpantsBottom';
// End Bottoms Component

// Sale Component
import TopsSale from './routes/Client/Sale/TopsSale';
import BottomsSale from './routes/Client/Sale/BottomsSale';
import FootwearSale from './routes/Client/Sale/FootwearSale';
import AccessoriesSale from './routes/Client/Sale/AccessoriesSale';
// End Sale Component

// Addtional
import ScrollToTop from './components/ScrollToTop';
import ForgotPassword from './routes/Client/ForgotPassword';
import ChangePassword from './routes/Client/ChangePassword';
import EditTransaction from './routes/Admin/Transaction/EditTransaction';
import EditDataUser from './routes/Admin/User/EditDataUser';

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
            <Route path="/user-management/edit-data-user/:id" element={<EditDataUser />} />
            <Route path="/news-management" element={<NewsManagement />} />
            <Route path="/news-management/:judulberita" element={<NewsManagementDetail />} />
            <Route path="/news-management/tambah-news" element={<TambahNews />} />
            <Route path="/transaction-management" element={<TransactionManagement />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/product-management/edit-product/:id" element={<EditProduct />} />
            <Route path="/product-management/detail-product/:group_id" element={<DetailProductManagement />} />
            <Route path="/transaction-management/edit-transaction/:user_id/:transaction_uuid" element={<EditTransaction />} />
            <Route path="*" element={<NotFoundAdmin />} />
          </Routes>
        </>
      );
    } else {
      return (
        <CartProvider>
          <Navbar userId={userId} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />

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
            <Route path="/allbrand/jovem" element={<Jovem />} />
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
            <Route path="/allbrand/nudie" element={<Nudie />} />
            {/* O */}
            <Route path="/allbrand/off-white" element={<OffWhite />} />
            <Route path="/allbrand/on" element={<OnBrand />} />
            {/* P */}
            <Route path="/allbrand/palm-angels" element={<Palmangels />} />
            {/* R */}
            <Route path="/allbrand/ricky-is-clown" element={<Rickyisclown />} />
            <Route path="/allbrand/ripndip" element={<Ripndip />} />
            {/* S */}
            <Route path="/allbrand/salvatore-ferragamo" element={<Salvatore />} />
            <Route path="/allbrand/sixstreet" element={<Sixstreet />} />
            <Route path="/allbrand/stayhoops" element={<Stayhoops />} />
            <Route path="/allbrand/stussy" element={<Stussy />} />
            <Route path="/allbrand/supreme" element={<SupremeBrand />} />
            {/* V */}
            <Route path="/allbrand/valentino-garavani" element={<Valentino />} />
            <Route path="/allbrand/vans" element={<VansBrand />} />
            <Route path="/allbrand/veja" element={<Veja />} />
            <Route path="/allbrand/versace" element={<Versace />} />
            <Route path="/allbrand/vlone" element={<Vlone />} />
            {/* W */}
            <Route path="/allbrand/who-cares" element={<Whocares />} />
            <Route path="/allbrand/water-the-plants" element={<Watertheplants />} />
            {/* Y */}
            <Route path="/allbrand/yeezy" element={<YeezyBrand />} />

            {/* Six Street Section */}
            <Route path="/sixstreet/all-products-sixstreet" element={<AllProductsSixstreet />} />
            <Route path="/sixstreet/tshirt" element={<TshirtSixstreet />} />
            <Route path="/sixstreet/shirt" element={<ShirtSixstreet />} />
            <Route path="/sixstreet/headwear" element={<HeadwearSixstreet />} />
            <Route path="/sixstreet/hoodies" element={<HoodiesSixstreet />} />
            <Route path="/sixstreet/jacket" element={<JacketSixstreet />} />
            <Route path="/sixstreet/lifestyle" element={<LifestyleSixstreet />} />
            <Route path="/sixstreet/shorts" element={<ShortsSixstreet />} />
            <Route path="/sixstreet/socks" element={<SocksSixstreet />} />
            <Route path="/sixstreet/sweaters" element={<SweatersSixstreet />} />

            {/* Tops Section */}
            <Route path="/tops/all-products-tops" element={<AllProductsTops />} />
            <Route path="/tops/t-shirts" element={<TshirtsTops />} />
            <Route path="/tops/shirts" element={<ShirtsTops />} />
            <Route path="/tops/polo-shirts" element={<PoloShirtsTops />} />
            <Route path="/tops/jackets" element={<JacketsTops />} />
            <Route path="/tops/hoodies" element={<HoodiesTops />} />
            <Route path="/tops/sweaters" element={<SweatersTops />} />

            {/* Sale Section */}
            <Route path="/sale/tops-sale" element={<TopsSale />} />
            <Route path="/sale/bottoms-sale" element={<BottomsSale />} />
            <Route path="/sale/footwear-sale" element={<FootwearSale />} />
            <Route path="/sale/accessories-sale" element={<AccessoriesSale />} />

            {/* Footwear */}
            <Route path="/footwear/all-products-footwear" element={<AllProductsFootwear />} />
            <Route path="/footwear/sneakers" element={<Sneakers />} />
            <Route path="/footwear/sandals" element={<Sandals />} />
            <Route path="/footwear/boots" element={<Boots />} />
            <Route path="/footwear/slip-on" element={<Slipon />} />
            <Route path="/footwear/socks" element={<Socks />} />
            <Route path="/footwear/heels" element={<Heels />} />
            <Route path="/footwear/loafers" element={<Loafers />} />

            {/* Bottoms */}
            <Route path="/bottoms/all-products-bottoms" element={<AllProductsBottom />} />
            <Route path="/bottoms/jeans" element={<JeansBottoms />} />
            <Route path="/bottoms/trousers" element={<TrouserBottom />} />
            <Route path="/bottoms/shorts" element={<ShortBottom />} />
            <Route path="/bottoms/sweatpants" element={<SweatpantsBottom />} />

            {/* Accessories */}
            <Route path="/accessories/all-products-accessories" element={<AllProductsAccessories />} />
            <Route path="/accessories/eyewear" element={<Eyewear />} />
            <Route path="/accessories/wallets-cardholders" element={<Wallets />} />
            <Route path="/accessories/belt" element={<Belts />} />
            <Route path="/accessories/bag" element={<Bag />} />
            <Route path="/accessories/headwear" element={<Headwear />} />
            <Route path="/accessories/jewelry" element={<Jewelry />} />
            <Route path="/accessories/collectibles" element={<Collectibles />} />
            <Route path="/accessories/lifestyle" element={<Lifestyle />} />
            <Route path="/accessories/socks" element={<SocksAcc />} />
            <Route path="/accessories/watch" element={<Watch />} />

            {/* Collaboration */}
            <Route path="/collaboration/all-collaborations" element={<AllCollaborations />} />
            <Route path="/collaboration/wukong" element={<Wukong />} />
            <Route path="/collaboration/jameson" element={<Jameson />} />
            <Route path="/collaboration/rajawali" element={<Rajawali />} />

            {/* Product Detail */}
            <Route path="/product-detail/:group_id" element={<ProductDetail userId={userId} isLoggedIn={isLoggedIn} />} />

            {/* Product Detail Sold */}
            <Route path="/product-detail-sold/:itemId" element={<ProductDetailSold userId={userId} isLoggedIn={isLoggedIn} />} />

            {/* Order */}
            <Route path="/checkout/:user_id/:transaction_uuid" element={<Checkout isLoggedIn={isLoggedIn} />} />
            <Route path="/thank-you" element={<FinishTransaction />} />
            <Route path="/order-detail/:user_id/:transaction_uuid" element={<OrderDetail isLoggedIn={isLoggedIn} />} />
            <Route path="/order-history" element={<OrderHistory />} />

            {/* Profile */}
            <Route path="/profile/:id" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

            {/* News */}
            <Route path="/news/:judulberita" element={<NewsDetail />} />

            {/* 404 */}
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
        <Route path="*" element={renderRoutes()} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
