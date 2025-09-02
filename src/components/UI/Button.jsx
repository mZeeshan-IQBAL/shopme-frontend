// src/components/UI/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = "button",
  variant = "primary", // primary, secondary, success, danger, dark
  size = "md", // sm, md, lg
  disabled = false,
  loading = false,
  className = "",
  icon = null,
  fullWidth = false
}) => {
  const baseClasses = "font-medium transition-all duration-300 flex items-center justify-center gap-2 transform focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-black hover:from-black hover:to-primary text-white focus:ring-primary/20",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-300",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-300",
    dark: "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white focus:ring-gray-600"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const hoverClass = !disabled ? "hover:scale-[1.02]" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${hoverClass} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-75"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
