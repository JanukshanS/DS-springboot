import React, { useState, useEffect } from 'react';
import { FiImage, FiClock, FiDollarSign, FiX } from 'react-icons/fi';

/**
 * Dedicated component for updating menu items
 * Uses a different layout optimized for modal display
 */
const MenuUpdateForm = ({
  initialData,
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
    image: null,
    isAvailable: true,
    preparationTime: 15,
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        image: null, // Don't pre-fill file input
        isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
        preparationTime: initialData.preparationTime?.toString() || '15',
      });
      setImagePreview(initialData.imageUrl || null);
      setFormErrors({});
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(initialData?.imageUrl || null);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear field error when changing
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      preparationTime: parseInt(formData.preparationTime) || 0,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 pb-5">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {formError}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="update-name" className="block text-sm font-medium text-gray-700">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              id="update-name"
              value={formData.name}
              onChange={handleFormChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                formErrors.name ? 'border-red-300 ring ring-red-300' : ''
              }`}
              placeholder="Dish name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="update-category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              id="update-category"
              value={formData.category}
              onChange={handleFormChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                formErrors.category ? 'border-red-300 ring ring-red-300' : ''
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="update-description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="update-description"
            rows="2"
            value={formData.description}
            onChange={handleFormChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            placeholder="Brief description of the dish (optional)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price Field */}
          <div>
            <label htmlFor="update-price" className="block text-sm font-medium text-gray-700">
              Price ($) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-500" />
              </div>
              <input
                type="text"
                name="price"
                id="update-price"
                value={formData.price}
                onChange={handleFormChange}
                className={`pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                  formErrors.price ? 'border-red-300 ring ring-red-300' : ''
                }`}
                placeholder="0.00"
              />
            </div>
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>

          {/* Preparation Time Field */}
          <div>
            <label htmlFor="update-preparationTime" className="block text-sm font-medium text-gray-700">
              Prep Time (min)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="text-gray-500" />
              </div>
              <input
                type="number"
                name="preparationTime"
                id="update-preparationTime"
                min="0"
                step="1"
                value={formData.preparationTime}
                onChange={handleFormChange}
                className={`pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                  formErrors.preparationTime ? 'border-red-300 ring ring-red-300' : ''
                }`}
                placeholder="e.g., 15"
              />
            </div>
            {formErrors.preparationTime && (
              <p className="mt-1 text-sm text-red-600">{formErrors.preparationTime}</p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <FiImage className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="update-image"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FiImage className="mr-2" />
                Change Image
                <input
                  id="update-image"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  className="sr-only"
                  onChange={handleFormChange}
                />
              </label>
              {formData.image && (
                <p className="mt-1 text-xs text-green-600 truncate max-w-xs">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="update-isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={handleFormChange}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="update-isAvailable"
                className="font-medium text-gray-700"
              >
                Available for ordering
              </label>
              <p className="text-gray-500 text-xs">
                When unchecked, item won't be visible on the customer menu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
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
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default MenuUpdateForm;