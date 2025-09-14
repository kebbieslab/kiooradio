import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const Dashboard = () => {
  const [farmerWeatherData, setFarmerWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
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

  // Load farmer weather data on component mount
  useEffect(() => {
    loadFarmerWeatherData();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadFarmerWeatherData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/farmer-weather`);
      
      if (response.ok) {
        const data = await response.json();
        setFarmerWeatherData(data.locations || []);
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to load weather data');
      }
    } catch (error) {
      console.error('Error loading farmer weather data:', error);
      setError(language === 'fr' ? 'Erreur de chargement des données météo' : 'Failed to load weather data');
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

  // Simple sparkline component for rain probability
  const Sparkline = ({ data, width = 60, height = 20 }) => {
    if (!data || data.length === 0) return <div className="w-15 h-5 bg-gray-200 rounded"></div>;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'EN' : 'FR'} | {language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('dashboardAccess')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('dashboardAccessDesc')}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder={t('username')}
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kioo-primary focus:border-kioo-primary focus:z-10 sm:text-sm"
                  placeholder={t('password')}
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
                {t('accessDashboard')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Farmer Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with GMT Time and Language Toggle */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
              <p className="text-sm text-gray-600">{t('farmerFocused')}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* GMT Time Pills */}
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t('allTimesGMT')}
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  🕐 {currentTime.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'UTC'
                  })} GMT
                </div>
              </div>
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'EN' : 'FR'} | {language === 'en' ? 'FR' : 'EN'}
              </button>
              
              {/* Actions */}
              <button
                onClick={loadFarmerWeatherData}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-kioo-primary hover:bg-kioo-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kioo-primary disabled:opacity-50"
              >
                {loading ? t('refreshing') : t('refresh')}
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('logout')}
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-2">
              {t('lastUpdated')}: {lastUpdated.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB', { timeZone: 'UTC' })} GMT
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kioo-primary"></div>
            <p className="mt-2 text-gray-600">{t('loading')}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold text-lg hover:text-red-900">×</button>
          </div>
        )}

        {/* Weather Cards */}
        {farmerWeatherData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {farmerWeatherData.map((location, index) => {
              const messages = generateFarmerMessages(location);
              const firstRain = location.hourly?.find(h => 
                (h.rainProbPct || 0) >= 50 && (h.rainMmHr || 0) >= 0.2
              );
              
              const getIntensityLabel = (rainMmHr) => {
                if (!rainMmHr || rainMmHr < 0.2) return t('none');
                if (rainMmHr < 2.5) return t('light');
                if (rainMmHr <= 10) return t('moderate');
                return t('heavy');
              };

              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  {/* Location Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{location.location}</h3>
                  </div>

                  {/* Current Conditions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{t('now')}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{location.now?.tempC || 'N/A'}°C</div>
                        <div className="text-xs text-gray-500">{t('temp')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{location.now?.rainProbPct || 0}%</div>
                        <div className="text-xs text-gray-500">{t('rainChance')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700">
                          {getIntensityLabel(location.now?.rainMmHr)}
                        </div>
                        <div className="text-xs text-gray-500">{t('rainIntensity')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">{location.now?.windKph || 0} km/h</div>
                        <div className="text-xs text-gray-500">{t('wind')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Rain Highlight */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="text-sm font-medium text-blue-900">
                      {firstRain ? (
                        <>
                          {t('likelyRain')} {new Date(firstRain.timeIsoUTC).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            timeZone: 'UTC'
                          })} GMT
                        </>
                      ) : (
                        t('lowChanceNext24h')
                      )}
                    </div>
                  </div>

                  {/* 3-Day Outlook */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{t('threeDayOutlook')}</h4>
                    <div className="space-y-2">
                      {location.daily?.slice(0, 3).map((day, dayIndex) => {
                        const date = new Date(day.dateIsoUTC);
                        const dayName = date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { 
                          weekday: 'short',
                          timeZone: 'UTC'
                        });
                        
                        // Create sparkline data from hourly data for this day
                        const dayHourly = location.hourly?.filter(h => {
                          const hourDate = new Date(h.timeIsoUTC);
                          return hourDate.toDateString() === date.toDateString();
                        }) || [];
                        const sparklineData = dayHourly.map(h => h.rainProbPct || 0);

                        return (
                          <div key={dayIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900 w-8">{dayName}</span>
                              <span className="text-sm text-gray-600">{t('maxChance')}: {day.rainProbMaxPct || 0}%</span>
                              <span className="text-sm text-gray-600">{t('totalRain')}: {(day.rainSumMm || 0).toFixed(1)}mm</span>
                            </div>
                            <Sparkline data={sparklineData} width={60} height={20} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Farmer Messages */}
                  <div className="space-y-3">
                    {messages.map((message, msgIndex) => (
                      <div 
                        key={msgIndex} 
                        className={`p-3 rounded-lg text-sm ${
                          msgIndex === 0 
                            ? 'bg-green-50 border border-green-200 text-green-800 font-medium' 
                            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                        }`}
                      >
                        <span className="mr-2">{msgIndex === 0 ? '🌾' : '⚠️'}</span>
                        {message}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {farmerWeatherData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="font-medium text-gray-700 mb-2">{t('rainIntensity')} (mm/h):</div>
              <div className="flex flex-wrap gap-4">
                <span>{t('light')}: &lt;2.5mm/h</span>
                <span>{t('moderate')}: 2.5-10mm/h</span>
                <span>{t('heavy')}: &gt;10mm/h</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="italic">
                  {language === 'fr' 
                    ? 'Prévisions basées sur les données météorologiques. Les conditions peuvent changer rapidement.'
                    : 'Forecasts based on weather data. Conditions may change rapidly.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;