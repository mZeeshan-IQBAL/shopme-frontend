// src/components/UI/Input.jsx
import React from 'react';

const Input = ({ 
  type = "text",
  value, 
  onChange, 
  placeholder = "", 
  name,
  className = "",
  required = false,
  disabled = false,
  label = "",
  error = ""
}) => {
  const baseClasses = "w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${className}`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
