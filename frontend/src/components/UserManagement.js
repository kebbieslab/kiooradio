import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const UserManagement = ({ onBack }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
  const crmAuth = localStorage.getItem('crmAuth');

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to load users:', await response.text());
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/stats`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadUsers();
        await loadUserStats();
        setShowDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.viewer;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPermissionsSummary = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No permissions';
    
    const moduleCount = permissions.length;
    const writeCount = permissions.filter(p => p.can_write).length;
    
    if (writeCount === 0) return `${moduleCount} modules (read-only)`;
    return `${moduleCount} modules (${writeCount} writable)`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            ← {t('Back') || 'Back'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            👥 {t('User Management') || 'User Management'}
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
        >
          ➕ {t('Add User') || 'Add User'}
        </button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{userStats.total_users || 0}</div>
          <div className="text-sm text-gray-600">{t('Total Users') || 'Total Users'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{userStats.active_users || 0}</div>
          <div className="text-sm text-gray-600">{t('Active Users') || 'Active Users'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{userStats.recent_logins_30_days || 0}</div>
          <div className="text-sm text-gray-600">{t('Recent Logins (30d)') || 'Recent Logins (30d)'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{userStats.users_created_this_month || 0}</div>
          <div className="text-sm text-gray-600">{t('New This Month') || 'New This Month'}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {t('User Accounts') || 'User Accounts'}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">{t('Loading users...') || 'Loading users...'}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p>{t('No users found') || 'No users found'}</p>
            <p className="text-sm mt-1">{t('Create your first user account to get started') || 'Create your first user account to get started'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('User') || 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Role') || 'Role'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Permissions') || 'Permissions'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Status') || 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Last Login') || 'Last Login'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getPermissionsSummary(user.permissions)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-50"
                        >
                          ✏️ {t('Edit') || 'Edit'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-50"
                        >
                          🗑️ {t('Delete') || 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadUsers();
            loadUserStats();
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            loadUsers();
            loadUserStats();
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('Delete User') || 'Delete User'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {t('Are you sure you want to delete this user? This action cannot be undone.') || 
                 'Are you sure you want to delete this user? This action cannot be undone.'}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  {t('Cancel') || 'Cancel'}
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t('Delete') || 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add User Modal Component
const AddUserModal = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    role: 'staff',
    is_active: true,
    permissions: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
  const crmAuth = localStorage.getItem('crmAuth');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', description: 'View system statistics and overview' },
    { id: 'contacts', name: 'Contacts', description: 'Manage contact database' },
    { id: 'visitors', name: 'Visitors', description: 'Track website visitors' },
    { id: 'donations', name: 'Donations', description: 'Manage donations and funding' },
    { id: 'projects', name: 'Projects', description: 'Manage projects, files, and reports' },
    { id: 'settings', name: 'Settings', description: 'System configuration (admin only)' }
  ];

  const handlePermissionChange = (moduleId, permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.module === moduleId 
          ? { ...p, [permission]: value }
          : p
      ).concat(
        prev.permissions.find(p => p.module === moduleId) 
          ? [] 
          : [{ module: moduleId, can_read: false, can_write: false, can_delete: false, can_export: false, [permission]: value }]
      )
    }));
  };

  const getPermissionValue = (moduleId, permission) => {
    const modulePermission = formData.permissions.find(p => p.module === moduleId);
    return modulePermission ? modulePermission[permission] : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        alert(t('User created successfully! Welcome email has been sent.') || 'User created successfully! Welcome email has been sent.');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to create user');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              ➕ {t('Add New User') || 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Username') || 'Username'} *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Password') || 'Password'} *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Full Name') || 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Email') || 'Email'} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Role') || 'Role'}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t('Active Account') || 'Active Account'}
                  </span>
                </label>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('Module Permissions') || 'Module Permissions'}
              </h3>
              <div className="space-y-4">
                {modules.map(module => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_read')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_read', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Read</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_write')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_write', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Write</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_delete')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_delete', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Delete</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_export')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_export', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Export</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Notes') || 'Notes'} ({t('Optional') || 'Optional'})
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder={t('Additional notes about this user...') || 'Additional notes about this user...'}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {t('Cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? (t('Creating...') || 'Creating...') : (t('Create User') || 'Create User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
    permissions: user.permissions,
    notes: user.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
  const crmAuth = localStorage.getItem('crmAuth');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', description: 'View system statistics and overview' },
    { id: 'contacts', name: 'Contacts', description: 'Manage contact database' },
    { id: 'visitors', name: 'Visitors', description: 'Track website visitors' },
    { id: 'donations', name: 'Donations', description: 'Manage donations and funding' },
    { id: 'projects', name: 'Projects', description: 'Manage projects, files, and reports' },
    { id: 'settings', name: 'Settings', description: 'System configuration (admin only)' }
  ];

  const handlePermissionChange = (moduleId, permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.module === moduleId 
          ? { ...p, [permission]: value }
          : p
      ).concat(
        prev.permissions.find(p => p.module === moduleId) 
          ? [] 
          : [{ module: moduleId, can_read: false, can_write: false, can_delete: false, can_export: false, [permission]: value }]
      )
    }));
  };

  const getPermissionValue = (moduleId, permission) => {
    const modulePermission = formData.permissions.find(p => p.module === moduleId);
    return modulePermission ? modulePermission[permission] : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        alert(t('User updated successfully!') || 'User updated successfully!');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${user.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_password: newPassword })
      });

      if (response.ok) {
        alert(t('Password reset successfully! Email notification sent.') || 'Password reset successfully! Email notification sent.');
        setShowPasswordReset(false);
        setNewPassword('');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              ✏️ {t('Edit User') || 'Edit User'}: {user.username}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Username') || 'Username'}
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">{t('Username cannot be changed') || 'Username cannot be changed'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Password') || 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  🔒 {t('Reset Password') || 'Reset Password'}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Full Name') || 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Email') || 'Email'} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Role') || 'Role'}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t('Active Account') || 'Active Account'}
                  </span>
                </label>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('Module Permissions') || 'Module Permissions'}
              </h3>
              <div className="space-y-4">
                {modules.map(module => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_read')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_read', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Read</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_write')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_write', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Write</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_delete')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_delete', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Delete</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue(module.id, 'can_export')}
                          onChange={(e) => handlePermissionChange(module.id, 'can_export', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Export</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Notes') || 'Notes'} ({t('Optional') || 'Optional'})
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder={t('Additional notes about this user...') || 'Additional notes about this user...'}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {t('Cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? (t('Updating...') || 'Updating...') : (t('Update User') || 'Update User')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('Reset Password') || 'Reset Password'}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('Enter a new password for') || 'Enter a new password for'} <strong>{user.username}</strong>
              </p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('New password...') || 'New password...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setNewPassword('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  {t('Cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handlePasswordReset}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  {t('Reset Password') || 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;