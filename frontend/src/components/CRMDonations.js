import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const CRMDonations = ({ crmAuth }) => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totals, setTotals] = useState({ thisMonth: 0, ytd: 0 });
  const [filters, setFilters] = useState({
    search: '',
    payment_method: '',
    currency: '',
    date_range: ''
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  // Form state for new donation
  const [newDonation, setNewDonation] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    currency: 'USD',
    payment_method: 'bank_transfer',
    purpose: 'general',
    notes: '',
    is_recurring: false,
    is_anonymous: false
  });

  // Load donations data
  const loadDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/donations`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        console.error('Failed to load donations');
      }
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load donation totals
  const loadTotals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/donations/totals`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTotals(data);
      }
    } catch (error) {
      console.error('Error loading donation totals:', error);
    }
  };

  // Create new donation
  const handleCreateDonation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newDonation,
          amount: parseFloat(newDonation.amount)
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewDonation({
          donor_name: '',
          donor_email: '',
          donor_phone: '',
          amount: '',
          currency: 'USD',
          payment_method: 'bank_transfer',
          purpose: 'general',
          notes: '',
          is_recurring: false,
          is_anonymous: false
        });
        await loadDonations();
        await loadTotals();
      } else {
        console.error('Failed to create donation');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete donation
  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm(t('Are you sure you want to delete this donation?') || 'Are you sure you want to delete this donation?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/donations/${donationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadDonations();
        await loadTotals();
      } else {
        console.error('Failed to delete donation');
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  // Export donations
  const handleExportDonations = async (format = 'csv') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/donations/export?format=${format}`, {
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
        a.download = `donations_export.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    if (filters.search && !donation.donor_name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !donation.donor_email?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.payment_method && donation.payment_method !== filters.payment_method) {
      return false;
    }
    if (filters.currency && donation.currency !== filters.currency) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    loadDonations();
    loadTotals();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                💝 {t('Donations Management') || 'Donations Management'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t('Track donations, manage donors, and monitor financial contributions') || 'Track donations, manage donors, and monitor financial contributions'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExportDonations('csv')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                📊 {t('Export CSV') || 'Export CSV'}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                ➕ {t('Add Donation') || 'Add Donation'}
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">${totals.thisMonth?.toLocaleString() || '0'}</div>
              <div className="text-sm text-green-600">{t('This Month') || 'This Month'}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">${totals.ytd?.toLocaleString() || '0'}</div>
              <div className="text-sm text-blue-600">{t('Year to Date') || 'Year to Date'}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{donations.length}</div>
              <div className="text-sm text-purple-600">{t('Total Donations') || 'Total Donations'}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-800">
                {donations.length > 0 ? Math.round(totals.ytd / donations.length) : 0}
              </div>
              <div className="text-sm text-amber-600">{t('Average Donation') || 'Average Donation'}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder={t('Search donors...') || 'Search donors...'}
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={filters.payment_method}
              onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('All Payment Methods') || 'All Payment Methods'}</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="online">Online</option>
            </select>
            <select
              value={filters.currency}
              onChange={(e) => setFilters({...filters, currency: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('All Currencies') || 'All Currencies'}</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="SLL">SLL</option>
            </select>
            <button
              onClick={() => setFilters({ search: '', payment_method: '', currency: '', date_range: '' })}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              🔄 {t('Clear Filters') || 'Clear Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Donor') || 'Donor'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Amount') || 'Amount'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Payment Method') || 'Payment Method'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Purpose') || 'Purpose'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Date') || 'Date'}
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('No donations found') || 'No donations found'}
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.is_anonymous ? t('Anonymous Donor') || 'Anonymous Donor' : donation.donor_name}
                      </div>
                      <div className="text-sm text-gray-500">{donation.donor_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {donation.currency} {donation.amount?.toLocaleString()}
                      </div>
                      {donation.is_recurring && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          🔄 {t('Recurring') || 'Recurring'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {donation.payment_method?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {donation.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDonation(donation);
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✏️ {t('Edit') || 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDeleteDonation(donation.id)}
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

      {/* Add Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  ➕ {t('Add New Donation') || 'Add New Donation'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDonation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Donor Name') || 'Donor Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDonation.donor_name}
                      onChange={(e) => setNewDonation({...newDonation, donor_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Donor Email') || 'Donor Email'}
                    </label>
                    <input
                      type="email"
                      value={newDonation.donor_email}
                      onChange={(e) => setNewDonation({...newDonation, donor_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Amount') || 'Amount'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newDonation.amount}
                      onChange={(e) => setNewDonation({...newDonation, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Currency') || 'Currency'}
                    </label>
                    <select
                      value={newDonation.currency}
                      onChange={(e) => setNewDonation({...newDonation, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="SLL">SLL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Payment Method') || 'Payment Method'}
                    </label>
                    <select
                      value={newDonation.payment_method}
                      onChange={(e) => setNewDonation({...newDonation, payment_method: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Purpose') || 'Purpose'}
                    </label>
                    <select
                      value={newDonation.purpose}
                      onChange={(e) => setNewDonation({...newDonation, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="general">General</option>
                      <option value="programs">Programs</option>
                      <option value="equipment">Equipment</option>
                      <option value="missions">Missions</option>
                      <option value="building">Building Fund</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Notes') || 'Notes'}
                  </label>
                  <textarea
                    value={newDonation.notes}
                    onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_recurring"
                      checked={newDonation.is_recurring}
                      onChange={(e) => setNewDonation({...newDonation, is_recurring: e.target.checked})}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900">
                      {t('Recurring donation') || 'Recurring donation'}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_anonymous"
                      checked={newDonation.is_anonymous}
                      onChange={(e) => setNewDonation({...newDonation, is_anonymous: e.target.checked})}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-900">
                      {t('Anonymous donation') || 'Anonymous donation'}
                    </label>
                  </div>
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
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? (t('Creating...') || 'Creating...') : (t('Create Donation') || 'Create Donation')}
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

export default CRMDonations;