import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartOpen, showCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(300000);

  // Function untuk menambah jumlah produk di keranjang
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    setPrice((prevPrice) => prevPrice + 300000);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setPrice((prevPrice) => prevPrice - 300000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <>
      {cartOpen && (
        <div className={`cart ${cartOpen ? 'cart-open' : ''}`}>
          <div className={`overlay-cart ${cartOpen ? 'overlay-open' : ''}`} onClick={showCart}>
            <div className="absolute inset-0 bg-[#333333] opacity-30"></div>
          </div>
          <div className={`cart-content ${cartOpen ? 'cart-content-open' : ''}`}>
            <div className="flex-1 flex flex-col py-10 overflow-y-auto">
              <div className="flex items-center justify-between w-full px-10">
                <h2 className="font-garamond text-2xl font-semibold">Shopping Cart</h2>
                <button onClick={showCart}>
                  <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4944 8.28577L7.49438 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.49438 8.28577L22.4944 23.2858" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {/* Cart items */}
              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              <div className="mt-5 px-8 space-y-2">
                {quantity > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src="/dummy-product.png" alt="Product" className="w-[5rem] h-[5rem] mr-4" />
                      <div className="flex flex-col">
                        <h4 className="text-lg font-overpass mb-2">Product Name</h4>
                        <div className="flex items-center mt-1">
                          <button className="quantity-btn border border-[#333333] rounded-sm px-3 py-1 font-overpass" onClick={decreaseQuantity}>
                            -
                          </button>
                          <p className="text-lg text-[#333333] mx-3 font-overpass">Qty: {quantity}</p>
                          <button className="quantity-btn border border-[#333333] rounded-sm px-3 py-1 font-overpass" onClick={increaseQuantity}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-overpass">{formatPrice(price)}</p>
                  </div>
                )}
                {quantity === 0 && <p className="text-lg text-gray-600 font-overpass">Your cart is currently empty.</p>}
              </div>
              <div className="mt-5 border-t border-gray-200 mx-8"></div>
              {quantity > 0 && (
                <div className="mt-5 px-8">
                  <Link to="/checkout" className="block w-full bg-[#333333] text-white py-3 text-center font-semibold rounded font-overpass">
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
