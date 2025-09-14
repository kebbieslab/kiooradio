import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const PodcastAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('episodes');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [episodes, setEpisodes] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [episodeForm, setEpisodeForm] = useState({
    id: '',
    title: '',
    slug: '',
    seriesId: '',
    date_gmt_iso: new Date().toISOString().slice(0, 16),
    duration_sec: 0,
    language: 'en',
    audio_url: '',
    audio_bytes: 0,
    description: '',
    imageUrl: '',
    transcript_url: ''
  });
  
  const [seriesForm, setSeriesForm] = useState({
    id: '',
    title: '',
    slug: '',
    language: 'en',
    imageUrl: '',
    description: ''
  });
  
  const [csvText, setCsvText] = useState('');
  const [programsList, setProgramsList] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadData();
    } else {
      setError('Invalid username or password');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [episodesRes, seriesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/podcast/episodes`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/podcast/series`)
      ]);

      if (episodesRes.ok && seriesRes.ok) {
        const episodesData = await episodesRes.json();
        const seriesData = await seriesRes.json();
        setEpisodes(episodesData.episodes || []);
        setSeries(seriesData.series || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleEpisodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const method = episodeForm.id ? 'PUT' : 'POST';
      const url = episodeForm.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/podcast/episodes/${episodeForm.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/podcast/episodes`;
      
      // Auto-generate slug if empty
      const formData = {
        ...episodeForm,
        slug: episodeForm.slug || generateSlug(episodeForm.title)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(episodeForm.id ? 'Episode updated successfully' : 'Episode created successfully');
        resetEpisodeForm();
        loadData();
      } else {
        throw new Error('Failed to save episode');
      }
    } catch (error) {
      setError('Error saving episode: ' + error.message);
    }
  };

  const handleSeriesSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const method = seriesForm.id ? 'PUT' : 'POST';
      const url = seriesForm.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/podcast/series/${seriesForm.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/podcast/series`;
      
      // Auto-generate slug if empty
      const formData = {
        ...seriesForm,
        slug: seriesForm.slug || generateSlug(seriesForm.title)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(seriesForm.id ? 'Series updated successfully' : 'Series created successfully');
        resetSeriesForm();
        loadData();
      } else {
        throw new Error('Failed to save series');
      }
    } catch (error) {
      setError('Error saving series: ' + error.message);
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/podcast/episodes/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        },
        body: JSON.stringify({ csv_data: csvText })
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(`Imported ${result.imported_count} episodes successfully`);
        setCsvText('');
        loadData();
      } else {
        throw new Error(result.detail || 'Import failed');
      }
    } catch (error) {
      setError('Import error: ' + error.message);
    }
  };

  const handleProgramsMapper = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const programs = programsList.split('\n').filter(line => line.trim());
      let createdCount = 0;
      
      for (const program of programs) {
        const [title, language = 'en'] = program.split(',').map(s => s.trim());
        if (!title) continue;
        
        const seriesData = {
          title,
          slug: generateSlug(title),
          language,
          description: `Series for ${title} program`,
          imageUrl: ''
        };
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/podcast/series`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:kioo2025!')
          },
          body: JSON.stringify(seriesData)
        });
        
        if (response.ok) {
          createdCount++;
        }
      }
      
      setSuccess(`Created ${createdCount} series from programs list`);
      setProgramsList('');
      loadData();
    } catch (error) {
      setError('Programs mapper error: ' + error.message);
    }
  };

  const resetEpisodeForm = () => {
    setEpisodeForm({
      id: '',
      title: '',
      slug: '',
      seriesId: '',
      date_gmt_iso: new Date().toISOString().slice(0, 16),
      duration_sec: 0,
      language: 'en',
      audio_url: '',
      audio_bytes: 0,
      description: '',
      imageUrl: '',
      transcript_url: ''
    });
  };

  const resetSeriesForm = () => {
    setSeriesForm({
      id: '',
      title: '',
      slug: '',
      language: 'en',
      imageUrl: '',
      description: ''
    });
  };

  const editEpisode = (episode) => {
    setEpisodeForm({
      ...episode,
      date_gmt_iso: episode.date_gmt_iso ? episode.date_gmt_iso.slice(0, 16) : ''
    });
  };

  const editSeries = (series) => {
    setSeriesForm(series);
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/podcast/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:kioo2025!')
        }
      });

      if (response.ok) {
        setSuccess(`${type} deleted successfully`);
        loadData();
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (error) {
      setError(`Error deleting ${type}: ` + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Podcast Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your credentials to access the podcast administration panel
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
                Access Admin Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Podcast Admin - Kioo Radio"
        description="Podcast administration panel for Kioo Radio"
        robots="noindex,nofollow"
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Podcast Admin</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'episodes', label: 'Episodes' },
              { id: 'series', label: 'Series' },
              { id: 'import', label: 'Bulk Import' },
              { id: 'programs', label: 'Programs Mapper' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-kioo-primary text-kioo-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                {episodeForm.id ? 'Edit Episode' : 'Add New Episode'}
              </h2>
              
              <form onSubmit={handleEpisodeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={episodeForm.title}
                      onChange={(e) => setEpisodeForm({...episodeForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={episodeForm.slug}
                      onChange={(e) => setEpisodeForm({...episodeForm, slug: e.target.value})}
                      placeholder="Auto-generated from title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Series *</label>
                    <select
                      required
                      value={episodeForm.seriesId}
                      onChange={(e) => setEpisodeForm({...episodeForm, seriesId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    >
                      <option value="">Select Series</option>
                      {series.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                    <select
                      value={episodeForm.language}
                      onChange={(e) => setEpisodeForm({...episodeForm, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    >
                      <option value="kissi">Kissi</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ev">Evangelistic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time (GMT) *</label>
                    <input
                      type="datetime-local"
                      required
                      value={episodeForm.date_gmt_iso}
                      onChange={(e) => setEpisodeForm({...episodeForm, date_gmt_iso: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds) *</label>
                    <input
                      type="number"
                      required
                      value={episodeForm.duration_sec}
                      onChange={(e) => setEpisodeForm({...episodeForm, duration_sec: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL *</label>
                    <input
                      type="url"
                      required
                      value={episodeForm.audio_url}
                      onChange={(e) => setEpisodeForm({...episodeForm, audio_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Audio File Size (bytes)</label>
                    <input
                      type="number"
                      value={episodeForm.audio_bytes}
                      onChange={(e) => setEpisodeForm({...episodeForm, audio_bytes: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={episodeForm.imageUrl}
                      onChange={(e) => setEpisodeForm({...episodeForm, imageUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transcript URL</label>
                    <input
                      type="url"
                      value={episodeForm.transcript_url}
                      onChange={(e) => setEpisodeForm({...episodeForm, transcript_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={episodeForm.description}
                    onChange={(e) => setEpisodeForm({...episodeForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary-dark"
                  >
                    {episodeForm.id ? 'Update Episode' : 'Create Episode'}
                  </button>
                  
                  {episodeForm.id && (
                    <button
                      type="button"
                      onClick={resetEpisodeForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Episodes List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Episodes ({episodes.length})</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Series</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {episodes.map(episode => {
                      const episodeSeries = series.find(s => s.id === episode.seriesId);
                      return (
                        <tr key={episode.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{episode.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{episodeSeries?.title || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(episode.date_gmt_iso).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {episode.language}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => editEpisode(episode)}
                              className="text-kioo-primary hover:text-kioo-primary-dark mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteItem('episodes', episode.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Series Tab */}
        {activeTab === 'series' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                {seriesForm.id ? 'Edit Series' : 'Add New Series'}
              </h2>
              
              <form onSubmit={handleSeriesSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={seriesForm.title}
                      onChange={(e) => setSeriesForm({...seriesForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={seriesForm.slug}
                      onChange={(e) => setSeriesForm({...seriesForm, slug: e.target.value})}
                      placeholder="Auto-generated from title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                    <select
                      value={seriesForm.language}
                      onChange={(e) => setSeriesForm({...seriesForm, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    >
                      <option value="kissi">Kissi</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ev">Evangelistic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={seriesForm.imageUrl}
                      onChange={(e) => setSeriesForm({...seriesForm, imageUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={seriesForm.description}
                    onChange={(e) => setSeriesForm({...seriesForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary-dark"
                  >
                    {seriesForm.id ? 'Update Series' : 'Create Series'}
                  </button>
                  
                  {seriesForm.id && (
                    <button
                      type="button"
                      onClick={resetSeriesForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Series List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Series ({series.length})</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Episodes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {series.map(s => {
                      const episodeCount = episodes.filter(ep => ep.seriesId === s.id).length;
                      return (
                        <tr key={s.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{s.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{s.slug}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {s.language}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{episodeCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => editSeries(s)}
                              className="text-kioo-primary hover:text-kioo-primary-dark mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteItem('series', s.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Bulk Import Episodes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload CSV data with the following headers: id,seriesId,title,slug,date_gmt_iso,duration_sec,language,audio_url,audio_bytes,description,imageUrl,transcript_url
            </p>
            
            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSV Data</label>
                <textarea
                  rows={10}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary font-mono text-sm"
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary-dark"
              >
                Import Episodes
              </button>
            </form>
          </div>
        )}

        {/* Programs Mapper Tab */}
        {activeTab === 'programs' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Programs Mapper</h2>
            <p className="text-sm text-gray-600 mb-4">
              Paste program names (one per line), optionally with language. Format: "Program Name, language" (language defaults to 'en')
            </p>
            
            <form onSubmit={handleProgramsMapper} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programs List</label>
                <textarea
                  rows={10}
                  value={programsList}
                  onChange={(e) => setProgramsList(e.target.value)}
                  placeholder={`Morning Devotion, en\nEvening Gospel, kissi\nSunday Service, fr\nYouth Program, ev`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kioo-primary font-mono text-sm"
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary-dark"
              >
                Create Series from Programs
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastAdmin;