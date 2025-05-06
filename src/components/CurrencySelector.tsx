
import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown } from 'lucide-react';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, exchangeRates } = useCurrency();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
  ];

  const handleSelect = (code: string) => {
    setCurrency(code as any);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="floating-label relative">
        <div className={`border rounded-md border-input relative bg-background`}>
          {true && (
            <span className={`absolute -top-2.5 left-2 px-1 text-xs transform bg-background text-gray-500`}>
              Currency
            </span>
          )}
          <div 
            className="flex justify-between items-center h-10 px-3 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{currency}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 mt-1 w-full rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <ul className="py-1 max-h-60 overflow-auto">
            {currencies.map((curr) => (
              <li 
                key={curr.code}
                className={`px-4 py-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => handleSelect(curr.code)}
              >
                {curr.code}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
