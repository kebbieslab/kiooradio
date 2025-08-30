import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ setIsPlayerVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();

  // Reduced navigation - About moved right after Home
  const navigation = [
    { name: 'Home', nameKey: 'navHome', path: '/', icon: '🏠' },
    { name: 'About', nameKey: 'navAbout', path: '/about', icon: 'ℹ️' },
    { name: 'Listen', nameKey: 'navListen', path: '/listen-live', icon: '📻' },
    { name: 'Programs', nameKey: 'navPrograms', path: '/programs', icon: '📅' },
    { name: 'Churches', nameKey: 'navChurches', path: '/church-partners', icon: '⛪' },
    { name: 'Impact', nameKey: 'navImpact', path: '/impact', icon: '💝' },
    { name: 'Donate', nameKey: 'navDonate', path: '/donate', icon: '💖' },
  ];

  // Language system initialization
  useEffect(() => {
    const initLanguage = () => {
      const saved = localStorage.getItem('lang');
      if (saved) {
        setCurrentLanguage(saved);
        return;
      }
      
      // Auto-detect based on browser language
      const nav = (navigator.language || 'en').toLowerCase();
      const defaultLang = nav.startsWith('fr') ? 'fr' : 'en';
      setCurrentLanguage(defaultLang);
      localStorage.setItem('lang', defaultLang);
    };

    initLanguage();
  }, []);

  // Apply i18n translations
  useEffect(() => {
    if (typeof window !== 'undefined' && window.applyI18n) {
      window.applyI18n();
    }
  }, [currentLanguage]);

  const switchLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('lang', lang);
    if (typeof window !== 'undefined' && window.setLang) {
      window.setLang(lang);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Countdown Bar - site-wide */}
      <div id="countdown" style={{
        background: '#0F172A',
        color: '#fff',
        textAlign: 'center',
        padding: '6px 10px',
        font: '600 14px/1.4 Inter, system-ui'
      }}>
        Launching Kioo Radio in <span id="cd"></span> — November 13, 2025
      </div>

      {/* Top Ticker - Updated without solar */}
      <div className="bg-kioo-primary text-white py-2 px-4 text-center text-sm font-medium overflow-hidden">
        <div className="animate-pulse">
          🎙️ Launch set for November 13, 2025 • 📡 Broadcasting into 3 nations • 🌍 Reaching the Makona River Region
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
                  <span data-i18n={item.nameKey}>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Language Toggle + Listen Live Button */}
            <div className="flex items-center space-x-4">
              
              {/* EN/FR Language Toggle */}
              <div className="language-switcher flex items-center space-x-1">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`px-2 py-1 text-sm font-medium rounded ${
                    currentLanguage === 'en' ? 'text-kioo-primary font-bold' : 'text-gray-600 hover:text-kioo-primary'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => switchLanguage('fr')}
                  className={`px-2 py-1 text-sm font-medium rounded ${
                    currentLanguage === 'fr' ? 'text-kioo-primary font-bold' : 'text-gray-600 hover:text-kioo-primary'
                  }`}
                  aria-label="Basculer en français"
                >
                  FR
                </button>
              </div>

              {/* Listen Live Button */}
              <button
                onClick={() => setIsPlayerVisible(true)}
                className="btn-primary hidden sm:flex items-center space-x-2 text-sm"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
                <span data-i18n="listen">Listen Live</span>
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
                    <span data-i18n={item.nameKey}>{item.name}</span>
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
                  <span data-i18n="listen">🔴 Listen Live</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Countdown Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function(){
            const target = new Date('2025-11-13T09:00:00Z');
            const el = document.getElementById('cd');
            if (!el) return;
            function tick(){
              const now = new Date();
              let s = Math.max(0, Math.floor((target - now)/1000));
              const d = Math.floor(s/86400); s%=86400;
              const h = Math.floor(s/3600);  s%=3600;
              const m = Math.floor(s/60);    s%=60;
              el.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
            }
            tick(); setInterval(tick, 1000);
          })();
        `
      }} />
    </>
  );
};

export default Header;