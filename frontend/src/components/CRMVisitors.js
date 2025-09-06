import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const CRMVisitors = ({ crmAuth }) => {
  const { t } = useTranslation();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    source: '',
    date_range: ''
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  // Form state for new visitor
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    source: 'website',
    testimony: '',
    prayer_request: '',
    follow_up_needed: false,
    preferred_language: 'en'
  });

  // Load visitors data
  const loadVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/visitors`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      } else {
        console.error('Failed to load visitors');
      }
    } catch (error) {
      console.error('Error loading visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load visitor statistics
  const loadStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/visitors/stats-summary`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading visitor stats:', error);
    }
  };

  // Create new visitor
  const handleCreateVisitor = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/visitors`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVisitor)
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewVisitor({
          name: '',
          email: '',
          phone: '',
          country: '',
          city: '',
          source: 'website',
          testimony: '',
          prayer_request: '',
          follow_up_needed: false,
          preferred_language: 'en'
        });
        await loadVisitors();
        await loadStats();
      } else {
        console.error('Failed to create visitor');
      }
    } catch (error) {
      console.error('Error creating visitor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete visitor
  const handleDeleteVisitor = async (visitorId) => {
    if (!window.confirm(t('Are you sure you want to delete this visitor?') || 'Are you sure you want to delete this visitor?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/visitors/${visitorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadVisitors();
        await loadStats();
      } else {
        console.error('Failed to delete visitor');
      }
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  };

  // Export visitors
  const handleExportVisitors = async (format = 'csv') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/visitors/export?format=${format}`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitors_export.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Filter visitors
  const filteredVisitors = visitors.filter(visitor => {
    if (filters.search && !visitor.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !visitor.email?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.country && visitor.country !== filters.country) {
      return false;
    }
    if (filters.source && visitor.source !== filters.source) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    loadVisitors();
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                👥 {t('Visitor Management') || 'Visitor Management'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t('Manage visitor records, testimonies, and follow-ups') || 'Manage visitor records, testimonies, and follow-ups'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExportVisitors('csv')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                📊 {t('Export CSV') || 'Export CSV'}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                ➕ {t('Add Visitor') || 'Add Visitor'}
              </button>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">{stats.total_visitors || 0}</div>
                <div className="text-sm text-blue-600">{t('Total Visitors') || 'Total Visitors'}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-800">{stats.this_month || 0}</div>
                <div className="text-sm text-green-600">{t('This Month') || 'This Month'}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">{stats.testimonies || 0}</div>
                <div className="text-sm text-purple-600">{t('Testimonies') || 'Testimonies'}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-800">{stats.follow_ups || 0}</div>
                <div className="text-sm text-amber-600">{t('Follow-ups Needed') || 'Follow-ups Needed'}</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder={t('Search visitors...') || 'Search visitors...'}
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('All Countries') || 'All Countries'}</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Guinea">Guinea</option>
              <option value="Liberia">Liberia</option>
              <option value="Mali">Mali</option>
              <option value="Ghana">Ghana</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilters({...filters, source: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('All Sources') || 'All Sources'}</option>
              <option value="website">Website</option>
              <option value="radio">Radio</option>
              <option value="social_media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="event">Event</option>
            </select>
            <button
              onClick={() => setFilters({ search: '', country: '', source: '', date_range: '' })}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              🔄 {t('Clear Filters') || 'Clear Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Visitor') || 'Visitor'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Contact') || 'Contact'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Location') || 'Location'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Source') || 'Source'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Status') || 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Actions') || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('No visitors found') || 'No visitors found'}
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                      <div className="text-sm text-gray-500">{t('Language') || 'Language'}: {visitor.preferred_language}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.email}</div>
                      <div className="text-sm text-gray-500">{visitor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.city}</div>
                      <div className="text-sm text-gray-500">{visitor.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {visitor.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {visitor.testimony && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            📝 {t('Testimony') || 'Testimony'}
                          </span>
                        )}
                        {visitor.follow_up_needed && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                            📞 {t('Follow-up') || 'Follow-up'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ✏️ {t('Edit') || 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDeleteVisitor(visitor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ {t('Delete') || 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  ➕ {t('Add New Visitor') || 'Add New Visitor'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateVisitor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Name') || 'Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVisitor.name}
                      onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Email') || 'Email'}
                    </label>
                    <input
                      type="email"
                      value={newVisitor.email}
                      onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Phone') || 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={newVisitor.phone}
                      onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('City') || 'City'}
                    </label>
                    <input
                      type="text"
                      value={newVisitor.city}
                      onChange={(e) => setNewVisitor({...newVisitor, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Country') || 'Country'}
                    </label>
                    <select
                      value={newVisitor.country}
                      onChange={(e) => setNewVisitor({...newVisitor, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('Select Country') || 'Select Country'}</option>
                      <option value="Sierra Leone">Sierra Leone</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Mali">Mali</option>
                      <option value="Ghana">Ghana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Source') || 'Source'}
                    </label>
                    <select
                      value={newVisitor.source}
                      onChange={(e) => setNewVisitor({...newVisitor, source: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="radio">Radio</option>
                      <option value="social_media">Social Media</option>
                      <option value="referral">Referral</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Testimony') || 'Testimony'}
                  </label>
                  <textarea
                    value={newVisitor.testimony}
                    onChange={(e) => setNewVisitor({...newVisitor, testimony: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Prayer Request') || 'Prayer Request'}
                  </label>
                  <textarea
                    value={newVisitor.prayer_request}
                    onChange={(e) => setNewVisitor({...newVisitor, prayer_request: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="follow_up_needed"
                    checked={newVisitor.follow_up_needed}
                    onChange={(e) => setNewVisitor({...newVisitor, follow_up_needed: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="follow_up_needed" className="ml-2 block text-sm text-gray-900">
                    {t('Follow-up needed') || 'Follow-up needed'}
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    {t('Cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (t('Creating...') || 'Creating...') : (t('Create Visitor') || 'Create Visitor')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMVisitors;