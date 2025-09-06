import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../utils/i18n';

const ProjectDetail = () => {
  const { projectCode } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [project, setProject] = useState(null);
  const [donations, setDonations] = useState(null);
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { t } = useTranslation();

  // Form data for editing
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadProjectData();
    } else {
      setError(t('invalidCredentials') || 'Invalid username or password');
    }
  };

  const loadProjectData = async () => {
    setLoading(true);
    try {
      // Load project details
      const projectResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectCode}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData);
        
        // Set form data for editing
        setFormData({
          name: projectData.name || '',
          description_short: projectData.description_short || '',
          start_date_iso: projectData.start_date_iso || '',
          end_date_iso: projectData.end_date_iso || '',
          status: projectData.status || 'planned',
          budget_currency: projectData.budget_currency || 'USD',
          budget_amount: projectData.budget_amount?.toString() || '',
          manager: projectData.manager || '',
          country: projectData.country || '',
          tags: projectData.tags || ''
        });
      } else {
        setError(t('failedToLoadProjectDetails') || 'Failed to load project details');
        return;
      }

      // Load project donations
      const donationsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectCode}/donations`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json();
        setDonations(donationsData);
      }

      // Load project stories
      const storiesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectCode}/stories`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json();
        setStories(storiesData);
      }

    } catch (error) {
      console.error('Failed to load project data:', error);
      setError(t('failedToLoadProjectDetails') || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setShowEditModal(false);
        loadProjectData(); // Reload project data
      } else {
        const errorData = await response.json();
        setError(errorData.detail || (t('failedToSaveProject') || 'Failed to save project'));
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      setError(t('failedToSaveProject') || 'Failed to save project');
    } finally {
      setLoading(false);
    }
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setProject(null);
    setDonations(null);
    setStories(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProjectData();
    }
  }, [projectCode, isAuthenticated]);

  // Login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>{t('projectDetails') || 'Project Details'} - Kioo Radio</title>
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

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary"></div>
          <p className="mt-2 text-gray-600">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-kioo-primary text-white text-sm font-medium rounded-md hover:bg-kioo-primary-dark"
          >
            {t('backToProjects') || 'Back to Projects'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>{project?.name || t('projectDetails') || 'Project Details'} - Kioo Radio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <button
                        onClick={() => navigate('/projects')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {t('projectsManagement') || 'Projects Management'}
                      </button>
                    </li>
                    <li>
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-gray-900 font-medium">{project?.project_code}</span>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {project?.name || t('projectDetails') || 'Project Details'}
                </h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-kioo-primary text-white text-sm font-medium rounded-md hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
                >
                  {t('editProject') || 'Edit Project'}
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
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
              <button onClick={() => setError('')} className="float-right font-bold">×</button>
            </div>
          )}

          {project && (
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('projectCode') || 'Project Code'}</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">{project.project_code}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('status') || 'Status'}</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('manager') || 'Manager'}</dt>
                      <dd className="mt-1 text-lg text-gray-900">{project.manager || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('startDate') || 'Start Date'}</dt>
                      <dd className="mt-1 text-lg text-gray-900">{project.start_date_iso || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('endDate') || 'End Date'}</dt>
                      <dd className="mt-1 text-lg text-gray-900">{project.end_date_iso || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('country') || 'Country'}</dt>
                      <dd className="mt-1 text-lg text-gray-900">{project.country || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('budgetAmount') || 'Budget Amount'}</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {project.budget_amount 
                          ? `${project.budget_currency === 'USD' ? '$' : 'L$'}${project.budget_amount.toFixed(2)}` 
                          : '-'
                        }
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('tags') || 'Tags'}</dt>
                      <dd className="mt-1 text-lg text-gray-900">{project.tags || '-'}</dd>
                    </div>
                  </div>

                  {project.description_short && (
                    <div className="mt-6">
                      <dt className="text-sm font-medium text-gray-500">{t('description') || 'Description'}</dt>
                      <dd className="mt-2 text-gray-900">{project.description_short}</dd>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Donations */}
              {donations && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {t('projectDonations') || 'Project Donations'}
                    </h3>
                    
                    {/* Donations Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-green-700">{t('usdTotal') || 'USD Total'}</dt>
                        <dd className="text-2xl font-bold text-green-900">${donations.totals.USD.toFixed(2)}</dd>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-blue-700">{t('lrdTotal') || 'LRD Total'}</dt>
                        <dd className="text-2xl font-bold text-blue-900">L${donations.totals.LRD.toFixed(2)}</dd>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <dt className="text-sm font-medium text-purple-700">{t('totalProjectDonations') || 'Total Donations'}</dt>
                        <dd className="text-2xl font-bold text-purple-900">{donations.totals.total_donations}</dd>
                      </div>
                    </div>

                    {/* Recent Donations */}
                    {donations.recent_donations && donations.recent_donations.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                          {t('recentDonations') || 'Recent Donations'}
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('date') || 'Date'}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('donorName') || 'Donor'}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('amount') || 'Amount'}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('paymentMethod') || 'Method'}</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {donations.recent_donations.map((donation, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{donation.date_iso}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{donation.donor_name}</td>
                                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                    {donation.amount_currency === 'USD' ? '$' : 'L$'}{donation.amount.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{donation.method}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {donations.totals.total_donations === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        {t('noDonationsFound') || 'No donations found for this project'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Stories */}
              {stories && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {t('recentStories') || 'Recent Stories'} ({stories.total_stories})
                    </h3>
                    
                    {stories.recent_stories && stories.recent_stories.length > 0 ? (
                      <div className="space-y-4">
                        {stories.recent_stories.map((story, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{story.name_or_anonymous}</h4>
                              <span className="text-sm text-gray-500">{story.date_iso}</span>
                            </div>
                            {story.location && (
                              <p className="text-sm text-gray-600 mb-2">📍 {story.location}</p>
                            )}
                            <p className="text-gray-700 text-sm">
                              {story.story_text.length > 200 
                                ? story.story_text.substring(0, 200) + '...' 
                                : story.story_text}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              {story.program && (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{story.program}</span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded ${
                                story.approved_y_n === 'Y' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {story.approved_y_n === 'Y' ? (t('approved') || 'Approved') : (t('pending') || 'Pending')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        {t('noStoriesFound') || 'No stories found linked to this project'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Project Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('editProject') || 'Edit Project'}: {project?.project_code}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleUpdateProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onClick={() => setShowEditModal(false)}
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
                        : (t('updateProject') || 'Update Project')
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

export default ProjectDetail;