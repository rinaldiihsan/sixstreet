import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
// CSS
import './Navbar.css';
import Sidebar from './Sidebar';
import Cart from './Cart';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(1);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const showSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setUserDropdownOpen(false);
  }, [location]);

  const navbarColor = location.pathname === '/' ? (scrolling ? 'bg-white shadow-md' : 'bg-transparent') : 'bg-white shadow-md';
  const svgColor = scrolling || location.pathname !== '/' ? '#333333' : '#FFFFFF';
  const textColor = scrolling || location.pathname !== '/' ? 'text-[#333333]' : 'text-white';

  return (
    <>
      <nav className={`${navbarColor} fixed top-0 left-0 right-0 w-full z-[999] transition-colors duration-300`}>
        <div className="max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex justify-between items-center">
          <Link to="#" className="menu-bars transition-colors duration-300" onClick={showSidebar}>
            <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11.6667H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 20H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 28.3333H35" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <div className="logo">
            <Link to="/" className={`font-garamond font-semibold text-xl md:text-3xl tracking-[12px] md:tracking-[18px] ${textColor}`}>
              SIXSTREET
            </Link>
          </div>
          <div className="flex gap-x-6 relative">
            {/* Users */}
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
                        <Link to="/profile" className="block px-4 py-2 text-[#333333] font-medium font-overpass text-center">
                          Profile
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
            {/* End of Users */}
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
              {cartItemCount > 0 && <span className="absolute top-[-5px] right-[-5px] bg-red-500 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-overpass">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </nav>
      <Sidebar sidebarOpen={sidebarOpen} showSidebar={showSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Cart cartOpen={cartOpen} showCart={showCart} />
    </>
  );
};

export default Navbar;
