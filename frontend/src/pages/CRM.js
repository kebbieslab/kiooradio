import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CRM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, contacts, add-contact
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    contact_type: '',
    source: '',
    country: '',
    search: ''
  });

  // New contact form data
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    city: '',
    country: '',
    contact_type: 'general',
    notes: '',
    tags: []
  });
  };

  const sidebarItems = [
    { key: 'dashboard', icon: '📊', label: t[language].dashboard },
    { key: 'visitors', icon: '👥', label: t[language].visitors },
    { key: 'donations', icon: '💰', label: t[language].donations },
    { key: 'projects', icon: '📋', label: t[language].projects },
    { key: 'finance', icon: '💳', label: t[language].finance },
    { key: 'invoices', icon: '📄', label: t[language].invoices },
    { key: 'reminders', icon: '⏰', label: t[language].reminders },
    { key: 'stories', icon: '📝', label: t[language].stories },
    { key: 'settings', icon: '⚙️', label: t[language].settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].dashboard}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-600">
                <h3 className="font-semibold text-gray-700">Quick Stats</h3>
                <p className="text-gray-600 mt-2">Dashboard overview coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'visitors':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].visitors}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Visitor management system coming soon...</p>
            </div>
          </div>
        );
      case 'donations':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].donations}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Donation tracking system coming soon...</p>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].projects}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Project management system coming soon...</p>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].finance}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Financial management system coming soon...</p>
            </div>
          </div>
        );
      case 'invoices':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].invoices}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Invoice and receipt management coming soon...</p>
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].reminders}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Reminder system coming soon...</p>
            </div>
          </div>
        );
      case 'stories':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].stories}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Story management system coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t[language].settings}</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Kioo CRM - Internal System</title>
      </head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Logo + Title + Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo Area */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📻</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{t[language].title}</h1>
              </div>
            </div>

            {/* Right: Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {language === 'en' ? 'EN' : 'FR'}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-16 left-0 z-30 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors
                  ${activeSection === item.key 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="pt-16 lg:pl-64">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default CRM;