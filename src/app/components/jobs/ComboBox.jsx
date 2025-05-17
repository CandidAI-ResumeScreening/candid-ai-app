// src/app/components/jobs/ComboBox.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";

export default function ComboBox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  required = false,
  error = null,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchTerm) {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm`}
      >
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="flex-1 flex items-center">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full focus:outline-none"
              placeholder={value || placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex items-center">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                      value === option ? "bg-blue-50 text-blue-700" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                    {value === option && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
