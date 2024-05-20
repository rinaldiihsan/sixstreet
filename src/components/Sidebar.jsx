import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, showSidebar }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (subMenu) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  return (
    <>
      {sidebarOpen && (
        <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className={`overlay ${sidebarOpen ? 'overlay-open' : ''}`} onClick={showSidebar}>
            <div className="absolute inset-0 bg-[#333333] opacity-30"></div>
          </div>
          <div className={`sidebar-content ${sidebarOpen ? 'sidebar-content-open' : ''}`}>
            <div className="flex-1 flex flex-col py-10 overflow-y-auto">
              <div className="flex items-center justify-between w-full px-10 ">
                <div className="logo">
                  <Link to="/" className="font-garamond font-semibold text-2xl tracking-[10px]">
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
                <Link to="#" className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900">
                  ALL CATEGORY
                </Link>
                {/* Menu with Sub Menu */}
                <ul className="space-y-2 w-full">
                  {/* Clothing Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('clothing')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">clothing</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'clothing' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'clothing' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          T-Shirt
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Shirt
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Polo
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Jacket & Hoodie
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Pants
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Jeans
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Footware Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('footware')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">footware</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'footware' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'footware' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Sneakers
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Sandals
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Boots
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Accessories Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('accessories')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">accessories</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'accessories' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'accessories' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Eyewear
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Hats
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Wallets & Card Holder
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Belts
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Belts
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Face Mask
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Jewelry
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Brecelet
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Necklace
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Bag
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* Sixstreet Menu */}
                  <li>
                    <button className="flex justify-between w-full" onClick={() => toggleSubMenu('sixstreet')}>
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">sixstreet</span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">{activeSubMenu === 'sixstreet' ? '-' : '+'}</span>
                    </button>
                    <ul className={`${activeSubMenu === 'sixstreet' ? 'block' : 'hidden'} pl-4 space-y-1`}>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          T-Shirt
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Shirt
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Jacket & Hoodie Pants
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Hat
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
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          What News?
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
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
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          What News?
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="block text-lg text-[#AAAAAA] font-overpass font-light">
                          Live with sixstreet
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
