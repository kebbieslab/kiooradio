import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Impact = () => {
  const [impactStories, setImpactStories] = useState([]);
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, coverageRes] = await Promise.all([
          axios.get(`${API}/impact-stories`),
          axios.get(`${API}/coverage`)
        ]);
        
        setImpactStories(storiesRes.data);
        setCoverageData(coverageRes.data);
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
              Every day, Kioo Radio touches hearts and changes lives across West Africa. 
              Here are the real stories of hope, healing, and transformation from our listeners.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🌍</span>
              </div>
              <h3 className="text-3xl font-bold text-kioo-dark mb-2">3</h3>
              <p className="text-gray-600">Countries Reached</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">👥</span>
              </div>
              <h3 className="text-3xl font-bold text-kioo-dark mb-2">7M+</h3>
              <p className="text-gray-600">People in Coverage</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">📻</span>
              </div>
              <h3 className="text-3xl font-bold text-kioo-dark mb-2">24/7</h3>
              <p className="text-gray-600">Broadcasting</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-3xl font-bold text-kioo-dark mb-2">100%</h3>
              <p className="text-gray-600">Solar Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      {coverageData && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-kioo-dark mb-4">📡 Our Reach</h2>
              <p className="text-lg text-gray-600">Broadcasting the gift of good news across West Africa</p>
            </div>

            <div className="coverage-map">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {coverageData.countries.map((country) => (
                  <div key={country.name} className="text-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
                      <h3 className="text-xl font-bold text-kioo-dark mb-4">{country.name}</h3>
                      
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-kioo-primary">{country.coverage}%</div>
                        <p className="text-gray-600">Coverage Area</p>
                      </div>
                      
                      <div className="bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                          className="bg-kioo-primary h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${country.coverage}%` }}
                        ></div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Major Cities:</p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {country.major_cities.map((city) => (
                            <span key={city} className="bg-kioo-primary bg-opacity-10 text-kioo-primary px-2 py-1 rounded text-xs">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="bg-kioo-primary text-white rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold">{coverageData.total_reach}</div>
                      <div className="text-green-100 text-sm">Total Reach</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">150+ Miles</div>
                      <div className="text-green-100 text-sm">Signal Range</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">4 Languages</div>
                      <div className="text-green-100 text-sm">Multilingual</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
      <section className="py-16 bg-kioo-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">🎯 Areas of Impact</h2>
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
                href="tel:+2311234567890"
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all"
              >
                📞 Call Us Live
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📸 Community Gallery</h2>
            <p className="text-lg text-gray-600">Moments from our broadcasts and community events</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div key={index} className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center card-hover">
                <span className="text-gray-400 text-2xl">📷</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">More photos coming soon from our community events and studio</p>
            <a
              href="/contact"
              className="text-kioo-primary hover:text-kioo-secondary font-semibold"
            >
              Submit Your Photos →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;