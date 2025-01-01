import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="bg-[#333333] flex flex-col justify-center items-center py-12 gap-y-[7rem]">
        <div className="flex flex-col items-center justify-center gap-y-6">
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-y-4"
          >
            <img
              src="/logo_s.svg"
              alt="Logo Sixstreeet"
              className="w-[3rem] md:w-[4.5rem]"
            />
            <h1 className="font-garamond font-semibold text-2xl tracking-[10px] md:text-3xl md:tracking-[16px] text-white">
              SIXSTREET
            </h1>
          </Link>
          <div className="flex gap-x-2 md:gap-x-8">
            <Link
              to="/tops/all-products-tops"
              className="font-garamond text-white text-xl"
            >
              Tops
            </Link>
            <Link
              to="/bottoms/all-products-bottoms"
              className="font-garamond text-white text-xl"
            >
              Bottoms
            </Link>
            <Link
              to="/footwear/all-products-footwear"
              className="font-garamond text-white text-xl"
            >
              Footwear
            </Link>
            <Link
              to="/footwear/all-products-footwear"
              className="font-garamond text-white text-xl"
            >
              Accessories
            </Link>
            <Link
              to="/collaboration/all-collaborations"
              className="font-garamond text-white text-xl"
            >
              Collaborations
            </Link>
          </div>
          <div className="flex gap-x-7">
            <Link to="/">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.6104 2.9165H11.3895C6.08121 2.9165 2.91663 6.08109 2.91663 11.3894V23.5957C2.91663 28.9186 6.08121 32.0832 11.3895 32.0832H23.5958C28.9041 32.0832 32.0687 28.9186 32.0687 23.6103V11.3894C32.0833 6.08109 28.9187 2.9165 23.6104 2.9165ZM17.5 23.1582C14.3791 23.1582 11.8416 20.6207 11.8416 17.4998C11.8416 14.379 14.3791 11.8415 17.5 11.8415C20.6208 11.8415 23.1583 14.379 23.1583 17.4998C23.1583 20.6207 20.6208 23.1582 17.5 23.1582ZM26.1333 10.0332C26.0604 10.2082 25.9583 10.3686 25.827 10.5144C25.6812 10.6457 25.5208 10.7478 25.3458 10.8207C25.1708 10.8936 24.9812 10.9373 24.7916 10.9373C24.3979 10.9373 24.0333 10.7915 23.7562 10.5144C23.625 10.3686 23.5229 10.2082 23.45 10.0332C23.377 9.85817 23.3333 9.66859 23.3333 9.479C23.3333 9.28942 23.377 9.09984 23.45 8.92484C23.5229 8.73525 23.625 8.58942 23.7562 8.44359C24.0916 8.10817 24.602 7.94775 25.0687 8.04984C25.1708 8.06442 25.2583 8.09359 25.3458 8.13734C25.4333 8.1665 25.5208 8.21025 25.6083 8.26859C25.6812 8.31234 25.7541 8.38525 25.827 8.44359C25.9583 8.58942 26.0604 8.73525 26.1333 8.92484C26.2062 9.09984 26.25 9.28942 26.25 9.479C26.25 9.66859 26.2062 9.85817 26.1333 10.0332Z"
                  fill="#FDFDFC"
                />
              </svg>
            </Link>
            <Link to="/">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.0834 23.6103C32.0834 28.9186 28.9188 32.0832 23.6105 32.0832H21.8751C21.073 32.0832 20.4167 31.4269 20.4167 30.6248V22.2103C20.4167 21.8165 20.7376 21.4811 21.1313 21.4811L23.698 21.4374C23.9022 21.4228 24.0772 21.2769 24.1209 21.0728L24.6314 18.2874C24.6751 18.0249 24.4709 17.7769 24.1938 17.7769L21.0876 17.8207C20.6792 17.8207 20.3584 17.4999 20.3439 17.1061L20.2855 13.5332C20.2855 13.2998 20.4751 13.0957 20.723 13.0957L24.223 13.0373C24.4709 13.0373 24.6605 12.8478 24.6605 12.5999L24.6022 9.09982C24.6022 8.85191 24.4126 8.66234 24.1647 8.66234L20.2272 8.72069C17.8063 8.76444 15.8814 10.7478 15.9251 13.1686L15.998 17.179C16.0126 17.5873 15.6918 17.9082 15.2834 17.9228L13.5334 17.9519C13.2855 17.9519 13.0959 18.1415 13.0959 18.3894L13.1397 21.1603C13.1397 21.4082 13.3292 21.5978 13.5772 21.5978L15.3272 21.5686C15.7355 21.5686 16.0563 21.8894 16.0709 22.2832L16.2021 30.5957C16.2167 31.4124 15.5605 32.0832 14.7438 32.0832H11.3897C6.08133 32.0832 2.91675 28.9186 2.91675 23.5957V11.3894C2.91675 6.08108 6.08133 2.9165 11.3897 2.9165H23.6105C28.9188 2.9165 32.0834 6.08108 32.0834 11.3894V23.6103Z"
                  fill="#FDFDFC"
                />
              </svg>
            </Link>
            <Link to="/">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.7917 5.8335H10.2084C5.83342 5.8335 2.91675 8.75016 2.91675 13.1252V21.8752C2.91675 26.2502 5.83342 29.1668 10.2084 29.1668H24.7917C29.1668 29.1668 32.0834 26.2502 32.0834 21.8752V13.1252C32.0834 8.75016 29.1668 5.8335 24.7917 5.8335ZM20.2564 19.0022L16.6542 21.1606C15.1959 22.0356 14 21.3648 14 19.6585V15.3273C14 13.621 15.1959 12.9502 16.6542 13.8252L20.2564 15.9835C21.6418 16.8293 21.6418 18.171 20.2564 19.0022Z"
                  fill="#FDFDFC"
                />
              </svg>
            </Link>
            <Link to="/">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.0542 16.6396C31.5583 8.18124 23.8729 1.66251 15.0208 3.12084C8.92501 4.12709 4.0396 9.07081 3.09169 15.1666C2.53752 18.6958 3.26672 22.0354 4.8563 24.7917L3.55836 29.6187C3.2667 30.7125 4.27292 31.7041 5.35209 31.3979L10.1063 30.0854C12.2646 31.3542 14.7875 32.0833 17.4854 32.0833C25.7104 32.0833 32.5354 24.8354 32.0542 16.6396ZM24.6167 22.925C24.4854 23.1875 24.325 23.4354 24.1208 23.6687C23.7562 24.0625 23.3625 24.3542 22.925 24.5292C22.4875 24.7187 22.0063 24.8062 21.4958 24.8062C20.7521 24.8062 19.95 24.6313 19.1188 24.2667C18.2729 23.9021 17.4417 23.4208 16.6105 22.8229C15.7646 22.2104 14.9771 21.525 14.2188 20.7812C13.4604 20.0229 12.7896 19.2208 12.1771 18.3895C11.5792 17.5583 11.0979 16.7271 10.7479 15.8958C10.3979 15.0646 10.223 14.2625 10.223 13.5042C10.223 13.0083 10.3104 12.5271 10.4854 12.0896C10.6604 11.6375 10.9376 11.2292 11.3313 10.8646C11.798 10.3979 12.3084 10.1792 12.8479 10.1792C13.0521 10.1792 13.2562 10.2229 13.4458 10.3104C13.6354 10.3979 13.8104 10.5292 13.9417 10.7187L15.6333 13.1104C15.7646 13.3 15.8667 13.4604 15.925 13.6208C15.9979 13.7812 16.0271 13.9271 16.0271 14.0729C16.0271 14.2479 15.9688 14.4229 15.8667 14.5979C15.7646 14.7729 15.6333 14.9479 15.4583 15.1229L14.9042 15.7062C14.8167 15.7937 14.7875 15.8812 14.7875 15.9979C14.7875 16.0562 14.8021 16.1146 14.8167 16.1729C14.8458 16.2312 14.8605 16.275 14.875 16.3187C15.0063 16.5667 15.2396 16.8729 15.5604 17.252C15.8958 17.6312 16.2459 18.025 16.6251 18.4041C17.0188 18.7979 17.398 19.1479 17.7917 19.4833C18.1709 19.8041 18.4917 20.0229 18.7396 20.1542C18.7833 20.1687 18.8271 20.1979 18.8709 20.2125C18.9292 20.2416 18.9875 20.2417 19.0605 20.2417C19.1917 20.2417 19.2792 20.1979 19.3667 20.1104L19.9208 19.5562C20.1104 19.3667 20.2855 19.2354 20.4459 19.1479C20.6209 19.0458 20.7813 18.9875 20.9709 18.9875C21.1167 18.9875 21.2625 19.0166 21.4229 19.0896C21.5834 19.1625 21.7583 19.25 21.9333 19.3812L24.3542 21.1021C24.5438 21.2333 24.675 21.3937 24.7625 21.5687C24.8354 21.7583 24.8792 21.9333 24.8792 22.1375C24.7917 22.3854 24.7334 22.6625 24.6167 22.925Z"
                  fill="#FDFDFC"
                />
              </svg>
            </Link>
          </div>
        </div>
        <h1 className="font-garamond text-white text-lg md:text-xl">
          Laere.id All Right Reserved
        </h1>
      </div>
    </>
  );
};

export default Footer;
