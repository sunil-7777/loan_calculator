
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const ErrorPage: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong in the application.</h1>
        
        <Link to="/">
          <button className={`mt-6 px-6 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'}`}>
            GO HOME
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
