import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';

const ClickUpCRM = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    status: 'new',
    notes: ''
  });

  const statuses = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'customer', label: 'Customer' },
    { value: 'lost', label: 'Lost' }
  ];

  useEffect(() => {
    loadContacts();
    loadStats();
    checkHealth();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError('');

    try {
      const authHeader = btoa('admin:kioo2025!');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clickup/contacts`, {
        headers: { 'Authorization': `Basic ${authHeader}` }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        throw new Error('Failed to load contacts from ClickUp');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const authHeader = btoa('admin:kioo2025!');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clickup/stats`, {
        headers: { 'Authorization': `Basic ${authHeader}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const checkHealth = async () => {
    try {
      const authHeader = btoa('admin:kioo2025!');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clickup/health`, {
        headers: { 'Authorization': `Basic ${authHeader}` }
      });

      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch (err) {
      console.error('Failed to check health:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authHeader = btoa('admin:kioo2025!');
      const url = selectedContact 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/clickup/contacts/${selectedContact.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/clickup/contacts`;
      
      const method = selectedContact ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadContacts();
        await loadStats();
        setShowAddForm(false);
        setSelectedContact(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          job_title: '',
          status: 'new',
          notes: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save contact');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      job_title: contact.job_title || '',
      status: contact.status || 'new',
      notes: contact.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact from ClickUp?')) {
      return;
    }

    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clickup/contacts/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${authHeader}` }
      });

      if (response.ok) {
        await loadContacts();
        await loadStats();
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      customer: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ClickUp CRM Integration</h1>
          <p className="text-gray-600 mt-1">Manage your contacts directly in ClickUp</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedContact(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              job_title: '',
              status: 'new',
              notes: ''
            });
          }}
          className="bg-kioo-primary text-white px-4 py-2 rounded-md hover:bg-kioo-primary/90 transition-colors"
        >
          Add Contact to ClickUp
        </button>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <div className={`mb-6 p-4 rounded-lg ${healthStatus.clickup_connected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${healthStatus.clickup_connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${healthStatus.clickup_connected ? 'text-green-800' : 'text-red-800'}`}>
              ClickUp {healthStatus.clickup_connected ? 'Connected' : 'Disconnected'}
            </span>
            {healthStatus.workspaces_count && (
              <span className="ml-2 text-green-600">({healthStatus.workspaces_count} workspaces)</span>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Contacts</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total_contacts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Companies</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total_companies}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">New Contacts</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.status_breakdown?.new || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Customers</h3>
            <p className="text-2xl font-bold text-green-600">{stats.status_breakdown?.customer || 0}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedContact ? 'Edit Contact' : 'Add New Contact to ClickUp'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (selectedContact ? 'Update Contact' : 'Add to ClickUp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Contacts in ClickUp</h2>
        </div>
        
        {loading && contacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading contacts from ClickUp...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ClickUp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        {contact.job_title && (
                          <div className="text-sm text-gray-500">{contact.job_title}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.company || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {contact.clickup_url ? (
                        <a
                          href={contact.clickup_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-kioo-primary hover:text-kioo-primary/80"
                        >
                          View in ClickUp
                        </a>
                      ) : (
                        <span className="text-gray-400">No URL</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-900"  
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {contacts.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                No contacts found in ClickUp. Click "Add Contact to ClickUp" to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickUpCRM;