import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const languages = {
    '': 'All Languages',
    'english': 'English',
    'french': 'Français',
    'kissi': 'Kissi',
    'krio': 'Krio'
  };

  const categories = {
    '': 'All Categories',
    'news': 'News & Current Affairs',
    'music': 'Music',
    'talk': 'Talk Shows',
    'religious': 'Religious',
    'youth': 'Youth Programs',
    'farming': 'Farming & Agriculture',
    'community': 'Community Focus'
  };

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, scheduleRes] = await Promise.all([
          axios.get(`${API}/programs`),
          axios.get(`${API}/programs/schedule`)
        ]);
        
        setPrograms(programsRes.data);
        setSchedule(scheduleRes.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPrograms = programs.filter(program => {
    const matchesLanguage = !selectedLanguage || program.language === selectedLanguage;
    const matchesCategory = !selectedCategory || program.category === selectedCategory;
    return matchesLanguage && matchesCategory;
  });

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'news': '📰',
      'music': '🎵',
      'talk': '💬',
      'religious': '⛪',
      'youth': '🌟',
      'farming': '🌱',
      'community': '🏘️'
    };
    return icons[category] || '📻';
  };

  const getLanguageFlag = (language) => {
    const flags = {
      'english': '🇺🇸',
      'french': '🇫🇷',
      'kissi': '🇱🇷',
      'krio': '🇸🇱'
    };
    return flags[language] || '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="radio-waves mb-4">
            <div className="w-16 h-16 border-4 border-kioo-primary rounded-full"></div>
          </div>
          <p className="text-kioo-primary">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              📅 Radio Programs
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover our diverse programming in English, French, Kissi, and Krio. 
              Something meaningful for everyone, every day.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* View Tabs */}
          <div className="flex flex-wrap justify-center mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 mx-1 my-1 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-kioo-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📻 All Programs
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 mx-1 my-1 rounded-lg font-medium transition-all ${
                activeTab === 'schedule'
                  ? 'bg-kioo-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗓️ Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 mx-1 my-1 rounded-lg font-medium transition-all ${
                activeTab === 'live'
                  ? 'bg-kioo-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔴 Live Now
            </button>
          </div>

          {/* Filters */}
          {activeTab === 'all' && (
            <div className="flex flex-wrap justify-center gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary"
              >
                {Object.entries(languages).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary"
              >
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* All Programs View */}
          {activeTab === 'all' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(program.category)}</span>
                        <span className="text-lg">{getLanguageFlag(program.language)}</span>
                      </div>
                      {program.is_live && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full mr-1 live-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-kioo-dark mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>🎙️</span>
                        <span className="font-medium">{program.host}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🗓️</span>
                        <span className="capitalize">{program.day_of_week}s</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⏰</span>
                        <span>{formatTime(program.start_time)} • {program.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🏷️</span>
                        <span className="capitalize">{program.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schedule View */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="schedule-table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Time</th>
                      {daysOfWeek.map((day) => (
                        <th key={day} className="text-center capitalize">
                          {day.substring(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                      return (
                        <tr key={timeSlot}>
                          <td className="font-semibold text-kioo-primary">
                            {formatTime(timeSlot)}
                          </td>
                          {daysOfWeek.map((day) => {
                            const program = schedule[day]?.find(p => p.start_time === timeSlot);
                            return (
                              <td key={`${day}-${timeSlot}`} className="text-center">
                                {program ? (
                                  <div className="bg-kioo-primary bg-opacity-10 p-2 rounded text-xs">
                                    <div className="font-semibold text-kioo-dark">
                                      {program.title}
                                    </div>
                                    <div className="text-gray-500">
                                      {getLanguageFlag(program.language)} {getCategoryIcon(program.category)}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live Now View */}
          {activeTab === 'live' && (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <div className="bg-kioo-primary text-white rounded-2xl p-8 mb-8">
                  <div className="radio-waves mb-4">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">📻</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">🔴 Live Now</h2>
                  <p className="text-green-100 mb-6">Good Morning Kioo with Sarah Johnson</p>
                  <button className="bg-white text-kioo-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    🎧 Listen Live
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-kioo-dark mb-4">Coming Up Next</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Community Voice</h4>
                        <p className="text-sm text-gray-600">Local news and discussions in Krio</p>
                      </div>
                      <span className="text-kioo-primary font-bold">9:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Farming Today</h4>
                        <p className="text-sm text-gray-600">Agricultural tips and market updates</p>
                      </div>
                      <span className="text-kioo-primary font-bold">10:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-kioo-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">⭐ Featured Programs</h2>
            <p className="text-green-100">Don't miss these popular shows</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🌅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Good Morning Kioo</h3>
              <p className="text-green-100 mb-4">Start your day with uplifting news, music, and community updates</p>
              <div className="text-sm text-green-200">Mon-Fri • 6:00-9:00 AM • English</div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-white mb-2">Youth Pulse</h3>
              <p className="text-green-100 mb-4">Music, discussions, and opportunities for young people</p>
              <div className="text-sm text-green-200">Weekdays • 7:00-8:00 PM • English/Krio</div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Word in Kissi</h3>
              <p className="text-green-100 mb-4">Biblical teachings and spiritual growth in Kissi language</p>
              <div className="text-sm text-green-200">Sun • 8:00-9:00 AM • Kissi</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;