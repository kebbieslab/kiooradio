import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const CRMProjects = ({ crmAuth }) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Enhanced state for file management
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [projectFiles, setProjectFiles] = useState([]);
  const [projectReceipts, setProjectReceipts] = useState([]);
  const [projectReports, setProjectReports] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    country: '',
    manager: ''
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  // Form state for new project
  const [newProject, setNewProject] = useState({
    project_code: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning',
    country: '',
    manager: '',
    budget_amount: '',
    budget_currency: 'USD',
    impact_area: 'community',
    beneficiaries_target: '',
    objectives: ['']
  });

  // Load projects data
  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load project details
  const loadProjectDetail = async (projectCode) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/${projectCode}`, {
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProject(data);
      }
    } catch (error) {
      console.error('Error loading project details:', error);
    }
  };

  // Create new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newProject,
          budget_amount: parseFloat(newProject.budget_amount) || 0,
          beneficiaries_target: parseInt(newProject.beneficiaries_target) || 0,
          objectives: newProject.objectives.filter(obj => obj.trim() !== '')
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewProject({
          project_code: '',
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'planning',
          country: '',
          manager: '',
          budget_amount: '',
          budget_currency: 'USD',
          impact_area: 'community',
          beneficiaries_target: '',
          objectives: ['']
        });
        await loadProjects();
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectCode) => {
    if (!window.confirm(t('Are you sure you want to delete this project?') || 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/${projectCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${crmAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Export projects
  const handleExportProjects = async (format = 'csv') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/export?format=${format}`, {
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
        a.download = `projects_export.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Add objective field
  const addObjective = () => {
    setNewProject({
      ...newProject,
      objectives: [...newProject.objectives, '']
    });
  };

  // Remove objective field
  const removeObjective = (index) => {
    const newObjectives = newProject.objectives.filter((_, i) => i !== index);
    setNewProject({
      ...newProject,
      objectives: newObjectives.length > 0 ? newObjectives : ['']
    });
  };

  // Update objective
  const updateObjective = (index, value) => {
    const newObjectives = [...newProject.objectives];
    newObjectives[index] = value;
    setNewProject({
      ...newProject,
      objectives: newObjectives
    });
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (filters.search && !project.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.project_code?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && project.status !== filters.status) {
      return false;
    }
    if (filters.country && project.country !== filters.country) {
      return false;
    }
    if (filters.manager && !project.manager?.toLowerCase().includes(filters.manager.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                📋 {t('Projects Management') || 'Projects Management'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t('Manage community projects, track progress, and monitor impact') || 'Manage community projects, track progress, and monitor impact'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExportProjects('csv')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                📊 {t('Export CSV') || 'Export CSV'}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
              >
                ➕ {t('Add Project') || 'Add Project'}
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{projects.length}</div>
              <div className="text-sm text-purple-600">{t('Total Projects') || 'Total Projects'}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-green-600">{t('Active Projects') || 'Active Projects'}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-blue-600">{t('Completed Projects') || 'Completed Projects'}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-800">
                {projects.reduce((sum, p) => sum + (p.budget_amount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-amber-600">{t('Total Budget') || 'Total Budget'}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              placeholder={t('Search projects...') || 'Search projects...'}
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('All Statuses') || 'All Statuses'}</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('All Countries') || 'All Countries'}</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Guinea">Guinea</option>
              <option value="Liberia">Liberia</option>
              <option value="Mali">Mali</option>
            </select>
            <input
              type="text"
              placeholder={t('Manager name...') || 'Manager name...'}
              value={filters.manager}
              onChange={(e) => setFilters({...filters, manager: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setFilters({ search: '', status: '', country: '', manager: '' })}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              🔄 {t('Clear Filters') || 'Clear Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Project') || 'Project'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Status') || 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Budget') || 'Budget'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Manager') || 'Manager'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Timeline') || 'Timeline'}
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('No projects found') || 'No projects found'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.project_code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.project_code}</div>
                      <div className="text-xs text-gray-400">{project.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.budget_currency} {project.budget_amount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-500">{project.impact_area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</div>
                      <div className="text-xs">to {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            loadProjectDetail(project.project_code);
                            setShowDetailModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          👁️ {t('View') || 'View'}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.project_code)}
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

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  ➕ {t('Add New Project') || 'Add New Project'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Project Code') || 'Project Code'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.project_code}
                      onChange={(e) => setNewProject({...newProject, project_code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., KIOO-2025-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Project Name') || 'Project Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Country') || 'Country'} *
                    </label>
                    <select
                      required
                      value={newProject.country}
                      onChange={(e) => setNewProject({...newProject, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('Select Country') || 'Select Country'}</option>
                      <option value="Sierra Leone">Sierra Leone</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Mali">Mali</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Project Manager') || 'Project Manager'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.manager}
                      onChange={(e) => setNewProject({...newProject, manager: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Start Date') || 'Start Date'}
                    </label>
                    <input
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('End Date') || 'End Date'}
                    </label>
                    <input
                      type="date"
                      value={newProject.end_date}
                      onChange={(e) => setNewProject({...newProject, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Budget Amount') || 'Budget Amount'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProject.budget_amount}
                      onChange={(e) => setNewProject({...newProject, budget_amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Budget Currency') || 'Budget Currency'}
                    </label>
                    <select
                      value={newProject.budget_currency}
                      onChange={(e) => setNewProject({...newProject, budget_currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="SLL">SLL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Description') || 'Description'} *
                  </label>
                  <textarea
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Project Objectives') || 'Project Objectives'}
                  </label>
                  {newProject.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder={`${t('Objective') || 'Objective'} ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                        disabled={newProject.objectives.length === 1}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addObjective}
                    className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                  >
                    ➕ {t('Add Objective') || 'Add Objective'}
                  </button>
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? (t('Creating...') || 'Creating...') : (t('Create Project') || 'Create Project')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  📋 {selectedProject.name}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('Project Information') || 'Project Information'}</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>{t('Code') || 'Code'}:</strong> {selectedProject.project_code}</div>
                      <div><strong>{t('Manager') || 'Manager'}:</strong> {selectedProject.manager}</div>
                      <div><strong>{t('Country') || 'Country'}:</strong> {selectedProject.country}</div>
                      <div><strong>{t('Status') || 'Status'}:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedProject.status)}`}>
                          {selectedProject.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800">{t('Timeline & Budget') || 'Timeline & Budget'}</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>{t('Start Date') || 'Start Date'}:</strong> {selectedProject.start_date || 'TBD'}</div>
                      <div><strong>{t('End Date') || 'End Date'}:</strong> {selectedProject.end_date || 'TBD'}</div>
                      <div><strong>{t('Budget') || 'Budget'}:</strong> {selectedProject.budget_currency} {selectedProject.budget_amount?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('Description') || 'Description'}</h4>
                    <p className="mt-2 text-sm text-gray-700">{selectedProject.description}</p>
                  </div>

                  {selectedProject.objectives && selectedProject.objectives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('Objectives') || 'Objectives'}</h4>
                      <ul className="mt-2 space-y-1">
                        {selectedProject.objectives.map((objective, index) => (
                          <li key={index} className="text-sm text-gray-700">• {objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  {t('Close') || 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMProjects;