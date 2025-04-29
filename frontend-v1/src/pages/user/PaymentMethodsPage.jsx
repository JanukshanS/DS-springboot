import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiCreditCard, FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const PaymentMethodsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for adding/editing payment methods
  const [formData, setFormData] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const response = await userService.getPaymentMethods();
        
        // Mock data for development
        setTimeout(() => {
          const mockPaymentMethods = [
            {
              id: 'pm_1',
              cardType: 'visa',
              lastFourDigits: '4242',
              nameOnCard: 'John Doe',
              expiryMonth: '12',
              expiryYear: '2025',
              isDefault: true
            },
            {
              id: 'pm_2',
              cardType: 'mastercard',
              lastFourDigits: '5555',
              nameOnCard: 'John Doe',
              expiryMonth: '08',
              expiryYear: '2024',
              isDefault: false
            }
          ];
          
          setPaymentMethods(mockPaymentMethods);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      nameOnCard: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
    setFormErrors({});
  };

  const handleAddPaymentMethod = () => {
    setIsEditing(false);
    setCurrentMethod(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditPaymentMethod = (method) => {
    setIsEditing(true);
    setCurrentMethod(method);
    setFormData({
      cardNumber: `**** **** **** ${method.lastFourDigits}`,
      nameOnCard: method.nameOnCard,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvv: '',
      isDefault: method.isDefault
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        // In a real app, you would call your API
        // await userService.deletePaymentMethod(methodId);
        
        // For development, just update the state
        setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
        
        setSuccessMessage('Payment method deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      // In a real app, you would call your API
      // await userService.setDefaultPaymentMethod(methodId);
      
      // For development, just update the state
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })));
      
      setSuccessMessage('Default payment method updated');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'cardNumber') {
      // Format card number with spaces after every 4 digits
      // Only if the user is not currently editing an existing card
      if (!isEditing) {
        const formattedValue = value
          .replace(/\s/g, '')
          .replace(/(\d{4})/g, '$1 ')
          .trim();
        setFormData({ ...formData, [name]: formattedValue });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'expiryMonth') {
      // Ensure month is between 1-12
      if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'expiryYear') {
      // Accept only valid years
      if (value === '' || parseInt(value) >= new Date().getFullYear()) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'cvv') {
      // Accept only 3-4 digit CVV
      if (value === '' || /^\d{0,4}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-11
    
    if (!isEditing && !formData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!isEditing && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!formData.nameOnCard.trim()) {
      errors.nameOnCard = 'Name on card is required';
    }
    
    if (!formData.expiryMonth) {
      errors.expiryMonth = 'Required';
    }
    
    if (!formData.expiryYear) {
      errors.expiryYear = 'Required';
    } else if (parseInt(formData.expiryYear) === currentYear && parseInt(formData.expiryMonth) < currentMonth) {
      errors.expiryMonth = 'Card expired';
    }
    
    if (!isEditing && !formData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!isEditing && !/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'CVV should be 3-4 digits';
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
      // In a real app, you would call your API
      // let response;
      // if (isEditing) {
      //   response = await userService.updatePaymentMethod(currentMethod.id, formData);
      // } else {
      //   response = await userService.addPaymentMethod(formData);
      // }
      
      // For development, just update the state
      if (isEditing) {
        setPaymentMethods(paymentMethods.map(method => 
          method.id === currentMethod.id 
            ? { 
                ...method, 
                nameOnCard: formData.nameOnCard, 
                expiryMonth: formData.expiryMonth, 
                expiryYear: formData.expiryYear,
                isDefault: formData.isDefault
              } 
            : formData.isDefault ? { ...method, isDefault: false } : method
        ));
        setSuccessMessage('Payment method updated successfully');
      } else {
        const newMethod = {
          id: `pm_${Date.now()}`,
          cardType: formData.cardNumber.startsWith('4') ? 'visa' : 
                   formData.cardNumber.startsWith('5') ? 'mastercard' : 'generic',
          lastFourDigits: formData.cardNumber.replace(/\s/g, '').slice(-4),
          nameOnCard: formData.nameOnCard,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          isDefault: formData.isDefault
        };
        
        if (formData.isDefault) {
          setPaymentMethods(paymentMethods.map(method => ({
            ...method,
            isDefault: false
          })).concat(newMethod));
        } else {
          setPaymentMethods([...paymentMethods, newMethod]);
        }
        setSuccessMessage('Payment method added successfully');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const getCardLogo = (cardType) => {
    // In a real app, you might want to use actual card logos
    switch (cardType.toLowerCase()) {
      case 'visa':
        return (
          <div className="bg-blue-600 text-white font-bold rounded px-2 py-1 text-xs">VISA</div>
        );
      case 'mastercard':
        return (
          <div className="bg-red-600 text-white font-bold rounded px-2 py-1 text-xs">MC</div>
        );
      case 'amex':
        return (
          <div className="bg-gray-600 text-white font-bold rounded px-2 py-1 text-xs">AMEX</div>
        );
      default:
        return (
          <div className="bg-gray-500 text-white font-bold rounded px-2 py-1 text-xs">CARD</div>
        );
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-gray-600">Manage your payment methods for ordering food</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <FiCheckCircle className="text-green-500 mt-0.5 mr-2" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div>
          {/* Add Payment Method Button */}
          <button
            onClick={handleAddPaymentMethod}
            className="mb-6 flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Payment Method
          </button>

          {/* Payment Methods List */}
          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`border rounded-lg p-4 ${method.isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {getCardLogo(method.cardType)}
                      <div className="ml-3">
                        <div className="font-medium">
                          •••• •••• •••• {method.lastFourDigits}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.nameOnCard} • Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditPaymentMethod(method)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        aria-label="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        aria-label="Delete"
                        disabled={method.isDefault}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {method.isDefault && (
                    <div className="mt-2 text-sm text-orange-600 font-medium">
                      Default payment method
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <FiCreditCard size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Payment Methods</h3>
              <p className="text-gray-600 mb-4">
                You haven't added any payment methods yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Card Number */}
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleFormChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                              formErrors.cardNumber ? 'border-red-300' : ''
                            }`}
                            placeholder="1234 5678 9012 3456"
                            disabled={isEditing}
                          />
                          {formErrors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                          )}
                        </div>
                        
                        {/* Name on Card */}
                        <div>
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">Name on Card</label>
                          <input
                            type="text"
                            name="nameOnCard"
                            id="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleFormChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                              formErrors.nameOnCard ? 'border-red-300' : ''
                            }`}
                            placeholder="John Doe"
                          />
                          {formErrors.nameOnCard && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.nameOnCard}</p>
                          )}
                        </div>
                        
                        {/* Expiry Date and CVV */}
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                            <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">Month</label>
                            <input
                              type="text"
                              name="expiryMonth"
                              id="expiryMonth"
                              value={formData.expiryMonth}
                              onChange={handleFormChange}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                                formErrors.expiryMonth ? 'border-red-300' : ''
                              }`}
                              placeholder="MM"
                              maxLength={2}
                            />
                            {formErrors.expiryMonth && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.expiryMonth}</p>
                            )}
                          </div>
                          <div className="col-span-4">
                            <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">Year</label>
                            <input
                              type="text"
                              name="expiryYear"
                              id="expiryYear"
                              value={formData.expiryYear}
                              onChange={handleFormChange}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                                formErrors.expiryYear ? 'border-red-300' : ''
                              }`}
                              placeholder="YYYY"
                              maxLength={4}
                            />
                            {formErrors.expiryYear && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.expiryYear}</p>
                            )}
                          </div>
                          <div className="col-span-4">
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                            <input
                              type="password"
                              name="cvv"
                              id="cvv"
                              value={formData.cvv}
                              onChange={handleFormChange}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                                formErrors.cvv ? 'border-red-300' : ''
                              }`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {formErrors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Default Payment Method Toggle */}
                        <div className="flex items-center">
                          <input
                            id="isDefault"
                            name="isDefault"
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={handleFormChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                            Use as default payment method
                          </label>
                        </div>

                        {/* Security Note */}
                        <div className="mt-4 bg-gray-50 p-3 rounded-md flex items-start">
                          <FiAlertCircle className="text-gray-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">
                            Your payment information is securely stored and processed. We never store your full card details on our servers.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Update Card' : 'Add Card'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage;