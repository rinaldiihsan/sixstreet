import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetailSold = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [slider, setSlider] = useState(null);

  const formatDescription = (str) => {
    if (!str) return "";
    let formattedText = str.replace(/<br\s*\/?>/gi, "\n");
    formattedText = formattedText.replace(/<\/?p>/gi, "\n\n");
    formattedText = formattedText.replace(/<\/?[^>]+(>|$)/g, "");
    formattedText = formattedText.replace(/\n\s*\n\s*\n/g, "\n\n");
    return formattedText.trim();
  };

  const fetchProductGroup = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const groupResponse = await axios.get(
        `${apiUrl}/inventory/catalog/for-listing/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (groupResponse.status === 200 && groupResponse.data.length > 0) {
        const productData = groupResponse.data[0];

        if (productData.images && productData.images.length > 0) {
          setProductImages(productData.images);
        }

        setProduct({
          item_group_name: productData.item_group_name,
          description: formatDescription(productData.description || ""),
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("Failed to fetch product details");
    }
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#333333] hover:bg-[#333333]/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#333333] hover:bg-[#333333]/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "relative",
  };

  const loginAndFetchProduct = async () => {
    const email = import.meta.env.VITE_API_EMAIL;
    const password = import.meta.env.VITE_API_PASSWORD;
    const ApiLogin = import.meta.env.VITE_LOGIN_JUBELIO;

    try {
      const response = await axios.post(`${ApiLogin}/loginjubelio`);
      const data = response.data;

      if (response.status === 200) {
        Cookies.set("pos_token", data.token, { expires: 1 });
        await fetchProductGroup(data.token);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    if (itemId) {
      loginAndFetchProduct();
    } else {
      setError("Invalid item ID");
    }
  }, [itemId]);

  const getWhatsAppLink = () => {
    const phoneNumber = "6282284423150";
    const productName = product?.item_group_name || "";
    const message = `Halo, saya tertarik dengan produk berikut:\n\nNama: ${productName}\n*Status: SOLD OUT - Available for Pre-Order*\n\nMohon informasi mengenai:\n- Estimasi waktu Pre-Order\n- Sistem pembayaran\n- Harga Pre-Order\n\nTerima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const renderSkeleton = () => (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center">
        <Skeleton className="lg:w-[40rem]" height={400} />
        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <Skeleton height={40} />
          <Skeleton count={5} />
        </div>
      </div>
    </div>
  );

  if (error || !product) {
    return renderSkeleton();
  }

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center overflow-x-hidden">
      <div className="w-full flex flex-col lg:flex-row mb-6 gap-x-11 justify-center space-y-5 lg:space-y-0">
        <div className="w-full lg:w-[40rem] relative flex flex-col gap-y-4">
          <div className="w-full">
            <Slider ref={setSlider} {...settings}>
              {productImages.map((image, index) => (
                <div key={image.group_image_id}>
                  <img
                    src={image.url == null ? "/dummy-product.png" : image.url}
                    alt={`${product?.item_group_name} - ${index + 1}`}
                    className="w-[28rem] h-[28rem] md:w-full md:h-full lg:w-[40rem] lg:h-[40rem] object-cover opacity-50"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 mt-4 px-2">
            {productImages.map((image, index) => (
              <div
                key={`thumb-${image.group_image_id}`}
                className="cursor-pointer rounded overflow-hidden border-2 hover:border-gray-400"
                onClick={() => slider?.slickGoTo(index)}
              >
                <img
                  src={
                    image.thumbnail == null
                      ? "/dummy-product.png"
                      : image.thumbnail
                  }
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-cover opacity-50"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-[40rem] flex flex-col gap-y-3">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold font-overpass text-[#333333] uppercase">
              {product?.item_group_name}
            </h1>
            <p className="text-lg font-semibold font-overpass text-red-600">
              SOLD OUT
            </p>
          </div>

          <p className="text-sm font-overpass whitespace-pre-wrap text-justify">
            {product?.description}
          </p>

          <Link
            to={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fff] text-[#333] font-semibold py-3 px-8 hover:bg-[#333] hover:text-[#fff] focus:outline-none focus:shadow-outline font-overpass text-center border border-[#333] transition-colors duration-300 mt-4"
          >
            Chat Via Whatsapp for Pre-Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSold;
