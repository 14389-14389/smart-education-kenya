import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { MenuIcon, CloseIcon, LogoIcon } from './icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle ESC key for mobile menu
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        // Return focus to menu button when closing with ESC
        menuButtonRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);
  
  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const mobileMenu = mobileMenuRef.current;
    if (!mobileMenu) return;
    
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  
  const mainNavLinks = NAV_LINKS.filter(link => link.href !== '/donate');
  const donateLink = NAV_LINKS.find(link => link.href === '/donate');

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-bright-blue-600 text-white p-3 rounded-lg z-[100] focus:z-[100] font-medium text-sm shadow-lg transition-transform hover:scale-105"
      >
        Skip to main content
      </a>

      <header className={`bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3 md:py-4'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center text-base sm:text-lg font-bold text-bright-blue-700 hover:text-bright-blue-900 transition focus:outline-none focus:ring-2 focus:ring-bright-blue-500 focus:ring-offset-2 rounded-lg p-1 -ml-1"
              aria-label="Smart Education - Home"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogoIcon className="h-7 w-7 sm:h-8 sm:w-8 mr-2 flex-shrink-0" />
              <span className="truncate">Smart Education</span>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative text-gray-700 hover:text-bright-blue-600 transition duration-300 font-medium pb-1 ${
                      isActive
                        ? 'text-bright-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-bright-blue-600 after:rounded-full'
                        : 'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-bright-blue-600 after:rounded-full hover:after:w-full after:transition-all after:duration-300'
                    } text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-bright-blue-500 focus:ring-offset-2 rounded px-2 py-1`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {donateLink && (
                <NavLink
                  to={donateLink.href}
                  className="bg-gradient-to-r from-bright-blue-600 to-blue-700 hover:from-bright-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 lg:px-5 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-bright-blue-500 focus:ring-offset-2"
                >
                  {donateLink.label}
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bright-blue-500 focus:ring-offset-2 transition"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <CloseIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Panel */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`fixed inset-x-0 top-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          aria-hidden={!isMenuOpen}
          aria-label="Mobile navigation menu"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <NavLink
              to="/"
              className="flex items-center text-lg font-bold text-bright-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogoIcon className="h-7 w-7 mr-2" />
              Smart Education
            </NavLink>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bright-blue-500"
              aria-label="Close menu"
            >
              <CloseIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="px-4 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `block w-full text-left font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bright-blue-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-bright-blue-50 text-bright-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${link.href === '/donate' ? 'bg-gradient-to-r from-bright-blue-600 to-blue-700 hover:from-bright-blue-700 hover:to-blue-800 text-white shadow-md' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile menu footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Empowering children through education
            </p>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;