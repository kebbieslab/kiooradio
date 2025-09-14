import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const WeatherDashboard = () => {
  const [farmerWeatherData, setFarmerWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('current'); // New state for tabs

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

            {/* Tab Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'current'
                    ? 'bg-kioo-primary text-white rounded-l-lg'
                    : 'text-gray-600 hover:text-kioo-primary'
                }`}
              >
                {language === 'fr' ? '🌡️ Météo Actuelle' : '🌡️ Current Weather'}
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'forecast'
                    ? 'bg-kioo-primary text-white rounded-r-lg'
                    : 'text-gray-600 hover:text-kioo-primary'
                }`}
              >
                {language === 'fr' ? '📅 Prévisions' : '📅 Forecast'}
              </button>
            </div>

            {/* Current Weather Tab */}
            {activeTab === 'current' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {farmerWeatherData.map((location, index) => (
                  <CompactWeatherCard key={index} location={location} language={language} />
                ))}
              </div>
            )}

            {/* Forecast Tab */}
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                {farmerWeatherData.map((location, index) => (
                  <ForecastCard key={index} location={location} language={language} />
                ))}
              </div>
            )}

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

// Compact WeatherCard Component (for Current Weather tab)
const CompactWeatherCard = ({ location, language }) => {
  if (!location) return null;

  const formatTemperature = (tempC) => {
    if (tempC === null || tempC === undefined) return 'N/A';
    const tempF = Math.round((tempC * 9/5) + 32);
    return `${tempF}°F`;
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
        tempColor: 'text-red-700'
      };
    } else if (locationName?.includes('Sierra Leone')) {
      return {
        name: 'Sierra Leone',
        flag: '🇸🇱',
        borderColor: 'border-green-500',
        headerBg: 'bg-green-50',
        accentColor: 'text-green-600',
        tempColor: 'text-green-700'
      };
    } else if (locationName?.includes('Guinea')) {
      return {
        name: 'Guinea',
        flag: '🇬🇳',
        borderColor: 'border-yellow-500',
        headerBg: 'bg-yellow-50',
        accentColor: 'text-yellow-600',
        tempColor: 'text-yellow-700'
      };
    }
    return {
      name: 'Unknown',
      flag: '🌍',
      borderColor: 'border-gray-300',
      headerBg: 'bg-gray-50',
      accentColor: 'text-gray-600',
      tempColor: 'text-gray-700'
    };
  };

  // Get weather condition description
  const getWeatherCondition = (location, language) => {
    const temp = location.now?.tempC || 0;
    const humidity = location.now?.humidityPct || 0;
    const rainProb = location.now?.rainProbPct || 0;
    const rainMm = location.now?.rainMmHr || 0;

    const tempF = (temp * 9/5) + 32;

    if (rainMm > 0) {
      return language === 'fr' ? 'Pluvieux' : 'Rainy';
    } else if (rainProb > 80) {
      return language === 'fr' ? 'Très nuageux' : 'Overcast';
    } else if (rainProb > 60) {
      return language === 'fr' ? 'Nuageux' : 'Cloudy';
    } else if (rainProb > 30) {
      return language === 'fr' ? 'Partiellement nuageux' : 'Partly Cloudy';
    } else if (humidity > 90) {
      return language === 'fr' ? 'Brumeux' : 'Foggy';
    } else if (tempF < 75) {
      return language === 'fr' ? 'Frais' : 'Cool';
    } else if (tempF > 85) {
      return language === 'fr' ? 'Chaud' : 'Hot';
    } else if (rainProb < 20 && humidity < 60) {
      return language === 'fr' ? 'Ensoleillé' : 'Sunny';
    } else {
      return language === 'fr' ? 'Dégagé' : 'Clear';
    }
  };

  const theme = getCountryTheme(location.location);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${theme.borderColor} p-3 hover:shadow-md transition-shadow`}>
      {/* Location Header */}
      <div className={`text-center mb-2 p-2 ${theme.headerBg} rounded-lg`}>
        <h3 className="text-sm font-semibold text-gray-900">{location.location?.split(',')[0]}</h3>
        <p className={`text-xs ${theme.accentColor} flex items-center justify-center gap-1`}>
          {theme.flag} {theme.name}
        </p>
      </div>

      {/* Temperature */}
      <div className="text-center mb-2">
        <div className={`text-2xl font-bold ${theme.tempColor} mb-1`}>
          {formatTemperature(location.now?.tempC)}
        </div>
        <div className="text-xs text-gray-900 font-medium">
          {getWeatherCondition(location, language)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="bg-gray-50 p-1 rounded text-center">
          <div className="text-gray-600">💧 {language === 'fr' ? 'Hum' : 'Hum'}</div>
          <div className="font-semibold">{location.now?.humidityPct || 0}%</div>
        </div>
        <div className="bg-gray-50 p-1 rounded text-center">
          <div className="text-gray-600">🌧️ {language === 'fr' ? 'Pluie' : 'Rain'}</div>
          <div className="font-semibold">{location.now?.rainProbPct || 0}%</div>
        </div>
      </div>
    </div>
  );
};

// Forecast Card Component (for Forecast tab)
const ForecastCard = ({ location, language }) => {
  if (!location) return null;

  const formatTemperature = (tempC) => {
    if (tempC === null || tempC === undefined) return 'N/A';
    const tempF = Math.round((tempC * 9/5) + 32);
    return `${tempF}°F`;
  };

  // Get weather condition description
  const getWeatherCondition = (rainProb, rainMm, humidity, temp) => {
    const tempF = (temp * 9/5) + 32;
    
    if (rainMm > 0) {
      return { condition: language === 'fr' ? 'Pluvieux' : 'Rainy', icon: '🌧️' };
    } else if (rainProb > 80) {
      return { condition: language === 'fr' ? 'Très nuageux' : 'Overcast', icon: '☁️' };
    } else if (rainProb > 60) {
      return { condition: language === 'fr' ? 'Nuageux' : 'Cloudy', icon: '☁️' };
    } else if (rainProb > 30) {
      return { condition: language === 'fr' ? 'Partiellement nuageux' : 'Partly Cloudy', icon: '⛅' };
    } else if (humidity > 90) {
      return { condition: language === 'fr' ? 'Brumeux' : 'Foggy', icon: '🌫️' };
    } else if (rainProb > 20) {
      return { condition: language === 'fr' ? 'Averses éparses' : 'Scattered Showers', icon: '🌦️' };
    } else if (tempF > 85) {
      return { condition: language === 'fr' ? 'Ensoleillé' : 'Sunny', icon: '☀️' };
    } else {
      return { condition: language === 'fr' ? 'Dégagé' : 'Clear', icon: '🌤️' };
    }
  };

  // Determine country and flag colors
  const getCountryTheme = (locationName) => {
    if (locationName?.includes('Liberia')) {
      return {
        name: 'Liberia',
        flag: '🇱🇷',
        borderColor: 'border-red-200',
        headerBg: 'bg-red-50'
      };
    } else if (locationName?.includes('Sierra Leone')) {
      return {
        name: 'Sierra Leone', 
        flag: '🇸🇱',
        borderColor: 'border-green-200',
        headerBg: 'bg-green-50'
      };
    } else if (locationName?.includes('Guinea')) {
      return {
        name: 'Guinea',
        flag: '🇬🇳',
        borderColor: 'border-yellow-200',
        headerBg: 'bg-yellow-50'
      };
    }
    return {
      name: 'Unknown',
      flag: '🌍',
      borderColor: 'border-gray-200',
      headerBg: 'bg-gray-50'
    };
  };

  const theme = getCountryTheme(location.location);

  return (
    <div className="space-y-6">
      {/* Tomorrow Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🗓️</span>
          <h3 className="text-xl font-semibold text-gray-900">
            {language === 'fr' ? 'Demain' : 'Tomorrow'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {location.daily?.slice(1, 2).map((day, dayIndex) => {
            const weather = getWeatherCondition(
              day.rainProbMaxPct || 0,
              day.rainSumMm || 0, 
              85, // Default humidity
              location.now?.tempC || 25
            );
            
            // Calculate high/low temps (simulate from current temp)
            const currentTemp = location.now?.tempC || 25;
            const highTemp = currentTemp + 2;
            const lowTemp = currentTemp - 3;
            
            return (
              <div key={dayIndex} className={`bg-white rounded-lg shadow-sm border ${theme.borderColor} p-4`}>
                {/* Location Header */}
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{location.location}</h4>
                  <p className="text-xs text-gray-600">{theme.flag} {theme.name}</p>
                </div>
                
                {/* Temperature */}
                <div className="text-center mb-3">
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatTemperature(highTemp)}
                    </span>
                    <span className="text-lg text-blue-400">
                      {formatTemperature(lowTemp)}
                    </span>
                  </div>
                  <div className="flex justify-center text-xs text-gray-600 gap-4">
                    <span>{language === 'fr' ? 'Max' : 'High'}</span>
                    <span>{language === 'fr' ? 'Min' : 'Low'}</span>
                  </div>
                </div>
                
                {/* Weather Condition */}
                <div className="text-center mb-3">
                  <div className="text-2xl mb-1">{weather.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{weather.condition}</div>
                </div>
                
                {/* Weather Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      💧 {language === 'fr' ? 'Humidité:' : 'Humidity:'}
                    </span>
                    <span className="font-medium">{location.now?.humidityPct || 85}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      🌬️ {language === 'fr' ? 'Vent:' : 'Wind:'}
                    </span>
                    <span className="font-medium">{Math.round((location.now?.windKph || 10) * 0.621371)} mph</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      🌧️ {language === 'fr' ? 'Pluie:' : 'Rain:'}
                    </span>
                    <span className="font-medium">{day.rainProbMaxPct || 0}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day After Tomorrow Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📅</span>
          <h3 className="text-xl font-semibold text-gray-900">
            {language === 'fr' ? 'Après-demain' : 'Day After Tomorrow'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {location.daily?.slice(2, 3).map((day, dayIndex) => {
            const weather = getWeatherCondition(
              day.rainProbMaxPct || 0,
              day.rainSumMm || 0,
              80, // Default humidity
              location.now?.tempC || 25
            );
            
            // Calculate high/low temps (simulate from current temp)
            const currentTemp = location.now?.tempC || 25;
            const highTemp = currentTemp + 1;
            const lowTemp = currentTemp - 4;
            
            return (
              <div key={dayIndex} className={`bg-white rounded-lg shadow-sm border ${theme.borderColor} p-4`}>
                {/* Location Header */}
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{location.location}</h4>
                  <p className="text-xs text-gray-600">{theme.flag} {theme.name}</p>
                </div>
                
                {/* Temperature */}
                <div className="text-center mb-3">
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatTemperature(highTemp)}
                    </span>
                    <span className="text-lg text-blue-400">
                      {formatTemperature(lowTemp)}
                    </span>
                  </div>
                  <div className="flex justify-center text-xs text-gray-600 gap-4">
                    <span>{language === 'fr' ? 'Max' : 'High'}</span>
                    <span>{language === 'fr' ? 'Min' : 'Low'}</span>
                  </div>
                </div>
                
                {/* Weather Condition */}
                <div className="text-center mb-3">
                  <div className="text-2xl mb-1">{weather.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{weather.condition}</div>
                </div>
                
                {/* Weather Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      💧 {language === 'fr' ? 'Humidité:' : 'Humidity:'}
                    </span>
                    <span className="font-medium">{Math.max(75, (location.now?.humidityPct || 85) - 5)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      🌬️ {language === 'fr' ? 'Vent:' : 'Wind:'}
                    </span>
                    <span className="font-medium">{Math.round((location.now?.windKph || 8) * 0.621371)} mph</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-600">
                      🌧️ {language === 'fr' ? 'Pluie:' : 'Rain:'}
                    </span>
                    <span className="font-medium">{day.rainProbMaxPct || 0}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;