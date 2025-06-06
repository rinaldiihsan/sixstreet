import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchBar = ({ onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products/categories`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchProducts = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Try to get all products first (more reliable)
      const response = await axios.get(`${backendUrl}/products`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const allProducts = response.data.data || [];

        // Filter products locally
        const filteredProducts = allProducts.filter((product) => product.nama_produk?.toLowerCase().includes(term.toLowerCase()) && product.stok > 0);

        // Group by item_group_id to avoid duplicates
        const groupedProducts = {};

        filteredProducts.forEach((product) => {
          const groupId = product.item_group_id;
          if (!groupedProducts[groupId]) {
            groupedProducts[groupId] = {
              id: product.id,
              name: product.nama_produk.split(' - ')[0].trim(), // Get base name without size
              price: parseFloat(product.harga),
              groupId: product.item_group_id,
              categoryId: product.category_id,
              categoryName: product.category_name,
              thumbnail: product.thumbnail ? `${backendUrl}/${product.thumbnail}` : '/dummy-product.png',
            };
          }
        });

        // Convert to array - no limit, show all results
        const searchResults = Object.values(groupedProducts);
        setSearchResults(searchResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm.toLowerCase());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (item) => {
    setSearchTerm('');
    setSearchResults([]);
    if (onResultClick) {
      onResultClick(item);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (categoryId, categoryName) => {
    // If we have category name from the product data, use it
    if (categoryName) {
      return categoryName;
    }

    // Otherwise, try to find it in the categories array
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : '';
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/dummy-product.png') {
      return '/dummy-product.png';
    }

    // Check if it's already a full URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a relative path, prepend backend URL
    return `${backendUrl}/${imageUrl}`;
  };

  return (
    <div className="mt-5 px-8 space-y-1">
      <div className="relative">
        <input type="text" placeholder="Search products..." value={searchTerm} onChange={handleSearch} className="block w-full pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass" />
        {isLoading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.66659 14C11.1644 14 13.9999 11.1644 13.9999 7.66665C13.9999 4.16884 11.1644 1.33331 7.66659 1.33331C4.16878 1.33331 1.33325 4.16884 1.33325 7.66665C1.33325 11.1644 4.16878 14 7.66659 14Z"
              stroke="#AAAAAA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M14.6666 14.6666L13.3333 13.3333" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Display search results */}
      {searchTerm && (
        <div className="mt-2 border border-gray-200 shadow-sm bg-white max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              {/* Results header with count */}
              <div className="px-4 py-2 text-xs text-gray-600 bg-gray-50 border-b border-gray-200 font-medium">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found for "{searchTerm}"
              </div>

              {searchResults.map((item, index) => (
                <Link key={index} to={`/product-detail/${item.groupId}`} className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0" onClick={() => handleResultClick(item)}>
                  <img
                    src={getImageUrl(item.thumbnail)}
                    alt={item.name}
                    className="w-12 h-12 object-cover mr-3 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/dummy-product.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{getCategoryName(item.categoryId, item.categoryName)}</p>
                    <p className="text-sm font-semibold text-gray-700">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : searchTerm.length >= 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">No products found for "{searchTerm}"</div>
          ) : searchTerm.length > 0 && searchTerm.length < 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">Type at least 2 characters to search</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
