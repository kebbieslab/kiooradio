import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../utils/i18n';

const Donations = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [stats, setStats] = useState(null);
  const [totals, setTotals] = useState(null);
  
  const { t, currentLanguage } = useTranslation();
  
  // Filters
  const [filters, setFilters] = useState({
    month: '',
    project_code: '',
    method: '',
    anonymous: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    date_iso: new Date().toISOString().split('T')[0],
    donor_name: '',
    phone: '',
    email: '',
    country: '',
    method: 'OrangeMoney',
    amount_currency: 'USD',
    amount: '',
    project_code: '',
    note: '',
    receipt_no: '',
    anonymous_y_n: 'N'
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadDonations();
      loadStats();
      loadTotals();
    } else {
      setError(t('invalidCredentials') || 'Invalid username or password');
    }
  };

  const loadDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.project_code) params.append('project_code', filters.project_code);
      if (filters.method) params.append('method', filters.method);
      if (filters.anonymous) params.append('anonymous', filters.anonymous);
      params.append('limit', '1000');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations?${params}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        setError(t('failedToLoadDonations') || 'Failed to load donations');
      }
    } catch (error) {
      console.error('Failed to load donations:', error);
      setError(t('failedToLoadDonations') || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations/management-stats`, {
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

  const loadTotals = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations/totals/summary`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTotals(data);
      }
    } catch (error) {
      console.error('Failed to load totals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(t('amountMustBeGreaterThanZero') || 'Amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      const url = editingDonation 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/donations/${editingDonation.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/donations`;
      
      const method = editingDonation ? 'PUT' : 'POST';

      // Prepare data for submission
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        loadDonations();
        loadTotals(); // Refresh totals after new donation
      } else {
        const errorData = await response.json();
        setError(errorData.detail || (t('failedToSaveDonation') || 'Failed to save donation'));
      }
    } catch (error) {
      console.error('Failed to save donation:', error);
      setError(t('failedToSaveDonation') || 'Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setFormData({
      date_iso: donation.date_iso,
      donor_name: donation.donor_name || '',
      phone: donation.phone || '',
      email: donation.email || '',
      country: donation.country || '',
      method: donation.method || 'OrangeMoney',
      amount_currency: donation.amount_currency || 'USD',
      amount: donation.amount?.toString() || '',
      project_code: donation.project_code || '',
      note: donation.note || '',
      receipt_no: donation.receipt_no || '',
      anonymous_y_n: donation.anonymous_y_n || 'N'
    });
    setShowModal(true);
  };

  const handleDelete = async (donationId) => {
    if (!window.confirm(t('confirmDeleteDonation') || 'Are you sure you want to delete this donation?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations/${donationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        loadDonations();
        loadTotals(); // Refresh totals after deletion
      } else {
        setError(t('failedToDeleteDonation') || 'Failed to delete donation');
      }
    } catch (error) {
      console.error('Failed to delete donation:', error);
      setError(t('failedToDeleteDonation') || 'Failed to delete donation');
    }
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.project_code) params.append('project_code', filters.project_code);
      if (filters.method) params.append('method', filters.method);
      if (filters.anonymous) params.append('anonymous', filters.anonymous);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations/export/${format}?${params}`, {
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
        a.download = `donations_export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        setError(t('failedToExport') || 'Failed to export data');
      }
    } catch (error) {
      console.error('Failed to export:', error);
      setError(t('failedToExport') || 'Failed to export data');
    }
  };

  const resetForm = () => {
    setFormData({
      date_iso: new Date().toISOString().split('T')[0],
      donor_name: '',
      phone: '',
      email: '',
      country: '',
      method: 'OrangeMoney',
      amount_currency: 'USD',
      amount: '',
      project_code: '',
      note: '',
      receipt_no: '',
      anonymous_y_n: 'N'
    });
    setEditingDonation(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setDonations([]);
    setStats(null);
    setTotals(null);
  };

  // Apply filters
  useEffect(() => {
    if (isAuthenticated) {
      loadDonations();
    }
  }, [filters]);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>{t('donationsManagement') || 'Donations Management'} - Kioo Radio</title>
        </Helmet>

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('donationsAccess') || 'Donations Access'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('donationsAccessDescription') || 'Please enter your credentials to access the Donations Management system'}
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
                  {t('accessDonations') || 'Access Donations'}
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
        <title>{t('donationsManagement') || 'Donations Management'} - Kioo Radio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('donationsManagement') || 'Donations Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('manageDonationRecords') || 'Manage donation records and track contributions'}
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
                  {t('addDonation') || 'Add Donation'}
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

          {/* Running Totals */}
          {totals && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {t('runningTotals') || 'Running Totals'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* This Month */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">
                      {t('thisMonth') || 'This Month'} ({totals.month.period})
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">{t('usdTotal') || 'USD Total'}:</span>
                        <span className="font-bold text-blue-900">${totals.month.usd_total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">{t('lrdTotal') || 'LRD Total'}:</span>
                        <span className="font-bold text-blue-900">L${totals.month.lrd_total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">{t('totalDonations') || 'Total Donations'}:</span>
                        <span className="font-bold text-blue-900">{totals.month.total_donations}</span>
                      </div>
                    </div>
                  </div>

                  {/* Year to Date */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">
                      {t('yearToDate') || 'Year to Date'} ({totals.ytd.period})
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-700">{t('usdTotal') || 'USD Total'}:</span>
                        <span className="font-bold text-green-900">${totals.ytd.usd_total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">{t('lrdTotal') || 'LRD Total'}:</span>
                        <span className="font-bold text-green-900">L${totals.ytd.lrd_total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">{t('totalDonations') || 'Total Donations'}:</span>
                        <span className="font-bold text-green-900">{totals.ytd.total_donations}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    {t('projectCode') || 'Project Code'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.project_code}
                    onChange={(e) => setFilters({...filters, project_code: e.target.value})}
                  >
                    <option value="">{t('allProjects') || 'All Projects'}</option>
                    {stats && stats.project_codes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('paymentMethod') || 'Payment Method'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.method}
                    onChange={(e) => setFilters({...filters, method: e.target.value})}
                  >
                    <option value="">{t('allMethods') || 'All Methods'}</option>
                    {stats && stats.methods.map(method => (
                      <option key={method} value={method}>
                        {method === 'OrangeMoney' ? t('orangeMoney') || 'Orange Money' :
                         method === 'Lonestar' ? t('lonestar') || 'Lonestar' :
                         method === 'PayPal' ? t('paypal') || 'PayPal' :
                         method === 'Bank' ? t('bank') || 'Bank Transfer' : method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('anonymous') || 'Anonymous'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.anonymous}
                    onChange={(e) => setFilters({...filters, anonymous: e.target.value})}
                  >
                    <option value="">{t('allAnonymous') || 'All (Anonymous)'}</option>
                    <option value="Y">{t('anonymousYes') || 'Anonymous Only'}</option>
                    <option value="N">{t('anonymousNo') || 'Public Only'}</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setFilters({ month: '', project_code: '', method: '', anonymous: '' })}
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

          {/* Donations Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('donationsList') || 'Donations List'} ({donations.length})
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
                        {t('donorName') || 'Donor Name'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('country') || 'Country'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('paymentMethod') || 'Method'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('amountCurrency') || 'Currency'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('amount') || 'Amount'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('projectCode') || 'Project'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('note') || 'Note'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('receiptNo') || 'Receipt'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('anonymous') || 'Anonymous'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.date_iso}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.donor_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.country || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.method || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.amount_currency || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.amount ? donation.amount.toFixed(2) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.project_code || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {donation.note ? (
                            <span title={donation.note}>
                              {donation.note.length > 30 
                                ? donation.note.substring(0, 30) + '...' 
                                : donation.note}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.receipt_no || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.anonymous_y_n === 'Y' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {donation.anonymous_y_n === 'Y' ? (t('yes') || 'Yes') : (t('no') || 'No')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(donation)}
                              className="text-kioo-primary hover:text-kioo-primary-dark"
                            >
                              {t('edit') || 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDelete(donation.id)}
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
                
                {donations.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    {t('noDonationsFound') || 'No donations found'}
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
                    {editingDonation 
                      ? (t('editDonation') || 'Edit Donation') 
                      : (t('addDonation') || 'Add Donation')
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
                        {t('donorName') || 'Donor Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.donor_name}
                        onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
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
                        {t('country') || 'Country'}
                      </label>
                      <select
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
                        {t('paymentMethod') || 'Payment Method'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.method}
                        onChange={(e) => setFormData({...formData, method: e.target.value})}
                      >
                        <option value="OrangeMoney">{t('orangeMoney') || 'Orange Money'}</option>
                        <option value="Lonestar">{t('lonestar') || 'Lonestar'}</option>
                        <option value="PayPal">{t('paypal') || 'PayPal'}</option>
                        <option value="Bank">{t('bank') || 'Bank Transfer'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('amountCurrency') || 'Currency'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.amount_currency}
                        onChange={(e) => setFormData({...formData, amount_currency: e.target.value})}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="LRD">LRD (L$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('amount') || 'Amount'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('projectCode') || 'Project Code'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.project_code}
                        onChange={(e) => setFormData({...formData, project_code: e.target.value})}
                        placeholder="e.g., RADIO-2025, BUILDING"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('receiptNo') || 'Receipt Number'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.receipt_no}
                        onChange={(e) => setFormData({...formData, receipt_no: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('anonymous') || 'Anonymous'}
                      </label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.anonymous_y_n}
                        onChange={(e) => setFormData({...formData, anonymous_y_n: e.target.value})}
                      >
                        <option value="N">{t('no') || 'No'} - Public</option>
                        <option value="Y">{t('yes') || 'Yes'} - Anonymous</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('note') || 'Note'}
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      placeholder="Additional notes about this donation..."
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
                        : editingDonation 
                          ? (t('updateDonation') || 'Update Donation')
                          : (t('addDonation') || 'Add Donation')
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

export default Donations;