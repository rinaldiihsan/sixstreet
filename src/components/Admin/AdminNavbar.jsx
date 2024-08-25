import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './AdminNavbar.css';
import AdminSidebar from './AdminSidebar';

const AdminNavbar = ({ isLoggedIn, setIsLoggedIn, userId }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

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

  const handleLogout = async () => {
    try {
      await axios.delete('http://localhost:3000/logout');
      Cookies.remove('accessToken');
      sessionStorage.removeItem('DetailUser');
      setIsLoggedIn(false);
      setUserDropdownOpen(false);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error;
      alert('Gagal melakukan Logout!❌');
    }
  };

  return (
    <>
      <nav className="bg-white fixed top-0 left-0 right-0 w-full z-[999] transition-colors duration-300 shadow-md">
        <div className="max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex justify-between items-center">
          <button className="menu-bars transition-colors duration-300" onClick={showSidebar}>
            <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11.6667H35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <path d="M5 20H35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <path d="M5 28.3333H35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="logo">
            <Link to="/dashboard-admin" className="font-garamond font-semibold text-xl md:text-3xl tracking-[10px] md:tracking-[12px] text-[#333]">
              SIXSTREET ADMIN
            </Link>
          </div>
          <div className="flex gap-x-6 relative">
            {/* Users */}
            <div ref={dropdownRef} className="hidden md:block md:relative">
              <button onClick={toggleUserDropdown} className="flex flex-col items-center">
                <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#333333">
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
          </div>
        </div>
      </nav>
      <AdminSidebar sidebarOpen={sidebarOpen} showSidebar={showSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userId={userId} />
    </>
  );
};

export default AdminNavbar;
