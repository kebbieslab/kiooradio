import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from '../utils/i18n';
import SEOHead from '../components/SEOHead';

const Podcast = () => {
  const { episodeSlug } = useParams();
  const { t } = useTranslation();
  const [episodes, setEpisodes] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [languageFilter, setLanguageFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Single episode view
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    loadPodcastData();
  }, []);

  useEffect(() => {
    if (episodeSlug && episodes.length > 0) {
      const episode = episodes.find(ep => ep.slug === episodeSlug);
      setSelectedEpisode(episode);
    }
  }, [episodeSlug, episodes]);

  const loadPodcastData = async () => {
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
      } else {
        throw new Error('Failed to load podcast data');
      }
    } catch (error) {
      console.error('Error loading podcast data:', error);
      setError('Failed to load podcast content');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
    const dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });
    return `${time} GMT, ${dateStr}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `(${mb} MB)`;
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      'kissi': 'Kissi',
      'en': 'English',
      'fr': 'French',
      'ev': 'Evangelistic'
    };
    return labels[lang] || lang;
  };

  const getLanguageColor = (lang) => {
    const colors = {
      'kissi': 'bg-blue-100 text-blue-800',
      'en': 'bg-green-100 text-green-800',
      'fr': 'bg-purple-100 text-purple-800',
      'ev': 'bg-orange-100 text-orange-800'
    };
    return colors[lang] || 'bg-gray-100 text-gray-800';
  };

  const filteredAndSortedEpisodes = () => {
    let filtered = [...episodes];
    
    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(ep => ep.language === languageFilter);
    }
    
    // Apply series filter
    if (seriesFilter !== 'all') {
      filtered = filtered.filter(ep => ep.seriesId === seriesFilter);
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date_gmt_iso) - new Date(a.date_gmt_iso));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date_gmt_iso) - new Date(b.date_gmt_iso));
    }
    
    return filtered;
  };

  const getSeriesById = (seriesId) => {
    return series.find(s => s.id === seriesId) || { title: 'Unknown Series' };
  };

  // Single episode detail view
  if (selectedEpisode) {
    const episodeSeries = getSeriesById(selectedEpisode.seriesId);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title={`${selectedEpisode.title} - Kioo Radio Podcast`}
          description={selectedEpisode.description || `Listen to ${selectedEpisode.title} from ${episodeSeries.title}`}
        />
        
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button */}
          <Link 
            to="/podcast" 
            className="inline-flex items-center text-kioo-primary hover:text-kioo-primary-dark mb-6"
          >
            ← Back to Podcast
          </Link>
          
          {/* Episode Hero */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={selectedEpisode.imageUrl || episodeSeries.imageUrl || '/assets/images/kioo-logo.png'}
                alt={selectedEpisode.title}
                className="w-full md:w-64 h-64 object-cover rounded-lg"
                loading="lazy"
              />
              
              <div className="flex-1">
                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(selectedEpisode.language)}`}>
                    {getLanguageLabel(selectedEpisode.language)}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedEpisode.title}
                </h1>
                
                <p className="text-gray-600 mb-2">{episodeSeries.title}</p>
                
                <p className="text-sm text-gray-500 mb-4">
                  {formatDate(selectedEpisode.date_gmt_iso)} • {formatDuration(selectedEpisode.duration_sec)}
                </p>
                
                {selectedEpisode.description && (
                  <p className="text-gray-700 mb-4">{selectedEpisode.description}</p>
                )}
                
                {/* Audio Player */}
                <div className="mb-4">
                  <audio 
                    controls 
                    preload="metadata"
                    className="w-full"
                    style={{ height: '40px' }}
                  >
                    <source src={selectedEpisode.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={selectedEpisode.audio_url}
                    download
                    className="inline-flex items-center px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary-dark transition-colors"
                  >
                    📥 Download {formatFileSize(selectedEpisode.audio_bytes)}
                  </a>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    🔗 Share
                  </button>
                  
                  {selectedEpisode.transcript_url && (
                    <a
                      href={selectedEpisode.transcript_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      📄 Transcript
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Kioo Radio Podcast - Listen & Download"
        description="Discover inspiring content from Kioo Radio in multiple languages. Listen online or download episodes in Kissi, English, French, and Evangelistic content."
      />
      
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Kioo Radio Podcast — Listen & Download
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Inspiring content in multiple languages bringing hope, faith, and community across the Makona River Region
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Language Filter */}
            <div className="flex flex-wrap gap-2">
              <label className="text-sm font-medium text-gray-700">Language:</label>
              {['all', 'kissi', 'en', 'fr', 'ev'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguageFilter(lang)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    languageFilter === lang
                      ? 'bg-kioo-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'all' ? 'All' : getLanguageLabel(lang)}
                </button>
              ))}
            </div>
            
            {/* Series Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Series:</label>
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              >
                <option value="all">All Series</option>
                {series.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary mb-4"></div>
            <p className="text-gray-600">Loading episodes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Subscribe Box */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Subscribe to our Podcast</h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/podcast/feed.xml"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  📡 RSS Feed
                </a>
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
                  🍎 Apple Podcasts (Coming Soon)
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
                  🎵 Spotify (Coming Soon)
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {filteredAndSortedEpisodes().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No episodes found matching your filters.</p>
                </div>
              ) : (
                filteredAndSortedEpisodes().map((episode) => {
                  const episodeSeries = getSeriesById(episode.seriesId);
                  
                  return (
                    <div key={episode.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Cover Image */}
                        <img 
                          src={episode.imageUrl || episodeSeries.imageUrl || '/assets/images/kioo-logo.png'}
                          alt={episode.title}
                          className="w-full sm:w-24 h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                        
                        {/* Episode Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <Link 
                                to={`/podcast/episode/${episode.slug}`}
                                className="text-lg font-semibold text-gray-900 hover:text-kioo-primary line-clamp-2"
                              >
                                {episode.title}
                              </Link>
                              <p className="text-sm text-gray-600">{episodeSeries.title}</p>
                            </div>
                            
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(episode.language)}`}>
                              {getLanguageLabel(episode.language)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(episode.date_gmt_iso)} • {formatDuration(episode.duration_sec)}
                          </p>
                          
                          {/* Audio Player */}
                          <div className="mb-3">
                            <audio 
                              controls 
                              preload="metadata"
                              className="w-full max-w-md"
                              style={{ height: '32px' }}
                            >
                              <source src={episode.audio_url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={episode.audio_url}
                              download
                              className="inline-flex items-center px-3 py-1 bg-kioo-primary text-white text-sm rounded hover:bg-kioo-primary-dark transition-colors"
                            >
                              📥 Download {formatFileSize(episode.audio_bytes)}
                            </a>
                            
                            <Link
                              to={`/podcast/episode/${episode.slug}`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                            >
                              🔗 Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Podcast;