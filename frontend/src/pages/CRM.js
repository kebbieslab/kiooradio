import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CRMMergeStatus from './CRMMergeStatus';
import CRMVisitors from '../components/CRMVisitors';
import CRMDonations from '../components/CRMDonations';
import CRMProjects from '../components/CRMProjects';

const CRM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, contacts, add-contact, import-data, settings, merge-status, visitors, donations, projects
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    contact_type: '',
    source: '',
    country: '',
    search: ''
  });

  // CSV Import state
  const [importData, setImportData] = useState({
    file_type: 'visitors',
    csv_content: '',
    is_importing: false,
    import_result: null,
    import_history: null
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

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      const authHeader = btoa('admin:kioo2025!');
      localStorage.setItem('crmAuth', authHeader);
      setIsAuthenticated(true);
      loadCRMData();
    } else {
      setError('Invalid username or password');
    }
  };

  const loadCRMData = async () => {
    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      // Load CRM stats
      const statsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/stats`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load contacts
      await loadContacts();
      
    } catch (error) {
      console.error('Failed to load CRM data:', error);
      setError('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      // Build query params
      const params = new URLSearchParams();
      if (filters.contact_type) params.append('contact_type', filters.contact_type);
      if (filters.source) params.append('source', filters.source);
      if (filters.country) params.append('country', filters.country);
      params.append('limit', '500');
      
      const contactsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/contacts?${params}`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      }
      
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setError('Failed to load contacts');
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContact)
      });
      
      if (response.ok) {
        const createdContact = await response.json();
        setContacts([createdContact, ...contacts]);
        setNewContact({
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
        setCurrentView('contacts');
        loadCRMData(); // Refresh stats
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create contact');
      }
      
    } catch (error) {
      console.error('Failed to create contact:', error);
      setError('Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        setSelectedContact(null);
        loadCRMData(); // Refresh stats
      } else {
        setError('Failed to delete contact');
      }
      
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setError('Failed to delete contact');
    }
  };

  const handleImportContacts = async () => {
    if (!window.confirm('This will import contacts from newsletter subscriptions, contact forms, and church partners. Continue?')) return;
    
    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/import-from-sources`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        loadCRMData(); // Refresh all data
      } else {
        setError('Failed to import contacts');
      }
      
    } catch (error) {
      console.error('Failed to import contacts:', error);
      setError('Failed to import contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crmAuth');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setContacts([]);
    setStats(null);
    setCurrentView('dashboard');
  };

  // CSV Import Functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(prev => ({
          ...prev,
          csv_content: e.target.result
        }));
      };
      reader.readAsText(file);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleImportCSV = async () => {
    if (!importData.csv_content) {
      setError('Please upload a CSV file first');
      return;
    }

    setImportData(prev => ({ ...prev, is_importing: true }));
    setError('');

    try {
      const formData = new FormData();
      formData.append('file_type', importData.file_type);
      formData.append('csv_content', importData.csv_content);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/import-csv`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setImportData(prev => ({ 
          ...prev, 
          import_result: result,
          csv_content: '' // Clear the content after successful import
        }));
        
        // Reset file input
        const fileInput = document.getElementById('csv-file-input');
        if (fileInput) fileInput.value = '';
        
        // Refresh CRM data if contacts were imported
        if (importData.file_type === 'visitors' && result.success) {
          loadCRMData();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to import CSV data');
      }
    } catch (error) {
      console.error('Failed to import CSV:', error);
      setError('Failed to import CSV data');
    } finally {
      setImportData(prev => ({ ...prev, is_importing: false }));
    }
  };

  const loadImportHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/crm/import-history`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const history = await response.json();
        setImportData(prev => ({ ...prev, import_history: history }));
      }
    } catch (error) {
      console.error('Failed to load import history:', error);
    }
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.organization && contact.organization.toLowerCase().includes(searchLower)) ||
      (contact.city && contact.city.toLowerCase().includes(searchLower)) ||
      (contact.country && contact.country.toLowerCase().includes(searchLower))
    );
  });

  // Apply filters and load import history
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'import-data' && !importData.import_history) {
        loadImportHistory();
      }
      loadContacts();
    }
  }, [filters.contact_type, filters.source, filters.country, currentView]);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>Kioo CRM - Internal System</title>
        </Helmet>

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                CRM Access
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please enter your credentials to access the Customer Relationship Management system
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    type="text"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
                >
                  Access CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  // CRM Dashboard
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Kioo CRM - Internal System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kioo Radio CRM</h1>
                <p className="text-sm text-gray-500">Customer Relationship Management System</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'dashboard' 
                      ? 'bg-kioo-primary text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('contacts')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'contacts' 
                      ? 'bg-kioo-primary text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Contacts
                </button>
                <button
                  onClick={() => setCurrentView('add-contact')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'add-contact' 
                      ? 'bg-kioo-primary text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setCurrentView('import-data')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'import-data' 
                      ? 'bg-kioo-primary text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Import Data
                </button>
                
                {/* Integrated Module Navigation */}
                <div className="border-l border-gray-300 h-8 mx-2"></div>
                
                <button
                  onClick={() => setCurrentView('visitors')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'visitors' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  👥 Visitors
                </button>
                <button
                  onClick={() => setCurrentView('donations')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'donations' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  💝 Donations
                </button>
                <button
                  onClick={() => setCurrentView('projects')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'projects' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  📋 Projects
                </button>
                
                <div className="border-l border-gray-300 h-8 mx-2"></div>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentView === 'settings' || currentView === 'merge-status'
                      ? 'bg-kioo-primary text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
              <button onClick={() => setError('')} className="float-right font-bold">×</button>
            </div>
          )}

          {/* Dashboard View */}
          {currentView === 'dashboard' && stats && (
            <div>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-kioo-primary rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.total_contacts}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">📅</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Recent (30 days)</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.recent_contacts}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">📧</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Newsletter Subs</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.newsletter_subscribers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">⛪</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Church Partners</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.church_partners}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Breakdowns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Contact Types */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Contact Types</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.by_type || {}).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 capitalize">{type.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Sources */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Sources</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.by_source || {}).map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 capitalize">{source.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Countries */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Countries</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.by_country || {}).map(([country, count]) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{country || 'Unknown'}</span>
                          <span className="text-sm text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Contacts */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Data Import</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import contacts from existing data sources: newsletter subscriptions, contact form submissions, and church partners.
                  </p>
                  <button
                    onClick={handleImportContacts}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
                  >
                    {loading ? 'Importing...' : 'Import from Sources'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contacts View */}
          {currentView === 'contacts' && (
            <div>
              {/* Filters */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                    <div>
                      <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={filters.contact_type}
                        onChange={(e) => setFilters({...filters, contact_type: e.target.value})}
                      >
                        <option value="">All Types</option>
                        <option value="general">General</option>
                        <option value="church_partner">Church Partner</option>
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="presenter">Presenter</option>
                        <option value="newsletter">Newsletter</option>
                      </select>
                    </div>
                    <div>
                      <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={filters.source}
                        onChange={(e) => setFilters({...filters, source: e.target.value})}
                      >
                        <option value="">All Sources</option>
                        <option value="manual">Manual</option>
                        <option value="contact_form">Contact Form</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="church_partner">Church Partner</option>
                      </select>
                    </div>
                    <div>
                      <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={filters.country}
                        onChange={(e) => setFilters({...filters, country: e.target.value})}
                      >
                        <option value="">All Countries</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Guinea">Guinea</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Table */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Contacts ({filteredContacts.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {contact.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <a href={`mailto:${contact.email}`} className="text-kioo-primary hover:underline">
                                {contact.email}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kioo-primary bg-opacity-20 text-kioo-primary">
                                {contact.contact_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.city ? `${contact.city}, ` : ''}{contact.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedContact(contact)}
                                className="text-kioo-primary hover:text-kioo-primary-dark mr-4"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Contact View */}
          {currentView === 'add-contact' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Contact</h3>
                <form onSubmit={handleCreateContact} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Organization</label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.organization}
                        onChange={(e) => setNewContact({...newContact, organization: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.city}
                        onChange={(e) => setNewContact({...newContact, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.country}
                        onChange={(e) => setNewContact({...newContact, country: e.target.value})}
                      >
                        <option value="">Select Country</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Type</label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={newContact.contact_type}
                        onChange={(e) => setNewContact({...newContact, contact_type: e.target.value})}
                      >
                        <option value="general">General</option>
                        <option value="church_partner">Church Partner</option>
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="presenter">Presenter</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                      value={newContact.notes}
                      onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView('contacts')}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Contact'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Import Data View */}
          {currentView === 'import-data' && (
            <div>
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Import CSV Data
                  </h3>
                  
                  {/* File Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Data Type
                    </label>
                    <select
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                      value={importData.file_type}
                      onChange={(e) => setImportData(prev => ({ ...prev, file_type: e.target.value, import_result: null }))}
                    >
                      <option value="visitors">Visitors</option>
                      <option value="donations">Donations</option>
                      <option value="projects">Projects</option>
                      <option value="finance">Finance Records</option>
                      <option value="tasks_reminders">Tasks & Reminders</option>
                      <option value="users_roles">Users & Roles</option>
                      <option value="invoices">Invoices</option>
                      <option value="stories">Stories</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV File
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"/>
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="csv-file-input" className="relative cursor-pointer bg-white rounded-md font-medium text-kioo-primary hover:text-kioo-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-kioo-primary">
                            <span>Upload a file</span>
                            <input
                              id="csv-file-input"
                              name="csv-file"
                              type="file"
                              accept=".csv"
                              className="sr-only"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV files only</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {importData.csv_content && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CSV Preview (first 5 lines)
                      </label>
                      <div className="bg-gray-50 rounded-md p-3 overflow-x-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {importData.csv_content.split('\n').slice(0, 5).join('\n')}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Import Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleImportCSV}
                      disabled={!importData.csv_content || importData.is_importing}
                      className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importData.is_importing ? 'Importing...' : 'Import CSV Data'}
                    </button>
                  </div>

                  {/* Import Results */}
                  {importData.import_result && (
                    <div className={`mb-6 p-4 rounded-md ${importData.import_result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <h4 className={`font-medium ${importData.import_result.success ? 'text-green-800' : 'text-red-800'} mb-2`}>
                        Import {importData.import_result.success ? 'Successful' : 'Failed'}
                      </h4>
                      <div className={`text-sm ${importData.import_result.success ? 'text-green-700' : 'text-red-700'}`}>
                        <p>Imported: {importData.import_result.imported_count} records</p>
                        {importData.import_result.error_count > 0 && (
                          <p>Errors: {importData.import_result.error_count}</p>
                        )}
                        
                        {/* Show validation errors */}
                        {importData.import_result.validation_errors && importData.import_result.validation_errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Validation Errors:</p>
                            <ul className="list-disc list-inside mt-1">
                              {importData.import_result.validation_errors.slice(0, 10).map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                              {importData.import_result.validation_errors.length > 10 && (
                                <li>... and {importData.import_result.validation_errors.length - 10} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {/* Show processing errors */}
                        {importData.import_result.errors && importData.import_result.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Processing Errors:</p>
                            <ul className="list-disc list-inside mt-1">
                              {importData.import_result.errors.slice(0, 10).map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                              {importData.import_result.errors.length > 10 && (
                                <li>... and {importData.import_result.errors.length - 10} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Import History Button */}
                  <div className="mb-6">
                    <button
                      onClick={loadImportHistory}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Load Import History
                    </button>
                  </div>

                  {/* Import History */}
                  {importData.import_history && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Import Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(importData.import_history.import_statistics).map(([type, stats]) => (
                          <div key={type} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 capitalize mb-2">
                              {type.replace('_', ' ')}
                            </h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium">{stats.total_records}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Recent:</span>
                                <span className="font-medium">{stats.recent_records}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Last updated: {new Date(importData.import_history.last_updated).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* CSV Format Guide */}
                  <div className="mt-8 border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">CSV Format Guide</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h5 className="font-medium text-blue-900 mb-2">Required Format for {importData.file_type}:</h5>
                      <div className="text-sm text-blue-800">
                        {importData.file_type === 'visitors' && (
                          <p>Headers: id, date_iso, name, phone, email, country, county_or_prefecture, city_town, program, language, testimony, source, consent_y_n</p>
                        )}
                        {importData.file_type === 'donations' && (
                          <p>Headers: id, date_iso, donor_name, phone, email, country, method, amount_currency, amount, project_code, note, receipt_no, anonymous_y_n</p>
                        )}
                        {importData.file_type === 'projects' && (
                          <p>Headers: project_code, name, description_short, start_date_iso, end_date_iso, status, budget_currency, budget_amount, manager, country, tags</p>
                        )}
                        {importData.file_type === 'finance' && (
                          <p>Headers: id, date_iso, type, category, subcategory, amount_currency, amount, method, reference, project_code, notes, attachment_url</p>
                        )}
                        {importData.file_type === 'tasks_reminders' && (
                          <p>Headers: id, due_date_iso, agency, description_short, amount_currency, amount, status, recurrence, contact_person, notes</p>
                        )}
                        {importData.file_type === 'users_roles' && (
                          <p>Headers: id, name, role, email, country, language_default, phone</p>
                        )}
                        {importData.file_type === 'invoices' && (
                          <p>Headers: id, date_iso, donor_name, contact, project_code, amount_currency, amount, status, due_date_iso, receipt_no</p>
                        )}
                        {importData.file_type === 'stories' && (
                          <p>Headers: id, date_iso, name_or_anonymous, location, country, program, language, story_text, approved_y_n, publish_url</p>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-blue-700">
                        <p>• Dates should be in YYYY-MM-DD format</p>
                        <p>• Currency codes: USD or LRD</p>
                        <p>• Y/N fields: Use Y or N only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <div>
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    CRM Settings & Configuration
                  </h3>
                  
                  {/* Settings Menu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                      onClick={() => setCurrentView('merge-status')}
                      className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">🔄</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          Merge & SSO Status
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Analyze and consolidate CRM modules. Check integration status, detect standalone components, and get automated merge recommendations.
                      </p>
                      <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                        View Integration Status →
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow opacity-50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">🔐</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          Authentication Settings
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Configure SSO, user roles, and access permissions across all CRM modules.
                      </p>
                      <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                        Coming Soon →
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow opacity-50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">🌐</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          Language & Localization
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Manage translations, regional settings, and language preferences for EN/FR support.
                      </p>
                      <div className="mt-4 flex items-center text-yellow-600 text-sm font-medium">
                        Coming Soon →
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow opacity-50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">📊</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          Data Export & Sync
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Configure automated exports, data synchronization, and backup settings.
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                        Coming Soon →
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow opacity-50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">🛡️</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          Security & Compliance
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Manage data privacy, GDPR compliance, and security audit logs.
                      </p>
                      <div className="mt-4 flex items-center text-red-600 text-sm font-medium">
                        Coming Soon →
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow opacity-50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">⚙️</span>
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-900">
                          System Configuration
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Configure system-wide settings, API endpoints, and performance optimizations.
                      </p>
                      <div className="mt-4 flex items-center text-gray-600 text-sm font-medium">
                        Coming Soon →
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">System Information</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          CRM Version: 2.1.0 | Last Updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        System Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Merge Status View */}
          {currentView === 'merge-status' && (
            <CRMMergeStatus onBack={() => setCurrentView('settings')} />
          )}

          {/* Integrated CRM Modules */}
          {currentView === 'visitors' && (
            <CRMVisitors crmAuth={localStorage.getItem('crmAuth')} />
          )}

          {currentView === 'donations' && (
            <CRMDonations crmAuth={localStorage.getItem('crmAuth')} />
          )}

          {currentView === 'projects' && (
            <CRMProjects crmAuth={localStorage.getItem('crmAuth')} />
          )}

          {/* Contact Detail Modal */}
          {selectedContact && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> {selectedContact.name}
                    </div>
                    <div>
                      <strong>Email:</strong> <a href={`mailto:${selectedContact.email}`} className="text-kioo-primary hover:underline">{selectedContact.email}</a>
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedContact.phone || 'N/A'}
                    </div>
                    <div>
                      <strong>Organization:</strong> {selectedContact.organization || 'N/A'}
                    </div>
                    <div>
                      <strong>Location:</strong> {selectedContact.city ? `${selectedContact.city}, ` : ''}{selectedContact.country || 'N/A'}
                    </div>
                    <div>
                      <strong>Type:</strong> <span className="capitalize">{selectedContact.contact_type}</span>
                    </div>
                    <div>
                      <strong>Source:</strong> <span className="capitalize">{selectedContact.source.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(selectedContact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedContact.notes && (
                    <div className="mt-4">
                      <strong>Notes:</strong>
                      <p className="mt-1 text-gray-700">{selectedContact.notes}</p>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => handleDeleteContact(selectedContact.id)}
                      className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CRM;