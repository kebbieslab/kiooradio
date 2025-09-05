import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

const Visitors = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [stats, setStats] = useState(null);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [clickAnalytics, setClickAnalytics] = useState(null);
  const [gaConnected, setGaConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      
      // Track login event with Google Analytics
      const gaId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
      if (gaId && gaId !== 'G-PLACEHOLDER123') {
        ReactGA.event({
          category: 'Admin',
          action: 'Login',
          label: 'Visitor Analytics Dashboard'
        });
        setGaConnected(true);
      }
      
      loadAnalyticsData();
    } else {
      setError('Invalid username or password');
    }
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const authHeader = btoa('admin:kioo2025!');
      
      // Track data refresh event
      if (gaConnected) {
        ReactGA.event({
          category: 'Analytics',
          action: 'Data Refresh',
          label: 'Visitor Dashboard'
        });
      }
      
      // Load visitor stats
      const statsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/stats`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent visitors
      const visitorsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/recent`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json();
        setRecentVisitors(visitorsData);
      }

      // Load click analytics
      const clicksResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/clicks`, {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      });
      
      if (clicksResponse.ok) {
        const clicksData = await clicksResponse.json();
        setClickAnalytics(clicksData);
      }
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setStats(null);
    setRecentVisitors([]);
    setClickAnalytics(null);
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(loadAnalyticsData, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Visitor Analytics Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your credentials to access the visitor analytics dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
              >
                Access Analytics
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Analytics dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitor Analytics Dashboard</h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-500">Real-time visitor tracking for Kioo Radio</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gaConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${gaConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                    {gaConnected ? 'GA4 Connected' : 'GA4 Setup Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadAnalyticsData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && !stats ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-kioo-primary"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-kioo-primary rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">👥</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.total_visitors}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-kioo-secondary rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">🔄</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.unique_visitors}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">📅</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.visitors_today}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">🔴</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Live Status</dt>
                            <dd className="text-lg font-medium text-green-600">Active</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Countries */}
              {stats?.top_countries && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Countries</h3>
                    <div className="space-y-3">
                      {stats.top_countries.map((country, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {country._id || 'Unknown'}
                          </span>
                          <span className="text-sm text-gray-500">{country.count} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Pages */}
              {stats?.top_pages && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Popular Pages</h3>
                    <div className="space-y-3">
                      {stats.top_pages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {new URL(page._id).pathname}
                          </span>
                          <span className="text-sm text-gray-500">{page.count} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Visitors */}
            {recentVisitors.length > 0 && (
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Visitors</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentVisitors.slice(0, 10).map((visitor, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(visitor.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.city}, {visitor.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {visitor.page_url ? new URL(visitor.page_url).pathname : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {visitor.ip_address}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Click Analytics */}
            {clickAnalytics && (
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Click Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Most Clicked Elements</h4>
                      <div className="space-y-2">
                        {clickAnalytics.click_stats.map((stat, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-900">{stat._id}</span>
                            <span className="text-sm text-gray-500">{stat.count} clicks</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Recent Clicks</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {clickAnalytics.recent_clicks.slice(0, 5).map((click, index) => (
                          <div key={index} className="text-xs text-gray-600 border-b pb-1">
                            <div className="font-medium">{click.element_type}</div>
                            <div>{click.element_text?.substring(0, 50)}...</div>
                            <div className="text-gray-400">{new Date(click.timestamp).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Visitors;