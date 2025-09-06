import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../utils/i18n';

const Projects = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [stats, setStats] = useState(null);
  
  const { t, currentLanguage } = useTranslation();
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    country: '',
    manager: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    project_code: '',
    name: '',
    description_short: '',
    start_date_iso: '',
    end_date_iso: '',
    status: 'planned',
    budget_currency: 'USD',
    budget_amount: '',
    manager: '',
    country: '',
    tags: ''
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadProjects();
      loadStats();
    } else {
      setError(t('invalidCredentials') || 'Invalid username or password');
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.country) params.append('country', filters.country);
      if (filters.manager) params.append('manager', filters.manager);
      params.append('limit', '1000');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects?${params}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError(t('failedToLoadProjects') || 'Failed to load projects');
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError(t('failedToLoadProjects') || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/filter-stats`, {
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

    // Client-side validation
    if (!formData.project_code.trim()) {
      setError(t('projectCodeRequired') || 'Project code is required');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError(t('projectNameRequired') || 'Project name is required');
      setLoading(false);
      return;
    }

    if (formData.budget_amount && parseFloat(formData.budget_amount) < 0) {
      setError(t('invalidBudgetAmount') || 'Budget amount must be positive');
      setLoading(false);
      return;
    }

    try {
      const url = editingProject 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/projects/${editingProject.project_code}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';

      // Prepare data for submission
      const submitData = {
        ...formData,
        budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) : null
      };

      // Remove empty strings
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          submitData[key] = null;
        }
      });

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
        loadProjects();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || (t('failedToSaveProject') || 'Failed to save project'));
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      setError(t('failedToSaveProject') || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      project_code: project.project_code || '',
      name: project.name || '',
      description_short: project.description_short || '',
      start_date_iso: project.start_date_iso || '',
      end_date_iso: project.end_date_iso || '',
      status: project.status || 'planned',
      budget_currency: project.budget_currency || 'USD',
      budget_amount: project.budget_amount?.toString() || '',
      manager: project.manager || '',
      country: project.country || '',
      tags: project.tags || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm(t('confirmDeleteProject') || 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        loadProjects();
      } else {
        setError(t('failedToDeleteProject') || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError(t('failedToDeleteProject') || 'Failed to delete project');
    }
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.country) params.append('country', filters.country);
      if (filters.manager) params.append('manager', filters.manager);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/export/${format}?${params}`, {
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
        a.download = `projects_export.${format}`;
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
      project_code: '',
      name: '',
      description_short: '',
      start_date_iso: '',
      end_date_iso: '',
      status: 'planned',
      budget_currency: 'USD',
      budget_amount: '',
      manager: '',
      country: '',
      tags: ''
    });
    setEditingProject(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setProjects([]);
    setStats(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return t('active') || 'Active';
      case 'completed': return t('completed') || 'Completed';
      case 'planned': return t('planned') || 'Planned';
      case 'on-hold': return t('onHold') || 'On Hold';
      case 'cancelled': return t('cancelled') || 'Cancelled';
      default: return status;
    }
  };

  // Apply filters
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [filters]);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>{t('projectsManagement') || 'Projects Management'} - Kioo Radio</title>
        </Helmet>

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {t('projectsAccess') || 'Projects Access'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('projectsAccessDescription') || 'Please enter your credentials to access the Projects Management system'}
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
                  {t('accessProjects') || 'Access Projects'}
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
        <title>{t('projectsManagement') || 'Projects Management'} - Kioo Radio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('projectsManagement') || 'Projects Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('manageProjectRecords') || 'Manage project records and track progress'}
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
                  {t('addProject') || 'Add Project'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('status') || 'Status'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">{t('allStatuses') || 'All Statuses'}</option>
                    {stats && stats.statuses.map(status => (
                      <option key={status} value={status}>{getStatusLabel(status)}</option>
                    ))}
                  </select>
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
                    {t('manager') || 'Manager'}
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                    value={filters.manager}
                    onChange={(e) => setFilters({...filters, manager: e.target.value})}
                  >
                    <option value="">{t('allManagers') || 'All Managers'}</option>
                    {stats && stats.managers.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setFilters({ status: '', country: '', manager: '' })}
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

          {/* Projects Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('projectsList') || 'Projects List'} ({projects.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('projectCode') || 'Project Code'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('projectName') || 'Name'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status') || 'Status'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('budgetCurrency') || 'Currency'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('budgetAmount') || 'Budget'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('manager') || 'Manager'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.project_code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-kioo-primary">
                          <button
                            onClick={() => navigate(`/project-detail/${project.project_code}`)}
                            className="hover:text-kioo-primary-dark"
                          >
                            {project.project_code}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.budget_currency || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.budget_amount ? project.budget_amount.toFixed(2) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.manager || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-kioo-primary hover:text-kioo-primary-dark"
                            >
                              {t('edit') || 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDelete(project.project_code)}
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
                
                {projects.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    {t('noProjectsFound') || 'No projects found'}
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
                    {editingProject 
                      ? (t('editProject') || 'Edit Project') 
                      : (t('addProject') || 'Add Project')
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
                        {t('projectCode') || 'Project Code'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!!editingProject}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm disabled:bg-gray-100"
                        value={formData.project_code}
                        onChange={(e) => setFormData({...formData, project_code: e.target.value})}
                        placeholder="e.g., RADIO-2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('projectName') || 'Project Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('startDate') || 'Start Date'}
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.start_date_iso}
                        onChange={(e) => setFormData({...formData, start_date_iso: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('endDate') || 'End Date'}
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.end_date_iso}
                        onChange={(e) => setFormData({...formData, end_date_iso: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('status') || 'Status'}
                      </label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="planned">{t('planned') || 'Planned'}</option>
                        <option value="active">{t('active') || 'Active'}</option>
                        <option value="completed">{t('completed') || 'Completed'}</option>
                        <option value="on-hold">{t('onHold') || 'On Hold'}</option>
                        <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('budgetCurrency') || 'Budget Currency'}
                      </label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.budget_currency}
                        onChange={(e) => setFormData({...formData, budget_currency: e.target.value})}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="LRD">LRD (L$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('budgetAmount') || 'Budget Amount'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.budget_amount}
                        onChange={(e) => setFormData({...formData, budget_amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('manager') || 'Manager'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.manager}
                        onChange={(e) => setFormData({...formData, manager: e.target.value})}
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
                        {t('tags') || 'Tags'}
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="building, equipment, outreach"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('descriptionShort') || 'Short Description'}
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary sm:text-sm"
                      value={formData.description_short}
                      onChange={(e) => setFormData({...formData, description_short: e.target.value})}
                      placeholder="Brief description of project goals and objectives..."
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
                        : editingProject 
                          ? (t('updateProject') || 'Update Project')
                          : (t('addProject') || 'Add Project')
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

export default Projects;