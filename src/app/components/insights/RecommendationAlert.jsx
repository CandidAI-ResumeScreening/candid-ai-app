"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  LightbulbIcon,
} from "lucide-react";

export default function RecommendationAlert({ id, type, message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose(id);
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-400";
      case "success":
        return "bg-green-50 border-green-400";
      case "info":
        return "bg-blue-50 border-blue-400";
      case "suggestion":
        return "bg-purple-50 border-purple-400";
      default:
        return "bg-gray-50 border-gray-400";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "warning":
        return "text-amber-700";
      case "success":
        return "text-green-700";
      case "info":
        return "text-blue-700";
      case "suggestion":
        return "text-purple-700";
      default:
        return "text-gray-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      case "suggestion":
        return <LightbulbIcon className="h-5 w-5 text-purple-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} border-l-4 p-4 rounded-md flex items-start justify-between transition-opacity duration-300`}
      id={`alert-${id}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className={`${getTextColor()} flex-1`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 flex-shrink-0 bg-transparent text-gray-400 hover:text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <span className="sr-only">Close</span>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
