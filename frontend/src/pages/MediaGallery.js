import React, { useState, useEffect } from 'react';

const MediaGallery = () => {
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
        const [videosRes, photosRes, settingsRes] = await Promise.all([
          fetch(`${backendUrl}/api/media/videos`),
          fetch(`${backendUrl}/api/media/photos`),
          fetch(`${backendUrl}/api/media/settings`)
        ]);

        if (videosRes.ok) setVideos(await videosRes.json());
        if (photosRes.ok) setPhotos(await photosRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
      } catch (error) {
        console.error('Error fetching media data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Open lightbox
  const openLightbox = (photo) => {
    setLightboxPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxPhoto(null);
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && lightboxPhoto) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightboxPhoto]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kioo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              🎬 Media Gallery
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Watch and discover the inspiring journey of Kioo Radio 98.1FM through videos and photos showcasing God's work in the Makona River Region
            </p>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📹 Videos</h2>
            <p className="text-xl text-gray-600">The story of Kioo Radio in moving pictures</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const videoId = extractYouTubeId(video.youtubeUrl);
              const thumbnailUrl = getYouTubeThumbnail(videoId);
              const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

              return (
                <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Video Thumbnail/Embed */}
                  <div className="relative bg-gray-100">
                    <div style={{paddingBottom: '56.25%', height: 0, position: 'relative'}}>
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                    
                    {/* Language Badge */}
                    {video.language && (
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.language === 'fr' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {video.language.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-kioo-dark mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-kioo-primary hover:text-kioo-secondary font-medium"
                      >
                        ▶️ Watch
                      </a>
                      {video.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Highlights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📸 Photo Highlights</h2>
            <p className="text-xl text-gray-600">Capturing moments from our journey of faith</p>
          </div>

          {/* Featured Photos Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {photos.slice(0, 3).map((photo, index) => (
              <div 
                key={photo.id} 
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => openLightbox(photo)}
              >
                {/* Photo */}
                <div className={`relative bg-gray-200 ${index === 0 ? 'h-96' : 'h-48'}`}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <div className="text-2xl mb-2">🔍</div>
                      <p className="text-sm font-medium">View Photo</p>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {photo.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Photo Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-kioo-dark mb-1">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-gray-600 text-sm mb-2">{photo.caption}</p>
                  )}
                  {photo.location && (
                    <p className="text-gray-500 text-xs">📍 {photo.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View More Photos Button */}
          {photos.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllPhotos(!showAllPhotos)}
                className="bg-kioo-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
              >
                {showAllPhotos ? '📁 Show Less Photos' : '📂 View More Photos'}
              </button>
            </div>
          )}

          {/* All Photos Grid (when expanded) */}
          {showAllPhotos && photos.length > 3 && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              {photos.slice(3).map((photo) => (
                <div
                  key={photo.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                  onClick={() => openLightbox(photo)}
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={photo.imageUrl}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                        <div className="text-xl">🔍</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-kioo-dark truncate">
                      {photo.title}
                    </h4>
                    {photo.location && (
                      <p className="text-xs text-gray-500 mt-1">📍 {photo.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Close lightbox"
            >
              ×
            </button>

            {/* Photo */}
            <img
              src={lightboxPhoto.imageUrl}
              alt={lightboxPhoto.alt}
              className="max-w-full max-h-screen object-contain"
            />

            {/* Photo Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{lightboxPhoto.title}</h3>
              {lightboxPhoto.caption && (
                <p className="text-gray-200 mb-2">{lightboxPhoto.caption}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-300">
                {lightboxPhoto.location && (
                  <span>📍 {lightboxPhoto.location}</span>
                )}
                {lightboxPhoto.credit && (
                  <span>📷 {lightboxPhoto.credit}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;