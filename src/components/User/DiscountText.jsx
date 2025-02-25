import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DiscountText = () => {
  const items = [
    "Branded Apparel",
    "Sneakers & Footwear",
    "Accessories & Collectible Items",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-black text-white h-8"
      style={{ marginBottom: "64px" }}
    >
      <div className="max-w-[115rem] h-full mx-auto px-5 md:px-2">
        <div className="relative h-full overflow-hidden flex justify-center items-center">
          <span className="text-sm font-garamond">Discount 10% OFF - </span>
          <div className="relative inline-block h-full overflow-hidden ml-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="absolute left-0 text-sm font-garamond whitespace-nowrap"
              >
                {items[currentIndex]}
              </motion.span>
            </AnimatePresence>
            {/* Placeholder untuk menjaga ruang */}
            <span className="invisible text-sm font-garamond whitespace-nowrap">
              {items[currentIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountText;
