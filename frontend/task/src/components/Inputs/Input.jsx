import React, { useState } from "react";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="mb-6">
      {label && (
        <label className="block mb-2 text-gray-700 font-semibold text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type === "password" && !showPassword ? "password" : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        {type === "password" && (
          <span
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700 select-none"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
