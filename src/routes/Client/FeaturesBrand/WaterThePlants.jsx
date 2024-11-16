import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import assetWtp from "../../../assets/banner/WTP.webp";
import { motion } from "framer-motion";

const WaterThePlant = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Relevance");
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

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

  const handleSoldOutClick = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
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
          src={assetWtp} // Pastikan untuk mengganti dengan gambar hero WaterThePlant
          alt="Hero WaterThePlant"
          className="w-full h-full md:h-auto mb-6"
        />
        {/* Sort Options */}
        <div className="w-full flex justify-between mb-6 sticky top-[70px] bg-white z-[997] py-1 md:py-4">
          <div className="flex flex-grow">
            <div className="border-t border-b border-r lg:border-r-0 border-[#E5E5E5] flex-grow flex items-center px-4 md:px-10 py-5">
              <p className="font-overpass capitalize">
                {
                  products
                    .flatMap((item) => item.variants)
                    .filter((variant) =>
                      variant.item_name
                        .toUpperCase()
                        .includes("WATER THE PLANT")
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
                  .flatMap((item) => item.variants)
                  .reduce((uniqueVariants, variant) => {
                    if (!uniqueVariants[variant.item_name]) {
                      uniqueVariants[variant.item_name] = variant;
                    }
                    return uniqueVariants;
                  }, {})
              )
                .filter((variant) =>
                  variant.item_name.toUpperCase().includes("WATER THE PLANT")
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
                    <Link to={`/product-detail/${variant.item_id}`}>
                      {variant.parentThumbnail ? (
                        <img
                          src={variant.parentThumbnail}
                          alt={variant.item_name}
                          className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover"
                        />
                      ) : (
                        <img
                          src="/dummy-product.png"
                          alt={variant.item_name}
                          className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover"
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
                  .flatMap((item) => item.variants)
                  .reduce((uniqueVariants, variant) => {
                    if (!uniqueVariants[variant.item_name]) {
                      uniqueVariants[variant.item_name] = variant;
                    }
                    return uniqueVariants;
                  }, {})
              )
                .filter((variant) =>
                  variant.item_name.toUpperCase().includes("WATER THE PLANT")
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
                          className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover opacity-50"
                        />
                      ) : (
                        <img
                          src="/dummy-product.png"
                          alt={variant.item_name}
                          className="w-[10rem] mobileS:w-[10.5rem] mobile:w-[11.5rem] md:w-[23rem] lg:w-[31rem] laptopL:w-[27rem] object-cover opacity-50"
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
    </>
  );
};

export default WaterThePlant;