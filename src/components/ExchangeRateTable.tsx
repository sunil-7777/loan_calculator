
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ExchangeRate {
  code: string;
  rate: number;
}

const ExchangeRateTable: React.FC = () => {
  const { theme } = useTheme();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        
        // Convert object to array for easier rendering
        const ratesArray = Object.entries(data.rates).map(([code, rate]) => ({
          code,
          rate: rate as number,
        }));
        
        setRates(ratesArray);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('Failed to load exchange rates');
        
        // Fallback with some common currencies
        setRates([
          { code: 'USD', rate: 1 },
          { code: 'EUR', rate: 0.92 },
          { code: 'INR', rate: 83.14 },
          { code: 'GBP', rate: 0.79 },
          { code: 'JPY', rate: 151.35 },
          { code: 'AUD', rate: 1.55 },
          { code: 'CAD', rate: 1.38 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(rates.length / rowsPerPage);
  
  // Get current page data
  const currentRates = rates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="loan-container">
      <h1 className="text-3xl font-bold mb-6">Live Exchange Rates (Base: USD)</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Loading exchange rates...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <>
          <div className={`table-container ${theme}`}>
            <table className="w-full">
              <thead>
                <tr className={`table-header ${theme} h-14`}>
                  <th className="text-left w-1/2 py-3 px-4">Currency</th>
                  <th className="text-right w-1/2 py-3 px-4">Rate</th>
                </tr>
              </thead>
              <tbody>
                {currentRates.map((rate) => (
                  <tr 
                    key={rate.code}
                    className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="py-3 px-4">{rate.code}</td>
                    <td className="text-right py-3 px-4">{rate.rate.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="mr-2">Rows per page:</span>
              <select 
                value={rowsPerPage} 
                onChange={handleRowsPerPageChange}
                className={`currency-dropdown ${theme} p-1`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span>{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, rates.length)} of {rates.length}</span>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`ml-2 p-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &lt;
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-2 p-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExchangeRateTable;
