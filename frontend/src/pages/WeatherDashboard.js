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
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
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
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-4"></div>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                {language === 'fr' ? 'Zone de Couverture' : 'Coverage Area'}
              </h2>
              <p className="text-blue-800">
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
            <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900 mb-3">
                {language === 'fr' ? '🌾 Conseils Agricoles' : '🌾 Farming Tips'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Location Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
          <p className="text-sm text-gray-600">{location.country}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {formatTemperature(location.current?.tempC)}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'fr' ? 'Maintenant' : 'Now'}
          </div>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">{language === 'fr' ? 'Humidité' : 'Humidity'}</div>
          <div className="font-semibold text-lg">{location.current?.humidityPct || 0}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">{language === 'fr' ? 'Vent' : 'Wind'}</div>
          <div className="font-semibold text-lg">{location.current?.windKph || 0} km/h</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">{language === 'fr' ? 'Pluie' : 'Rain'}</div>
          <div className="font-semibold text-lg">{location.current?.rainProbPct || 0}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">{language === 'fr' ? 'Intensité' : 'Intensity'}</div>
          <div className="font-semibold text-lg">{formatRainIntensity(location.current?.rainIntensity)}</div>
        </div>
      </div>

      {/* Rain Status */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <div className="font-medium text-blue-900">
          {location.rainStatus || (language === 'fr' ? 'Faible chance de pluie dans les 24h' : 'Low chance of rain next 24h')}
        </div>
        {location.nextRainTime && (
          <div className="text-sm text-blue-700 mt-1">
            {language === 'fr' ? 'Prochaine pluie probable vers' : 'Next rain likely around'} {formatTime(location.nextRainTime)}
          </div>
        )}
      </div>

      {/* 3-Day Outlook */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">
          {language === 'fr' ? 'Prévisions 3 jours' : '3-Day Outlook'}
        </h4>
        
        <div className="space-y-3">
          {location.forecast?.daily?.slice(0, 3).map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <span className="w-16 text-sm text-gray-600">
                  {index === 0 ? (language === 'fr' ? 'Aujourd\'hui' : 'Today') : 
                   index === 1 ? (language === 'fr' ? 'Demain' : 'Tomorrow') : 
                   (language === 'fr' ? 'Jour 3' : 'Day 3')}
                </span>
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Max' : 'Max'} {day.maxRainChance || 0}%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
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
          <h4 className="font-medium text-gray-900 mb-3">
            {language === 'fr' ? 'Messages Agriculteurs' : 'Farmer Messages'}
          </h4>
          <div className="space-y-2">
            {location.farmerMessages.primary && (
              <div className="text-sm text-green-800 bg-green-100 rounded-lg p-3 border-l-4 border-green-400">
                🌾 {location.farmerMessages.primary}
              </div>
            )}
            {location.farmerMessages.secondary && (
              <div className="text-sm text-blue-700 bg-blue-100 rounded-lg p-3 border-l-4 border-blue-400">
                💧 {location.farmerMessages.secondary}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;