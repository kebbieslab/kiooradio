import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const Dashboard = () => {
  const [farmerWeatherData, setFarmerWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Kioo Dashboard - GMT + Farmer Messages"
        description="Farmer-focused weather dashboard for the Makona River Region with GMT timezone and multilingual support"
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {language === 'fr' ? 'Tableau de Bord Kioo: GMT + Messages Agriculteurs' : 'Kioo Dashboard: GMT + Farmer Messages'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'fr' ? 'Informations météo pour les agriculteurs avec timing et intensité de pluie' : 'Farmer-focused rain timing & intensity'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {language === 'fr' ? 'Toutes les heures en GMT' : 'All times in GMT'}
              </div>
              <div className="flex items-center gap-2 text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                🕐 {currentTime.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'UTC'
                })} GMT
              </div>
              
              {/* Language Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setLanguage('en');
                    localStorage.setItem('kioo_lang', 'en');
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'en' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLanguage('fr');
                    localStorage.setItem('kioo_lang', 'fr');
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'fr' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  FR
                </button>
              </div>
              
              <button
                onClick={() => loadFarmerWeatherData()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                {language === 'fr' ? 'Actualiser' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500">
              {language === 'fr' ? 'Dernière mise à jour: ' : 'Last updated: '}
              {lastUpdated.toLocaleString('en-GB', { 
                timeZone: 'UTC',
                day: '2-digit',
                month: 'short', 
                hour: '2-digit',
                minute: '2-digit'
              })} GMT
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
            <span className="text-gray-600">
              {language === 'fr' ? 'Chargement des données météo...' : 'Loading weather data...'}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {farmerWeatherData.map((location, index) => (
              <WeatherCard key={index} location={location} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// WeatherCard Component
const WeatherCard = ({ location, language }) => {
  if (!location) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const formatTemperature = (temp) => {
    return temp !== null && temp !== undefined ? `${Math.round(temp)}°C` : 'N/A';
  };

  const formatRainIntensity = (intensity) => {
    if (!intensity || intensity === 'none') return language === 'fr' ? 'Aucune' : 'None';
    const intensityMap = {
      'light': language === 'fr' ? 'Légère' : 'Light',
      'moderate': language === 'fr' ? 'Modérée' : 'Moderate', 
      'heavy': language === 'fr' ? 'Forte' : 'Heavy'
    };
    return intensityMap[intensity] || intensity;
  };

  const renderSparkline = (data) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data, 1);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - (value / max) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Location Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          <p className="text-sm text-gray-600">{location.country}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatTemperature(location.current?.tempC)}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'fr' ? 'Maintenant' : 'Now'}
          </div>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">{language === 'fr' ? 'Humidité:' : 'Humidity:'}</span>
          <span className="font-medium ml-1">{location.current?.humidityPct || 0}%</span>
        </div>
        <div>
          <span className="text-gray-600">{language === 'fr' ? 'Vent:' : 'Wind:'}</span>
          <span className="font-medium ml-1">{location.current?.windKph || 0} km/h</span>
        </div>
        <div>
          <span className="text-gray-600">{language === 'fr' ? 'Pluie:' : 'Rain:'}</span>
          <span className="font-medium ml-1">{location.current?.rainProbPct || 0}%</span>
        </div>
        <div>
          <span className="text-gray-600">{language === 'fr' ? 'Intensité:' : 'Intensity:'}</span>
          <span className="font-medium ml-1">{formatRainIntensity(location.current?.rainIntensity)}</span>
        </div>
      </div>

      {/* Rain Status */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm font-medium text-blue-900">
          {location.rainStatus || (language === 'fr' ? 'Faible chance de pluie dans les 24h' : 'Low chance of rain next 24h')}
        </div>
        {location.nextRainTime && (
          <div className="text-xs text-blue-700 mt-1">
            {language === 'fr' ? 'Prochaine pluie probable vers' : 'Next rain likely around'} {formatTime(location.nextRainTime)}
          </div>
        )}
      </div>

      {/* 3-Day Outlook */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {language === 'fr' ? 'Prévisions 3 jours' : '3-Day Outlook'}
        </h4>
        
        <div className="space-y-2 text-xs">
          {location.forecast?.daily?.slice(0, 3).map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-8 text-gray-600">
                  {['Today', 'Tomorrow', 'Day 3'][index]}
                </span>
                <span className="text-gray-900 font-medium">
                  {language === 'fr' ? 'Max' : 'Max'} {day.maxRainChance || 0}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  {day.totalRain || 0}mm
                </span>
                {renderSparkline(day.hourlyRainChances?.slice(0, 8) || [])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Messages */}
      {location.farmerMessages && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {language === 'fr' ? 'Messages Agriculteurs' : 'Farmer Messages'}
          </h4>
          <div className="space-y-2">
            {location.farmerMessages.primary && (
              <div className="text-sm text-green-800 bg-green-50 rounded p-2">
                🌾 {location.farmerMessages.primary}
              </div>
            )}
            {location.farmerMessages.secondary && (
              <div className="text-xs text-blue-700 bg-blue-50 rounded p-2">
                💧 {location.farmerMessages.secondary}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;