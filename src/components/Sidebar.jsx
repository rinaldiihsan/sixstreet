import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { featuredBrand } from '../constans/featured-brand';
import { SixStreet } from '../constans/sixstreet';
import { Tops } from '../constans/tops';
import { Bottom } from '../constans/bottoms';
import { Footwear } from '../constans/footwear';
import { Accessories } from '../constans/accessories';

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
              {/* Search */}
              <div className="mt-5 px-8 space-y-1">
                <div className="relative">
                  <input type="text" placeholder="Search" className="block w-full pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass" />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M7.66659 14C11.1644 14 13.9999 11.1644 13.9999 7.66665C13.9999 4.16884 11.1644 1.33331 7.66659 1.33331C4.16878 1.33331 1.33325 4.16884 1.33325 7.66665C1.33325 11.1644 4.16878 14 7.66659 14Z"
                      stroke="#AAAAAA"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M14.6666 14.6666L13.3333 13.3333" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {/* End Search */}
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
                      {/* Sub Menu */}
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
                      {/* Sub Menu */}
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
                      {/*  Sub Menu */}
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
                      {/*  Sub Menu */}
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
                      {/*  Sub Menu */}
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
                      {/*  Sub Menu */}
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
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('collboration')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">collboration</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'collboration' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'collboration' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="/collaboration/wukong" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Sixstreet x Wukong
                        </Link>
                      </li>
                      <li>
                        <Link to="/collaboration/jameson" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Sixstreet x Jameson
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Collectible Item */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('collectible')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">collectible</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'collectible' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'collectible' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="/collectible/figure" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Figure
                        </Link>
                      </li>
                      <li>
                        <Link to="/collectible/toys" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Toys
                        </Link>
                      </li>
                      <li>
                        <Link to="/collectible/miniature" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Miniature
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Comunnity Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('comunnity')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">comunnity</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'comunnity' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'comunnity' ? 'block' : 'hidden'} pl-4 space-y-1`}>
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
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]" onClick={handleCloseSidebar}>
                          Location Store
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Sale Menu */}
                  <Link to="/flashsale" className="block text-lg font-overpass font-semibold text-red-500 hover:text-red-600 " onClick={handleCloseSidebar}>
                    SALE
                  </Link>
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
