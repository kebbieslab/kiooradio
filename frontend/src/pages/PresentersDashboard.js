import React, { useState, useEffect } from 'react';

const PresentersDashboard = () => {
  // Language state
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('weather');
  const [weatherData, setWeatherData] = useState({});
  const [programSchedule, setProgramSchedule] = useState([]);
  const [presenters, setPresenters] = useState({});
  const [liveBroadcastSchedule, setLiveBroadcastSchedule] = useState({});
  const [submittedTestimonies, setSubmittedTestimonies] = useState([]);
  const [submittedCalls, setSubmittedCalls] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [testimonyForm, setTestimonyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    location: '',
    program: '',
    summary: ''
  });

  const [callForm, setCallForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
    phone: '',
    summary: '',
    category: 'Testimony'
  });

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kioo-dashboard-language') || 'en';
    setLanguage(savedLanguage);
    
    // Load submitted data from localStorage
    const savedTestimonies = JSON.parse(localStorage.getItem('kioo-testimonies') || '[]');
    const savedCalls = JSON.parse(localStorage.getItem('kioo-calls') || '[]');
    const savedNotifications = JSON.parse(localStorage.getItem('kioo-notifications') || '[]');
    
    setSubmittedTestimonies(savedTestimonies);
    setSubmittedCalls(savedCalls);
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);
    
    // Request permission for browser notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Notification functions
  const addNotification = (type, message, details) => {
    const notification = {
      id: Date.now().toString(),
      type, // 'testimony' or 'call'
      message,
      details,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('kioo-notifications', JSON.stringify(updatedNotifications));
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Kioo Radio Dashboard', {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
    
    // Show toast notification
    showToast(message, type);
  };

  const showToast = (message, type) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white transform transition-transform duration-300 translate-x-full ${
      type === 'testimony' ? 'bg-green-600' : 'bg-blue-600'
    }`;
    toast.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3 text-xl">${type === 'testimony' ? '📝' : '📞'}</div>
        <div class="flex-1">
          <div class="font-medium">New ${type === 'testimony' ? 'Testimony' : 'Call Log'}</div>
          <div class="text-sm opacity-90">${message}</div>
        </div>
        <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  const markNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('kioo-notifications', JSON.stringify(updatedNotifications));
  };

  // Save language preference
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('kioo-dashboard-language', newLanguage);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
        
        // Fetch weather data
        const weatherRes = await fetch(`${backendUrl}/api/dashboard/weather`);
        if (weatherRes.ok) {
          const weather = await weatherRes.json();
          setWeatherData(weather);
        }

        // Fetch program schedule
        const scheduleRes = await fetch(`${backendUrl}/api/dashboard/schedule`);
        if (scheduleRes.ok) {
          const schedule = await scheduleRes.json();
          setProgramSchedule(schedule);
        }

        // Fetch presenters
        const presentersRes = await fetch(`${backendUrl}/api/dashboard/presenters`);
        if (presentersRes.ok) {
          const presenterData = await presentersRes.json();
          setPresenters(presenterData);
        }

        // Fetch live broadcast schedule
        const liveScheduleRes = await fetch(`${backendUrl}/api/live-broadcast-schedule`);
        if (liveScheduleRes.ok) {
          const liveScheduleData = await liveScheduleRes.json();
          setLiveBroadcastSchedule(liveScheduleData);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDashboardData();
    
    // Set up weather refresh every 15 minutes (900000ms)
    const weatherInterval = setInterval(() => {
      const fetchWeatherOnly = async () => {
        try {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
          const weatherRes = await fetch(`${backendUrl}/api/dashboard/weather`);
          if (weatherRes.ok) {
            const weather = await weatherRes.json();
            setWeatherData(weather);
            console.log('Weather data refreshed:', new Date().toLocaleTimeString());
          }
        } catch (error) {
          console.error('Error refreshing weather data:', error);
        }
      };
      fetchWeatherOnly();
    }, 900000); // 15 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(weatherInterval);
  }, []);

  // Translations
  const t = {
    en: {
      title: 'Kioo Radio Presenters Dashboard',
      language: 'Language',
      weather: 'Current Weather',
      presenters: 'Presenters by Country',
      submissions: 'Recent Submissions',
      testimony: 'Submit Testimony',
      calls: 'Log a Phone Call',
      export: 'Download as Excel',
      social: 'WhatsApp & Facebook',
      
      // Weather
      temperature: 'Temperature',
      condition: 'Condition',
      updated: 'Updated',
      
      // Submissions
      testimonies: 'Recent Testimonies',
      callLogs: 'Recent Phone Calls',
      noSubmissions: 'No submissions yet',
      submittedOn: 'Submitted on',
      
      // Forms
      date: 'Date',
      name: 'Name (Optional)',
      location: 'Location',
      programName: 'Program Name',
      summary: 'Summary',
      phoneNumber: 'Phone Number (Optional)',
      category: 'Category',
      submit: 'Submit',
      
      // Categories
      categories: {
        'Testimony': 'Testimony',
        'Question': 'Question',
        'Complaint': 'Complaint',
        'Prayer Request': 'Prayer Request'
      },
      
      // Success messages
      testimonySuccess: 'Testimony logged successfully!',
      callSuccess: 'Phone call logged successfully!',
      
      // Export
      exportData: 'Export Data',
      noData: 'No data to export',
      
      // Notifications
      notifications: 'Notifications',
      newSubmission: 'New Submission',
      noNotifications: 'No notifications',
      markAllRead: 'Mark all as read'
    },
    fr: {
      title: 'Tableau de Bord des Présentateurs Kioo Radio',
      language: 'Langue',
      weather: 'Météo Actuelle',
      presenters: 'Présentateurs par Pays',
      submissions: 'Soumissions Récentes',
      testimony: 'Soumettre un Témoignage',
      calls: 'Journal d\'Appel',
      export: 'Télécharger en Excel',
      social: 'WhatsApp et Facebook',
      
      // Weather
      temperature: 'Température',
      condition: 'Condition',
      updated: 'Mis à jour',
      
      // Submissions
      testimonies: 'Témoignages Récents',
      callLogs: 'Appels Téléphoniques Récents',
      noSubmissions: 'Aucune soumission pour le moment',
      submittedOn: 'Soumis le',
      
      // Forms
      date: 'Date',
      name: 'Nom (Optionnel)',
      location: 'Lieu',
      programName: 'Nom du Programme',
      summary: 'Résumé',
      phoneNumber: 'Numéro de Téléphone (Optionnel)',
      category: 'Catégorie',
      submit: 'Soumettre',
      
      // Categories
      categories: {
        'Testimony': 'Témoignage',
        'Question': 'Question',
        'Complaint': 'Plainte',
        'Prayer Request': 'Demande de Prière'
      },
      
      // Success messages
      testimonySuccess: 'Témoignage enregistré avec succès!',
      callSuccess: 'Appel téléphonique enregistré avec succès!',
      
      // Export
      exportData: 'Exporter les Données',
      noData: 'Aucune donnée à exporter',
      
      // Notifications
      notifications: 'Notifications',
      newSubmission: 'Nouvelle Soumission',
      noNotifications: 'Aucune notification',
      markAllRead: 'Marquer tout comme lu'
    }
  };

  // Handle form submissions
  const handleTestimonySubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      // Create testimony with timestamp
      const testimonyWithId = {
        ...testimonyForm,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${backendUrl}/api/dashboard/testimony`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonyWithId)
      });

      if (response.ok) {
        // Add to local state and localStorage
        const updatedTestimonies = [testimonyWithId, ...submittedTestimonies];
        setSubmittedTestimonies(updatedTestimonies);
        localStorage.setItem('kioo-testimonies', JSON.stringify(updatedTestimonies));
        
        // Add notification
        const message = `New testimony from ${testimonyWithId.name || 'Anonymous'} in ${testimonyWithId.location}`;
        addNotification('testimony', message, testimonyWithId);
        
        alert(t[language].testimonySuccess);
        setTestimonyForm({
          date: new Date().toISOString().split('T')[0],
          name: '',
          location: '',
          program: '',
          summary: ''
        });
      }
    } catch (error) {
      console.error('Error submitting testimony:', error);
    }
  };

  const handleCallSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
      // Create call log with timestamp
      const callWithId = {
        ...callForm,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${backendUrl}/api/dashboard/call-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callWithId)
      });

      if (response.ok) {
        // Add to local state and localStorage
        const updatedCalls = [callWithId, ...submittedCalls];
        setSubmittedCalls(updatedCalls);
        localStorage.setItem('kioo-calls', JSON.stringify(updatedCalls));
        
        // Add notification
        const message = `New ${callWithId.category.toLowerCase()} call logged at ${callWithId.time}`;
        addNotification('call', message, callWithId);
        
        alert(t[language].callSuccess);
        setCallForm({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
          phone: '',
          summary: '',
          category: 'Testimony'
        });
      }
    } catch (error) {
      console.error('Error submitting call log:', error);
    }
  };

  // Export data functionality
  const exportData = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/dashboard/export`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `kioo-radio-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{t[language].title}</h1>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    markNotificationsAsRead();
                  }
                }}
                className="relative bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{t[language].notifications}</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={markNotificationsAsRead}
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          {t[language].markAllRead}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="mr-3 text-lg">
                              {notification.type === 'testimony' ? '📝' : '📞'}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t[language].noNotifications}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">{t[language].language}:</span>
              <button
                onClick={toggleLanguage}
                className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm font-medium hover:bg-opacity-30"
              >
                {language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto">
            {[
              { key: 'weather', label: t[language].weather },
              { key: 'presenters', label: t[language].presenters },
              { key: 'social', label: t[language].social },
              { key: 'testimony', label: t[language].testimony },
              { key: 'calls', label: t[language].calls },
              { key: 'submissions', label: t[language].submissions }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeSection === section.key
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Export Button */}
        <div className="mb-4 text-right">
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            📤 {t[language].export}
          </button>
        </div>

        {/* Weather Section */}
        {activeSection === 'weather' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{t[language].weather}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(weatherData).map(([city, data]) => (
                <div key={city} className="border rounded p-4">
                  <div className="font-medium text-gray-900">{city}</div>
                  <div className="text-2xl font-bold text-blue-600">{data.temperature}°C</div>
                  <div className="text-sm text-gray-600">{data.condition}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {t[language].updated}: {data.updated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presenters by Country Section */}
        {activeSection === 'presenters' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">{t[language].presenters}</h2>
            
            {/* Live vs Pre-recorded Schedule Overview */}
            {liveBroadcastSchedule.countrySchedules && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-blue-800">📡 Live vs Pre-recorded Broadcast Schedule</h3>
                <p className="text-sm text-blue-700 mb-4">
                  {liveBroadcastSchedule.introText}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {liveBroadcastSchedule.countrySchedules.map((schedule) => (
                    <div key={schedule.country} className={`border-2 rounded-lg p-4 ${
                      schedule.colorCode === 'green' ? 'border-green-500 bg-green-50' :
                      schedule.colorCode === 'blue' ? 'border-blue-500 bg-blue-50' :
                      'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="font-bold text-lg mb-2 flex items-center">
                        {schedule.country === 'Liberia' && '🇱🇷'} 
                        {schedule.country === 'Sierra Leone' && '🇸🇱'} 
                        {schedule.country === 'Guinea' && '🇬🇳'} 
                        <span className="ml-2">{schedule.country}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-green-700 mb-1">🔴 Live Days:</div>
                        <div className="text-xs">
                          {schedule.liveDays.join(', ')}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-orange-700 mb-1">📹 Pre-recorded Days:</div>
                        <div className="text-xs">
                          {schedule.preRecordedDays.length > 0 ? schedule.preRecordedDays.join(', ') : 'None'}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 italic">
                        {schedule.specialNote}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Weekly Schedule Grid */}
                {liveBroadcastSchedule.weeklySchedule && (
                  <div className="mt-6">
                    <h4 className="font-bold mb-3">📅 Weekly Live vs Pre-recorded Schedule</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border border-gray-300 px-2 py-1 text-left font-medium">Day</th>
                            <th className="border border-gray-300 px-2 py-1 text-center font-medium">🇱🇷 Liberia</th>
                            <th className="border border-gray-300 px-2 py-1 text-center font-medium">🇸🇱 Sierra Leone</th>
                            <th className="border border-gray-300 px-2 py-1 text-center font-medium">🇬🇳 Guinea</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(liveBroadcastSchedule.weeklySchedule).map(([day, countries]) => (
                            <tr key={day} className={day === 'saturday' ? 'bg-yellow-50' : ''}>
                              <td className="border border-gray-300 px-2 py-1 font-medium capitalize">
                                {day}
                                {day === 'saturday' && (
                                  <div className="text-xs text-yellow-700 mt-1">
                                    ⭐ Makona Talk Show<br/>6:00-9:00 AM
                                  </div>
                                )}
                              </td>
                              <td className={`border border-gray-300 px-2 py-1 text-center ${
                                countries.liberia === 'live' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {countries.liberia === 'live' ? '🔴 LIVE' : '📹 Pre-recorded'}
                              </td>
                              <td className={`border border-gray-300 px-2 py-1 text-center ${
                                day === 'saturday' ? 'bg-green-100 text-green-800' :
                                countries.sierra_leone === 'live' ? 'bg-green-100 text-green-800' : 
                                countries.sierra_leone === 'rotation' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {day === 'saturday' ? '🔴 LIVE*' :
                                 countries.sierra_leone === 'live' ? '🔴 LIVE' : 
                                 countries.sierra_leone === 'rotation' ? '🔄 Rotation' : '📹 Pre-recorded'}
                              </td>
                              <td className={`border border-gray-300 px-2 py-1 text-center ${
                                countries.guinea === 'live' ? 'bg-green-100 text-green-800' : 
                                countries.guinea === 'rotation' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {countries.guinea === 'live' ? '🔴 LIVE' : 
                                 countries.guinea === 'rotation' ? '🔄 Rotation' : '📹 Pre-recorded'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {liveBroadcastSchedule.weeklySchedule.sunday?.note && (
                      <div className="mt-2 text-xs text-gray-600 italic">
                        * {liveBroadcastSchedule.weeklySchedule.sunday.note}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-yellow-700 italic">
                      * Saturday 6:00-9:00 AM: All countries are LIVE for Makona Talk Show
                    </div>
                  </div>
                )}
                
                {/* Special Programs Highlight */}
                {liveBroadcastSchedule.specialPrograms && (
                  <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                    <h4 className="font-bold text-yellow-800 mb-2">⭐ Special Programs</h4>
                    {Object.entries(liveBroadcastSchedule.specialPrograms).map(([key, program]) => (
                      <div key={key} className="mb-3">
                        <div className="font-semibold text-yellow-900">{program.name}</div>
                        <div className="text-sm text-yellow-800">{program.day} • {program.time}</div>
                        <div className="text-xs text-yellow-700 mt-1">{program.description}</div>
                        {program.all_countries_live && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">🇱🇷 Liberia LIVE</span>
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">🇸🇱 Sierra Leone LIVE</span>
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">🇬🇳 Guinea LIVE</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-8">
              {Object.entries(presenters).map(([country, countryPresenters]) => (
                <div key={country} className="border rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-4 text-green-600 capitalize flex items-center">
                    {country === 'liberia' && '🇱🇷'} 
                    {country === 'sierra_leone' && '🇸🇱'} 
                    {country === 'guinea' && '🇬🇳'} 
                    <span className="ml-2">
                      {country === 'liberia' ? 'Liberia' : ''}
                      {country === 'sierra_leone' ? 'Sierra Leone' : ''}
                      {country === 'guinea' ? 'Guinea' : ''}
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryPresenters.map((presenter, index) => (
                      <div key={index} className="bg-gray-50 rounded p-4">
                        <div className="font-semibold text-gray-900 mb-2">{presenter.name}</div>
                        
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-600 mb-1">Programs:</div>
                          <div className="space-y-1">
                            {presenter.programs.map((program, programIndex) => (
                              <span key={programIndex} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {program}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Schedule:</div>
                          <div className="text-sm text-gray-800">{presenter.schedule}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {countryPresenters.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No presenters found for this country
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {Object.keys(presenters).length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">👥</div>
                <div>Loading presenters information...</div>
              </div>
            )}
          </div>
        )}

        {/* Social Media Section */}
        {activeSection === 'social' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{t[language].social}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* WhatsApp */}
              <div className="border rounded p-4">
                <h3 className="font-medium mb-3">WhatsApp</h3>
                <a
                  href="https://web.whatsapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                >
                  💬 Open WhatsApp Web
                </a>
              </div>

              {/* Facebook */}
              <div className="border rounded p-4">
                <h3 className="font-medium mb-3">Facebook</h3>
                <a
                  href="http://facebook.com/kiooradio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                >
                  📘 Visit Facebook Page
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Section */}
        {activeSection === 'submissions' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">{t[language].submissions}</h2>
            
            {/* Testimonies */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-green-600">📝 {t[language].testimonies}</h3>
              {submittedTestimonies.length > 0 ? (
                <div className="space-y-4">
                  {submittedTestimonies.slice(0, 5).map((testimony) => (
                    <div key={testimony.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          {testimony.name || 'Anonymous'} - {testimony.location}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t[language].submittedOn} {new Date(testimony.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Program:</strong> {testimony.program}
                      </div>
                      <div className="text-sm text-gray-800">
                        {testimony.summary}
                      </div>
                    </div>
                  ))}
                  {submittedTestimonies.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      ... and {submittedTestimonies.length - 5} more testimonies
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {t[language].noSubmissions}
                </div>
              )}
            </div>

            {/* Call Logs */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-600">📞 {t[language].callLogs}</h3>
              {submittedCalls.length > 0 ? (
                <div className="space-y-4">
                  {submittedCalls.slice(0, 5).map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          {call.category} - {call.phone || 'No phone number'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t[language].submittedOn} {new Date(call.submittedAt).toLocaleDateString()} at {call.time}
                        </div>
                      </div>
                      <div className="text-sm text-gray-800">
                        {call.summary}
                      </div>
                    </div>
                  ))}
                  {submittedCalls.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      ... and {submittedCalls.length - 5} more call logs
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {t[language].noSubmissions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testimony Form */}
        {activeSection === 'testimony' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{t[language].testimony}</h2>
            <form onSubmit={handleTestimonySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].date}</label>
                  <input
                    type="date"
                    value={testimonyForm.date}
                    onChange={(e) => setTestimonyForm({...testimonyForm, date: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].name}</label>
                  <input
                    type="text"
                    value={testimonyForm.name}
                    onChange={(e) => setTestimonyForm({...testimonyForm, name: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    placeholder={t[language].name}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].location}</label>
                  <input
                    type="text"
                    value={testimonyForm.location}
                    onChange={(e) => setTestimonyForm({...testimonyForm, location: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].programName}</label>
                  <input
                    type="text"
                    value={testimonyForm.program}
                    onChange={(e) => setTestimonyForm({...testimonyForm, program: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].summary}</label>
                <textarea
                  value={testimonyForm.summary}
                  onChange={(e) => setTestimonyForm({...testimonyForm, summary: e.target.value})}
                  className="w-full p-2 border rounded text-sm h-24"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700"
              >
                {t[language].submit}
              </button>
            </form>
          </div>
        )}

        {/* Call Log Form */}
        {activeSection === 'calls' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{t[language].calls}</h2>
            <form onSubmit={handleCallSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].date}</label>
                  <input
                    type="date"
                    value={callForm.date}
                    onChange={(e) => setCallForm({...callForm, date: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].time}</label>
                  <input
                    type="time"
                    value={callForm.time}
                    onChange={(e) => setCallForm({...callForm, time: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].phoneNumber}</label>
                  <input
                    type="tel"
                    value={callForm.phone}
                    onChange={(e) => setCallForm({...callForm, phone: e.target.value})}
                    className="w-full p-2 border rounded text-sm"
                    placeholder={t[language].phoneNumber}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].category}</label>
                <select
                  value={callForm.category}
                  onChange={(e) => setCallForm({...callForm, category: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  required
                >
                  {Object.entries(t[language].categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].summary}</label>
                <textarea
                  value={callForm.summary}
                  onChange={(e) => setCallForm({...callForm, summary: e.target.value})}
                  className="w-full p-2 border rounded text-sm h-24"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700"
              >
                {t[language].submit}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentersDashboard;