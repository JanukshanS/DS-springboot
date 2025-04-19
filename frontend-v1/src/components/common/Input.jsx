import React from 'react';

/**
 * Reusable Input component for form fields
 * Supports various input types, validation, and error messages
 */
const Input = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  error = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none ${
            error
              ? 'focus:ring-red-500 focus:border-red-500'
              : 'focus:ring-orange-500 focus:border-orange-500'
          } disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;