import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [radioStatus, setRadioStatus] = useState(null);
  const [impactStories, setImpactStories] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [donationTotal, setDonationTotal] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statusRes, impactRes, newsRes, donationRes] = await Promise.all([
          axios.get(`${API}/radio/status`),
          axios.get(`${API}/impact-stories?featured_only=true`),
          axios.get(`${API}/news`),
          axios.get(`${API}/donations/total`)
        ]);
        
        setRadioStatus(statusRes.data);
        setImpactStories(impactRes.data.slice(0, 3));
        setLatestNews(newsRes.data.slice(0, 3));
        setDonationTotal(donationRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kioo-primary via-kioo-secondary to-kioo-dark text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Radio waves background animation */}
        <div className="absolute top-10 right-10 opacity-10">
          <div className="radio-waves">
            <div className="w-32 h-32 border-4 border-white rounded-full"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="hero-content hero-fade-in">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                  🎙️ Now Broadcasting Live
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                The Gift of
                <span className="block bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
                  Good News
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-green-100 leading-relaxed">
                Kioo Radio 98.1 FM brings hope, faith, and community together across 
                Liberia, Sierra Leone, and Guinea. Broadcasting 24/7 with solar power.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/listen-live"
                  className="btn-primary inline-flex items-center justify-center space-x-3 text-lg"
                >
                  <span className="w-3 h-3 bg-red-400 rounded-full live-pulse"></span>
                  <span>🔴 Listen Live Now</span>
                </Link>
                
                <Link 
                  to="/programs"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-kioo-primary transition-all duration-200"
                >
                  📅 View Programs
                </Link>
              </div>

              {/* Live Status */}
              {radioStatus && (
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Currently Playing</p>
                      <p className="text-white font-semibold">{radioStatus.current_program}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-200 text-sm">Listeners</p>
                      <p className="text-white font-bold text-lg">{radioStatus.listener_count}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Image/Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 card-hover">
                  <div className="text-3xl mb-2">🌍</div>
                  <h3 className="text-2xl font-bold">3 Nations</h3>
                  <p className="text-green-200">Coverage Area</p>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 card-hover">
                  <div className="text-3xl mb-2">📡</div>
                  <h3 className="text-2xl font-bold">98.1 FM</h3>
                  <p className="text-green-200">Crystal Clear</p>
                </div>
              </div>
              <div className="space-y-6 mt-8">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 card-hover">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-2xl font-bold">Solar</h3>
                  <p className="text-green-200">Powered</p>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 card-hover">
                  <div className="text-3xl mb-2">🕐</div>
                  <h3 className="text-2xl font-bold">24/7</h3>
                  <p className="text-green-200">Broadcasting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage & Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-4">
              Reaching Hearts Across West Africa
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
                <p className="text-gray-600">85% Coverage • 3.2M People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-kioo-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🇸🇱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sierra Leone</h3>
                <p className="text-gray-600">70% Coverage • 2.8M People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-kioo-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🇬🇳</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Guinea</h3>
                <p className="text-gray-600">60% Coverage • 1.5M People</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-kioo-accent h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-8 text-sm text-gray-600">
                <span>📍 Broadcast Range: 150+ Miles</span>
                <span>👥 Total Reach: 7+ Million People</span>
                <span>🔋 100% Solar Powered</span>
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
                  Real stories from our listeners across West Africa
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
              <Link 
                to="/news" 
                className="text-kioo-primary font-semibold hover:text-kioo-secondary transition-colors"
              >
                All News →
              </Link>
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
              Help us continue spreading hope and good news across West Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/get-involved" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-white mb-3">Pray for Us</h3>
              <p className="text-green-100">Support our mission through prayer</p>
            </Link>
            
            <Link to="/get-involved" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-3">Volunteer</h3>
              <p className="text-green-100">Join our team and make a difference</p>
            </Link>
            
            <Link to="/donate" className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center card-hover">
              <div className="text-4xl mb-4">💖</div>
              <h3 className="text-xl font-semibold text-white mb-3">Donate</h3>
              <p className="text-green-100">Support our broadcasting mission</p>
              {donationTotal && (
                <div className="mt-4 text-sm text-green-200">
                  ${donationTotal.total_amount?.toLocaleString() || '0'} raised by {donationTotal.donor_count || 0} donors
                </div>
              )}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;