import React from "react";
import { motion } from "framer-motion";

function SidebarFilterBrand({
  isSidebarOpen,
  toggleSidebar,
  handleCategoryChange,
  handleSizeChange,
  selectedCategory,
  selectedSizes,
}) {
  const categories = [
    { id: "BAGS", label: "Bags" },
    { id: "HATS", label: "Hats" },
    { id: "HOODIE", label: "Hoodie" },
    { id: "SOCKS", label: "Socks" },
    { id: "SHIRTS", label: "Shirts" },
    { id: "T_SHIRTS", label: "T-Shirts" },
  ];

  const sizes = [
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
    { id: "XL", label: "XL" },
  ];

  const FilterSection = ({ title, options, onChange }) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium font-overpass">{title}</h3>
      <ul className="mt-3 space-y-2">
        {options.map((option) => (
          <li key={option.id} className="flex items-center gap-x-2">
            <input
              type="checkbox"
              className="border border-[#E5E5E5] focus:outline-none focus:shadow-outline focus:border-[#E5E5E5] focus:ring-0"
              name={option.id.toLowerCase()}
              id={option.id}
              value={option.label}
              onChange={onChange}
              checked={
                title === "Category"
                  ? selectedCategory.includes(option.label)
                  : selectedSizes.includes(option.label)
              }
            />
            <label className="font-overpass" htmlFor={option.id}>
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div className="w-[15%] border border-[#E5E5E5] flex-col px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto hidden md:flex md:py-5">
        <FilterSection
          title="Category"
          options={categories}
          onChange={handleCategoryChange}
        />
      </div>

      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-white z-[999] flex flex-col w-3/4 h-full px-6 py-6 overflow-y-auto md:hidden overflow-x-hidden"
          initial="closed"
          animate={isSidebarOpen ? "open" : "closed"}
          variants={{
            open: { x: 0, opacity: 1 },
            closed: { x: "-100%", opacity: 0 },
          }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <button
            onClick={toggleSidebar}
            className="self-end text-xl font-bold mb-4"
          >
            ×
          </button>
          <FilterSection
            title="Category"
            options={categories}
            onChange={handleCategoryChange}
          />
        </motion.div>
      )}
    </>
  );
}

export default SidebarFilterBrand;
