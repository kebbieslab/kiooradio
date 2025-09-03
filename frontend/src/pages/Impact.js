import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Impact = () => {
  const [impactStories, setImpactStories] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Impact Metrics - Creative Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-kioo-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-kioo-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-kioo-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kioo-dark mb-4">Our Impact by Numbers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Broadcasting hope and transformation across West Africa</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Countries Reached */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-kioo-primary/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-kioo-primary/5 to-transparent rounded-tr-full"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-kioo-primary to-kioo-primary/80 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-4xl font-bold text-kioo-dark mb-2 group-hover:text-kioo-primary transition-colors duration-300">3</h3>
                  <p className="text-gray-600 font-medium">Countries Reached</p>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-kioo-primary to-kioo-primary/70 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* People in Coverage */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-kioo-secondary/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-kioo-secondary/5 to-transparent rounded-tr-full"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-kioo-secondary to-kioo-secondary/80 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-4xl font-bold text-kioo-dark mb-2 group-hover:text-kioo-secondary transition-colors duration-300">3M+</h3>
                  <p className="text-gray-600 font-medium">People in Coverage</p>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-kioo-secondary to-kioo-secondary/70 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 24/7 Broadcasting */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-kioo-accent/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-kioo-accent/5 to-transparent rounded-tr-full"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-kioo-accent to-kioo-accent/80 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📻</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-4xl font-bold text-kioo-dark mb-2 group-hover:text-kioo-accent transition-colors duration-300">24/7</h3>
                  <p className="text-gray-600 font-medium">Broadcasting</p>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-kioo-accent to-kioo-accent/70 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-400"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500/5 to-transparent rounded-tr-full"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🎙️</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-4xl font-bold text-kioo-dark mb-2 group-hover:text-green-600 transition-colors duration-300">6</h3>
                  <p className="text-gray-600 font-medium">Languages</p>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Accent */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">Broadcasting Live Now</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
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
              <div className="mt-4 bg-gray-200 rounded-full h-3">
                <div className="bg-kioo-primary h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
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
              <div className="mt-4 bg-gray-200 rounded-full h-3">
                <div className="bg-kioo-secondary h-3 rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
              </div>
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
              <div className="mt-4 bg-gray-200 rounded-full h-3">
                <div className="bg-kioo-accent h-3 rounded-full transition-all duration-1000" style={{ width: '90%' }}></div>
              </div>
            </article>
          </div>
          
          <div className="text-center">
            <div className="bg-kioo-primary text-white rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold">3M+ People</div>
                  <div className="text-green-100 text-sm">Total Reach</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">150+ Miles</div>
                  <div className="text-green-100 text-sm">Signal Range</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Kissi, English, French, Mandingo, Fula & Gbandi +</div>
                  <div className="text-green-100 text-sm">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      {impactStories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-kioo-dark mb-4">🗣️ Stories of Hope</h2>
              <p className="text-lg text-gray-600">Real testimonies from our listeners</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {impactStories.map((story) => (
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