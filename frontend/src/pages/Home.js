import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PartnersStrip from '../components/PartnersStrip';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [impactStories, setImpactStories] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [impactRes, newsRes] = await Promise.all([
          axios.get(`${API}/impact-stories?featured_only=true`),
          axios.get(`${API}/news`),
        ]);
        
        setImpactStories(impactRes.data.slice(0, 3));
        setLatestNews(newsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  // Countdown Logic
  useEffect(() => {
    const LAUNCH_DATE = new Date('November 13, 2025 00:00:00 GMT').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeLeft = LAUNCH_DATE - now;
      
      if (timeLeft <= 0) {
        setShowCountdown(false);
        return;
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      const daysEl = document.getElementById('kioo-days');
      const hoursEl = document.getElementById('kioo-hours');
      const minutesEl = document.getElementById('kioo-minutes');
      const secondsEl = document.getElementById('kioo-seconds');
      
      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };

    if (showCountdown) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [showCountdown]);

  const closeCountdown = () => {
    setShowCountdown(false);
  };

  return (
    <div className="min-h-screen">
      
      {/* Kioo Radio Launch Countdown Popup - Horizontal Design */}
      {showCountdown && (
        <>
          {/* Mobile-specific styles */}
          <style>{`
            @media (max-width: 768px) {
              .kioo-countdown-container {
                width: 95% !important;
                padding: 20px 25px !important;
                margin: 10px !important;
              }
              .kioo-countdown-mobile-stack {
                flex-direction: column !important;
                gap: 20px !important;
              }
              .kioo-countdown-mobile-wrap {
                flex-wrap: wrap !important;
                justify-content: center !important;
              }
              .kioo-countdown-mobile-info {
                flex-direction: column !important;
                text-align: center !important;
                gap: 10px !important;
              }
            }
          `}</style>
          
          <div className="kioo-countdown-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999999,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            <div className="kioo-countdown-container" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '25px',
              padding: '25px 40px',
              maxWidth: '95%',
              width: '900px',
              height: 'auto',
              position: 'relative',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              border: '3px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #148026, #FF6600)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'content-box, border-box'
            }}>
              {/* Close Button */}
              <button 
                onClick={closeCountdown}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '25px',
                  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  border: '2px solid #148026',
                  fontSize: '24px',
                  color: '#148026',
                  cursor: 'pointer',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #148026, #0f6a1f)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
                  e.target.style.color = '#148026';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
              
              {/* Content */}
              <div className="kioo-countdown-content">
                {/* Header - Horizontal Layout */}
                <div className="kioo-countdown-mobile-stack" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '25px',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      fontSize: '3em',
                      background: 'linear-gradient(135deg, #148026, #0f6a1f)',
                      borderRadius: '15px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(20, 128, 38, 0.3)'
                    }}>📻</div>
                    
                    <div style={{ textAlign: 'left' }}>
                      <h1 style={{
                        fontSize: '2.4em',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #148026, #0f6a1f)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0',
                        textShadow: 'none'
                      }}>
                        KIOO RADIO
                      </h1>
                      <div style={{
                        fontSize: '1.4em',
                        color: '#148026',
                        fontWeight: '600',
                        margin: '0'
                      }}>
                        98.1FM
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #FF6600, #e55d00)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontSize: '1.1em',
                    fontWeight: '600',
                    boxShadow: '0 6px 20px rgba(255, 102, 0, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Official Launch Countdown
                  </div>
                </div>
                
                {/* Countdown Display - Horizontal */}
                <div className="kioo-countdown-mobile-wrap" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '30px 0',
                  flexWrap: 'wrap',
                  gap: '15px',
                  background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                  padding: '25px',
                  borderRadius: '20px',
                  border: '2px solid #e9ecef'
                }}>
                  {/* Days */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                    <div id="kioo-days" style={{
                      fontSize: '3.5em',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #148026, #0f6a1f)',
                      borderRadius: '18px',
                      padding: '20px 15px',
                      minWidth: '100px',
                      boxShadow: '0 8px 25px rgba(20, 128, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>00</div>
                    <div style={{
                      fontSize: '1em',
                      fontWeight: 'bold',
                      color: '#148026',
                      marginTop: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}>Days</div>
                  </div>
                  
                  {/* Separator */}
                  <div style={{ 
                    fontSize: '3em', 
                    fontWeight: 'bold', 
                    color: '#FF6600', 
                    margin: '0 5px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}>:</div>
                  
                  {/* Hours */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                    <div id="kioo-hours" style={{
                      fontSize: '3.5em',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #FF6600, #e55d00)',
                      borderRadius: '18px',
                      padding: '20px 15px',
                      minWidth: '100px',
                      boxShadow: '0 8px 25px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}>00</div>
                    <div style={{
                      fontSize: '1em',
                      fontWeight: 'bold',
                      color: '#FF6600',
                      marginTop: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}>Hours</div>
                  </div>
                  
                  {/* Separator */}
                  <div style={{ 
                    fontSize: '3em', 
                    fontWeight: 'bold', 
                    color: '#148026', 
                    margin: '0 5px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}>:</div>
                  
                  {/* Minutes */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                    <div id="kioo-minutes" style={{
                      fontSize: '3.5em',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #148026, #0f6a1f)',
                      borderRadius: '18px',
                      padding: '20px 15px',
                      minWidth: '100px',
                      boxShadow: '0 8px 25px rgba(20, 128, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}>00</div>
                    <div style={{
                      fontSize: '1em',
                      fontWeight: 'bold',
                      color: '#148026',
                      marginTop: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}>Minutes</div>
                  </div>
                  
                  {/* Separator */}
                  <div style={{ 
                    fontSize: '3em', 
                    fontWeight: 'bold', 
                    color: '#FF6600', 
                    margin: '0 5px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}>:</div>
                  
                  {/* Seconds */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                    <div id="kioo-seconds" style={{
                      fontSize: '3.5em',
                      fontWeight: 'bold',
                      color: 'white',
                      background: 'linear-gradient(135deg, #FF6600, #e55d00)',
                      borderRadius: '18px',
                      padding: '20px 15px',
                      minWidth: '100px',
                      boxShadow: '0 8px 25px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}>00</div>
                    <div style={{
                      fontSize: '1em',
                      fontWeight: 'bold',
                      color: '#FF6600',
                      marginTop: '12px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}>Seconds</div>
                  </div>
                </div>
                
                {/* Launch Date - Horizontal Info Bar */}
                <div className="kioo-countdown-mobile-info" style={{
                  background: 'linear-gradient(135deg, #148026, #0f6a1f)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5em' }}>🎉</span>
                    <div>
                      <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>November 13, 2025</div>
                      <div style={{ fontSize: '0.9em', opacity: '0.9' }}>Launch Day</div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <div style={{ fontSize: '1.1em', fontStyle: 'italic', marginBottom: '5px' }}>
                      Broadcasting to the Makona River Region
                    </div>
                    <div style={{ fontSize: '1em', fontWeight: '600' }}>
                      🇱🇷 Liberia • 🇸🇱 Sierra Leone • 🇬🇳 Guinea
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>98.1 FM</div>
                      <div style={{ fontSize: '0.9em', opacity: '0.9' }}>Radio Frequency</div>
                    </div>
                    <span style={{ fontSize: '1.5em' }}>📡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Hero Section - Updated for Makona River Region */}
      <section className="relative bg-gradient-to-br from-kioo-primary via-kioo-secondary to-kioo-dark text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Radio waves background animation */}
        <div className="absolute top-10 right-10 opacity-10">
          <div className="radio-waves">
            <div className="w-32 h-32 border-4 border-white rounded-full"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Hero Content - Updated Text */}
            <div className="hero-content hero-fade-in">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                  🎙️ Broadcasting Soon
                </span>
              </div>
              
              {/* Centered Main Title */}
              <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  <span data-i18n="heroTitle">Reaching Hearts across the Makona River Region</span>
                </h1>
                
                <p className="text-xl lg:text-2xl mb-8 text-green-100 leading-relaxed max-w-3xl mx-auto">
                  <span data-i18n="heroSub">Our signal covers over 150 miles, bringing Faith and Hope to the Kissi, Mandingo, Fulani, Gbandi and more.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                <Link 
                  to="/listen-live"
                  className="btn-primary inline-flex items-center justify-center space-x-3 text-lg"
                >
                  <span className="w-3 h-3 bg-red-400 rounded-full live-pulse"></span>
                  <span data-i18n="listen">🔴 Listen Live</span>
                </Link>
                
                <Link 
                  to="/programs"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all duration-200"
                >
                  <span data-i18n="programs">📅 Programs</span>
                </Link>

                <Link 
                  to="/church-partners"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all duration-200"
                >
                  <span>⛪ Partner Churches</span>
                </Link>

                <Link 
                  to="/donate"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all duration-200"
                >
                  <span data-i18n="donate">💖 Donate</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery Promo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-kioo-primary to-kioo-secondary rounded-2xl overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Content */}
              <div className="p-8 lg:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">🎬 Media Gallery</h2>
                <p className="text-green-100 text-lg mb-6 leading-relaxed">
                  Discover the inspiring journey of Kioo Radio through videos and photos. 
                  Watch our story unfold from divine calling to broadcasting reality across the Makona River Region.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/media"
                    className="bg-white text-kioo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                  >
                    📹 Watch & Photos
                  </Link>
                  <Link
                    to="/media#videos"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-colors inline-flex items-center justify-center"
                  >
                    ▶️ View Videos
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <div className="relative bg-gradient-to-br from-kioo-secondary to-kioo-primary p-8 lg:p-12 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 opacity-80">
                  {/* Video thumbnails mockup */}
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">▶️</div>
                    <div className="text-sm text-green-100">Vision Story</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📹</div>
                    <div className="text-sm text-green-100">French Version</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-sm text-green-100">Photo Gallery</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎤</div>
                    <div className="text-sm text-green-100">Behind Scenes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage & Impact Section - Updated for Makona River Region */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-4">
              Reaching Hearts Across the Makona River Region
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our signal covers over 150 miles, bringing hope and community to millions
            </p>
          </div>

          <div className="coverage-map">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-kioo-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🇱🇷</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Liberia</h3>
                <p className="text-gray-600">Foya, Lofa County • 400K People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-kioo-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🇸🇱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sierra Leone</h3>
                <p className="text-gray-600">Koindu, Kailahun • 500K People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-kioo-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🇬🇳</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Guinea</h3>
                <p className="text-gray-600">Guéckédou Region • 2.1M People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-accent h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-8 text-sm text-gray-600">
                <span>📍 Broadcast Range: 150+ Miles</span>
                <span>👥 Total Reach: 3+ Million People</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      {impactStories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-4">
                  Lives Changed
                </h2>
                <p className="text-lg text-gray-600">
                  Real stories from our listeners across the Makona River Region
                </p>
              </div>
              <Link 
                to="/impact" 
                className="text-kioo-primary font-semibold hover:text-kioo-secondary transition-colors"
              >
                View All Stories →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {impactStories.map((story) => (
                <div key={story.id} className="impact-card p-6 rounded-xl card-hover">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-12 h-12 bg-kioo-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">💝</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-kioo-dark">{story.title}</h3>
                      <p className="text-sm text-gray-500">{story.author_name} • {story.author_location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {story.content.substring(0, 120)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-4">
                  Latest Updates
                </h2>
                <p className="text-lg text-gray-600">
                  Stay informed about our progress and community events
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <article key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <span>📰</span>
                      <span>{new Date(news.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{news.author}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-kioo-dark mb-3">{news.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{news.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get Involved CTA Section */}
      <section className="py-16 bg-kioo-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Help us continue spreading hope and good news across the Makona River Region
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/listen-live" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">📻</div>
              <h3 className="text-xl font-semibold text-white mb-3" data-i18n="listen">Listen Live</h3>
              <p className="text-green-100">Tune in to our broadcasts</p>
            </Link>
            
            <Link to="/programs" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-3" data-i18n="programs">Programs</h3>
              <p className="text-green-100">Discover our programming schedule</p>
            </Link>
            
            <Link to="/donate" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">💖</div>
              <h3 className="text-xl font-semibold text-white mb-3" data-i18n="donate">Donate</h3>
              <p className="text-green-100">Support our broadcasting mission</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Strip - Above Footer */}
      <PartnersStrip />
    </div>
  );
};

export default Home;