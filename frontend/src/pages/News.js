import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API}/news`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading w-16 h-16 rounded-full mb-4"></div>
          <p className="text-kioo-primary">Loading latest news...</p>
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
              📰 Latest News & Updates
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Stay informed about Kioo Radio's progress, community events, construction updates, 
              and inspiring stories from across West Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {news.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <span className="bg-kioo-primary text-white px-2 py-1 rounded text-xs font-bold">FEATURED</span>
                  <span>📰</span>
                  <span>{new Date(news[0].created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{news[0].author}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-kioo-dark mb-4">{news[0].title}</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{news[0].excerpt}</p>
                
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{news[0].content}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Share this article:</span>
                      <div className="flex space-x-2">
                        <button className="text-kioo-primary hover:text-kioo-secondary">📘 Facebook</button>
                        <button className="text-kioo-primary hover:text-kioo-secondary">💬 WhatsApp</button>
                        <button className="text-kioo-primary hover:text-kioo-secondary">🔗 Copy Link</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length > 1 && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-kioo-dark mb-4">More Stories</h2>
                <p className="text-lg text-gray-600">Catch up on recent developments</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(1).map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <span>📰</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-kioo-dark mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <button className="text-kioo-primary font-semibold hover:text-kioo-secondary transition-colors">
                        Read More →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* Placeholder when no news */}
          {news.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-kioo-dark mb-4">News Coming Soon</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're preparing exciting updates about our launch progress, community events, 
                and stories from our listeners. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-kioo-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">📧 Stay Updated</h2>
          <p className="text-green-100 mb-8 text-lg">
            Get the latest news and updates delivered directly to your inbox. 
            Be the first to know about new programs, community events, and station milestones.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-kioo-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-green-200 text-xs mt-3">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* News Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📋 News Categories</h2>
            <p className="text-lg text-gray-600">What we cover in our updates</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-kioo-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🏗️</span>
              </div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-2">Station Progress</h3>
              <p className="text-gray-600 text-sm">Construction updates, equipment installation, and launch preparations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-kioo-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎉</span>
              </div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-2">Community Events</h3>
              <p className="text-gray-600 text-sm">Local gatherings, celebrations, and outreach activities</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-kioo-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎙️</span>
              </div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-2">Programming Updates</h3>
              <p className="text-gray-600 text-sm">New shows, host introductions, and schedule changes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-2">Impact Stories</h3>
              <p className="text-gray-600 text-sm">Listener testimonies and community transformation stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archive & Search (Coming Soon) */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-kioo-dark mb-4">🔍 Looking for Something Specific?</h2>
            <p className="text-gray-600 mb-6">
              Our searchable news archive and category filters are coming soon. 
              In the meantime, feel free to contact us if you're looking for specific information.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-kioo-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
              >
                📞 Contact Us
              </a>
              <a
                href="/about"
                className="bg-gray-100 text-kioo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                📖 Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;