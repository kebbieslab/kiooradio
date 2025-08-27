import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ currentLanguage, setCurrentLanguage, languages, setIsPlayerVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Listen Live', path: '/listen-live', icon: '📻' },
    { name: 'Programs', path: '/programs', icon: '📅' },
    { name: 'Impact', path: '/impact', icon: '💝' },
    { name: 'News', path: '/news', icon: '📰' },
    { name: 'Get Involved', path: '/get-involved', icon: '🤝' },
    { name: 'Donate', path: '/donate', icon: '💖' },
    { name: 'About', path: '/about', icon: 'ℹ️' },
    { name: 'Contact', path: '/contact', icon: '📞' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Ticker */}
      <div className="bg-kioo-primary text-white py-2 px-4 text-center text-sm font-medium overflow-hidden">
        <div className="animate-pulse">
          🎙️ Launch set for November 13, 2025 • ⚡ Solar power installed • 🌍 Broadcasting into 3 nations
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg border-b-2 border-kioo-primary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="radio-waves">
                <img 
                  src="https://customer-assets.emergentagent.com/job_ab37571b-81ea-4716-830b-4dd3875c42b0/artifacts/3n0kpvfn_KIOO%20RADIO.png" 
                  alt="Kioo Radio Logo" 
                  className="h-12 w-auto group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-kioo-primary">Kioo Radio</h1>
                <p className="text-xs text-kioo-secondary -mt-1">98.1 FM - The Gift of Good News</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    isActive(item.path)
                      ? 'bg-kioo-primary text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-kioo-primary hover:text-white hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Action Buttons & Language Switcher */}
            <div className="flex items-center space-x-4">
              
              {/* Language Switcher */}
              <div className="language-switcher">
                <select
                  value={currentLanguage}
                  onChange={(e) => setCurrentLanguage(e.target.value)}
                  className="bg-transparent text-kioo-primary text-sm font-medium px-2 py-1 rounded border-none outline-none cursor-pointer"
                >
                  {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code} className="bg-white text-gray-700">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Listen Live Button */}
              <button
                onClick={() => setIsPlayerVisible(true)}
                className="btn-primary hidden sm:flex items-center space-x-2 text-sm"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
                <span>Listen Live</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-kioo-primary text-white'
                        : 'text-gray-700 hover:bg-kioo-primary hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Mobile Listen Live Button */}
                <button
                  onClick={() => {
                    setIsPlayerVisible(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-kioo-primary text-white rounded-lg font-medium"
                >
                  <span className="w-2 h-2 bg-red-400 rounded-full live-pulse"></span>
                  <span>🔴 Listen Live</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;