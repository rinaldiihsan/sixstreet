import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <img src="/hero1.png" alt="Hero" className="w-full" style={{ height: windowHeight }} />
        <div className="absolute bottom-[10%] left-0 text-white px-10 flex flex-col items-start">
          <div className="max-w-[40rem] mb-2">
            <h1 className="uppercase font-overpass tracking-[10px] font-extrabold text-3xl">sixstreet apparel</h1>
            <p className="capitalize font-garamond font-medium text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-2xl border border-white px-12 py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="relative mb-10">
        <img src="/hero2.png" alt="Hero2" className="w-full" style={{ height: windowHeight }} />
        <div className="absolute bottom-[10%] right-0 text-white px-10 flex flex-col items-end">
          <div className="max-w-[40rem] mb-2 ">
            <h1 className="uppercase font-overpass tracking-[10px] font-extrabold text-3xl text-right">sixstreet apparel</h1>
            <p className="capitalize font-garamond font-medium text-2xl text-right">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-2xl border border-white px-12 py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="max-w-[115rem] mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10">
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/dummy-product.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SIXSTREET Tee FAM Black</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
      </div>
      <div className="relative mb-10">
        <img src="/hero3.png" alt="Hero" className="w-full" style={{ height: windowHeight }} />
        <div className="absolute bottom-[10%] left-0 text-white px-10 flex flex-col items-start">
          <div className="max-w-[40rem] mb-2">
            <h1 className="uppercase font-overpass tracking-[10px] font-extrabold text-3xl">sixstreet sneakers</h1>
            <p className="capitalize font-garamond font-medium text-2xl">Lorem ipsum dolor sit amet consectetur. Vehicula ac bibendum elit varius auctor posuere.</p>
          </div>
          <Link className="capitalize font-garamond font-medium text-2xl border border-white px-12 py-4 hover:bg-white hover:text-[#333333] transition-colors duration-300" to="/">
            Buy Now
          </Link>
        </div>
      </div>
      <div className="max-w-[115rem] mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10">
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/product/accessories/wallet1.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SAINT LAURENT YSL CC HOLDER MILO</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/product/accessories/brecellet1.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">TOM WOOD DEAN BRACELET DUO 7.0</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/product/accessories/wallet1.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">SAINT LAURENT YSL CC HOLDER MILO</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 items-center">
          <Link to="/">
            <img src="/product/accessories/brecellet1.png" alt="dummy" className="w-[27rem]" />
          </Link>
          <div className="flex flex-col text-center gap-y-2">
            <h2 className="uppercase font-overpass font-extrabold text-xl">TOM WOOD DEAN BRACELET DUO 7.0</h2>
            <h2 className="uppercase font-overpass text-xl">Rp. 385.000</h2>
          </div>
        </div>
      </div>
      <div className="max-w-[115rem] mx-auto flex flex-col gap-y-8 md:flex-row md:flex-wrap md:justify-between mb-10">
        <div className="flex flex-col gap-y-5r">
          <Link to="/" className="mb-5">
            <img src="/dummy-news.png" alt="dummy" className="w-[37rem]" />
          </Link>
          <div className="flex flex-col gap-y-2">
            <h2 className="capitalize font-garamond font-extrabold text-xl max-w-[37rem]">SixStreet Unveils Latest Collection: Cutting-edge Fashion Pieces Hit the Runway</h2>
            <Link to="/" className="self-start font-garamond py-2 px-10 border border-[#333333] text-xl">
              View Blog
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-y-5r">
          <Link to="/" className="mb-5">
            <img src="/dummy-news.png" alt="dummy" className="w-[37rem]" />
          </Link>
          <div className="flex flex-col gap-y-2">
            <h2 className="capitalize font-garamond font-extrabold text-xl max-w-[37rem]">SixStreet Unveils Latest Collection: Cutting-edge Fashion Pieces Hit the Runway</h2>
            <Link to="/" className="self-start font-garamond py-2 px-10 border border-[#333333] text-xl">
              View Blog
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-y-5r">
          <Link to="/" className="mb-5">
            <img src="/dummy-news.png" alt="dummy" className="w-[37rem]" />
          </Link>
          <div className="flex flex-col gap-y-2">
            <h2 className="capitalize font-garamond font-extrabold text-xl max-w-[37rem]">SixStreet Unveils Latest Collection: Cutting-edge Fashion Pieces Hit the Runway</h2>
            <Link to="/" className="self-start font-garamond py-2 px-10 border border-[#333333] text-xl">
              View Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
