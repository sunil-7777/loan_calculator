
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AmortizationEntry } from './LoanCalculator';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

interface LoanScheduleProps {
  schedule: AmortizationEntry[];
  currency: string;
  exchangeRate: number;
}

const LoanSchedule: React.FC<LoanScheduleProps> = ({ schedule, currency, exchangeRate }) => {
  const { theme } = useTheme();

  // Format currency values
  const formatCurrency = (value: number): string => {
    const convertedValue = value * exchangeRate;
    return `${convertedValue.toFixed(2)} ${currency}`;
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-2">Amortization Schedule ({currency})</h3>
      
      <div className={`border rounded-md mt-4 max-h-[400px] overflow-y-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Table>
          <TableHeader>
            <TableRow className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} h-16`}>
              <TableHead className="text-left w-1/4">Month</TableHead>
              <TableHead className="text-left w-1/4">Principal</TableHead>
              <TableHead className="text-left w-1/4">Interest</TableHead>
              <TableHead className="text-left w-1/4">Remaining Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((entry) => (
              <TableRow 
                key={entry.month}
                className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} h-14`}
              >
                <TableCell className="py-4">{entry.month}</TableCell>
                <TableCell className="py-4">{formatCurrency(entry.principal)}</TableCell>
                <TableCell className="py-4">{formatCurrency(entry.interest)}</TableCell>
                <TableCell className="py-4">{formatCurrency(entry.remainingBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoanSchedule;
