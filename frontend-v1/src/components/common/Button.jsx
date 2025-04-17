import React from 'react';

/**
 * Reusable Button component with consistent styling
 * Supports multiple variants, sizes, and states
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary:
      'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    secondary:
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    outline:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-orange-500',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Combine all styles
  const buttonStyles = `
    inline-flex justify-center items-center rounded-md
    font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;