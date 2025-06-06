import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ChevronLeft, Save, Upload, X, AlertCircle, CheckCircle, Loader, Package, DollarSign, FileText, Image, Plus, Trash2, Eye, Move, Layers } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    deskripsi: '',
    harga: '',
    hargaFormatted: '', // For display with separators
  });

  // Images state
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedViewImage, setSelectedViewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${backendUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        const productData = response.data.data;
        setProduct(productData);

        const hargaValue = productData.harga || '';
        setFormData({
          deskripsi: productData.deskripsi || '',
          harga: hargaValue,
          hargaFormatted: hargaValue ? formatNumberWithSeparator(hargaValue) : '',
        });

        // Set existing images
        if (productData.images && Array.isArray(productData.images)) {
          setExistingImages(productData.images);
        } else if (productData.thumbnail) {
          // Fallback untuk single thumbnail
          setExistingImages([
            {
              id: 'thumbnail',
              url: productData.thumbnail,
              thumbnail: productData.thumbnail,
              index: 1,
            },
          ]);
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Format number with thousand separators
  const formatNumberWithSeparator = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/[^\d]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Remove separators to get raw number
  const removeNumberSeparator = (value) => {
    return value.replace(/\./g, '');
  };

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return 'Rp 0';
    const numericValue = typeof value === 'string' ? parseFloat(removeNumberSeparator(value)) : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hargaFormatted') {
      // Handle price input with separator
      const numericValue = removeNumberSeparator(value);
      const formattedValue = formatNumberWithSeparator(numericValue);

      setFormData((prev) => ({
        ...prev,
        harga: numericValue,
        hargaFormatted: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name] || errors.harga) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
        harga: '',
      }));
    }
  };

  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const fileErrors = [];

    files.forEach((file, index) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        fileErrors.push(`File ${file.name}: Invalid file type`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        fileErrors.push(`File ${file.name}: Size exceeds 5MB`);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `new_${Date.now()}_${index}`,
        file: file,
        preview: previewUrl,
        name: file.name,
        isNew: true,
      });
    });

    if (fileErrors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        files: fileErrors.join(', '),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        files: '',
      }));
    }

    setNewImages((prev) => [...prev, ...validFiles]);

    // Reset file input
    e.target.value = '';
  };

  const removeExistingImage = (imageIndex) => {
    const imageToRemove = existingImages[imageIndex];
    setImagesToDelete((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) => prev.filter((_, index) => index !== imageIndex));
  };

  const removeNewImage = (imageId) => {
    const imageToRemove = newImages.find((img) => img.id === imageId);
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setNewImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const moveImage = (fromIndex, toIndex, isExisting = true) => {
    if (isExisting) {
      setExistingImages((prev) => {
        const newArray = [...prev];
        const [movedItem] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, movedItem);
        return newArray;
      });
    } else {
      setNewImages((prev) => {
        const newArray = [...prev];
        const [movedItem] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, movedItem);
        return newArray;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Description is required';
    }

    if (!formData.harga || parseFloat(formData.harga) <= 0) {
      newErrors.harga = 'Price must be greater than 0';
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('harga', formData.harga); // Send raw number without separators

      // Add new images (multiple files support)
      newImages.forEach((image) => {
        formDataToSend.append('images', image.file);
      });

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Log untuk debugging
      console.log('Sending data:', {
        deskripsi: formData.deskripsi,
        harga: formData.harga,
        newImagesCount: newImages.length,
        imagesToDeleteCount: imagesToDelete.length,
        existingImagesCount: existingImages.length,
      });

      const response = await axios.put(`${backendUrl}/products/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/product-management');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const openImageModal = (image, isExisting = true) => {
    const imageUrl = isExisting ? `${backendUrl}/${image.url || image.thumbnail}` : image.preview;
    setSelectedViewImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedViewImage(null);
  };

  if (loading) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
          <span className="ml-2 text-lg font-overpass text-[#666666]">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-lg font-overpass text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

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
          <h1 className="font-overpass text-[#333333] font-semibold text-2xl">Edit Product</h1>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700 font-overpass">Product updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 font-overpass">{error}</span>
        </div>
      )}

      {/* Product Info Header */}
      {product && (
        <div className="mb-6 bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Package className="h-6 w-6 text-gray-600" />
            <div className="flex-1">
              <h2 className="font-overpass text-lg font-semibold text-[#333333]">{product.nama_produk}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>ID: {product.id}</span>
                <span>•</span>
                <span>Group: {product.item_group_id}</span>
                {product.category_name && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Layers className="h-3 w-3" />
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold">{product.category_name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-overpass text-lg font-semibold text-[#333333] mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description Field */}
            <div className="lg:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Product Description *</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border ${errors.deskripsi ? 'border-red-300' : 'border-gray-300'} focus:ring-gray-300 focus:border-gray-300 font-overpass resize-vertical`}
                placeholder="Enter product description..."
              />
              {errors.deskripsi && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.deskripsi}
                </p>
              )}
            </div>

            {/* Price Field with Enhanced Formatting */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4" />
                <span>Price (IDR) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input
                  type="text"
                  name="hargaFormatted"
                  value={formData.hargaFormatted}
                  onChange={handleInputChange}
                  className={`w-full pl-8 pr-3 py-2 border ${errors.harga ? 'border-red-300' : 'border-gray-300'} focus:ring-gray-300 focus:border-gray-300 font-overpass`}
                  placeholder="0"
                />
              </div>
              {errors.harga && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.harga}
                </p>
              )}
              {formData.harga && !errors.harga && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Formatted:</span> {formatCurrency(formData.harga)}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Raw Value:</span> {formData.harga}
                  </p>
                </div>
              )}
            </div>

            {/* Category Info (Read-only) */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Layers className="h-4 w-4" />
                <span>Category</span>
              </label>
              <div className="bg-gray-50 border border-gray-300 p-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 text-sm font-semibold">{product?.category_name || 'Uncategorized'}</span>
                  {product?.category_id && <span className="text-xs text-gray-500">ID: {product.category_id}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">Category is managed through Jubelio and cannot be edited here</p>
              </div>
            </div>

            {/* Image Count Info */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Images Summary</label>
              <div className="bg-gray-50 border border-gray-300 p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{totalImages}</p>
                    <p className="text-xs">Total Images</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg text-blue-600">{existingImages.length}</p>
                    <p className="text-xs">Existing</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg text-green-600">{newImages.length}</p>
                    <p className="text-xs">New</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg text-red-600">{imagesToDelete.length}</p>
                    <p className="text-xs">To Delete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images Management */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-overpass text-lg font-semibold text-[#333333] flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Product Images
            </h3>
            <div className="text-sm text-gray-600">
              {totalImages} image{totalImages !== 1 ? 's' : ''} total
            </div>
          </div>

          {errors.images && (
            <div className="mb-4 bg-red-50 border border-red-200 p-3 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{errors.images}</span>
            </div>
          )}

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={`existing_${index}`} className="relative group border border-gray-200 p-2 bg-gray-50">
                    <div className="aspect-square bg-white border border-gray-200 overflow-hidden mb-2">
                      <img src={`${backendUrl}/${image.url || image.thumbnail}`} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">#{index + 1}</span>
                      <div className="flex space-x-1">
                        <button onClick={() => openImageModal(image, true)} className="p-1 bg-blue-500 hover:bg-blue-600 text-white text-xs transition-colors" title="View">
                          <Eye className="h-3 w-3" />
                        </button>
                        {index > 0 && (
                          <button onClick={() => moveImage(index, index - 1, true)} className="p-1 bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors" title="Move Up">
                            ↑
                          </button>
                        )}
                        {index < existingImages.length - 1 && (
                          <button onClick={() => moveImage(index, index + 1, true)} className="p-1 bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors" title="Move Down">
                            ↓
                          </button>
                        )}
                        <button onClick={() => removeExistingImage(index)} className="p-1 bg-red-500 hover:bg-red-600 text-white text-xs transition-colors" title="Delete">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">New Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newImages.map((image, index) => (
                  <div key={image.id} className="relative group border border-green-200 p-2 bg-green-50">
                    <div className="aspect-square bg-white border border-gray-200 overflow-hidden mb-2">
                      <img src={image.preview} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-green-600">New #{index + 1}</span>
                      <div className="flex space-x-1">
                        <button onClick={() => openImageModal(image, false)} className="p-1 bg-blue-500 hover:bg-blue-600 text-white text-xs transition-colors" title="View">
                          <Eye className="h-3 w-3" />
                        </button>
                        {index > 0 && (
                          <button onClick={() => moveImage(index, index - 1, false)} className="p-1 bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors" title="Move Up">
                            ↑
                          </button>
                        )}
                        {index < newImages.length - 1 && (
                          <button onClick={() => moveImage(index, index + 1, false)} className="p-1 bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors" title="Move Down">
                            ↓
                          </button>
                        )}
                        <button onClick={() => removeNewImage(image.id)} className="p-1 bg-red-500 hover:bg-red-600 text-white text-xs transition-colors" title="Remove">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Images - Multiple selection */}
          <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="multiple-images" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">Add More Images</span>
                  <span className="mt-1 block text-sm text-gray-500">PNG, JPG, WebP up to 5MB each (multiple selection allowed)</span>
                </label>
                <input id="multiple-images" type="file" accept="image/*" multiple onChange={handleMultipleFileChange} className="sr-only" />
              </div>
            </div>
          </div>

          {errors.files && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.files}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button onClick={() => navigate('/product-management')} className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-overpass">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-[#333333] hover:bg-[#555555] text-white transition-colors duration-300 font-overpass disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="animate-spin h-4 w-4" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedViewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button onClick={closeImageModal} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="h-8 w-8" />
            </button>
            <img src={selectedViewImage} alt="Full size view" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}

      {/* Enhanced Info Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div className="text-sm text-blue-700 font-overpass">
            <p className="font-medium mb-1">Edit Product Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use dots (.) as thousand separators for prices (e.g., 1.500.000)</li>
              <li>• Upload multiple images at once using the file selector</li>
              <li>• Reorder images using the up/down arrows (first image becomes thumbnail)</li>
              <li>• Click the eye icon to view full-size images</li>
              <li>• All images will be converted to WebP format for optimization</li>
              <li>• Category information is synced from Jubelio and cannot be edited</li>
              <li>• Product name and stock are managed through Jubelio sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
