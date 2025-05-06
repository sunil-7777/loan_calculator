import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ClipboardList } from 'lucide-react';

const About: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="loan-container">
      <h1 className="text-3xl font-bold mb-6">About This App</h1>

      <p className="mb-6 text-lg">
        This Loan Calculator is a responsive, single-page web application built using
        <strong> React JS</strong> and <strong>Material UI</strong>. It allows users to:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Calculate EMIs (Equated Monthly Installments) using the standard EMI formula</li>
        <li>View a monthly amortization schedule with principal, interest, and remaining balance</li>
        <li>Convert EMI amounts into different currencies using live exchange rates</li>
        <li>Switch between light and dark modes with theme persistence</li>
        <li>Use the app seamlessly across all device sizes</li>
        <li>Experience error handling with a custom 404 page and error fallback</li>
      </ul>

      <div className="flex items-center mb-6 text-green-600">
        <ClipboardList className="mr-2 h-6 w-6" />
        <span>
          Built with best practices: modular code, Context API for state management, and custom hooks for reusability.
        </span>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span role="img" aria-label="sparkles" className="mr-2">✨</span>
          Features
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Accurate EMI calculation using a custom React hook</li>
          <li>Detailed amortization table with monthly breakdown</li>
          <li>Real-time currency conversion via ExchangeRate API</li>
          <li>Context API for global state like theme and currency</li>
          <li>Custom hooks for calculation and API calls</li>
          <li>Responsive layout for desktop and mobile users</li>
          <li>Light and dark mode with smooth transitions</li>
          <li>404 and error pages for improved user experience</li>
          <li>Deployed version available via GitHub repository</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
