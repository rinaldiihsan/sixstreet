import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = ({ sidebarOpen, showSidebar, isLoggedIn, setIsLoggedIn, userId }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (subMenu) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  const handleCloseSidebar = () => {
    showSidebar(false);
  };

  useEffect(() => {
    setActiveSubMenu(null);
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.1, ease: 'easeInOut' } },
    closed: { x: '-100%', opacity: 0, transition: { duration: 0.1, ease: 'easeInOut' } },
  };

  return (
    <>
      {sidebarOpen && (
        <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className={`overlay`} onClick={showSidebar}>
            <div className="absolute inset-0 bg-[#333333] opacity-30"></div>
          </div>
          <motion.div className="sidebar-content" initial="closed" animate={sidebarOpen ? 'open' : 'closed'} variants={sidebarVariants} transition={{ type: 'spring', stiffness: 100 }}>
            <div className="flex-1 flex flex-col py-10 overflow-y-auto">
              <div className="flex items-center justify-between w-full px-10 ">
                <div className="logo">
                  <Link to="/dashboard-admin" className="font-garamond font-semibold text-2xl tracking-[5px] md:tracking-[8px]" onClick={handleCloseSidebar}>
                    SIXSTREET ADMIN
                  </Link>
                </div>
                <button onClick={showSidebar}>
                  <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4944 8.28577L7.49438 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.49438 8.28577L22.4944 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              <nav className="mt-5 px-8 space-y-2 w-full">
                <Link to="/user-management" className="uppercase block text-lg font-overpass font-semibold text-[#333333] hover:text-gray-900" onClick={handleCloseSidebar}>
                  user management
                </Link>
                <Link to="/news-management" className="uppercase block text-lg font-overpass font-semibold text-[#333333] hover:text-gray-900" onClick={handleCloseSidebar}>
                  news management
                </Link>
                <Link to="/transaction-management" className="uppercase block text-lg font-overpass font-semibold text-[#333333] hover:text-gray-900" onClick={handleCloseSidebar}>
                  transaction management
                </Link>
                <Link to="/product-management" className="uppercase block text-lg font-overpass font-semibold text-[#333333] hover:text-gray-900" onClick={handleCloseSidebar}>
                  product management
                </Link>
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
