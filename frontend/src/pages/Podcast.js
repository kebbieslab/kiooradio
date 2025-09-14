import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const Podcast = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [loading, setLoading] = useState(true);

  // Real program samples based on kiooradio.org/programs
  const programSamples = [
    {
      id: 1,
      title: "Guidelines",
      language: "en",
      description: "Morning Bible teaching program providing spiritual guidance and scriptural insights",
      thumbnail: "https://images.unsplash.com/photo-1576506542790-51244b486a6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHN0dWR5fGVufDB8fHx8MTc1NzgyNTQ1N3ww&ixlib=rb-4.1.0&q=85",
      audioUrl: "/assets/audio/guidelines-sample.mp3",
      duration: "5:10",
      category: "Bible Teaching",
      timeSlot: "05:00-05:10"
    },
    {
      id: 2,
      title: "Love & Faith",
      language: "en", 
      description: "Special program featuring Christian teachings on love, faith, and spiritual growth",
      thumbnail: "https://images.pexels.com/photos/3118214/pexels-photo-3118214.jpeg",
      audioUrl: "/assets/audio/love-faith-sample.mp3",
      duration: "7:30",
      category: "Bible Teaching",
      timeSlot: "07:00-07:30"
    },
    {
      id: 3,
      title: "Thru the Bible (TTB) - Kissi",
      language: "kissi",
      description: "Bible teaching program conducted in Kissi language for local community",
      thumbnail: "https://images.unsplash.com/photo-1485579149621-3123dd979885?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lfGVufDB8fHx8MTc1NzgyNTQ1MHww&ixlib=rb-4.1.0&q=85",
      audioUrl: "/assets/audio/ttb-kissi-sample.mp3",
      duration: "8:30",
      category: "Bible Teaching",
      timeSlot: "08:00-08:30"
    },
    {
      id: 4,
      title: "La Vie Chez Nous",
      language: "fr",
      description: "Community program in French featuring local stories and cultural content",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxtaWNyb3Bob25lfGVufDB8fHx8MTc1NzgyNTQ1MHww&ixlib=rb-4.1.0&q=85",
      audioUrl: "https://customer-assets.emergentagent.com/job_radio-weather-hub/artifacts/hmq9da5g_Spot%20Kioo%20Radio%2BLa%20Vie%20chez%20Nous_mixage%20final.mp3",
      duration: "2:45",
      category: "Community",
      timeSlot: "Various"
    },
    {
      id: 5,
      title: "Renaissance",
      language: "fr",
      description: "Interactive French program promoting cultural renaissance and community engagement",
      thumbnail: "https://images.unsplash.com/photo-1531651008558-ed1740375b39?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxtaWNyb3Bob25lfGVufDB8fHx8MTc1NzgyNTQ1MHww&ixlib=rb-4.1.0&q=85",
      audioUrl: "/assets/audio/renaissance-sample.mp3",
      duration: "16:30",
      category: "Interactive",
      timeSlot: "16:30-17:30"
    },
    {
      id: 6,
      title: "Pastor's Corner - Multi-Country",
      language: "mixed",
      description: "Special sermon program featuring pastors from Liberia, Sierra Leone, and Guinea",
      thumbnail: "https://images.unsplash.com/photo-1713281318607-c0fbfc96d58c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMGJyb2FkY2FzdGluZ3xlbnwwfHx8fDE3NTc4MjU0NDR8MA&ixlib=rb-4.1.0&q=85",
      audioUrl: "/assets/audio/pastors-corner-sample.mp3",
      duration: "21:30",
      category: "Sermon",
      timeSlot: "21:30-22:00"
    },
    {
      id: 7,
      title: "Youth Connect",
      language: "kissi",
      description: "Engaging program designed for young listeners with music, discussions, and inspiration",
      thumbnail: "https://images.unsplash.com/photo-1562072299-8ecc43a8c709?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxyYWRpbyUyMGJyb2FkY2FzdGluZ3xlbnwwfHx8fDE3NTc4MjU0NDR8MA&ixlib=rb-4.1.0&q=85",  
      audioUrl: "/assets/audio/youth-connect-sample.mp3",
      duration: "12:30",
      category: "Youth/Community",
      timeSlot: "12:30-13:00"
    },
    {
      id: 8,
      title: "Makona Talk Show",
      language: "mixed",
      description: "Weekly interactive show featuring discussions on issues across Liberia, Sierra Leone, and Guinea",
      thumbnail: "https://images.unsplash.com/photo-1713281318667-920b4708e77e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxyYWRpbyUyMGJyb2FkY2FzdGluZ3xlbnwwfHx8fDE3NTc4MjU0NDR8MA&ixlib=rb-4.1.0&q=85",
      audioUrl: "/assets/audio/makona-talk-sample.mp3",
      duration: "18:00",
      category: "Interactive",
      timeSlot: "Saturday 06:00-09:00"
    },
    {
      id: 9,
      title: "Hope & Care Outreach",
      language: "mixed",
      description: "Community outreach program focusing on hope, care, and social support across the region",
      thumbnail: "https://customer-assets.emergentagent.com/job_kioo-broadcast-mgmt/artifacts/jimaulr5_wide-view-of-Foya.jpg",
      audioUrl: "/assets/audio/hope-care-sample.mp3",
      duration: "15:00",
      category: "Outreach",
      timeSlot: "15:00-15:30"
    },
    {
      id: 10,
      title: "Christian Teaching - Mandingo",
      language: "mandingo",
      description: "Christian teachings and biblical principles presented in Mandingo language",
      thumbnail: "https://customer-assets.emergentagent.com/job_kioo-broadcast-mgmt/artifacts/bh1ilom6_Telling-the-vision-of-Kioo.jpg",
      audioUrl: "/assets/audio/christian-mandingo-sample.mp3",
      duration: "16:00",
      category: "Bible Teaching",
      timeSlot: "16:00-16:30"
    },
    {
      id: 11,
      title: "Christian Teaching - Fula",
      language: "fula",
      description: "Bible-based teachings and spiritual guidance presented in Fula language",
      thumbnail: "https://customer-assets.emergentagent.com/job_kioo-broadcast-mgmt/artifacts/6f4q1xma_Praying-over-Gue%CC%81cke%CC%81dou.JPG",
      audioUrl: "/assets/audio/christian-fula-sample.mp3",
      duration: "17:00",
      category: "Bible Teaching",
      timeSlot: "17:00-17:30"
    },
    {
      id: 12,
      title: "VNA French Satellite Feed",
      language: "fr",
      description: "International French programming via satellite providing diverse content from Voice of America",
      thumbnail: "https://customer-assets.emergentagent.com/job_kioo-broadcast-mgmt/artifacts/dd62t4s1_view-of-Gue%CC%81cke%CC%81dou.jpg",
      audioUrl: "/assets/audio/vna-french-sample.mp3",
      duration: "10:00",
      category: "Satellite",
      timeSlot: "09:00-10:00"
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
      'mixed': 'Mixed',
      'mandingo': 'Mandingo',
      'fula': 'Fula',
      'gbandi': 'Gbandi'
    };
    return labels[lang] || lang;
  };

  const getLanguageColor = (lang) => {
    const colors = {
      'kissi': 'bg-blue-100 text-blue-800',
      'en': 'bg-green-100 text-green-800',
      'fr': 'bg-purple-100 text-purple-800',
      'mixed': 'bg-orange-100 text-orange-800',
      'mandingo': 'bg-red-100 text-red-800',
      'fula': 'bg-yellow-100 text-yellow-800',
      'gbandi': 'bg-pink-100 text-pink-800'
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
            {['all', 'kissi', 'en', 'fr', 'mixed', 'mandingo', 'fula'].map(lang => (
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

                    {/* Time Slot Info */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">
                        📅 Air Time: {sample.timeSlot}
                      </p>
                    </div>

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