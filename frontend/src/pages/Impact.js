import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Impact = () => {
  const [impactStories, setImpactStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storiesRes = await axios.get(`${API}/impact-stories`);
        setImpactStories(storiesRes.data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading w-16 h-16 rounded-full mb-4"></div>
          <p className="text-kioo-primary">Loading impact stories...</p>
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
              💝 Lives Transformed
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Every day, Kioo Radio touches hearts and changes lives across the Makona River Region. 
              Here are the real stories of hope, healing, and transformation from our listeners.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics - Infographic Style */}
      <section className="py-20 bg-gradient-to-r from-kioo-primary via-kioo-secondary to-kioo-accent relative overflow-hidden">
        {/* Radio Wave Animation Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 border border-white rounded-full animate-ping animation-delay-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white rounded-full animate-ping animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Statistics Display */}
          <div className="relative">
            {/* Central Hub */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl">📻</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Countries Stat */}
              <div className="relative group">
                {/* Connecting Line */}
                <div className="hidden lg:block absolute top-0 left-1/2 w-px h-16 bg-white/30 transform -translate-x-1/2 -translate-y-16"></div>
                
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  {/* Hexagon Shape */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transform rotate-45 rounded-lg border border-white/30"></div>
                    <div className="absolute inset-2 bg-white rounded-lg transform rotate-45 flex items-center justify-center">
                      <span className="text-2xl transform -rotate-45">🌍</span>
                    </div>
                  </div>
                  
                  {/* Counter */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">3</h3>
                    <p className="text-white/90 font-medium text-lg">Countries</p>
                    <p className="text-white/70 text-sm mt-2">Liberia • Sierra Leone • Guinea</p>
                    
                    {/* Progress Ring */}
                    <div className="mt-4 mx-auto w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4"/>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" 
                                strokeDasharray="176" strokeDashoffset="0" 
                                className="transition-all duration-2000 group-hover:stroke-dashoffset-44"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* People Stat */}
              <div className="relative group">
                <div className="hidden lg:block absolute top-0 left-1/2 w-px h-16 bg-white/30 transform -translate-x-1/2 -translate-y-16"></div>
                
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transform rotate-45 rounded-lg border border-white/30"></div>
                    <div className="absolute inset-2 bg-white rounded-lg transform rotate-45 flex items-center justify-center">
                      <span className="text-2xl transform -rotate-45">👥</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">3M+</h3>
                    <p className="text-white/90 font-medium text-lg">People Reached</p>
                    <p className="text-white/70 text-sm mt-2">Daily broadcast coverage</p>
                    
                    <div className="mt-4 mx-auto w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4"/>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" 
                                strokeDasharray="176" strokeDashoffset="35" 
                                className="transition-all duration-2000 group-hover:stroke-dashoffset-18"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Broadcasting Stat */}
              <div className="relative group">
                <div className="hidden lg:block absolute top-0 left-1/2 w-px h-16 bg-white/30 transform -translate-x-1/2 -translate-y-16"></div>
                
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transform rotate-45 rounded-lg border border-white/30"></div>
                    <div className="absolute inset-2 bg-white rounded-lg transform rotate-45 flex items-center justify-center">
                      <span className="text-2xl transform -rotate-45">⏰</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">24/7</h3>
                    <p className="text-white/90 font-medium text-lg">Broadcasting</p>
                    <p className="text-white/70 text-sm mt-2">Non-stop programming</p>
                    
                    <div className="mt-4 mx-auto w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4"/>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" 
                                strokeDasharray="176" strokeDashoffset="0" 
                                className="transition-all duration-2000 group-hover:stroke-dashoffset-0"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages Stat */}
              <div className="relative group">
                <div className="hidden lg:block absolute top-0 left-1/2 w-px h-16 bg-white/30 transform -translate-x-1/2 -translate-y-16"></div>
                
                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transform rotate-45 rounded-lg border border-white/30"></div>
                    <div className="absolute inset-2 bg-white rounded-lg transform rotate-45 flex items-center justify-center">
                      <span className="text-2xl transform -rotate-45">🎙️</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">6</h3>
                    <p className="text-white/90 font-medium text-lg">Languages</p>
                    <p className="text-white/70 text-sm mt-2">Multilingual programming</p>
                    
                    <div className="mt-4 mx-auto w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4"/>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" 
                                strokeDasharray="176" strokeDashoffset="88" 
                                className="transition-all duration-2000 group-hover:stroke-dashoffset-44"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">6+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Status Bar */}
            <div className="mt-16 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-12 py-4 border border-white/20 flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">ON AIR</span>
                </div>
                <div className="w-px h-6 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">FM 98.1</span>
                </div>
                <div className="w-px h-6 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">STREAMING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom CSS for animation delays */}
        <style jsx>{`
          .animation-delay-0 { animation-delay: 0s; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </section>

      {/* Coverage Areas - Updated per specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4" data-i18n="impactTitle">Our Coverage at a Glance</h2>
            <p className="text-lg text-gray-600">Broadcasting across the Makona River Region</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Foya, Lofa County: Liberia */}
            <article className="card bg-white border border-gray-200 rounded-xl p-6 shadow-lg card-hover">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kioo-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🇱🇷</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-kioo-dark">Foya, Lofa County: Liberia</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <span className="en-text">Estimated 400,000 people within our coverage area.</span>
                <span className="fr-text hidden">Environ 400 000 personnes couvertes.</span>
              </p>
            </article>

            {/* Koindu, Kailahun District: Sierra Leone */}
            <article className="card bg-white border border-gray-200 rounded-xl p-6 shadow-lg card-hover">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kioo-secondary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🇸🇱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-kioo-dark">Koindu, Kailahun District: Sierra Leone</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <span className="en-text">Our signal reaches over 500,000 people.</span>
                <span className="fr-text hidden">Notre signal atteint plus de 500 000 personnes.</span>
              </p>
            </article>

            {/* Guéckédou – N'Zérékoré corridor: Guinea */}
            <article className="card bg-white border border-gray-200 rounded-xl p-6 shadow-lg card-hover">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-kioo-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🇬🇳</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-kioo-dark">Guéckédou – N'Zérékoré corridor: Guinea</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <span className="en-text">The most populous region in our coverage area, with over 2.1 million people.</span>
                <span className="fr-text hidden">La région la plus peuplée de notre couverture, avec plus de 2,1 millions de personnes.</span>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">Our Radio Coverage Map</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Broadcasting across the tri-border region of Liberia, Sierra Leone, and Guinea</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              {/* Map Container */}
              <div className="relative group cursor-pointer" onClick={() => setShowMapModal(true)}>
                <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_radio-dash-1/artifacts/jyro0vqg_foya%20site%201%20jpg.JPG"
                    alt="Kioo Radio Coverage Map - Broadcasting across West Africa"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4">
                    <svg className="w-8 h-8 text-kioo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                
                {/* Click to Enlarge Indicator */}
                <div className="absolute bottom-4 right-4 bg-kioo-primary text-white px-3 py-1 rounded-full text-sm font-medium opacity-90">
                  Click to enlarge
                </div>
              </div>
              
              {/* Map Info */}
              <div className="mt-6 grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Strong Signal Coverage</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-kioo-primary rounded-full"></div>
                  <span className="text-gray-700 font-medium">FM 98.1 MHz</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-kioo-secondary rounded-full"></div>
                  <span className="text-gray-700 font-medium">150+ Mile Radius</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowMapModal(false)}>
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src="https://customer-assets.emergentagent.com/job_radio-dash-1/artifacts/jyro0vqg_foya%20site%201%20jpg.JPG"
              alt="Kioo Radio Coverage Map - Full Size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Close Button */}
            <button 
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Map Details */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
              <h3 className="font-bold text-kioo-dark mb-2">Coverage Area Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Frequency:</strong> FM 98.1 MHz</li>
                <li>• <strong>Power:</strong> High-powered transmission</li>
                <li>• <strong>Radius:</strong> 150+ mile coverage area</li>
                <li>• <strong>Population:</strong> 3M+ people reached</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Impact Stories */}
      {impactStories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-kioo-dark mb-4">🗣️ Stories of Hope</h2>
              <p className="text-lg text-gray-600">Real testimonies from our listeners</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStories.slice(0, 4).map((story) => (
                <div key={story.id} className="impact-card p-6 rounded-xl card-hover">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-kioo-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">💝</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-kioo-dark">{story.title}</h3>
                      <p className="text-sm text-gray-500">
                        {story.author_name} • {story.author_location}
                      </p>
                      {story.is_featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 leading-relaxed mb-4">
                    "{story.content}"
                  </blockquote>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(story.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Impact Categories */}
      <section className="py-16 bg-kioo-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🎯 Areas of Impact</h2>
            <p className="text-green-100">How Kioo Radio is making a difference</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">⛪</div>
                <h3 className="text-xl font-semibold text-white mb-2">Spiritual Growth</h3>
                <p className="text-green-100 text-sm">Daily devotions, biblical teachings, and spiritual encouragement</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-white mb-2">Health Education</h3>
                <p className="text-green-100 text-sm">Health tips, disease prevention, and wellness programs</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-white mb-2">Agriculture</h3>
                <p className="text-green-100 text-sm">Farming techniques, market prices, and agricultural news</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-white mb-2">Education</h3>
                <p className="text-green-100 text-sm">Literacy programs, educational content, and learning opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-kioo-primary to-kioo-secondary rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">📝 Share Your Story</h2>
            <p className="text-green-100 mb-6 text-lg">
              Has Kioo Radio impacted your life? We'd love to hear from you and share your story 
              to encourage others in our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-kioo-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                💬 Share Your Story
              </a>
              <a
                href="tel:+231778383703"
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all"
              >
                📞 Call Us Live
              </a>
              <a
                href="/kioo-presenters-dashboard-1981"
                className="bg-white bg-opacity-10 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                📊 Presenters Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;