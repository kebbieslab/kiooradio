import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const Podcast = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample program data - you can later move this to a JSON file or API
  const programSamples = [
    {
      id: 1,
      title: "Morning Devotion",
      language: "en",
      description: "Start your day with inspiring devotional content and prayers",
      thumbnail: "/assets/images/morning-devotion.jpg",
      audioUrl: "/assets/audio/morning-devotion-sample.mp3",
      duration: "5:30",
      category: "Devotional"
    },
    {
      id: 2,
      title: "Kissi Gospel Hour",
      language: "kissi",
      description: "Traditional gospel music and teachings in Kissi language",
      thumbnail: "/assets/images/kissi-gospel.jpg",
      audioUrl: "/assets/audio/kissi-gospel-sample.mp3",
      duration: "8:15",
      category: "Gospel"
    },
    {
      id: 3,
      title: "French Bible Study",
      language: "fr",
      description: "Interactive Bible study sessions conducted in French",
      thumbnail: "/assets/images/french-bible.jpg",
      audioUrl: "/assets/audio/french-bible-sample.mp3",
      duration: "12:45",
      category: "Bible Study"
    },
    {
      id: 4,
      title: "Youth Connection",
      language: "en",
      description: "Engaging content designed specifically for young listeners",
      thumbnail: "/assets/images/youth-program.jpg",
      audioUrl: "/assets/audio/youth-sample.mp3",
      duration: "6:20",
      category: "Youth"
    },
    {
      id: 5,
      title: "Evening Reflection",
      language: "kissi",
      description: "Peaceful evening reflections and community stories",
      thumbnail: "/assets/images/evening-reflection.jpg",
      audioUrl: "/assets/audio/evening-sample.mp3",
      duration: "7:30",
      category: "Reflection"
    },
    {
      id: 6,
      title: "Prières du Soir",
      language: "fr",
      description: "Evening prayers and spiritual guidance in French",
      thumbnail: "/assets/images/french-prayers.jpg",
      audioUrl: "/assets/audio/french-prayers-sample.mp3",
      duration: "4:45",
      category: "Prayer"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

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

  const filteredSamples = selectedLanguage === 'all' 
    ? programSamples 
    : programSamples.filter(sample => sample.language === selectedLanguage);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Program Samples - Kioo Radio"
        description="Listen to sample clips from Kioo Radio's inspiring programs in multiple languages. Experience our faith-based content serving the Makona River Region."
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-kioo-primary to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Program Samples
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Listen & Experience Our Content
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Discover the inspiring content we broadcast daily. Listen to sample clips from our various programs 
              in multiple languages, bringing hope, faith, and community to the Makona River Region.
            </p>
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by Language:</span>
            {['all', 'kissi', 'en', 'fr'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-kioo-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang === 'all' ? '🌍 All Languages' : `${getLanguageLabel(lang)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary mb-4"></div>
            <p className="text-gray-600">Loading program samples...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredSamples.length} program sample{filteredSamples.length !== 1 ? 's' : ''} found
                {selectedLanguage !== 'all' && ` in ${getLanguageLabel(selectedLanguage)}`}
              </p>
            </div>

            {/* Program Samples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSamples.map((sample) => (
                <div key={sample.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img 
                      src={sample.thumbnail || '/assets/images/kioo-logo.png'}
                      alt={sample.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/kioo-logo.png';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(sample.language)}`}>
                        {getLanguageLabel(sample.language)}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {sample.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {sample.title}
                      </h3>
                      <p className="text-sm text-kioo-primary font-medium">
                        {sample.category}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {sample.description}
                    </p>

                    {/* Audio Player */}
                    <div className="mb-4">
                      <audio 
                        controls 
                        preload="metadata"
                        className="w-full"
                        style={{ height: '36px' }}
                      >
                        <source src={sample.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const audio = document.createElement('audio');
                          audio.src = sample.audioUrl;
                          audio.play().catch(() => {
                            alert('Unable to play audio. Please check your browser settings.');
                          });
                        }}
                        className="flex-1 bg-kioo-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-kioo-primary-dark transition-colors"
                      >
                        🎵 Play Sample
                      </button>
                      <button
                        onClick={() => {
                          // Share functionality
                          if (navigator.share) {
                            navigator.share({
                              title: sample.title,
                              text: sample.description,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        📤
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSamples.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎙️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No samples found</h3>
                <p className="text-gray-600">
                  No program samples available for the selected language.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-kioo-primary text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Listen Live?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Experience our full programming live on Kioo Radio 98.1 FM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/listen-live"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-kioo-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              📻 Listen Live Now
            </a>
            <a
              href="/programs"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-colors"
            >
              📅 View Program Schedule
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;