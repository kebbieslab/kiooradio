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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-scroll functionality for the banner - pause on hover/touch
  useEffect(() => {
    if (isHovered || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered, isPaused]);

  // Resume auto-scroll after manual navigation
  useEffect(() => {
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
      }, 6000); // Resume after 6 seconds
      return () => clearTimeout(timeout);
    }
  }, [isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        closeBanner();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsHovered(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    
    setIsHovered(false);
  };

  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsPaused(true);
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
    localStorage.setItem('kiooHeroClosed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Photo Banner */}
      <div 
        id="kioo-hero-gallery"
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 photo-banner"
        style={{ height: 'clamp(240px, 50vh, 520px)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
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
            className="flex h-full transition-transform duration-500 ease-in-out"
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
                  alt={image.alt || image.caption}
                  className="w-full h-full object-contain object-center bg-gradient-to-br from-gray-800 to-black"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Per-Image Caption - Bottom Center */}
                <div 
                  className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 transition-opacity duration-250"
                  aria-live="polite"
                >
                  <div className="bg-black/45 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg text-center">
                    <p 
                      className="text-white font-normal leading-relaxed text-shadow-lg"
                      style={{ 
                        fontSize: 'clamp(16px, 2.6vw, 28px)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {image.caption}
                    </p>
                  </div>
                </div>

                {/* Click to expand hint */}
                <div className="absolute top-4 left-4 bg-kioo-primary/90 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold opacity-90">
                  Click to expand
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-black/80 transition-all duration-200 z-20 shadow-lg"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-16 md:right-20 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-black/80 transition-all duration-200 z-20 shadow-lg"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsPaused(true);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-kioo-primary scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1} of ${images.length}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {!isHovered && !isPaused && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div 
              className="h-full bg-kioo-primary transition-all duration-100"
              style={{ 
                width: `${((currentIndex + 1) / images.length) * 100}%`
              }}
            />
          </div>
        )}

        {/* Auto-scroll pause indicator */}
        {(isHovered || isPaused) && (
          <div className="absolute top-4 right-20 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">
            Auto-scroll paused
          </div>
        )}
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