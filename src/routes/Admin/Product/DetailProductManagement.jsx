import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ChevronLeft, Package, Tag, DollarSign, Users, Image, Edit, Trash2, AlertCircle, CheckCircle, XCircle, Loader, Layers, Calendar, Hash, Info } from 'lucide-react';

const DetailProductManagement = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState(null);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${backendUrl}/products/group/${group_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setProduct(response.data.data);

        // Fetch category info from database
        await fetchCategoryInfo(accessToken);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryInfo = async (accessToken) => {
    try {
      // Get category info from local database
      const response = await axios.get(`${backendUrl}/products?item_group_id=${group_id}&limit=1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success && response.data.data.length > 0) {
        const productData = response.data.data[0];
        setCategoryInfo({
          category_id: productData.category_id,
          category_name: productData.category_name || 'Uncategorized',
          category_parent_id: productData.category_parent_id,
          created_at: productData.created_at,
          updated_at: productData.updated_at,
        });
      }
    } catch (error) {
      console.error('Error fetching category info:', error);
      setCategoryInfo({ category_name: 'Unknown' });
    }
  };

  useEffect(() => {
    if (group_id) {
      fetchProductDetail();
    }
  }, [group_id]);

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

  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        text: 'Out of Stock',
        icon: XCircle,
        class: 'bg-red-100 text-red-800 border-red-200',
      };
    if (stock <= 5)
      return {
        text: 'Low Stock',
        icon: AlertCircle,
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      };
    return {
      text: 'In Stock',
      icon: CheckCircle,
      class: 'bg-green-100 text-green-800 border-green-200',
    };
  };

  const handleEditProduct = async () => {
    try {
      if (!product.variations || product.variations.length === 0) {
        alert('No variants available to edit');
        return;
      }

      const firstVariantItemId = product.variations[0].item_id;
      const accessToken = Cookies.get('accessToken');

      // Find product in database by id_jubelio
      const response = await axios.get(`${backendUrl}/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        const foundProduct = response.data.data.find((p) => p.id_jubelio === firstVariantItemId.toString());
        if (foundProduct) {
          navigate(`/product-management/edit-product/${foundProduct.id}`);
        } else {
          alert('Product not found in database');
        }
      }
    } catch (error) {
      console.error('Error finding product:', error);
      alert('Failed to find product for editing');
    }
  };

  const handleDeleteProduct = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.item_group_name}"? This will delete all variants.`);

    if (!confirmed) return;

    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) return;

      // Get all products to find database IDs
      const productsResponse = await axios.get(`${backendUrl}/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (productsResponse.data.success) {
        const allProducts = productsResponse.data.data;

        // Find all variants of this product group
        const variantsToDelete = product.variations
          .map((variant) => {
            const foundProduct = allProducts.find((p) => p.id_jubelio === variant.item_id.toString());
            return foundProduct ? foundProduct.id : null;
          })
          .filter((id) => id !== null);

        // Delete all variants
        for (const productId of variantsToDelete) {
          await axios.delete(`${backendUrl}/products/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        alert('Product and all variants deleted successfully');
        navigate('/product-management');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
          <span className="ml-2 text-lg font-overpass text-[#666666]">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-lg font-overpass text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <span className="text-lg font-overpass text-[#666666]">Product not found</span>
        </div>
      </div>
    );
  }

  const totalStock = product.variations?.reduce((sum, variant) => sum + variant.available_qty, 0) || 0;
  const totalVariants = product.variations?.length || 0;
  const stockStatus = getStockStatus(totalStock);
  const StockIcon = stockStatus.icon;

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/product-management')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-overpass">Back to Products</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="font-overpass text-[#333333] font-semibold text-2xl">Product Details</h1>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleEditProduct} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 font-overpass">
            <Edit className="h-4 w-4" />
            <span>Edit Product</span>
          </button>

          <button onClick={handleDeleteProduct} className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 font-overpass">
            <Trash2 className="h-4 w-4" />
            <span>Delete Product</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <h2 className="font-overpass text-xl font-semibold text-[#333333] flex items-center">
            <Image className="h-5 w-5 mr-2" />
            Product Images
          </h2>

          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img src={`${backendUrl}/${product.images[selectedImage]?.url}`} alt={product.item_group_name} className="w-full h-full object-cover" onError={handleImageError} />
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <img src={`${backendUrl}/${image.url}`} alt={`${product.item_group_name} ${index + 1}`} className="w-full h-full object-cover" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 font-overpass">No images available</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="font-overpass text-xl font-semibold text-[#333333] mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <p className="text-lg font-overpass text-[#333333]">{product.item_group_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group ID</label>
                  <p className="font-mono text-sm bg-gray-100 px-2 py-1">{group_id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 text-sm font-semibold">{categoryInfo?.category_name || 'Loading...'}</span>
                    {categoryInfo?.category_id && <span className="text-xs text-gray-500">ID: {categoryInfo.category_id}</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="bg-gray-50 p-3 border max-h-40 overflow-y-auto">
                  <p className="text-sm font-overpass text-gray-700 whitespace-pre-line">{product.description || 'No description available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Stock</p>
                  <p className="text-2xl font-bold text-[#333333]">{totalStock}</p>
                </div>
                <StockIcon className={`h-8 w-8 ${stockStatus.class.includes('red') ? 'text-red-500' : stockStatus.class.includes('yellow') ? 'text-yellow-500' : 'text-green-500'}`} />
              </div>
              <div className={`mt-2 inline-flex items-center px-2 py-1 text-xs font-medium border ${stockStatus.class}`}>{stockStatus.text}</div>
            </div>

            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Variants</p>
                  <p className="text-2xl font-bold text-[#333333]">{totalVariants}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-xs text-gray-500">{product.available_sizes?.length || 0} sizes available</div>
            </div>
          </div>

          {/* Additional Info Cards */}
          {categoryInfo && (
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Layers className="h-5 w-5 text-purple-500" />
                  <h3 className="font-overpass font-medium text-[#333333]">Category Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{categoryInfo.category_name}</span>
                  </div>
                  {categoryInfo.category_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category ID:</span>
                      <span className="font-mono text-xs">{categoryInfo.category_id}</span>
                    </div>
                  )}
                  {categoryInfo.category_parent_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parent ID:</span>
                      <span className="font-mono text-xs">{categoryInfo.category_parent_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {categoryInfo && (categoryInfo.created_at || categoryInfo.updated_at) && (
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-overpass font-medium text-[#333333]">Timeline</h3>
              </div>
              <div className="space-y-2 text-sm">
                {categoryInfo.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(categoryInfo.created_at)}</span>
                  </div>
                )}
                {categoryInfo.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{formatDate(categoryInfo.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size & Stock Information */}
      <div className="mt-8">
        <h2 className="font-overpass text-xl font-semibold text-[#333333] mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Size & Stock Details
        </h2>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.product_skus?.map((sku, index) => {
                  const sizeStockStatus = getStockStatus(sku.end_qty);
                  const SizeStockIcon = sizeStockStatus.icon;

                  return (
                    <tr key={sku.item_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{sku.item_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="bg-gray-100 px-2 py-1 text-sm font-mono">{sku.variation_values?.[0]?.value || 'One Size'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(sku.sell_price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{sku.end_qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${sizeStockStatus.class}`}>
                          <SizeStockIcon className="h-3 w-3 mr-1" />
                          {sizeStockStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{sku.item_code || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Sizes Summary */}
        {product.available_sizes && product.available_sizes.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200">
            <h3 className="font-overpass font-medium text-[#333333] mb-2">Available Sizes:</h3>
            <div className="flex flex-wrap gap-2">
              {product.available_sizes.map((size) => {
                const quantity = product.available_quantities?.[size] || 0;
                const sizeStatus = getStockStatus(quantity);

                return (
                  <span key={size} className={`inline-flex items-center px-3 py-1 text-sm font-medium border ${sizeStatus.class}`}>
                    {size} ({quantity})
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Information */}
      {product.product_skus && product.product_skus.length > 0 && (
        <div className="mt-8 font-overpass">
          <h2 className="font-overpass text-xl font-semibold text-[#333333] mb-4 flex items-center">Pricing Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Base Price</p>
              <p className="text-xl font-bold text-[#333333]">{formatCurrency(product.product_skus[0]?.sell_price || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">All variants have same price</p>
            </div>

            <div className="bg-white border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Total Value</p>
              <p className="text-xl font-bold text-[#333333]">{formatCurrency((product.product_skus[0]?.sell_price || 0) * totalStock)}</p>
              <p className="text-xs text-gray-500 mt-1">Based on current stock</p>
            </div>

            <div className="bg-white border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Avg. Stock per Size</p>
              <p className="text-xl font-bold text-[#333333]">{totalVariants > 0 ? Math.round(totalStock / totalVariants) : 0}</p>
              <p className="text-xs text-gray-500 mt-1">Units per variant</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Info Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div className="text-sm text-blue-700 font-overpass">
            <p className="font-medium mb-1">Product Management Information:</p>
            <ul className="space-y-1 text-xs">
              <li>• Product data is synchronized from Jubelio API with real-time stock information</li>
              <li>• Category information is fetched from Jubelio categories database</li>
              <li>• Images are downloaded and converted to WebP format for optimization</li>
              <li>• Stock levels and prices are updated during sync operations</li>
              <li>• Use "Edit Product" to modify descriptions, prices, and images</li>
              <li>• Product name and stock quantities are managed through Jubelio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProductManagement;
