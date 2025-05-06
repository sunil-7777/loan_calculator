
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Oops! Page not found
        </p>
        <Link 
          to="/" 
          className={`inline-block px-6 py-2 rounded-md ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }`}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
