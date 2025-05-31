import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './User/SearchBar';
import { featuredBrand } from '../constans/featured-brand';
import { SixStreet } from '../constans/sixstreet';
import { Tops } from '../constans/tops';
import { Bottom } from '../constans/bottoms';
import { Footwear } from '../constans/footwear';
import { Accessories } from '../constans/accessories';
import { Collaborations } from '../constans/collaborations';
import { Sale } from '../constans/sale';

const Sidebar = ({ sidebarOpen, showSidebar, isLoggedIn, setIsLoggedIn, userId }) => {
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

  // Handler untuk ketika user mengklik hasil pencarian
  const handleSearchResultClick = (item) => {
    handleCloseSidebar();
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.1, ease: 'easeInOut' },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.1, ease: 'easeInOut' },
    },
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
                  <Link to="/" className="font-garamond font-semibold text-2xl tracking-[5px] md:tracking-[10px]" onClick={handleCloseSidebar}>
                    SIXSTREET
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

              {/* Search Component */}
              <SearchBar onResultClick={handleSearchResultClick} />

              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              <nav className="mt-5 px-8 space-y-2 w-full">
                {/* Menu with Sub Menu */}
                <ul className="space-y-2 w-full">
                  {/* SixStreet Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('sixstreet')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Sixstreet</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'sixstreet' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'sixstreet' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {SixStreet.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Featured Brand Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('featuredBrand')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Featured Brands</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'featuredBrand' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'featuredBrand' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {featuredBrand.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Tops Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('tops')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Tops</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'tops' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'tops' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Tops.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Bottom Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('bottoms')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Bottoms</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'bottoms' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'bottoms' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Bottom.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Footwear Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('footwear')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Footwear</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'footwear' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'footwear' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Footwear.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Accessories Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('accessories')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Accessories</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'accessories' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'accessories' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Accessories.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Collab Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('collaboration')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">Collaboration</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'collaboration' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'collaboration' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Collaborations.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Community Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('community')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">community</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'community' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'community' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          What News?
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Live with sixstreet
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Location Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('location')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">location</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'location' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'location' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link target="_blank" to="https://maps.app.goo.gl/9m9WXF5nCRbZqYgVA" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Location Store
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Sale Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('sale')}>
                      <span className="block text-lg font-overpass font-semibold text-red-500 hover:text-red-600 ">SALE</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'sale' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'sale' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {Sale.map((brand, index) => (
                        <li key={index}>
                          <Link to={brand.path} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* User Section */}
                  <li className="block md:hidden">
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('user')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">User</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'user' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'user' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      {isLoggedIn ? (
                        <>
                          <li>
                            <Link to={`/profile/${userId}`} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link to={'/order-history'} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                              Order History
                            </Link>
                          </li>
                          <li>
                            <button onClick={handleLogout} className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]">
                              Logout
                            </button>
                          </li>
                        </>
                      ) : (
                        <li>
                          <Link to="/login" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                            Login
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
