import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
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
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setContacts([]);
    setStats(null);
    setCurrentView('dashboard');
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

  // Apply filters
  useEffect(() => {
    if (isAuthenticated) {
      loadContacts();
    }
  }, [filters.contact_type, filters.source, filters.country]);

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