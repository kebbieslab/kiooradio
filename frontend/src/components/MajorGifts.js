import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MajorGifts = ({ isStandalonePage = false }) => {
  const [activeTab, setActiveTab] = useState('give-now');
  const [showContactModal, setShowContactModal] = useState(false);
  const [settings, setSettings] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maskedFields, setMaskedFields] = useState({});

  // Pledge form state
  const [pledgeForm, setPledgeForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    designation: 'Where most needed',
    pledgeDate: '',
    message: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [majorGiftsRes, paymentRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/major-gifts-settings`),
        axios.get(`${BACKEND_URL}/api/payment-settings`)
      ]);
      
      setSettings(majorGiftsRes.data);
      setPaymentSettings(paymentRes.data);
      
      // Initialize masked fields
      const initialMasked = {};
      if (paymentRes.data?.wire) {
        Object.keys(paymentRes.data.wire).forEach(key => {
          if (key.includes('account') || key.includes('swift') || key.includes('routing')) {
            initialMasked[key] = true;
          }
        });
      }
      setMaskedFields(initialMasked);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/pledges`, pledgeForm);
      
      if (response.data.status === 'success') {
        alert('Thank you for your pledge! We will contact you soon to discuss next steps.');
        
        // Generate calendar file
        generateCalendarFile();
        
        // Reset form
        setPledgeForm({
          name: '',
          email: '',
          phone: '',
          amount: '',
          designation: 'Where most needed',
          pledgeDate: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting pledge:', error);
      alert('There was an error submitting your pledge. Please try again.');
    }
  };

  const generateCalendarFile = () => {
    const event = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kioo Radio//Major Gift Pledge//EN
BEGIN:VEVENT
UID:pledge-${Date.now()}@kiooradio.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(pledgeForm.pledgeDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Kioo Radio Major Gift Pledge - $${pledgeForm.amount}
DESCRIPTION:Major gift pledge for ${pledgeForm.designation}. Contact: ${pledgeForm.email}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([event], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kioo-radio-pledge.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Show toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = `${field} copied to clipboard!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleMask = (field) => {
    setMaskedFields(prev => ({ ...prev, [field]: !prev[field] }));
    
    // Auto-mask after 20 seconds
    if (!maskedFields[field]) {
      setTimeout(() => {
        setMaskedFields(prev => ({ ...prev, [field]: true }));
      }, 20000);
    }
  };

  const formatMaskedValue = (value) => {
    if (!value) return '';
    return '••••' + value.slice(-4);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`${isStandalonePage ? 'py-16' : 'py-8'} bg-gradient-to-br from-kioo-primary to-kioo-secondary`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {isStandalonePage ? 'Partner at a Leadership Level' : 'Major Gifts'}
          </h2>
          <p className="text-xl text-green-100 max-w-4xl mx-auto">
            {isStandalonePage 
              ? "Let's build lasting gospel impact across the Makona River Region together."
              : "Invest in sustainable, 24/7 gospel broadcasting across Liberia, Sierra Leone, and Guinea. Your leadership gift accelerates solar, studios, programming, and youth outreach."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Story & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              
              {/* Investment Priorities (if standalone) */}
              {isStandalonePage && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Investment Priorities</h3>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold">Solar & Power Resilience</h4>
                      <p className="text-sm text-green-100">Ensure 24/7 broadcasting capability</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold">Studio Build-out</h4>
                      <p className="text-sm text-green-100">Professional production facilities</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold">Cross-Border Programming</h4>
                      <p className="text-sm text-green-100">Reach Sierra Leone and Guinea</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold">Youth & Community Outreach</h4>
                      <p className="text-sm text-green-100">Next generation engagement</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-white text-kioo-primary py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  💬 Talk to Us
                </button>
                
                {settings?.calUrl && (
                  <a
                    href={settings.calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-kioo-secondary text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-opacity-90 transition-colors"
                  >
                    📅 Schedule a Call
                  </a>
                )}

                <a
                  href={`https://wa.me/231778383703?text=I'd like to discuss a major gift to Kioo Radio.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-green-600 transition-colors"
                >
                  📱 WhatsApp Us
                </a>
              </div>
            </div>

            {/* Naming Opportunities (if standalone) */}
            {isStandalonePage && settings?.namingOpportunities && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-semibold mb-4">Naming & Recognition</h3>
                <ul className="space-y-2">
                  {settings.namingOpportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span className="text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Action Cards */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('give-now')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'give-now'
                      ? 'bg-kioo-primary text-white'
                      : 'text-gray-600 hover:text-kioo-primary'
                  }`}
                >
                  💳 Give Now
                </button>
                <button
                  onClick={() => setActiveTab('pledge')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'pledge'
                      ? 'bg-kioo-primary text-white'
                      : 'text-gray-600 hover:text-kioo-primary'
                  }`}
                >
                  📋 Pledge a Gift
                </button>
                <button
                  onClick={() => setActiveTab('wire')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'wire'
                      ? 'bg-kioo-primary text-white'
                      : 'text-gray-600 hover:text-kioo-primary'
                  }`}
                >
                  🏦 Bank Transfer
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                
                {/* Give Now Tab */}
                {activeTab === 'give-now' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Make a Leadership Gift</h3>
                    
                    {/* Amount Chips */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {['250', '1000', '5000', '10000'].map(amount => (
                        <button
                          key={amount}
                          className="px-4 py-2 border-2 border-kioo-primary text-kioo-primary rounded-lg hover:bg-kioo-primary hover:text-white transition-colors"
                        >
                          ${amount}
                        </button>
                      ))}
                      <button className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-kioo-primary hover:text-kioo-primary transition-colors">
                        Other Amount
                      </button>
                    </div>

                    {/* Direct Liberia Embed Placeholder */}
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">💳</div>
                      <h4 className="text-xl font-semibold mb-2">Secure Online Donation</h4>
                      <p className="text-gray-600 mb-4">
                        Direct Liberia payment integration will be embedded here
                      </p>
                      {paymentSettings?.directLiberiaFallbackUrl && (
                        <a
                          href={paymentSettings.directLiberiaFallbackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-kioo-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
                        >
                          Open Direct Liberia Checkout
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Pledge Tab */}
                {activeTab === 'pledge' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Make a Pledge</h3>
                    
                    <form onSubmit={handlePledgeSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={pledgeForm.name}
                            onChange={(e) => setPledgeForm({...pledgeForm, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={pledgeForm.email}
                            onChange={(e) => setPledgeForm({...pledgeForm, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            value={pledgeForm.phone}
                            onChange={(e) => setPledgeForm({...pledgeForm, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pledge Amount *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={pledgeForm.amount}
                            onChange={(e) => setPledgeForm({...pledgeForm, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                            placeholder="$"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Designation
                          </label>
                          <select
                            value={pledgeForm.designation}
                            onChange={(e) => setPledgeForm({...pledgeForm, designation: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          >
                            <option value="Where most needed">Where most needed</option>
                            <option value="Solar">Solar & Power</option>
                            <option value="Studios">Studio Build-out</option>
                            <option value="Programming">Cross-Border Programming</option>
                            <option value="Youth Outreach">Youth & Community Outreach</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pledge Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={pledgeForm.pledgeDate}
                            onChange={(e) => setPledgeForm({...pledgeForm, pledgeDate: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          rows={4}
                          value={pledgeForm.message}
                          onChange={(e) => setPledgeForm({...pledgeForm, message: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                          placeholder="Tell us about your heart for this ministry..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-kioo-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
                      >
                        Submit Pledge
                      </button>
                    </form>
                  </div>
                )}

                {/* Wire Transfer Tab */}
                {activeTab === 'wire' && paymentSettings?.wire && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Bank Transfer / Wire Instructions</h3>
                    <p className="text-gray-600 mb-6">
                      International bank fees may apply. Please email your transfer advice so we can confirm.
                    </p>

                    <div className="space-y-4">
                      {Object.entries(paymentSettings.wire).map(([key, value]) => {
                        if (key === 'qrEnabled' || key === 'donorNoteHint') return null;
                        
                        const isSensitive = key.includes('account') || key.includes('swift') || key.includes('routing');
                        const displayValue = isSensitive && maskedFields[key] ? formatMaskedValue(value) : value;
                        
                        return (
                          <div key={key} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </label>
                                <span className="text-lg font-mono">{displayValue}</span>
                              </div>
                              
                              <div className="flex space-x-2">
                                {isSensitive && (
                                  <button
                                    onClick={() => toggleMask(key)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                  >
                                    {maskedFields[key] ? '👁️ Show' : '🔒 Hide'}
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => copyToClipboard(value, key)}
                                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                >
                                  📋 Copy
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {paymentSettings.wire.donorNoteHint && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <p className="text-sm text-yellow-700">
                            <strong>Reference Note:</strong> {paymentSettings.wire.donorNoteHint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Documents (if standalone) */}
        {isStandalonePage && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-white mb-8">Impact Documents</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {settings?.caseForSupportUrl && (
                <a
                  href={settings.caseForSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  📄 Case for Support
                </a>
              )}
              
              {settings?.impactBriefUrl && (
                <a
                  href={settings.impactBriefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  📊 Latest Impact Brief
                </a>
              )}
              
              {settings?.budgetOverviewUrl && (
                <a
                  href={settings.budgetOverviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  💰 Budget Overview
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Contact About Major Gifts</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  placeholder="I'm interested in discussing a major gift to support Kioo Radio's mission..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
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
      )}
    </div>
  );
};

export default MajorGifts;