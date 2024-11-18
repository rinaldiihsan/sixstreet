{
  /* Footware Menu
                  <li>
                    <button
                      className="flex justify-between w-full"
                      onClick={() => toggleSubMenu("footware")}
                    >
                      <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">
                        footware
                      </span>
                      <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">
                        {activeSubMenu === "footware" ? "-" : "+"}
                      </span>
                    </button>
                    <ul
                      className={`${
                        activeSubMenu === "footware" ? "block" : "hidden"
                      } pl-4 space-y-1`}
                    >
                      <li>
                        <Link
                          to="/footware/sneakers"
                          className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
                          onClick={handleCloseSidebar}
                        >
                          Sneakers
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/footware/sandals"
                          className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
                          onClick={handleCloseSidebar}
                        >
                          Sandals
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/footware/boots"
                          className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
                          onClick={handleCloseSidebar}
                        >
                          Boots
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/footware/slipon"
                          className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
                          onClick={handleCloseSidebar}
                        >
                          Slip On
                        </Link>
                      </li>
                    </ul>
                  </li> */
}
{
  /* Accessories Menu */
}
<li>
  <button
    className="flex justify-between w-full"
    onClick={() => toggleSubMenu("accessories")}
  >
    <span className="block text-lg font-overpass font-semibold text-gray-800 hover:text-gray-900 uppercase">
      accessories
    </span>
    <span className="block text-xl font-overpass font-semibold text-gray-800 hover:text-gray-900">
      {activeSubMenu === "accessories" ? "-" : "+"}
    </span>
  </button>
  <ul
    className={`${
      activeSubMenu === "accessories" ? "block" : "hidden"
    } pl-4 space-y-1`}
  >
    <li>
      <Link
        to="/accessories/eyewear"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Eyewear
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/hats"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Hats
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/wallets"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Wallets & Card Holder
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/belts"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Belts
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/facemask"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Face Mask
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/jewelry"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Jewelry
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/bracelet"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Bracelet
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/necklace"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Necklace
      </Link>
    </li>
    <li>
      <Link
        to="/accessories/bag"
        className="block text-lg text-[#AAAAAA] font-overpass font-light hover:text-[#7A7A7A]"
        onClick={handleCloseSidebar}
      >
        Bag
      </Link>
    </li>
  </ul>
</li>;
