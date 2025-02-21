import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import Cart from './Cart';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Discount banner items
  const discountItems = ['Branded Apparel', 'Sneakers & Footwear', 'Accessories & Collectible Items'];
  const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);

  // Original functions
  const showSidebar = () => setSidebarOpen(!sidebarOpen);
  const showCart = () => setCartOpen(!cartOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleLogout = async () => {
    try {
      await axios.delete(`${backendUrl}/logout`);
      Cookies.remove('accessToken');
      sessionStorage.removeItem('DetailUser');
      setIsLoggedIn(false);
      setUserDropdownOpen(false);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      toast.error('Gagal melakukan logout', {
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside dropdown effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Location change effect
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [location]);

  // Cart items count effect
  useEffect(() => {
    setCartItemCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  // Discount banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDiscountIndex((prev) => (prev + 1) % discountItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navbarColor = location.pathname === '/' ? (scrolling ? 'bg-white shadow-md' : 'bg-transparent') : 'bg-white shadow-md';
  const svgColor = scrolling || location.pathname !== '/' ? '#333333' : '#FFFFFF';
  const textColor = scrolling || location.pathname !== '/' ? 'text-[#333333]' : 'text-white';

  return (
    <>
      {/* Discount Banner */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white h-8 z-[1000]">
        <div className="max-w-[115rem] h-full mx-auto px-5 md:px-2">
          <div className="h-full flex justify-center items-center">
            <div className="flex items-center h-full">
              <span className="text-base font-overpass leading-none">Discount 10% OFF - </span>
              <div className="relative inline-flex items-center h-full">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentDiscountIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    className="absolute left-0 text-base font-overpass leading-none whitespace-nowrap"
                  >
                    {discountItems[currentDiscountIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="invisible text-base font-overpass leading-none whitespace-nowrap"> {discountItems[currentDiscountIndex]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`${navbarColor} fixed top-8 left-0 right-0 w-full z-[999] transition-colors duration-300`}>
        <div className="max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex justify-between items-center">
          {/* Hamburger Button */}
          <Link to="#" className="menu-bars transition-colors duration-300" onClick={showSidebar}>
            <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11.6667H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 20H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 28.3333H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>

          {/* Logo */}
          <div className="logo">
            <Link to="/" className={`font-garamond font-semibold text-xl md:text-3xl tracking-[10px] md:tracking-[18px] ${textColor}`}>
              SIXSTREET
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex gap-x-6 relative">
            {/* User Dropdown */}
            <div ref={dropdownRef} className="hidden md:block md:relative">
              <button onClick={toggleUserDropdown} className="flex flex-col items-center">
                <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" stroke={svgColor}>
                  <path
                    d="M20.0001 20C24.6025 20 28.3334 16.269 28.3334 11.6667C28.3334 7.0643 24.6025 3.33334 20.0001 3.33334C15.3977 3.33334 11.6667 7.0643 11.6667 11.6667C11.6667 16.269 15.3977 20 20.0001 20Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M34.3167 36.6667C34.3167 30.2167 27.9 25 20 25C12.1 25 5.68335 30.2167 5.68335 36.6667" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-zinc-100 rounded-sm shadow-lg z-50">
                  <div className="py-1">
                    {isLoggedIn ? (
                      <>
                        <Link to={`/profile/${userId}`} className="block px-4 py-2 text-[#333333] font-medium font-overpass text-center">
                          Profile
                        </Link>
                        <Link to={'/order-history'} className="block px-4 py-2 text-[#333333] font-medium font-overpass text-center">
                          Order History
                        </Link>
                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-[#333333] font-medium font-overpass text-center">
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/login" className="block w-full px-4 py-2 text-[#333333] font-medium font-overpass text-center">
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={showCart} className="relative">
              <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.5 12.7833V11.1667C12.5 7.41668 15.5167 3.73335 19.2667 3.38335C23.7333 2.95001 27.5 6.46668 27.5 10.85V13.15"
                  stroke={svgColor}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 36.6667H25C31.7 36.6667 32.9 33.9833 33.25 30.7167L34.5 20.7167C34.95 16.65 33.7833 13.3333 26.6666 13.3333H13.3333C6.21662 13.3333 5.04996 16.65 5.49996 20.7167L6.74996 30.7167C7.09996 33.9833 8.29996 36.6667 15 36.6667Z"
                  stroke={svgColor}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M25.8259 20H25.8409" stroke={svgColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.1574 20H14.1724" stroke={svgColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {cartItemCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebars */}
      <Sidebar sidebarOpen={sidebarOpen} showSidebar={showSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userId={userId} />
      <Cart cartOpen={cartOpen} showCart={showCart} showSidebar={showSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userId={userId} />
    </>
  );
};

export default Navbar;
