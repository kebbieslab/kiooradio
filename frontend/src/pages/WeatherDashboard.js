import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const WeatherDashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Weather Dashboard - Kioo Radio Programs"
        description="Farmer-focused weather dashboard for the Makona River Region. Get real-time weather updates for agricultural planning across Liberia, Sierra Leone, and Guinea."
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-kioo-primary to-kioo-accent text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'fr' ? 'Tableau de Bord Météo' : 'Weather Dashboard'}
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              {language === 'fr' ? 'Informations Météo pour Agriculteurs' : 'Farmer-Focused Weather Information'}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              {language === 'fr' 
                ? 'Données météo en temps réel pour planification agricole dans la région de la rivière Makona'
                : 'Real-time weather data for agricultural planning across the Makona River Region'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Toutes les heures en GMT' : 'All times in GMT'}
                </span>
                <div className="bg-kioo-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  🕐 {currentTime.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'UTC'
                  })} GMT
                </div>
              </div>
              
              {lastUpdated && (
                <div className="text-xs text-gray-500">
                  {language === 'fr' ? 'Mise à jour: ' : 'Updated: '}
                  {lastUpdated.toLocaleString('en-GB', { 
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} GMT
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
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
                disabled={loading}
                className="bg-kioo-primary text-white px-4 py-2 rounded-lg hover:bg-kioo-secondary transition-colors text-sm disabled:opacity-50"
              >
                {loading 
                  ? (language === 'fr' ? 'Actualisation...' : 'Refreshing...') 
                  : (language === 'fr' ? 'Actualiser' : 'Refresh')
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kioo-primary mr-4"></div>
            <span className="text-lg text-gray-600">
              {language === 'fr' ? 'Chargement des données météo...' : 'Loading weather data...'}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Coverage Area Info */}
            <div className="bg-kioo-light border border-kioo-primary/20 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-kioo-dark mb-2">
                {language === 'fr' ? 'Zone de Couverture' : 'Coverage Area'}
              </h2>
              <p className="text-kioo-secondary">
                {language === 'fr' 
                  ? 'Données météo pour les régions agricoles clés de la zone de diffusion de Kioo Radio 98.1 FM.'
                  : 'Weather data for key agricultural regions within Kioo Radio 98.1 FM broadcast coverage.'
                }
              </p>
            </div>

            {/* Weather Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farmerWeatherData.map((location, index) => (
                <WeatherCard key={index} location={location} language={language} />
              ))}
            </div>

            {/* Farming Tips */}
            <div className="mt-12 bg-kioo-light border border-kioo-primary/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-kioo-dark mb-3">
                {language === 'fr' ? '🌾 Conseils Agricoles' : '🌾 Farming Tips'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-kioo-secondary">
                <div>
                  <strong>{language === 'fr' ? 'Planification:' : 'Planning:'}</strong> 
                  {language === 'fr' 
                    ? ' Utilisez les prévisions à 3 jours pour planifier les activités agricoles.'
                    : ' Use 3-day forecasts to plan farming activities.'
                  }
                </div>
                <div>
                  <strong>{language === 'fr' ? 'Pluie:' : 'Rain:'}</strong> 
                  {language === 'fr' 
                    ? ' Surveillez les heures de pluie probables pour optimiser l\'irrigation.'
                    : ' Monitor likely rain times to optimize irrigation schedules.'
                  }
                </div>
                <div>
                  <strong>{language === 'fr' ? 'Récolte:' : 'Harvest:'}</strong> 
                  {language === 'fr' 
                    ? ' Évitez la récolte pendant les périodes de forte pluie.'
                    : ' Avoid harvesting during heavy rain periods.'
                  }
                </div>
                <div>
                  <strong>{language === 'fr' ? 'Semis:' : 'Planting:'}</strong> 
                  {language === 'fr' 
                    ? ' Planifiez les semis en fonction des prévisions de pluie.'
                    : ' Time planting based on rain forecasts.'
                  }
                </div>
              </div>
            </div>
          </>
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

  const formatTemperature = (tempC) => {
    if (tempC === null || tempC === undefined) return 'N/A';
    const tempF = Math.round((tempC * 9/5) + 32);
    return `${tempF}°F`;
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

  // Determine country and flag colors
  const getCountryTheme = (locationName) => {
    if (locationName?.includes('Liberia')) {
      return {
        name: 'Liberia',
        flag: '🇱🇷',
        borderColor: 'border-red-500',
        headerBg: 'bg-red-50',
        accentColor: 'text-red-600',
        tempColor: 'text-red-700',
        progressColor: 'bg-red-500'
      };
    } else if (locationName?.includes('Sierra Leone')) {
      return {
        name: 'Sierra Leone',
        flag: '🇸🇱',
        borderColor: 'border-green-500',
        headerBg: 'bg-green-50',
        accentColor: 'text-green-600',
        tempColor: 'text-green-700',
        progressColor: 'bg-green-500'
      };
    } else if (locationName?.includes('Guinea')) {
      return {
        name: 'Guinea',
        flag: '🇬🇳',
        borderColor: 'border-yellow-500',
        headerBg: 'bg-yellow-50',
        accentColor: 'text-yellow-600',
        tempColor: 'text-yellow-700',
        progressColor: 'bg-yellow-500'
      };
    }
    // Default theme
    return {
      name: 'Unknown',
      flag: '🌍',
      borderColor: 'border-gray-300',
      headerBg: 'bg-gray-50',
      accentColor: 'text-gray-600',
      tempColor: 'text-gray-700',
      progressColor: 'bg-gray-500'
    };
  };

  const theme = getCountryTheme(location.location);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${theme.borderColor} p-6 hover:shadow-md transition-shadow`}>
      {/* Location Header */}
      <div className={`flex justify-between items-start mb-4 p-3 ${theme.headerBg} rounded-lg`}>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{location.location}</h3>
          <p className={`text-sm font-medium ${theme.accentColor} flex items-center gap-1`}>
            {theme.flag} {theme.name}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${theme.tempColor}`}>
            {formatTemperature(location.now?.tempC)}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'fr' ? 'Maintenant' : 'Now'}
          </div>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600 flex items-center gap-1">
            💧 {language === 'fr' ? 'Humidité' : 'Humidity'}
          </div>
          <div className="font-semibold text-lg">{location.now?.humidityPct || 0}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600 flex items-center gap-1">
            🌧️ {language === 'fr' ? 'Pluie' : 'Rain'}
          </div>
          <div className="font-semibold text-lg">{location.now?.rainProbPct || 0}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded col-span-2 text-center">
          <div className="text-gray-600 flex items-center justify-center gap-1">
            ☔ {language === 'fr' ? 'Pluie/Heure' : 'Rain/Hour'}
          </div>
          <div className="font-semibold text-lg">{location.now?.rainMmHr || 0} mm</div>
        </div>
      </div>

      {/* Rain Status */}
      <div className={`mb-4 p-4 ${theme.headerBg} rounded-lg border-l-4 ${theme.borderColor}`}>
        <div className="font-medium text-gray-900">
          {location.now?.rainProbPct > 70 
            ? (language === 'fr' ? '🌧️ Forte chance de pluie' : '🌧️ High chance of rain')
            : location.now?.rainProbPct > 40
            ? (language === 'fr' ? '🌦️ Chance modérée de pluie' : '🌦️ Moderate chance of rain') 
            : (language === 'fr' ? '☁️ Faible chance de pluie' : '☁️ Low chance of rain')
          }
        </div>
        <div className={`text-sm ${theme.accentColor} mt-1`}>
          {language === 'fr' ? 'Probabilité actuelle:' : 'Current probability:'} {location.now?.rainProbPct || 0}%
        </div>
      </div>

      {/* 2-Day Forecast */}
      <div className="border-t pt-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-3">
          {language === 'fr' ? '📅 Prévisions 2 jours' : '📅 2-Day Forecast'}
        </h4>
        
        <div className="space-y-3">
          {location.daily?.slice(1, 3).map((day, index) => (
            <div key={index} className={`flex items-center justify-between p-3 ${theme.headerBg} rounded-lg border ${theme.borderColor}`}>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">
                  {index === 0 ? (language === 'fr' ? '🌅 Demain' : '🌅 Tomorrow') : (language === 'fr' ? '🌄 Après-demain' : '🌄 Day After')}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-gray-600">{language === 'fr' ? 'Pluie' : 'Rain'}</div>
                  <div className={`text-sm font-semibold ${theme.accentColor}`}>{day.rainProbMaxPct || 0}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">{language === 'fr' ? 'Total' : 'Total'}</div>
                  <div className="text-sm font-semibold text-gray-700">{Math.round(day.rainSumMm || 0)}mm</div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${theme.progressColor} transition-all rounded-full`}
                    style={{ width: `${Math.min((day.rainProbMaxPct || 0), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Preview */}
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium text-gray-900 mb-3">
          {language === 'fr' ? 'Prochaines heures' : 'Next Hours'}
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {location.hourly?.slice(0, 6).map((hour, index) => (
            <div key={index} className={`flex-shrink-0 ${theme.headerBg} rounded p-2 text-center min-w-16 border ${theme.borderColor}`}>
              <div className="text-xs text-gray-600">
                {new Date(hour.timeIsoUTC).toLocaleTimeString('en-GB', { 
                  hour: '2-digit',
                  timeZone: 'UTC'
                })}
              </div>
              <div className={`text-sm font-medium ${theme.tempColor}`}>{Math.round((hour.tempC * 9/5) + 32)}°F</div>
              <div className={`text-xs ${theme.accentColor}`}>{hour.rainProbPct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;