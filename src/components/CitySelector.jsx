import React, { useState, useRef, useEffect } from "react";

const CitySelector = ({ cities, selectedCity, onCitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filtered = cities.filter((city) =>
      `${city.type} ${city.city_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (cityId) => {
    onCitySelect(cityId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getSelectedCityName = () => {
    const city = cities.find((c) => c.city_id === selectedCity);
    return city ? `${city.type} ${city.city_name}` : "";
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-between relative"
      ref={dropdownRef}
    >
      <p className="font-overpass font-semibold">Kota/Kabupaten Tujuan</p>
      <div className="relative w-full md:w-[300px]">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer font-overpass p-2 border rounded flex justify-between items-center bg-white"
        >
          <span className="truncate">
            {selectedCity ? getSelectedCityName() : "Pilih kota/kabupaten"}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kota..."
                className="w-full p-2 border rounded font-overpass focus:outline-none focus:border-[#333333]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="overflow-y-auto max-h-[200px]">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.city_id}
                    onClick={() => handleCitySelect(city.city_id)}
                    className={`p-2 hover:bg-gray-100 cursor-pointer font-overpass
                      ${selectedCity === city.city_id ? "bg-gray-100" : ""}
                    `}
                  >
                    {city.type} {city.city_name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 font-overpass text-center">
                  Tidak ada kota yang ditemukan
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySelector;
