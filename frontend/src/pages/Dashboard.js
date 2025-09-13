import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [farmerWeatherData, setFarmerWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Language detection and setup
  useEffect(() => {
    // Auto-select language based on browser language
    const browserLang = navigator.language.toLowerCase();
    const savedLang = localStorage.getItem('kioo_lang');
    
    if (savedLang) {
      setLanguage(savedLang);
    } else if (browserLang.startsWith('fr')) {
      setLanguage('fr');
      localStorage.setItem('kioo_lang', 'fr');
    } else {
      setLanguage('en');
      localStorage.setItem('kioo_lang', 'en');
    }
  }, []);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (credentials.username === 'admin' && credentials.password === 'kioo2025!') {
      setIsAuthenticated(true);
      loadFarmerWeatherData();
    } else {
      setError(language === 'fr' ? 'Nom d\'utilisateur ou mot de passe incorrect' : 'Invalid username or password');
    }
  };

  const loadFarmerWeatherData = async () => {
    setLoading(true);
    try {
      // Load farmer-focused weather data for 4 locations
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/farmer-weather`);
      
      if (response.ok) {
        const weatherData = await response.json();
        setFarmerWeatherData(weatherData.locations || []);
        setLastUpdated(new Date(weatherData.updated));
      } else {
        throw new Error('Failed to load weather data');
      }

    } catch (error) {
      console.error('Failed to load farmer weather data:', error);
      setError(language === 'fr' ? 'Échec du chargement des données météo' : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setFarmerWeatherData([]);
    setLastUpdated(null);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('kioo_lang', newLang);
  };

  // Translation function
  const t = (key, fallback = key) => {
    const translations = {
      en: {
        dashboardTitle: 'Kioo Dashboard: GMT + Farmer Messages',
        farmerFocused: 'Farmer-focused rain timing & intensity',
        allTimesGMT: 'All times in GMT',
        currentTime: 'Current Time',
        dashboardAccess: 'Dashboard Access',
        dashboardAccessDesc: 'Please enter your credentials to access the farmer weather dashboard',
        username: 'Username',
        password: 'Password',
        accessDashboard: 'Access Dashboard',
        refresh: 'Refresh',
        logout: 'Logout',
        loading: 'Loading...',
        refreshing: 'Refreshing...',
        lastUpdated: 'Last updated',
        now: 'Now',
        temp: 'Temp',
        rainChance: 'Rain Chance',
        wind: 'Wind',
        humidity: 'Humidity',
        threeDayOutlook: '3-Day Outlook',
        rainIntensity: 'Rain Intensity',
        light: 'Light',
        moderate: 'Moderate',
        heavy: 'Heavy',
        none: 'None',
        likelyRain: 'Likely rain ~',
        lowChanceNext24h: 'Low chance of rain next 24h',
        dryPatternExpected: 'Dry pattern expected',
        maxChance: 'Max',
        totalRain: 'Total',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun'
      },
      fr: {
        dashboardTitle: 'Tableau de bord Kioo : GMT + Messages aux agriculteurs',
        farmerFocused: 'Informations pluie pour les agriculteurs : moment et intensité',
        allTimesGMT: 'Toutes les heures en GMT',
        currentTime: 'Heure actuelle',
        dashboardAccess: 'Accès au tableau de bord',
        dashboardAccessDesc: 'Veuillez saisir vos identifiants pour accéder au tableau de bord météo agricole',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        accessDashboard: 'Accéder au tableau de bord',
        refresh: 'Actualiser',
        logout: 'Déconnexion',
        loading: 'Chargement...',
        refreshing: 'Actualisation...',
        lastUpdated: 'Dernière mise à jour',
        now: 'Maintenant',
        temp: 'Temp',
        rainChance: 'Chance de pluie',
        wind: 'Vent',
        humidity: 'Humidité',
        threeDayOutlook: 'Prévisions 3 jours',
        rainIntensity: 'Intensité pluie',
        light: 'Légère',
        moderate: 'Modérée',
        heavy: 'Forte',
        none: 'Aucune',
        likelyRain: 'Pluie probable ~',
        lowChanceNext24h: 'Faible risque de pluie dans les 24h',
        dryPatternExpected: 'Tendance sèche prévue',
        maxChance: 'Max',
        totalRain: 'Total',
        mon: 'Lun',
        tue: 'Mar',
        wed: 'Mer',
        thu: 'Jeu',
        fri: 'Ven',
        sat: 'Sam',
        sun: 'Dim'
      }
    };

    return translations[language]?.[key] || fallback;
  };

  // Farmer message generation
  const generateFarmerMessages = (locationData) => {
    const messages = [];
    const { hourly = [], daily = [], now = {} } = locationData;
    
    // Check if any hourly has heavy rain (> 10mm/h)
    const hasHeavyRain = hourly.some(h => (h.rainMmHr || 0) > 10);
    
    // Find first rain within 3 hours
    const rainSoon = hourly.slice(0, 3).find(h => 
      (h.rainProbPct || 0) >= 50 && (h.rainMmHr || 0) >= 0.2
    );
    
    // Find first rain in next 24 hours
    const firstRain24h = hourly.find(h => 
      (h.rainProbPct || 0) >= 50 && (h.rainMmHr || 0) >= 0.2
    );
    
    // Check tomorrow's rain probability
    const tomorrowRain = daily.length > 1 ? daily[1] : null;
    
    // Check if 3-day totals are near zero
    const threeDayTotal = daily.slice(0, 3).reduce((sum, day) => sum + (day.rainSumMm || 0), 0);
    
    const getIntensityLabel = (rainMmHr) => {
      if (!rainMmHr || rainMmHr < 0.2) return language === 'fr' ? 'Aucune' : 'None';
      if (rainMmHr < 2.5) return language === 'fr' ? 'Légère' : 'Light';
      if (rainMmHr <= 10) return language === 'fr' ? 'Modérée' : 'Moderate';
      return language === 'fr' ? 'Forte' : 'Heavy';
    };
    
    const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' GMT';
    };

    // Primary message logic (priority order)
    if (hasHeavyRain) {
      const todayTotal = daily[0]?.rainSumMm || 0;
      messages.push(language === 'fr' 
        ? `Cumul proche de ${todayTotal} mm aujourd'hui. Évitez les zones basses.`
        : `Total rain near ${todayTotal} mm today. Avoid field work in low areas.`
      );
    } else if (rainSoon) {
      const timeStr = formatTime(rainSoon.timeIsoUTC);
      messages.push(language === 'fr'
        ? `Pluie probable vers ${timeStr}. Protégez les outils et privilégiez les tâches à l'abri.`
        : `Rain likely around ${timeStr}. Keep tools dry and plan indoor tasks.`
      );
    } else if (firstRain24h) {
      const hour = new Date(firstRain24h.timeIsoUTC).getUTCHours();
      const intensity = getIntensityLabel(firstRain24h.rainMmHr);
      
      if (hour >= 12 && hour < 18) {
        messages.push(language === 'fr'
          ? `${intensity} pluies attendues cet après-midi. Récoltez plus tôt si possible.`
          : `Expect ${intensity.toLowerCase()} showers this afternoon. Harvest early if possible.`
        );
      } else if (hour >= 18) {
        const timeStr = formatTime(firstRain24h.timeIsoUTC);
        messages.push(language === 'fr'
          ? `Pluie en soirée (~${timeStr}). Séchez les récoltes le matin.`
          : `Rain starting in the evening (~${timeStr}). Dry crops in the morning hours.`
        );
      } else {
        messages.push(language === 'fr'
          ? `Faible risque de pluie aujourd'hui. Bonne fenêtre pour semis/récolte.`
          : `Low chance of rain today. Good window for planting/harvest.`
        );
      }
    } else if (tomorrowRain && (tomorrowRain.rainProbMaxPct || 0) >= 60) {
      const intensity = getIntensityLabel(tomorrowRain.rainSumMm / 24); // Rough intensity estimate
      messages.push(language === 'fr'
        ? `${tomorrowRain.rainProbMaxPct}% de ${intensity.toLowerCase()} pluie demain. Sécurisez les récoltes en séchage.`
        : `Tomorrow shows ${tomorrowRain.rainProbMaxPct}% chance of ${intensity.toLowerCase()} rain. Secure drying crops.`
      );
    } else if (threeDayTotal < 5) {
      messages.push(language === 'fr'
        ? `Tendance sèche prévue pour les 3 prochains jours.`
        : `Dry pattern expected for the next 3 days.`
      );
    } else {
      messages.push(language === 'fr'
        ? `Faible risque de pluie aujourd'hui. Bonne fenêtre pour semis/récolte.`
        : `Low chance of rain today. Good window for planting/harvest.`
      );
    }

    // Secondary messages
    if ((now.windKph || 0) >= 25) {
      messages.push(language === 'fr'
        ? `Vent proche de ${now.windKph} km/h. Fixez les bâches, évitez le brûlage.`
        : `Wind near ${now.windKph} km/h. Tie down tarps and avoid burning.`
      );
    }

    const todayTotal = daily[0]?.rainSumMm || 0;
    if (todayTotal >= 20) {
      messages.push(language === 'fr'
        ? `Fort cumul journalier de ${todayTotal} mm. Évitez les zones basses.`
        : `Heavy day total of ${todayTotal} mm. Avoid field work in low areas.`
      );
    }

    return messages.slice(0, 3); // Maximum 3 messages
  };

  // Simple SVG Bar Chart Component
  const BarChart = ({ data, width = 300, height = 200 }) => {
    if (!data) return null;

    const maxValue = Math.max(data.income, data.expenses);
    const barWidth = 60;
    const spacing = 40;
    const chartHeight = height - 60;
    
    const incomeHeight = (data.income / maxValue) * chartHeight;
    const expensesHeight = (data.expenses / maxValue) * chartHeight;

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('incomeVsExpenses', 'Income vs Expenses')}</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid lines */}
          <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#e5e7eb" strokeWidth="1" />
          <line x1="40" y1={height - 40} x2={width - 20} y2={height - 40} stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Income bar */}
          <rect
            x="70"
            y={height - 40 - incomeHeight}
            width={barWidth}
            height={incomeHeight}
            fill="#10b981"
          />
          
          {/* Expenses bar */}
          <rect
            x={70 + barWidth + spacing}
            y={height - 40 - expensesHeight}
            width={barWidth}
            height={expensesHeight}
            fill="#ef4444"
          />
          
          {/* Labels */}
          <text x="100" y={height - 20} textAnchor="middle" fontSize="12" fill="#6b7280">
            {t('income', 'Income')}
          </text>
          <text x={100 + barWidth + spacing} y={height - 20} textAnchor="middle" fontSize="12" fill="#6b7280">
            {t('expenses', 'Expenses')}
          </text>
          
          {/* Values */}
          <text x="100" y={height - 50 - incomeHeight} textAnchor="middle" fontSize="11" fill="#10b981" fontWeight="bold">
            ${data.income.toLocaleString()}
          </text>
          <text x={100 + barWidth + spacing} y={height - 50 - expensesHeight} textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">
            ${data.expenses.toLocaleString()}
          </text>
        </svg>
      </div>
    );
  };

  // Simple SVG Pie Chart Component
  const PieChart = ({ data, width = 300, height = 300 }) => {
    if (!data || data.length === 0) return null;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    let currentAngle = 0;
    const segments = data.map((item, index) => {
      const angle = (item.percentage / 100) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle += angle;
      
      return {
        path: pathData,
        color: colors[index % colors.length],
        ...item
      };
    });

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('donationsByProject', 'Donations by Project')}</h3>
        <div className="flex items-center space-x-4">
          <svg width={width * 0.6} height={height * 0.6}>
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="flex-1">
            <div className="space-y-2">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-gray-700">{segment.project_name}</span>
                  <span className="text-gray-500 ml-auto">
                    ${segment.amount.toLocaleString()} ({segment.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('dashboardAccess', 'Dashboard Access')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('dashboardAccessDesc', 'Please enter your credentials to access the admin dashboard')}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder={t('username', 'Username')}
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder={t('password', 'Password')}
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
                {t('accessDashboard', 'Access Dashboard')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('kiooRadioDashboard', 'Kioo Radio Dashboard')}</h1>
              <p className="text-sm text-gray-500">{t('adminOverview', 'Administrative Overview')}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-1">
                  {t('lastUpdated', 'Last updated')}: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
              >
                {loading ? t('refreshing', 'Refreshing...') : t('refresh', 'Refresh')}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('logout', 'Logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary"></div>
            <p className="mt-2 text-gray-600">{t('loading', 'Loading...')}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Dashboard Tiles */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Visitors This Month */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('visitorsThisMonth', 'Visitors This Month')}</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.visitors_this_month.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Donations This Month */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('donationsThisMonth', 'Donations This Month')}</dt>
                      <dd className="text-lg font-medium text-gray-900">${stats.donations_this_month.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Income vs Expenses */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('netIncome', 'Net Income')}</dt>
                      <dd className={`text-lg font-medium ${
                        (stats.income_this_month - stats.expenses_this_month) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${(stats.income_this_month - stats.expenses_this_month).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Reminders */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⏰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('openReminders', 'Open Reminders')}</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.open_reminders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Stories */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📖</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('approvedStories', 'Approved Stories')}</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.approved_stories}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Section */}
        {(Object.keys(weatherData).length > 0 || Object.keys(weatherForecast).length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('weatherForecast', 'Weather Forecast')}</h2>
            
            {/* Current Weather */}
            {Object.keys(weatherData).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('currentWeather', 'Current Weather')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(weatherData).map(([city, data]) => (
                    <div key={city} className="bg-white rounded-lg shadow p-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">{city}</div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{data.temperature}°C</div>
                      <div className="text-sm text-gray-700 mb-2">{data.condition}</div>
                      <div className="text-xs text-gray-500">
                        {t('updated', 'Updated')}: {data.updated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2-Day Weather Forecast */}
            {Object.keys(weatherForecast).length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('twoDayForecast', '2-Day Weather Predictions')}</h3>
                <div className="space-y-4">
                  {Object.entries(weatherForecast).map(([city, data]) => (
                    <div key={city} className="bg-white rounded-lg shadow p-4">
                      <div className="font-medium text-gray-900 mb-3">{city}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {data.forecast && data.forecast.map((day, index) => (
                          <div key={index} className="bg-gray-50 rounded p-3 text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">{day.day_label}</div>
                            <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                            <div className="flex justify-center items-center space-x-2 mb-1">
                              <span className="text-lg font-bold text-red-500">{day.temp_max}°</span>
                              <span className="text-sm text-gray-400">/</span>
                              <span className="text-lg font-bold text-blue-500">{day.temp_min}°</span>
                            </div>
                            <div className="text-xs text-gray-700">{day.condition}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {t('updated', 'Updated')}: {data.updated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Bar Chart */}
          {incomeExpenses && (
            <BarChart data={incomeExpenses} width={400} height={250} />
          )}

          {/* Donations by Project Pie Chart */}
          {donationsByProject.length > 0 && (
            <PieChart data={donationsByProject} width={400} height={300} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;