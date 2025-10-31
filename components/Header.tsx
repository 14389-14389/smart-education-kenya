import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { MenuIcon, CloseIcon, LogoIcon } from './icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const mainNavLinks = NAV_LINKS.filter(link => link.href !== '/donate');
  const donateLink = NAV_LINKS.find(link => link.href === '/donate');

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center text-base sm:text-lg font-bold text-bright-blue-700 hover:text-bright-blue-900 transition"
          >
            <LogoIcon className="h-6 w-6 sm:h-7 sm:w-7 mr-2 flex-shrink-0" />
            <span className="truncate">Smart Education</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-bright-blue-600 transition duration-300 font-medium pb-1 border-b-2 ${
                    isActive
                      ? 'border-bright-blue-600 text-bright-blue-600'
                      : 'border-transparent'
                  } text-sm sm:text-base`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {donateLink && (
              <NavLink
                to={donateLink.href}
                className="bg-bright-blue-600 hover:bg-bright-blue-700 text-white font-bold py-1 px-3 lg:py-2 lg:px-4 rounded-full transition duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base"
              >
                {donateLink.label}
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none p-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel (Compact) */}
      <div
        className={`fixed inset-x-0 top-0 bg-bright-blue-800 bg-opacity-95 z-40 transform ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col items-center justify-start mt-20 px-4 space-y-3 pb-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={`block w-full text-center font-bold py-1 transition ${
                link.href === '/donate'
                  ? 'bg-white text-bright-blue-700 px-4 sm:px-6 rounded-full text-sm sm:text-base'
                  : 'text-white hover:text-bright-blue-200 text-sm sm:text-base'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
