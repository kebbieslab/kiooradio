import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChurchPartners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Liberia');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const countries = ['Liberia', 'Sierra Leone', 'Guinea'];
  
  const cities = {
    'Liberia': ['all', 'Foya', 'Kolahun', 'Kakata', 'Monrovia'],
    'Sierra Leone': ['all', 'Koindu', 'Kailahun', 'Bo'],
    'Guinea': ['all', 'Guéckédou', 'N\'Zérékoré', 'Kissidougou']
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, selectedCountry, selectedCity, searchQuery]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API}/church-partners`);
      setPartners(response.data);
    } catch (error) {
      console.error('Error fetching church partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners.filter(partner => partner.country === selectedCountry);
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(partner => 
        partner.city === selectedCity || partner.altCityNames.includes(selectedCity)
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(partner =>
        partner.pastorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.churchName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPartners(filtered);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity('all');
  };

  const handleShare = (partner) => {
    const url = `${window.location.origin}/church-partners?q=${encodeURIComponent(partner.pastorName)}`;
    navigator.clipboard.writeText(url);
    alert('Partner link copied to clipboard!');
  };

  const handleAskQuestion = (partner) => {
    if (partner.whatsAppNumber && partner.consentToDisplayContact) {
      const cleanNumber = partner.whatsAppNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } else {
      window.location.href = `/contact?partner=${encodeURIComponent(partner.pastorName)}`;
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kioo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partner churches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              ⛪ Partner Churches
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-green-100 leading-relaxed">
                We work with trusted pastors and churches across the Makona River Region. 
                Find their details and connect directly for prayer, counseling, or questions. 
                Broadcast times will be added soon. Check our <a href="/programs-lineup" className="text-white underline hover:text-green-200 font-semibold">Programs Lineup</a> for current schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section - Sticky on Mobile */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Country Tabs */}
          <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Country selection">
            {countries.map((country) => (
              <button
                key={country}
                role="tab"
                aria-selected={selectedCountry === country}
                onClick={() => handleCountryChange(country)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:ring-offset-2 ${
                  selectedCountry === country
                    ? 'bg-kioo-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          {/* City Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* City Filter */}
            <div className="flex-1">
              <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-2">
                City:
              </label>
              <select
                id="city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              >
                {cities[selectedCountry].map((city) => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Pastor or Church:
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pastor or church name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPartners.length} partner churches
            {selectedCity !== 'all' && ` in ${selectedCity}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              {selectedCountry === 'Liberia' ? (
                <div>
                  <div className="text-6xl mb-4">⛪</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No partners found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedCountry === 'Guinea' ? 'Liste des églises bientôt disponible' : 'Churches list coming soon'}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCountry === 'Guinea' 
                      ? `Nous travaillons pour nous connecter avec les églises en ${selectedCountry}.`
                      : `We're working to connect with churches in ${selectedCountry}.`
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPartners.map((partner, index) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 border border-gray-200"
                >
                  
                  {/* Pastor Photo or Placeholder */}
                  <div className="text-center mb-4">
                    {partner.photoUrl ? (
                      <img
                        src={partner.photoUrl}
                        alt={`${partner.pastorName}`}
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-kioo-primary rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white text-2xl">👤</span>
                      </div>
                    )}
                  </div>

                  {/* Pastor Name */}
                  <h3 className="text-lg font-bold text-kioo-dark text-center mb-2">
                    {partner.pastorName}
                  </h3>

                  {/* Church Name */}
                  <p className="text-kioo-primary font-medium text-center mb-3">
                    {partner.churchName}
                  </p>

                  {/* Location */}
                  <p className="text-gray-600 text-sm text-center mb-4">
                    {partner.city}, {partner.country}
                  </p>

                  {/* On Kioo Radio */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>On Kioo Radio:</strong>{' '}
                      {partner.onAirDaysTimes || 'To be announced'}
                    </p>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    
                    {/* Phone and WhatsApp */}
                    {partner.consentToDisplayContact && (partner.contactPhone || partner.whatsAppNumber) ? (
                      <div className="flex gap-2">
                        {partner.contactPhone && (
                          <a
                            href={`tel:${formatPhoneNumber(partner.contactPhone)}`}
                            className="flex-1 bg-kioo-primary text-white text-center py-2 px-3 rounded-lg hover:bg-kioo-secondary transition-colors text-sm font-medium"
                          >
                            📞 Call
                          </a>
                        )}
                        {partner.whatsAppNumber && (
                          <a
                            href={`https://wa.me/${partner.whatsAppNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-2 px-3 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-600">Contact: Coming soon</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(partner)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        🔗 Share
                      </button>
                      <button
                        onClick={() => handleAskQuestion(partner)}
                        className="flex-1 bg-kioo-secondary text-white py-2 px-3 rounded-lg hover:bg-kioo-primary transition-colors text-sm font-medium"
                      >
                        ❓ Ask Question
                      </button>
                    </div>
                  </div>

                  {/* Notes (if any) */}
                  {partner.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">{partner.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChurchPartners;