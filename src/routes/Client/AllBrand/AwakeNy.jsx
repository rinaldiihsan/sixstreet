import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import heroAwakeNy from "../../../assets/banner/AWAKE-NY.webp";

const AwakeNy = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Relevance");
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchProducts = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/inventory/items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch products");
      }

      const data = response.data;
      const productsWithThumbnails = data.data.map((item) => {
        item.variants = item.variants.map((variant) => ({
          ...variant,
          parentThumbnail: item.thumbnail,
          last_modified: item.last_modified,
        }));
        return item;
      });

      setProducts(productsWithThumbnails);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAndFetchProducts = async () => {
    const email = import.meta.env.VITE_API_EMAIL;
    const password = import.meta.env.VITE_API_PASSWORD;
    const ApiLogin = import.meta.env.VITE_LOGIN_JUBELIO;

    if (!email || !password) {
      setError("Missing email or password in environment variables.");
      setLoginStatus("error");
      return;
    }

    try {
      const response = await axios.post(`${ApiLogin}/loginjubelio`);
      const data = response.data;

      if (response.status === 200) {
        Cookies.set("pos_token", data.token, { expires: 1 });
        setLoginStatus("success");
        fetchProducts(data.token);
      } else {
        setError(data.message);
        setLoginStatus("error");
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      setLoginStatus("error");
    }
  };

  useEffect(() => {
    loginAndFetchProducts();
  }, []);

  useEffect(() => {
    const token = Cookies.get("pos_token");
    if (token) {
      fetchProducts(token);
    }
  }, [selectedOption]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleBrandChange = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prevState) =>
      checked
        ? [...prevState, value]
        : prevState.filter((brand) => brand !== value)
    );
  };

  const handleSoldOutClick = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <>
      <div className="mt-20 max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex flex-col justify-center items-center overflow-x-hidden">
        {showAlert && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[999]">
            <div className="bg-red-100 border border-red-500 text-red-500 px-8 py-3 rounded-lg shadow-lg">
              Maaf, produk ini sedang tidak tersedia (Sold Out)
            </div>
          </div>
        )}

        <img
          src={heroAwakeNy} // Pastikan untuk mengganti dengan gambar hero AWAKE NY
          alt="Hero AWAKE NY"
          className="w-full h-full md:h-auto mb-6"
        />
        <h1 className="text-center text-xs font-overpass lg:max-w-7xl  md:block md:text-base">
          Awake NY is a streetwear brand founded by Angelo Baque in New York
          City. Known for its minimalist aesthetic and bold graphics, Awake NY
          offers a range of apparel and accessories. The brand is inspired by
          Baque's experiences growing up in New York and his passion for
          skateboarding.
        </h1>
        {/* Filter  */}
        <div className="w-full flex justify-between mb-6 sticky top-[70px] bg-white z-[997] py-1 md:py-4">
          <div className="flex flex-grow">
            <div className="border border-[#E5E5E5] flex items-center justify-center w-[10rem] md:w-[17rem] px-4 md:px-10 py-5 gap-x-5 md:gap-x-14">
              <p className="font-overpass text-lg hidden md:block">Filter</p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={toggleSidebar}
              >
                <path
                  d="M18.3335 5.41666H13.3335"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.99984 5.41666H1.6665"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.33317 8.33333C9.944 8.33333 11.2498 7.0275 11.2498 5.41667C11.2498 3.80584 9.944 2.5 8.33317 2.5C6.72234 2.5 5.4165 3.80584 5.4165 5.41667C5.4165 7.0275 6.72234 8.33333 8.33317 8.33333Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3333 14.5833H15"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.6665 14.5833H1.6665"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.6667 17.5C13.2775 17.5 14.5833 16.1942 14.5833 14.5833C14.5833 12.9725 13.2775 11.6667 11.6667 11.6667C10.0558 11.6667 8.75 12.9725 8.75 14.5833C8.75 16.1942 10.0558 17.5 11.6667 17.5Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="border-t border-b border-r lg:border-r-0 border-[#E5E5E5] flex-grow flex items-center px-4 md:px-10 py-5">
              <p className="font-overpass capitalize">
                {
                  products
                    .flatMap((item) => item.variants)
                    .filter((variant) =>
                      variant.item_name.toUpperCase().includes("AWAKE NY")
                    ).length
                }{" "}
                Hasil
              </p>
            </div>
            <div className="relative border border-[#E5E5E5] hidden md:flex items-center justify-center w-full md:w-[25rem] px-4 md:px-10 py-5 gap-x-5">
              <p
                className="font-overpass capitalize cursor-pointer"
                onClick={handleDropdownToggle}
              >
                {selectedOption}
              </p>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#E5E5E5] z-10">
                  <p
                    className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOptionSelect("Relevance")}
                  >
                    Relevance
                  </p>
                  <p
                    className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOptionSelect("Harga Tertinggi")}
                  >
                    Harga Tertinggi
                  </p>
                  <p
                    className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOptionSelect("Harga Terendah")}
                  >
                    Harga Terendah
                  </p>
                  <p
                    className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOptionSelect("Product Terbaru")}
                  >
                    Product Terbaru
                  </p>
                  <p
                    className="font-overpass px-10 py-5 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOptionSelect("Alphabet")}
                  >
                    Alphabet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-[999] flex flex-col w-3/4 h-full px-6 py-6 overflow-y-auto md:hidden overflow-x-hidden"
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button
              onClick={toggleSidebar}
              className="self-end text-xl font-bold mb-4"
            >
              ×
            </button>
            {/* Filter Brand */}
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Brand</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="JORDAN"
                    value="JORDAN"
                    onChange={handleBrandChange}
                  />
                  <label className="font-overpass" htmlFor="JORDAN">
                    JORDAN
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="OFFWHITE"
                    value="OFFWHITE"
                    onChange={handleBrandChange}
                  />
                  <label className="font-overpass" htmlFor="OFFWHITE">
                    OFFWHITE
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="BAPE"
                    value="BAPE"
                    onChange={handleBrandChange}
                  />
                  <label className="font-overpass" htmlFor="BAPE">
                    BAPE
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="OFFWHITE"
                    value="OFFWHITE"
                    onChange={handleBrandChange}
                  />
                  <label className="font-overpass" htmlFor="OFFWHITE">
                    OFFWHITE
                  </label>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        <div className="w-full flex justify-between gap-x-3 overflow-x-hidden">
          <div className="w-[15%] border border-[#E5E5E5] flex-col px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto hidden md:flex md:py-5">
            {/* Filter Size */}
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Size</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="price"
                    id="price1"
                  />
                  <label className="font-overpass" htmlFor="price1">
                    S
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="price"
                    id="price2"
                  />
                  <label className="font-overpass" htmlFor="price2">
                    M
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="price"
                    id="price3"
                  />
                  <label className="font-overpass" htmlFor="price3">
                    L
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="price"
                    id="price4"
                  />
                  <label className="font-overpass" htmlFor="price4">
                    XL
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="price"
                    id="price4"
                  />
                  <label className="font-overpass" htmlFor="price4">
                    XXL
                  </label>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium font-overpass">Categories</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="brand1"
                  />
                  <label className="font-overpass" htmlFor="brand1">
                    Bags
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="brand2"
                  />
                  <label className="font-overpass" htmlFor="brand2">
                    Hats
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="brand3"
                  />
                  <label className="font-overpass" htmlFor="brand3">
                    Hoodie
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="brand4"
                  />
                  <label className="font-overpass" htmlFor="brand4">
                    Socks
                  </label>
                </li>
                <li className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
                    name="brand"
                    id="brand4"
                  />
                  <label className="font-overpass" htmlFor="brand4">
                    T-Shirts
                  </label>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full grid grid-cols-2 gap-5 md:grid-cols-3 mb-10 overflow-y-auto h-[calc(100vh-4rem)] md:px-5 overflow-x-hidden">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-y-5 items-center">
                  <Skeleton className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover" />
                  <div className="flex flex-col text-center gap-y-2 w-full">
                    <Skeleton className="md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]" />
                    <Skeleton className="md:text-xl" />
                  </div>
                </div>
              ))
            ) : loginStatus === "success" ? (
              <>
                {/* Available Products */}
                {Object.values(
                  products
                    .flatMap((item) => ({
                      ...item.variants[0],
                      item_group_id: item.item_group_id,
                      parentThumbnail: item.thumbnail,
                      last_modified: item.last_modified,
                    }))
                    .reduce((uniqueVariants, variant) => {
                      if (!uniqueVariants[variant.item_name]) {
                        uniqueVariants[variant.item_name] = variant;
                      }
                      return uniqueVariants;
                    }, {})
                )
                  .filter((variant) =>
                    variant.item_name.toUpperCase().includes("AWAKE NY")
                  )
                  .filter(
                    (variant) =>
                      variant.sell_price !== null &&
                      variant.sell_price !== 0 &&
                      variant.available_qty !== null &&
                      variant.available_qty >= 1
                  )
                  .sort((a, b) => {
                    if (selectedOption === "Harga Tertinggi") {
                      return b.sell_price - a.sell_price;
                    } else if (selectedOption === "Harga Terendah") {
                      return a.sell_price - b.sell_price;
                    } else if (selectedOption === "Alphabet") {
                      return a.item_name.localeCompare(b.item_name);
                    } else if (selectedOption === "Product Terbaru") {
                      return (
                        new Date(b.last_modified) - new Date(a.last_modified)
                      );
                    }
                    return 0;
                  })
                  .map((variant, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-y-5 items-center"
                    >
                      <Link to={`/product-detail/${variant.item_group_id}`}>
                        {variant.parentThumbnail ? (
                          <img
                            src={variant.parentThumbnail}
                            alt={variant.item_name}
                            className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover"
                          />
                        ) : (
                          <img
                            src="/dummy-product.png"
                            alt={variant.item_name}
                            className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover"
                          />
                        )}
                      </Link>
                      <div className="flex flex-col md:text-center gap-y-2">
                        <h2 className="uppercase font-overpass font-extrabold md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem]">
                          {variant.item_name}
                        </h2>
                        <h2 className="uppercase font-overpass text-sm mobile:text-base md:text-xl">
                          Rp. {variant.sell_price.toLocaleString("id-ID")}
                        </h2>
                      </div>
                    </div>
                  ))}

                {/* Sold Out Products */}
                {Object.values(
                  products
                    .flatMap((item) => ({
                      ...item.variants[0],
                      item_group_id: item.item_group_id,
                      parentThumbnail: item.thumbnail,
                      last_modified: item.last_modified,
                    }))
                    .reduce((uniqueVariants, variant) => {
                      if (!uniqueVariants[variant.item_name]) {
                        uniqueVariants[variant.item_name] = variant;
                      }
                      return uniqueVariants;
                    }, {})
                )
                  .filter((variant) =>
                    variant.item_name.toUpperCase().includes("AWAKE NY")
                  )
                  .filter(
                    (variant) =>
                      variant.sell_price !== null &&
                      variant.sell_price !== 0 &&
                      (variant.available_qty === null ||
                        variant.available_qty <= 0)
                  )
                  .map((variant, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-y-5 items-center"
                    >
                      <Link
                        href="#"
                        onClick={handleSoldOutClick}
                        className="cursor-not-allowed transition-opacity duration-300 hover:opacity-75"
                      >
                        {variant.parentThumbnail ? (
                          <img
                            src={variant.parentThumbnail}
                            alt={variant.item_name}
                            className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover opacity-50"
                          />
                        ) : (
                          <img
                            src="/dummy-product.png"
                            alt={variant.item_name}
                            className="w-[10rem] h-[10rem] mobileS:w-[10.5rem] mobileS:h-[10.5rem] mobile:w-[11.5rem] mobile:h-[11.5rem] md:w-[23rem] md:h-[23rem] lg:w-[31rem] lg:h-[31rem] laptopL:w-[27rem] laptopL:h-[27rem] object-cover opacity-50"
                          />
                        )}
                      </Link>
                      <div className="flex flex-col text-center gap-y-2">
                        <h2 className="uppercase font-overpass font-extrabold md:text-xl w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[24rem] text-red-600">
                          {variant.item_name}
                        </h2>
                        <h2 className="uppercase font-overpass text-sm mobile:text-base md:text-xl text-red-600">
                          Sold Out
                        </h2>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <p className="uppercase font-overpass font-bold text-xl">
                {error ? `Login failed: ${error}` : "No products found"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AwakeNy;
