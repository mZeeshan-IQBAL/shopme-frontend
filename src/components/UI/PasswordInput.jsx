// src/components/UI/PasswordInput.jsx
import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Password", 
  name = "password",
  className = "",
  required = false,
  disabled = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseClasses = "w-full border border-gray-300 rounded-lg px-3 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500";
  
  return (
    <div className="relative">
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${baseClasses} ${className}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-primary transition-colors duration-200"
        tabIndex={-1}
      >
        {showPassword ? (
          <HiEyeOff className="w-5 h-5" />
        ) : (
          <HiEye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
