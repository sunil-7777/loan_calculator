import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `block px-4 py-2 rounded-md ${
      isActive(path) ? 'bg-white/20' : 'hover:bg-white/10'
    }`;

  return (
    <header className={`loan-header ${theme} px-4 py-3 shadow-md relative`}>
      {/* Header content */}
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-semibold">Loan Calculator</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className={navLinkClass('/')}>HOME</Link>
          <Link to="/exchange-rates" className={navLinkClass('/exchange-rates')}>EXCHANGE RATES (LIVE)</Link>
          <Link to="/about" className={navLinkClass('/about')}>ABOUT</Link>
          <Link to="/error-page" className={navLinkClass('/error-page')}>ERROR PAGE</Link>
          <div className="flex items-center space-x-2 ml-2">
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Tray */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-90 backdrop-blur-md p-6 md:hidden">
          <button
            className="absolute top-4 right-4"
            onClick={() => setMenuOpen(false)}
          >
            <X size={28} />
          </button>

          <div className="mt-16 flex flex-col space-y-6 text-lg">
            <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>HOME</Link>
            <Link to="/exchange-rates" className={navLinkClass('/exchange-rates')} onClick={() => setMenuOpen(false)}>EXCHANGE RATES (LIVE)</Link>
            <Link to="/about" className={navLinkClass('/about')} onClick={() => setMenuOpen(false)}>ABOUT</Link>
            <Link to="/error-page" className={navLinkClass('/error-page')} onClick={() => setMenuOpen(false)}>ERROR PAGE</Link>

            <div className="flex items-center space-x-2 mt-8">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
