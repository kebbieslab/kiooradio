import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Station settings (in real app, this would come from backend)
const STATION_SETTINGS = {
  stationWhatsAppNumber: "+231778383703",
  stationWhatsAppDigitsOnly: "231778383703",
  stationEmail: "info@kiooradio.org"
};

const ChurchPartners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Liberia');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const countries = ['Liberia', 'Sierra Leone', 'Guinea'];
  
  const cities = {
    'Liberia': ['all', 'Foya', 'Kolahun', 'Kakata', 'Monrovia'],
    'Sierra Leone': ['all', 'Koindu', 'Kailahun', 'Bo'],
    'Guinea': ['all', 'Guéckédou', 'N\'Zérékoré', 'Kissidougou']
  };

  // Placeholder partners for empty cities
  const getPlaceholderPartners = (city, country) => {
    const placeholders = [
      {
        id: `placeholder-${city}-1`,
        pastorName: country === 'Guinea' ? 'Pasteur Bientôt Disponible' : 'Pastor Coming Soon',
        churchName: country === 'Guinea' ? 'Église Partenaire Bientôt' : 'Partner Church Coming Soon',
        city: city,
        country: country,
        isPlaceholder: true,
        photoUrl: null,
        contactPhone: null
      },
      {
        id: `placeholder-${city}-2`,
        pastorName: country === 'Guinea' ? 'Ministre Bientôt Disponible' : 'Minister Coming Soon',
        churchName: country === 'Guinea' ? 'Ministère Partenaire Bientôt' : 'Partner Ministry Coming Soon',
        city: city,
        country: country,
        isPlaceholder: true,
        photoUrl: null,
        contactPhone: null
      }
    ];
    return placeholders;
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
        partner.city === selectedCity || partner.altCityNames?.includes(selectedCity)
      );
      
      // Add placeholder partners if no real partners exist for this city
      if (filtered.length === 0) {
        filtered = getPlaceholderPartners(selectedCity, selectedCountry);
      }
    }
    
    if (searchQuery && !searchQuery.includes('placeholder')) {
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

  const handleCall = (partner) => {
    if (partner.contactPhone) {
      window.open(`tel:${partner.contactPhone}`, '_self');
    }
  };

  const handleWhatsApp = (partner) => {
    const message = encodeURIComponent(
      `Hello Kioo Radio, I'm contacting about ${partner.pastorName} — ${partner.churchName} in ${partner.city}, ${partner.country}. I have a question / testimony:`
    );
    window.open(`https://wa.me/${STATION_SETTINGS.stationWhatsAppDigitsOnly}?text=${message}`, '_blank');
  };

  const handleShare = async (partner) => {
    const url = `${window.location.origin}/church-partners?partner=${partner.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'Link copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      // Fallback to Web Share API
      if (navigator.share) {
        navigator.share({
          title: `${partner.pastorName} - ${partner.churchName}`,
          text: `Connect with ${partner.pastorName} from ${partner.churchName} in ${partner.city}, ${partner.country}`,
          url: url,
        });
      }
    }
  };

  const handleAskQuestion = (partner) => {
    setSelectedPartner(partner);
    setShowContactModal(true);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  const ActionButton = ({ onClick, disabled, children, className = "", title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : className
      }`}
    >
      {children}
    </button>
  );

  const ContactModal = ({ isOpen, onClose, partner }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
      partnerRef: partner?.id || '',
      pastorName: partner?.pastorName || '',
      churchName: partner?.churchName || '',
      city: partner?.city || '',
      country: partner?.country || ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API}/contact`, formData);
        alert('Message sent successfully!');
        onClose();
        setFormData({ name: '', email: '', message: '', partnerRef: '', pastorName: '', churchName: '', city: '', country: '' });
      } catch (error) {
        alert('Error sending message. Please try again.');
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contact About {partner?.pastorName}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                placeholder="Your question or message..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-kioo-primary text-white rounded-lg hover:bg-kioo-secondary"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
                    {selectedCountry === 'Guinea' ? 'Liste des églises partenaires bientôt disponible' : 'Partner churches list coming soon'}
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