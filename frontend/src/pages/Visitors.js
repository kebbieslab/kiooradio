import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../utils/i18n';

const Visitors = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [stats, setStats] = useState(null);
  
  const { t, currentLanguage } = useTranslation();
  
  // Filters
  const [filters, setFilters] = useState({
    month: '',
    country: '',
    program: '',
    source: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    date_iso: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    email: '',
    country: '',
    county_or_prefecture: '',
    city_town: '',
    program: '',
    language: currentLanguage === 'fr' ? 'French' : 'English',
    testimony: '',
    source: 'web',
    consent_y_n: 'Y'
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadVisitors();
      loadStats();
    } else {
      setError(t('invalid_credentials') || 'Invalid username or password');
    }
  };

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.country) params.append('country', filters.country);
      if (filters.program) params.append('program', filters.program);
      if (filters.source) params.append('source', filters.source);
      params.append('limit', '1000');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors?${params}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      } else {
        setError(t('failed_to_load_visitors') || 'Failed to load visitors');
      }
    } catch (error) {
      console.error('Failed to load visitors:', error);
      setError(t('failed_to_load_visitors') || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/filter-stats`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingVisitor 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/visitors/${editingVisitor.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/visitors`;
      
      const method = editingVisitor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        loadVisitors();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || (t('failed_to_save_visitor') || 'Failed to save visitor'));
      }
    } catch (error) {
      console.error('Failed to save visitor:', error);
      setError(t('failed_to_save_visitor') || 'Failed to save visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      date_iso: visitor.date_iso,
      name: visitor.name || '',
      phone: visitor.phone || '',
      email: visitor.email || '',
      country: visitor.country || '',
      county_or_prefecture: visitor.county_or_prefecture || '',
      city_town: visitor.city_town || '',
      program: visitor.program || '',
      language: visitor.language || '',
      testimony: visitor.testimony || '',
      source: visitor.source || 'web',
      consent_y_n: visitor.consent_y_n || 'Y'
    });
    setShowModal(true);
  };

  const handleDelete = async (visitorId) => {
    if (!window.confirm(t('confirm_delete_visitor') || 'Are you sure you want to delete this visitor?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/${visitorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        loadVisitors();
      } else {
        setError(t('failed_to_delete_visitor') || 'Failed to delete visitor');
      }
    } catch (error) {
      console.error('Failed to delete visitor:', error);
      setError(t('failed_to_delete_visitor') || 'Failed to delete visitor');
    }
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.country) params.append('country', filters.country);
      if (filters.program) params.append('program', filters.program);
      if (filters.source) params.append('source', filters.source);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/export/${format}?${params}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `visitors_export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        setError(t('failed_to_export') || 'Failed to export data');
      }
    } catch (error) {
      console.error('Failed to export:', error);
      setError(t('failed_to_export') || 'Failed to export data');
    }
  };

  const resetForm = () => {
    setFormData({
      date_iso: new Date().toISOString().split('T')[0],
      name: '',
      phone: '',
      email: '',
      country: '',
      county_or_prefecture: '',
      city_town: '',
      program: '',
      language: currentLanguage === 'fr' ? 'French' : 'English',
      testimony: '',
      source: 'web',
      consent_y_n: 'Y'
    });
    setEditingVisitor(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setVisitors([]);
    setStats(null);
  };

  // Apply filters
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'import-data' && !importData.import_history) {
        loadImportHistory();
      }
      loadVisitors();
    }
  }, [filters]);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>{t('visitors_management') || 'Visitors Management'} - Kioo Radio</title>
        </Helmet>

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('visitors_access') || 'Visitors Access'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('visitors_access_description') || 'Please enter your credentials to access the Visitors Management system'}
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    type="text"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                    placeholder={t('username') || 'Username'}
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                    placeholder={t('password') || 'Password'}
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
                  {t('access_visitors') || 'Access Visitors'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>{t('visitors_management') || 'Visitors Management'} - Kioo Radio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('visitorsTestimonies') || 'Visitors & Testimonies'}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('manageVisitorRecords') || 'Manage visitor records and testimonies'}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-kioo-primary text-white text-sm font-medium rounded-md hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
                >
                  {t('addVisitorTestimony') || 'Add Visitor/Testimony'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('logout') || 'Logout'}
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
              <p className="mt-2 text-gray-600">{t('loading') || 'Loading...'}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
              <button onClick={() => setError('')} className="float-right font-bold">×</button>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('filters') || 'Filters'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('month') || 'Month'}
                  </label>
                  <input
                    type="month"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.month}
                    onChange={(e) => setFilters({...filters, month: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('country') || 'Country'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.country}
                    onChange={(e) => setFilters({...filters, country: e.target.value})}
                  >
                    <option value="">{t('allCountries') || 'All Countries'}</option>
                    {stats && stats.countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('program') || 'Program'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.program}
                    onChange={(e) => setFilters({...filters, program: e.target.value})}
                  >
                    <option value="">{t('allPrograms') || 'All Programs'}</option>
                    {stats && stats.programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('source') || 'Source'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.source}
                    onChange={(e) => setFilters({...filters, source: e.target.value})}
                  >
                    <option value="">{t('allSources') || 'All Sources'}</option>
                    {stats && stats.sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setFilters({ month: '', country: '', program: '', source: '' })}
                  className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('clearFilters') || 'Clear Filters'}
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('exportCsv') || 'Export CSV'}
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('exportXlsx') || 'Export XLSX'}
                </button>
              </div>
            </div>
          </div>

          {/* Visitors Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('visitorsList') || 'Visitors List'} ({visitors.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('date') || 'Date'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('name') || 'Name'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('phone') || 'Phone'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('email') || 'Email'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('country') || 'Country'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('program') || 'Program'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('language') || 'Language'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('testimony') || 'Testimony'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('source') || 'Source'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('consent') || 'Consent'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.date_iso}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.country || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.program || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.language || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {visitor.testimony ? (
                            <span title={visitor.testimony}>
                              {visitor.testimony.length > 50 
                                ? visitor.testimony.substring(0, 50) + '...' 
                                : visitor.testimony}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="capitalize">{visitor.source || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            visitor.consent_y_n === 'Y' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {visitor.consent_y_n === 'Y' ? (t('yes') || 'Yes') : (t('no') || 'No')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(visitor)}
                              className="text-kioo-primary hover:text-kioo-primary-dark"
                            >
                              {t('edit') || 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDelete(visitor.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {t('delete') || 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {visitors.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    {t('noVisitorsFound') || 'No visitors found'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingVisitor 
                      ? (t('editVisitor') || 'Edit Visitor') 
                      : (t('addVisitorTestimony') || 'Add Visitor/Testimony')
                    }
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('date') || 'Date'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.date_iso}
                        onChange={(e) => setFormData({...formData, date_iso: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('name') || 'Name'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('phone') || 'Phone'}
                      </label>
                      <input
                        type="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('email') || 'Email'}
                      </label>
                      <input
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('country') || 'Country'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                      >
                        <option value="">{t('selectCountry') || 'Select Country'}</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Other">{t('other') || 'Other'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('countyPrefecture') || 'County/Prefecture'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.county_or_prefecture}
                        onChange={(e) => setFormData({...formData, county_or_prefecture: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('cityTown') || 'City/Town'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.city_town}
                        onChange={(e) => setFormData({...formData, city_town: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('program') || 'Program'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                      >
                        <option value="">{t('selectProgram') || 'Select Program'}</option>
                        <option value="Morning Devotion">{t('morningDevotion') || 'Morning Devotion'}</option>
                        <option value="French Gospel">{t('frenchGospel') || 'French Gospel'}</option>
                        <option value="Evening Prayer">{t('eveningPrayer') || 'Evening Prayer'}</option>
                        <option value="Youth Hour">{t('youthHour') || 'Youth Hour'}</option>
                        <option value="Sunday Service">{t('sundayService') || 'Sunday Service'}</option>
                        <option value="Bible Study">{t('bibleStudy') || 'Bible Study'}</option>
                        <option value="Other">{t('other') || 'Other'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('language') || 'Language'}
                      </label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                      >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="French">Français</option>
                        <option value="Kpelle">Kpelle</option>
                        <option value="Bassa">Bassa</option>
                        <option value="Other">{t('other') || 'Other'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('source') || 'Source'}
                      </label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                      >
                        <option value="web">{t('website') || 'Website'}</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="call">{t('phoneCall') || 'Phone Call'}</option>
                        <option value="visit">{t('inPerson') || 'In Person'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('consent') || 'Consent'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.consent_y_n}
                        onChange={(e) => setFormData({...formData, consent_y_n: e.target.value})}
                      >
                        <option value="Y">{t('yesConsent') || 'Yes - Consent given'}</option>
                        <option value="N">{t('noConsent') || 'No - Consent not given'}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('testimony') || 'Testimony'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                      value={formData.testimony}
                      onChange={(e) => setFormData({...formData, testimony: e.target.value})}
                      placeholder={t('testimonyPlaceholder') || 'Share how Kioo Radio has impacted your life...'}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {t('cancel') || 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
                    >
                      {loading 
                        ? (t('saving') || 'Saving...') 
                        : editingVisitor 
                          ? (t('updateVisitor') || 'Update Visitor')
                          : (t('addVisitor') || 'Add Visitor')
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Visitors;
        setGaConnected(true);
      }
      
      loadAnalyticsData();
    } else {
      setError('Invalid username or password');
    }
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      // Track data refresh event
      if (gaConnected) {
        ReactGA.event({
          category: 'Analytics',
          action: 'Data Refresh',
          label: 'Visitor Dashboard'
        });
      }
      
      // Load visitor stats
      const statsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/stats`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent visitors
      const visitorsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/recent`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json();
        setRecentVisitors(visitorsData);
      }

      // Load click analytics
      const clicksResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/clicks`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (clicksResponse.ok) {
        const clicksData = await clicksResponse.json();
        setClickAnalytics(clicksData);
      }
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setStats(null);
    setRecentVisitors([]);
    setClickAnalytics(null);
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(loadAnalyticsData, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Visitor Analytics Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your credentials to access the visitor analytics dashboard
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
                Access Analytics
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Analytics dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitor Analytics Dashboard</h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-500">Real-time visitor tracking for Kioo Radio</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gaConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${gaConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                    {gaConnected ? 'GA4 Connected' : 'GA4 Setup Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadAnalyticsData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && !stats ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-kioo-primary"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.total_visitors}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-kioo-secondary rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">🔄</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.unique_visitors}</dd>
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
                            <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.visitors_today}</dd>
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
                            <span className="text-white font-bold">🔴</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Live Status</dt>
                            <dd className="text-lg font-medium text-green-600">Active</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Countries */}
              {stats?.top_countries && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Countries</h3>
                    <div className="space-y-3">
                      {stats.top_countries.map((country, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {country._id || 'Unknown'}
                          </span>
                          <span className="text-sm text-gray-500">{country.count} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Pages */}
              {stats?.top_pages && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Popular Pages</h3>
                    <div className="space-y-3">
                      {stats.top_pages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {new URL(page._id).pathname}
                          </span>
                          <span className="text-sm text-gray-500">{page.count} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Visitors */}
            {recentVisitors.length > 0 && (
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Visitors</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentVisitors.slice(0, 10).map((visitor, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(visitor.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.city}, {visitor.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.page_url ? new URL(visitor.page_url).pathname : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {visitor.ip_address}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Click Analytics */}
            {clickAnalytics && (
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Click Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Most Clicked Elements</h4>
                      <div className="space-y-2">
                        {clickAnalytics.click_stats.map((stat, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-900">{stat._id}</span>
                            <span className="text-sm text-gray-500">{stat.count} clicks</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Recent Clicks</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {clickAnalytics.recent_clicks.slice(0, 5).map((click, index) => (
                          <div key={index} className="text-xs text-gray-600 border-b pb-1">
                            <div className="font-medium">{click.element_type}</div>
                            <div>{click.element_text?.substring(0, 50)}...</div>
                            <div className="text-gray-400">{new Date(click.timestamp).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Visitors;