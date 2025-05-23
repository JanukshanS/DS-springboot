import React, { useState, useEffect } from 'react';
import { FiImage, FiClock, FiDollarSign, FiUpload } from 'react-icons/fi';
import { uploadImage as uploadImageService } from '../../../services/ImageService';

const MenuForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  categories = [],
  isLoading = false,
  formError = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
    preparationTime: 15,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
        preparationTime: initialData.preparationTime?.toString() || '15',
      });
      setImagePreview(initialData.imageUrl || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories.length > 0 ? categories[0].id : '',
        imageUrl: '',
        isAvailable: true,
        preparationTime: 15,
      });
      setImagePreview(null);
    }
    setFormErrors({});
  }, [initialData, categories]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedUrl = await uploadImageService(file);
      console.log('Image uploaded successfully:', uploadedUrl);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: uploadedUrl
      }));
      
      setImagePreview(uploadedUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'file') {
      handleImageChange(e);
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'category' && value === 'new') {
      setIsNewCategory(true);
    } else if (name === 'customCategory') {
      setCustomCategory(value);
      setFormData(prev => ({ ...prev, category: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'category' && isNewCategory) {
        setIsNewCategory(false);
        setCustomCategory('');
      }
    }

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Item name is required';
    }

    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      errors.price = 'Price must be a positive number';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (formData.preparationTime && (isNaN(parseInt(formData.preparationTime)) || parseInt(formData.preparationTime) < 0)) {
        errors.preparationTime = 'Preparation time must be a non-negative number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    try {
      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        preparationTime: parseInt(formData.preparationTime) || 0,
        isAvailable: formData.isAvailable,
        imageUrl: formData.imageUrl
      };
      
      console.log('Submitting menu item with data:', dataToSubmit);
      onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors(prev => ({ ...prev, submit: 'An error occurred. Please try again.' }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {formError}
        </div>
      )}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleFormChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                formErrors.name ? 'border-red-300 ring ring-red-300' : ''
              }`}
              placeholder="Dish name"
              aria-required="true"
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? "name-error" : undefined}
            />
            {formErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            
            {!isNewCategory ? (
              <div className="relative">
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                    formErrors.category ? 'border-red-300 ring ring-red-300' : ''
                  }`}
                  aria-required="true"
                  aria-invalid={!!formErrors.category}
                  aria-describedby={formErrors.category ? "category-error" : undefined}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new" className="font-medium text-blue-600">+ Add new category</option>
                </select>
              </div>
            ) : (
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="customCategory"
                  id="customCategory"
                  value={customCategory}
                  onChange={handleFormChange}
                  placeholder="Enter new category name"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                    formErrors.category ? 'border-red-300 ring ring-red-300' : ''
                  }`}
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategory(false);
                    if (!customCategory.trim()) {
                      setFormData(prev => ({ ...prev, category: '' }));
                    }
                  }}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {formErrors.category && (
              <p id="category-error" className="mt-1 text-sm text-red-600">
                {formErrors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Brief description of the dish (optional)"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price ($) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-500" />
              </div>
              <input
                type="text" 
                name="price"
                id="price"
                value={formData.price}
                onChange={handleFormChange}
                className={`pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                  formErrors.price ? 'border-red-300 ring ring-red-300' : ''
                }`}
                placeholder="0.00"
                aria-required="true"
                aria-invalid={!!formErrors.price}
                aria-describedby={formErrors.price ? "price-error" : undefined}
              />
            </div>
            {formErrors.price && (
              <p id="price-error" className="mt-1 text-sm text-red-600">
                {formErrors.price}
              </p>
            )}
          </div>

          {/* Preparation Time */}
          <div>
            <label
              htmlFor="preparationTime"
              className="block text-sm font-medium text-gray-700"
            >
              Prep Time (min)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="text-gray-500" />
              </div>
              <input
                type="number"
                name="preparationTime"
                id="preparationTime"
                min="0"
                step="1"
                value={formData.preparationTime}
                onChange={handleFormChange}
                className={`pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                  formErrors.preparationTime ? 'border-red-300 ring ring-red-300' : ''
                }`}
                placeholder="e.g., 15"
                aria-invalid={!!formErrors.preparationTime}
                aria-describedby={formErrors.preparationTime ? "prep-time-error" : undefined}
              />
            </div>
            {formErrors.preparationTime && (
              <p id="prep-time-error" className="mt-1 text-sm text-red-600">
                {formErrors.preparationTime}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Item Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0 h-20 w-20 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <FiImage className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex-grow flex justify-center px-6 py-5 border-2 border-gray-300 border-dashed rounded-md hover:border-orange-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 px-1"
                    >
                      <span>{uploadingImage ? 'Uploading...' : 'Upload a file'}</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {uploadingImage && (
                    <div className="flex items-center justify-center mt-2">
                      <span className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                  )}
                  {formData.imageUrl && !uploadingImage && (
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-xs text-green-600">
                        Image uploaded successfully
                      </span>
                    </div>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isAvailable"
                  name="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={handleFormChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="isAvailable"
                  className="font-medium text-gray-700"
                >
                  Available for ordering
                </label>
                <p className="text-gray-500">
                  When unchecked, this item will not be visible on the customer menu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              initialData ? 'Save Changes' : 'Add Item'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MenuForm;
