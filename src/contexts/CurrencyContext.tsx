
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'INR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

interface ExchangeRates {
  [currency: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('Failed to load exchange rates. Using default values.');
        // Fallback rates
        setExchangeRates({
          USD: 1,
          EUR: 0.92,
          INR: 83.14,
          GBP: 0.79,
          JPY: 151.35,
          AUD: 1.55,
          CAD: 1.38,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, isLoading, error }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
