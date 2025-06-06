import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Filter, X } from 'lucide-react';

const ProductManagement = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sorting states
  const [sortField, setSortField] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      const response = await axios.get(`${backendUrl}/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      const response = await axios.get(`${backendUrl}/products/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  const handleEdit = (product) => {
    if (product.variants && product.variants.length > 0) {
      const firstVariantId = product.variants[0].id;
      navigate(`/product-management/edit-product/${firstVariantId}`);
    } else {
      alert('No variants found for this product');
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus produk "${product.base_name}"?`);

    if (!confirmed) return;

    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      for (const variant of product.variants) {
        await axios.delete(`${backendUrl}/products/${variant.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      console.log('Product and all variants deleted successfully');
      await fetchProducts();

      const newTotalPages = Math.ceil((filteredProducts.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk');
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/product-management/detail-product/${product.item_group_id}`);
  };

  // Enhanced sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('all');
    setSortField('updated_at');
    setSortDirection('desc');
  };

  // Group products by base name with category info
  const groupedProducts = products.reduce((acc, product) => {
    const baseName = product.nama_produk.split(' - ')[0].trim();

    if (!acc[baseName]) {
      acc[baseName] = {
        base_name: baseName,
        item_group_id: product.item_group_id,
        deskripsi: product.deskripsi,
        thumbnail: product.thumbnail,
        images_folder: product.images_folder,
        created_at: product.created_at,
        updated_at: product.updated_at,
        category_name: product.category_name || 'Uncategorized',
        category_id: product.category_id,
        variants: [],
        total_stock: 0,
        price_range: { min: null, max: null },
        sizes: [],
      };
    }

    const variant = {
      id: product.id,
      id_jubelio: product.id_jubelio,
      full_name: product.nama_produk,
      harga: parseFloat(product.harga),
      stok: product.stok,
      size: product.nama_produk.split(' - ')[1] || 'One Size',
    };

    acc[baseName].variants.push(variant);
    acc[baseName].total_stock += product.stok;
    acc[baseName].sizes.push(variant.size);

    if (acc[baseName].price_range.min === null || variant.harga < acc[baseName].price_range.min) {
      acc[baseName].price_range.min = variant.harga;
    }
    if (acc[baseName].price_range.max === null || variant.harga > acc[baseName].price_range.max) {
      acc[baseName].price_range.max = variant.harga;
    }

    return acc;
  }, {});

  const groupedArray = Object.values(groupedProducts).map((group) => ({
    ...group,
    sizes: [...new Set(group.sizes)].sort(),
    variants_count: group.variants.length,
    average_price: group.variants.reduce((sum, v) => sum + v.harga, 0) / group.variants.length,
  }));

  // Enhanced filtering with category and stock
  const filteredProducts = groupedArray.filter((product) => {
    const searchLower = searchTerm.toLowerCase();

    // Search filter (name, category, description, group ID)
    const matchesSearch =
      !searchTerm ||
      product.base_name?.toLowerCase().includes(searchLower) ||
      product.category_name?.toLowerCase().includes(searchLower) ||
      product.item_group_id?.toLowerCase().includes(searchLower) ||
      product.deskripsi?.toLowerCase().includes(searchLower);

    // Category filter
    const matchesCategory = !categoryFilter || product.category_name === categoryFilter;

    // Stock filter
    const matchesStock =
      stockFilter === 'all' || (stockFilter === 'in_stock' && product.total_stock > 0) || (stockFilter === 'low_stock' && product.total_stock > 0 && product.total_stock <= 5) || (stockFilter === 'out_of_stock' && product.total_stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Enhanced sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (sortField === 'updated_at' || sortField === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortField === 'average_price' || sortField === 'total_stock' || sortField === 'variants_count') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, sortField, sortDirection]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  const getPriceDisplay = (priceRange) => {
    if (priceRange.min === priceRange.max) {
      return formatCurrency(priceRange.min);
    }
    return `${formatCurrency(priceRange.min)} - ${formatCurrency(priceRange.max)}`;
  };

  if (loading) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-overpass text-[#666666]">Loading products...</div>
        </div>
      </div>
    );
  }

  const activeFiltersCount = [searchTerm, categoryFilter, stockFilter !== 'all'].filter(Boolean).length;

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">Product Management</h1>

      {/* Enhanced Search and Filters */}
      <div className="mt-10 w-full space-y-4">
        {/* Search Bar and Main Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search by name, category, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block md:w-[25rem] pl-4 pr-10 py-3 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 sm:text-[1rem] font-overpass"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.66659 14C11.1644 14 13.9999 11.1644 13.9999 7.66665C13.9999 4.16884 11.1644 1.33331 7.66659 1.33331C4.16878 1.33331 1.33325 4.16884 1.33325 7.66665C1.33325 11.1644 4.16878 14 7.66659 14Z"
                  stroke="#AAAAAA"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M14.6666 14.6666L13.3333 13.3333" stroke="#AAAAAA" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 border transition-colors duration-300 font-overpass ${
                showFilters || activeFiltersCount > 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>}
            </button>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 transition-colors duration-300 font-overpass">
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <button onClick={() => navigate('/product-management/sync')} className="px-4 py-3 bg-[#333333] hover:bg-[#555555] text-white transition-colors duration-300 font-overpass">
            Sync from Jubelio
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 font-overpass">
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_name}>
                      {category.category_name} ({category.product_count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 font-overpass">
                  <option value="all">All Stock Levels</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock (≤5)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={`${sortField}_${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('_');
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-gray-300 focus:border-gray-300 font-overpass"
                >
                  <option value="updated_at_desc">Last Updated (Newest)</option>
                  <option value="updated_at_asc">Last Updated (Oldest)</option>
                  <option value="base_name_asc">Name (A-Z)</option>
                  <option value="base_name_desc">Name (Z-A)</option>
                  <option value="category_name_asc">Category (A-Z)</option>
                  <option value="total_stock_desc">Stock (High to Low)</option>
                  <option value="total_stock_asc">Stock (Low to High)</option>
                  <option value="average_price_desc">Price (High to Low)</option>
                  <option value="average_price_asc">Price (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data info */}
      <div className="mt-5 w-full flex justify-between items-center text-sm font-overpass text-[#666666]">
        <div>
          Menampilkan {startIndex + 1} - {Math.min(endIndex, sortedProducts.length)} dari {sortedProducts.length} produk
          {(searchTerm || categoryFilter || stockFilter !== 'all') && ` (filtered from ${groupedArray.length} total)`}
        </div>
        <div>
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-center font-overpass text-[#333333] text-lg">
              <th className="py-3 px-4 bg-gray-100">Gambar</th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('base_name')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Nama Produk</span>
                  {getSortIcon('base_name')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('category_name')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Category</span>
                  {getSortIcon('category_name')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">Group ID</th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('variants_count')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Variants</span>
                  {getSortIcon('variants_count')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('average_price')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Price Range</span>
                  {getSortIcon('average_price')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('total_stock')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Total Stock</span>
                  {getSortIcon('total_stock')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">Status</th>
              <th className="py-3 px-4 bg-gray-100">
                <button onClick={() => handleSort('updated_at')} className="flex items-center justify-center space-x-1 w-full hover:text-blue-600 transition-colors">
                  <span>Last Updated</span>
                  {getSortIcon('updated_at')}
                </button>
              </th>
              <th className="py-3 px-4 bg-gray-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-center font-overpass text-[#333333]">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const stockStatus = getStockStatus(product.total_stock);
                return (
                  <tr key={product.item_group_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {product.thumbnail ? (
                        <img src={`${backendUrl}/${product.thumbnail}`} alt={product.base_name} className="w-16 h-16 object-cover mx-auto" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 mx-auto flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-left max-w-xs">
                      <div className="font-medium">{product.base_name}</div>
                      {product.deskripsi && <div className="text-sm text-gray-500 truncate mt-1">{product.deskripsi.substring(0, 50)}...</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold">{product.category_name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{product.item_group_id}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold">{product.variants_count} variants</span>
                    </td>
                    <td className="py-3 px-4 font-medium">{getPriceDisplay(product.price_range)}</td>
                    <td className="py-3 px-4 font-bold text-lg">{product.total_stock}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold ${stockStatus.class}`}>{stockStatus.text}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(product.updated_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center items-center flex-wrap">
                        <button onClick={() => handleViewDetail(product)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 font-overpass text-sm">
                          View
                        </button>
                        <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-[#333333] hover:bg-[#555555] text-white transition-colors duration-300 font-overpass text-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 font-overpass text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-gray-500">
                  {searchTerm || categoryFilter || stockFilter !== 'all' ? 'Tidak ada produk yang sesuai dengan filter' : 'Tidak ada produk'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-overpass ${
              currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
            } transition-colors duration-300`}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
              disabled={pageNumber === '...'}
              className={`px-3 py-2 text-sm font-overpass ${
                pageNumber === currentPage ? 'bg-[#333333] text-white' : pageNumber === '...' ? 'bg-white text-gray-400 cursor-default' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
              } transition-colors duration-300`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-overpass ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-[#333333] hover:bg-[#333333] hover:text-white'
            } transition-colors duration-300`}
          >
            Next
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 text-center text-sm font-overpass text-[#666666]">
          Total {sortedProducts.length} produk, {totalPages} halaman
        </div>
      )}

      {/* Enhanced Summary stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-[#333333]">{groupedArray.length}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-[#333333]">{groupedArray.reduce((sum, p) => sum + p.variants_count, 0)}</div>
          <div className="text-sm text-gray-600">Total Variants</div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-[#333333]">{groupedArray.reduce((sum, p) => sum + p.total_stock, 0)}</div>
          <div className="text-sm text-gray-600">Total Stock</div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-[#333333]">{groupedArray.filter((p) => p.total_stock === 0).length}</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-[#333333]">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchTerm || categoryFilter || stockFilter !== 'all') && (
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-800">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold">Search: "{searchTerm}"</span>}
                {categoryFilter && <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold">Category: {categoryFilter}</span>}
                {stockFilter !== 'all' && <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold">Stock: {stockFilter.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>}
              </div>
            </div>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
