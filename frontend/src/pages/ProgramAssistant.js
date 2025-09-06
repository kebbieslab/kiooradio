import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const ProgramAssistant = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [analysisType, setAnalysisType] = useState('summary');
  const [analysisResult, setAnalysisResult] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  // Load programs and stats (no authentication required)
  const loadData = async () => {
    setLoading(true);
    try {
      // Load programs without authentication
      const programsResponse = await fetch(`${BACKEND_URL}/api/ai-programs`);
      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setPrograms(programsData);
      }

      // Load stats without authentication
      const statsResponse = await fetch(`${BACKEND_URL}/api/ai-programs/stats/overview`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Search programs (no authentication required)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai-programs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          language: language,
          limit: 20
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.programs);
        setActiveTab('search');
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analyze program (no authentication required)
  const analyzeProgram = async (programId, type) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai-programs/${programId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          program_id: programId,
          analysis_type: type,
          target_language: language === 'fr' ? 'fr' : 'en'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
        loadData(); // Refresh programs to show updated analysis
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🤖 {t('AI Program Assistant') || 'AI Program Assistant'}
              </h1>
              <p className="text-sm text-gray-600">
                {t('Intelligent program analysis and management') || 'Intelligent program analysis and management'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t('Refresh') || 'Refresh'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('Logout') || 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['programs', 'search', 'analytics', 'add'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'programs' && (t('Programs') || 'Programs')}
                {tab === 'search' && (t('Search') || 'Search')}
                {tab === 'analytics' && (t('Analytics') || 'Analytics')}
                {tab === 'add' && (t('Add Program') || 'Add Program')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">{t('Loading...') || 'Loading...'}</p>
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('Program Archive') || 'Program Archive'} ({programs.length})
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {program.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      program.language === 'fr' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {program.language?.toUpperCase()}
                    </span>
                  </div>
                  
                  {program.presenter && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>{t('Presenter') || 'Presenter'}:</strong> {program.presenter}
                    </p>
                  )}
                  
                  {program.date_aired && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>{t('Date') || 'Date'}:</strong> {program.date_aired}
                    </p>
                  )}
                  
                  {program.summary && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {program.summary}
                    </p>
                  )}
                  
                  {/* AI Analysis Status */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {program.summary && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✅ {t('Summary') || 'Summary'}
                      </span>
                    )}
                    {program.highlights && program.highlights.length > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        ✅ {t('Highlights') || 'Highlights'}
                      </span>
                    )}
                    {program.keywords && program.keywords.length > 0 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        ✅ {t('Keywords') || 'Keywords'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      {t('View Details') || 'View Details'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProgram(program);
                        setShowAnalysisModal(true);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      🤖 {t('Analyze') || 'Analyze'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('AI-Powered Program Search') || 'AI-Powered Program Search'}
              </h2>
              
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search programs by content, keywords, or themes...') || 'Search programs by content, keywords, or themes...'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  🔍 {t('Search') || 'Search'}
                </button>
              </form>
            </div>
            
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('Search Results') || 'Search Results'} ({searchResults.length})
                </h3>
                <div className="space-y-4">
                  {searchResults.map((program) => (
                    <div key={program.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {program.title}
                          </h4>
                          {program.summary && (
                            <p className="text-gray-700 mb-2">{program.summary}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {program.presenter && <span>👤 {program.presenter}</span>}
                            {program.date_aired && <span>📅 {program.date_aired}</span>}
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              program.language === 'fr' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {program.language?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          {t('View') || 'View'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && stats && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('Program Analytics') || 'Program Analytics'}
            </h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">📻</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t('Total Programs') || 'Total Programs'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.total_programs}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t('AI Summary Coverage') || 'AI Summary Coverage'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.ai_analysis_coverage.summary_percentage}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t('Highlights Coverage') || 'Highlights Coverage'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.ai_analysis_coverage.highlights_percentage}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {t('Keywords Coverage') || 'Keywords Coverage'}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.ai_analysis_coverage.keywords_percentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* By Language */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('Programs by Language') || 'Programs by Language'}
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.by_language).map(([lang, count]) => (
                    <div key={lang} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang}
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(count / stats.total_programs) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* By Type */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('Programs by Type') || 'Programs by Type'}
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.by_type).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">
                        {type === 'unknown' ? t('Unspecified') || 'Unspecified' : type}
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / stats.total_programs) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Program Tab */}
        {activeTab === 'add' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('Add New Program') || 'Add New Program'}
            </h2>
            <AddProgramForm 
              onSuccess={() => {
                loadData();
                setActiveTab('programs');
              }}
              t={t}
              BACKEND_URL={BACKEND_URL}
            />
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && !showAnalysisModal && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onAnalyze={(type) => {
            setAnalysisType(type);
            setShowAnalysisModal(true);
          }}
          t={t}
        />
      )}

      {/* Analysis Modal */}
      {showAnalysisModal && selectedProgram && (
        <AnalysisModal
          program={selectedProgram}
          analysisType={analysisType}
          onClose={() => {
            setShowAnalysisModal(false);
            setAnalysisResult(null);
          }}
          onAnalyze={analyzeProgram}
          result={analysisResult}
          loading={loading}
          t={t}
        />
      )}
    </div>
  );
};

// Add Program Form Component
const AddProgramForm = ({ onSuccess, t, BACKEND_URL }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    language: 'en',
    date_aired: '',
    duration_minutes: '',
    presenter: '',
    program_type: '',
    audio_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = localStorage.getItem('programAssistantAuth');
      const response = await fetch(`${BACKEND_URL}/api/ai-programs`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null
        })
      });
      
      if (response.ok) {
        onSuccess();
        setFormData({
          title: '',
          description: '',
          content: '',
          language: 'en',
          date_aired: '',
          duration_minutes: '',
          presenter: '',
          program_type: '',
          audio_url: ''
        });
      } else {
        console.error('Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Program Title') || 'Program Title'} *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Presenter') || 'Presenter'}
          </label>
          <input
            type="text"
            value={formData.presenter}
            onChange={(e) => setFormData({...formData, presenter: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Language') || 'Language'}
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Program Type') || 'Program Type'}
          </label>
          <select
            value={formData.program_type}
            onChange={(e) => setFormData({...formData, program_type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t('Select Type') || 'Select Type'}</option>
            <option value="devotion">{t('Devotion') || 'Devotion'}</option>
            <option value="music">{t('Music') || 'Music'}</option>
            <option value="news">{t('News') || 'News'}</option>
            <option value="discussion">{t('Discussion') || 'Discussion'}</option>
            <option value="prayer">{t('Prayer') || 'Prayer'}</option>
            <option value="testimony">{t('Testimony') || 'Testimony'}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Date Aired') || 'Date Aired'}
          </label>
          <input
            type="date"
            value={formData.date_aired}
            onChange={(e) => setFormData({...formData, date_aired: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Duration (minutes)') || 'Duration (minutes)'}
          </label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Description') || 'Description'}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Program Content') || 'Program Content'} *
        </label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={8}
          placeholder={t('Enter program transcript, notes, or content for AI analysis...') || 'Enter program transcript, notes, or content for AI analysis...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Audio URL') || 'Audio URL'}
        </label>
        <input
          type="url"
          value={formData.audio_url}
          onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setFormData({
            title: '',
            description: '',
            content: '',
            language: 'en',
            date_aired: '',
            duration_minutes: '',
            presenter: '',
            program_type: '',
            audio_url: ''
          })}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          {t('Clear') || 'Clear'}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (t('Creating...') || 'Creating...') : (t('Create Program') || 'Create Program')}
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>{t('AI Analysis') || 'AI Analysis'}</strong>: {t('Once created, the program will be automatically analyzed to generate summaries, extract highlights, and identify keywords.') || 'Once created, the program will be automatically analyzed to generate summaries, extract highlights, and identify keywords.'}
        </p>
      </div>
    </form>
  );
};

// Program Detail Modal Component
const ProgramDetailModal = ({ program, onClose, onAnalyze, t }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{program.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program Info */}
            <div className="space-y-4">
              {program.presenter && (
                <div>
                  <h4 className="font-semibold text-gray-700">{t('Presenter') || 'Presenter'}</h4>
                  <p className="text-gray-900">{program.presenter}</p>
                </div>
              )}
              
              {program.date_aired && (
                <div>
                  <h4 className="font-semibold text-gray-700">{t('Date Aired') || 'Date Aired'}</h4>
                  <p className="text-gray-900">{program.date_aired}</p>
                </div>
              )}
              
              {program.duration_minutes && (
                <div>
                  <h4 className="font-semibold text-gray-700">{t('Duration') || 'Duration'}</h4>
                  <p className="text-gray-900">{program.duration_minutes} {t('minutes') || 'minutes'}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-700">{t('Language') || 'Language'}</h4>
                <p className="text-gray-900">{program.language === 'fr' ? 'Français' : 'English'}</p>
              </div>
              
              {program.program_type && (
                <div>
                  <h4 className="font-semibold text-gray-700">{t('Type') || 'Type'}</h4>
                  <p className="text-gray-900 capitalize">{program.program_type}</p>
                </div>
              )}
            </div>
            
            {/* AI Analysis */}
            <div className="space-y-4">
              {program.summary && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🤖 {t('AI Summary') || 'AI Summary'}</h4>
                  <p className="text-gray-900 bg-green-50 p-3 rounded-md">{program.summary}</p>
                </div>
              )}
              
              {program.highlights && program.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">✨ {t('Key Highlights') || 'Key Highlights'}</h4>
                  <ul className="space-y-2">
                    {program.highlights.map((highlight, index) => (
                      <li key={index} className="bg-blue-50 p-2 rounded-md text-gray-900">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {program.keywords && program.keywords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🏷️ {t('Keywords') || 'Keywords'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.keywords.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">{t('Program Content') || 'Program Content'}</h4>
            <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
              <p className="text-gray-900 whitespace-pre-wrap">{program.content}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => onAnalyze('summary')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              🤖 {t('Generate Summary') || 'Generate Summary'}
            </button>
            <button
              onClick={() => onAnalyze('highlights')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ✨ {t('Extract Highlights') || 'Extract Highlights'}
            </button>
            <button
              onClick={() => onAnalyze('translate')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              🌐 {t('Translate') || 'Translate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analysis Modal Component
const AnalysisModal = ({ program, analysisType, onClose, onAnalyze, result, loading, t }) => {
  const handleAnalyze = () => {
    onAnalyze(program.id, analysisType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              🤖 {t('AI Analysis') || 'AI Analysis'}: {program.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Analysis Type') || 'Analysis Type'}
            </label>
            <div className="flex space-x-2">
              {['summary', 'highlights', 'keywords', 'translate'].map((type) => (
                <button
                  key={type}
                  onClick={() => {/* analysisType setter would go here */}}
                  className={`px-3 py-2 rounded-md text-sm ${
                    analysisType === type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'summary' && '📝 Summary'}
                  {type === 'highlights' && '✨ Highlights'}
                  {type === 'keywords' && '🏷️ Keywords'}
                  {type === 'translate' && '🌐 Translate'}
                </button>
              ))}
            </div>
          </div>
          
          {!result && !loading && (
            <div className="mb-6">
              <button
                onClick={handleAnalyze}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                🚀 {t('Start AI Analysis') || 'Start AI Analysis'}
              </button>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">{t('AI is analyzing the program...') || 'AI is analyzing the program...'}</p>
            </div>
          )}
          
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ {t('Analysis Complete') || 'Analysis Complete'}
                </h3>
                <p className="text-sm text-green-700">
                  {t('Processing time') || 'Processing time'}: {result.processing_time?.toFixed(2)}s | 
                  Model: {result.model_used}
                </p>
              </div>
              
              <div className="bg-white border rounded-md p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {t('Results') || 'Results'}:
                </h4>
                
                {result.result.summary && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">{t('Summary') || 'Summary'}:</h5>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{result.result.summary}</p>
                  </div>
                )}
                
                {result.result.highlights && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">{t('Highlights') || 'Highlights'}:</h5>
                    <ul className="space-y-1">
                      {result.result.highlights.map((highlight, index) => (
                        <li key={index} className="text-gray-700 bg-blue-50 p-2 rounded">
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.result.keywords && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">{t('Keywords') || 'Keywords'}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.result.keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.result.translation && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">
                      {t('Translation') || 'Translation'} ({result.result.target_language}):
                    </h5>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded">{result.result.translation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramAssistant;