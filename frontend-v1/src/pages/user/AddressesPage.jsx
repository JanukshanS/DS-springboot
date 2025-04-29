import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiHome, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { updateUserProfile } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AddressesPage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
    instructions: ''
  });

  useEffect(() => {
    // Initialize with user's addresses if available
    if (user && user.addresses) {
      setAddresses(user.addresses);
    } else if (user && user.address) {
      // If using the legacy address format
      setAddresses([
        {
          label: 'Home',
          street: user.address,
          apartment: '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.postalCode || '',
          isDefault: true,
          instructions: ''
        }
      ]);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
      instructions: ''
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedAddresses = [...addresses];
    
    // If this address is marked as default, update other addresses
    if (formData.isDefault) {
      updatedAddresses.forEach(address => {
        address.isDefault = false;
      });
    }
    
    if (editingIndex !== null) {
      // Update existing address
      updatedAddresses[editingIndex] = formData;
    } else {
      // Add new address
      updatedAddresses.push(formData);
    }
    
    // If no default address exists, make the first one default
    if (!updatedAddresses.some(address => address.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
    
    // Save to user profile
    dispatch(updateUserProfile({ addresses: updatedAddresses }))
      .then(() => {
        toast.success(editingIndex !== null ? 'Address updated' : 'Address added');
        resetForm();
      })
      .catch(() => {
        toast.error('Failed to save address');
      });
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      const updatedAddresses = [...addresses];
      const wasDefault = updatedAddresses[index].isDefault;
      
      updatedAddresses.splice(index, 1);
      
      // If the deleted address was default and we have other addresses, make the first one default
      if (wasDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      setAddresses(updatedAddresses);
      
      // Save to user profile
      dispatch(updateUserProfile({ addresses: updatedAddresses }))
        .then(() => {
          toast.success('Address removed');
        })
        .catch(() => {
          toast.error('Failed to remove address');
        });
    }
  };

  const handleSetDefault = (index) => {
    const updatedAddresses = addresses.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    
    setAddresses(updatedAddresses);
    
    // Save to user profile
    dispatch(updateUserProfile({ addresses: updatedAddresses }))
      .then(() => {
        toast.success('Default address updated');
      })
      .catch(() => {
        toast.error('Failed to update default address');
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Addresses</h1>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center"
          >
            <FiPlus className="mr-2" />
            Add New Address
          </Button>
        )}
      </div>

      {showAddForm ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address Label */}
                <div>
                  <label htmlFor="label" className="block text-gray-700 text-sm font-medium mb-2">
                    Address Label
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Home, Work, etc."
                    required
                  />
                </div>

                {/* Street */}
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-gray-700 text-sm font-medium mb-2">
                    Street Address*
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                {/* Apartment/Suite */}
                <div>
                  <label htmlFor="apartment" className="block text-gray-700 text-sm font-medium mb-2">
                    Apartment/Suite (optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">
                    State/Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label htmlFor="zipCode" className="block text-gray-700 text-sm font-medium mb-2">
                    Zip/Postal Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                {/* Delivery Instructions */}
                <div className="md:col-span-2">
                  <label htmlFor="instructions" className="block text-gray-700 text-sm font-medium mb-2">
                    Delivery Instructions (optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Gate code, delivery preferences, etc."
                  ></textarea>
                </div>

                {/* Default Address Checkbox */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-gray-700 text-sm">
                      Set as default address
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingIndex !== null ? 'Update Address' : 'Save Address'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Addresses Saved</h2>
              <p className="text-gray-600 mb-6">You haven't added any delivery addresses yet.</p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`bg-white border rounded-xl shadow-sm overflow-hidden ${
                    address.isDefault ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          <FiHome className="text-gray-400 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">{address.label}</h3>
                          {address.isDefault && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-700 space-y-1 mb-4">
                      <p>{address.street}</p>
                      {address.apartment && <p>{address.apartment}</p>}
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                    {address.instructions && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Instructions:</span> {address.instructions}
                        </p>
                      </div>
                    )}
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(index)}
                        className="mt-2"
                      >
                        <FiCheckCircle className="mr-2" />
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressesPage;