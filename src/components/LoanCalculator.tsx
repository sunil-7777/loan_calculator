import React, { useState, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import CurrencySelector from './CurrencySelector';
import LoanSchedule from './LoanSchedule';
import { toast } from "@/components/ui/sonner";
import FloatingLabelInput from './FloatingLabelInput';

interface LoanData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const LoanCalculator: React.FC = () => {
  const { theme } = useTheme();
  const { currency, exchangeRates } = useCurrency();
  
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTerm, setLoanTerm] = useState<string>('5');
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showConvertedEMI, setShowConvertedEMI] = useState<boolean>(false);

  // Validate input field in real-time
  const validateField = (name: string, value: string): string => {
    // Regex patterns
    const numberPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    
    if (!value) {
      return 'This field is required';
    }
    
    if (!numberPattern.test(value)) {
      return 'Please enter a valid number';
    }
    
    const numValue = parseFloat(value);
    
    switch (name) {
      case 'loanAmount':
        return numValue <= 0 ? 'Amount must be greater than 0' : '';
      case 'interestRate':
        return numValue < 0 || numValue > 100 ? 'Rate must be between 0-100' : '';
      case 'loanTerm':
        return numValue <= 0 ? 'Term must be greater than 0' : '';
      default:
        return '';
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (name: string, value: string) => {
    switch (name) {
      case 'loanAmount':
        setLoanAmount(value);
        break;
      case 'interestRate':
        setInterestRate(value);
        break;
      case 'loanTerm':
        setLoanTerm(value);
        break;
      default:
        break;
    }
    
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Validate all input fields
  const validateAllInputs = () => {
    const newErrors = {
      loanAmount: validateField('loanAmount', loanAmount),
      interestRate: validateField('interestRate', interestRate),
      loanTerm: validateField('loanTerm', loanTerm)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Calculate loan data
  const calculateLoan = () => {
    if (!validateAllInputs()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const term = parseFloat(loanTerm) * 12; // Term in months
    
    // Calculate monthly payment using loan formula
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    
    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = principal;
    
    for (let month = 1; month <= term; month++) {
      const interestPayment = balance * rate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance > 0 ? balance : 0,
      });
    }
    
    setLoanData({
      loanAmount: principal,
      interestRate: parseFloat(interestRate),
      loanTerm: parseFloat(loanTerm),
      monthlyPayment,
      amortizationSchedule: schedule,
    });
    
    setShowResults(true);
    setShowConvertedEMI(true);
  };

  // Reset the calculator
  const resetCalculator = () => {
    setLoanData(null);
    setShowResults(false);
    setShowConvertedEMI(false);
  };

  // Get converted amount based on selected currency
  const getConvertedAmount = (amount: number): number => {
    if (currency === 'USD' || !exchangeRates[currency]) return amount;
    return amount * exchangeRates[currency];
  };

  // When currency changes and we already have results, show the converted EMI
  useEffect(() => {
    if (showResults && loanData) {
      setShowConvertedEMI(true);
    }
  }, [currency]);

  return (
    <div className="loan-container">
      <h1 className="text-3xl font-bold mb-4">Loan Calculator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <FloatingLabelInput
            id="loanAmount"
            label="Loan Amount"
            value={loanAmount}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            error={errors.loanAmount}
          />
        </div>
        
        <div>
          <FloatingLabelInput
            id="interestRate"
            label="Interest Rate (%)"
            value={interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            error={errors.interestRate}
          />
        </div>
        
        <div>
          <FloatingLabelInput
            id="loanTerm"
            label="Term (Years)"
            value={loanTerm}
            onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            error={errors.loanTerm}
          />
        </div>
      </div>
      
      <button
        onClick={calculateLoan}
        className={`calculate-btn ${theme}`}
      >
        CALCULATE
      </button>
      
      {showResults && loanData && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Monthly EMI: ${loanData.monthlyPayment.toFixed(2)}
          </h2>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            {/* Currency + Converted EMI */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <CurrencySelector />
              {showConvertedEMI && (
                <p className="text-lg mt-2 md:mt-0">
                  Converted EMI: {currency} {getConvertedAmount(loanData.monthlyPayment).toFixed(2)}
                </p>
              )}
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={resetCalculator}
                className={`reset-btn ${theme} w-full md:w-auto`}
              >
                RESET TABLE
              </button>
            </div>
          </div>
          
          <LoanSchedule 
            schedule={loanData.amortizationSchedule} 
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
