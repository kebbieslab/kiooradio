import React, { useState, useEffect } from 'react';
import PhotoShowcase from './PhotoShowcase';

const PhotoBanner = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShowcase, setShowShowcase] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    // Check localStorage for closed state
    return localStorage.getItem('kiooHeroClosed') !== 'true';
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality for the banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const openShowcase = () => {
    setShowShowcase(true);
  };

  const closeShowcase = () => {
    setShowShowcase(false);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Photo Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-black photo-banner">
        
        {/* Close Button */}
        <button
          onClick={closeBanner}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
          aria-label="Close photo banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Image with Sliding Animation */}
        <div className="relative w-full h-full">
          <div 
            className="flex photo-banner-transition h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="min-w-full h-full relative cursor-pointer"
                onClick={openShowcase}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 photo-banner-caption">
                  <p className="text-white text-sm md:text-lg font-medium leading-relaxed max-w-4xl">
                    {image.caption}
                  </p>
                </div>

                {/* Click to expand hint */}
                <div className="absolute top-4 left-4 bg-kioo-primary text-white px-3 py-1 rounded-full text-xs md:text-sm opacity-80">
                  Click to expand
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
          aria-label="Previous image"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10 mr-12"
          aria-label="Next image"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-kioo-primary scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
          <div 
            className="h-full bg-kioo-primary"
            style={{ 
              width: `${((currentIndex + 1) / images.length) * 100}%`,
              transition: 'width 5s linear'
            }}
          />
        </div>
      </div>

      {/* Full Screen Photo Showcase */}
      {showShowcase && (
        <PhotoShowcase 
          images={images} 
          onClose={closeShowcase}
        />
      )}
    </>
  );
};

export default PhotoBanner;