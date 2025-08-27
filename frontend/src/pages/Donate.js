import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    message: '',
    is_anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const suggestedAmounts = [
    { amount: 25, description: 'One Hour of Broadcasting' },
    { amount: 50, description: 'Daily Equipment Maintenance' },
    { amount: 100, description: 'Weekly Program Sponsorship' },
    { amount: 250, description: 'Monthly Operations Support' },
    { amount: 500, description: 'Generator Fuel for One Month' },
    { amount: 1000, description: 'Equipment Upgrade Fund' }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const amount = customAmount || selectedAmount;
    if (!amount || !formData.donor_name || !formData.donor_email) {
      setSubmitMessage('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const donationData = {
        ...formData,
        amount: parseFloat(amount),
        donation_type: donationType
      };

      await axios.post(`${API}/donations`, donationData);
      setSubmitMessage('Thank you for your donation pledge! We will contact you with payment details.');
      
      // Reset form
      setFormData({
        donor_name: '',
        donor_email: '',
        message: '',
        is_anonymous: false
      });
      setSelectedAmount('');
      setCustomAmount('');
      
    } catch (error) {
      console.error('Error submitting donation:', error);
      setSubmitMessage('There was an error processing your donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAmount = customAmount || selectedAmount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              💖 Support Our Mission
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              <span data-i18n="donateBlurb" className="en-text">
                Your donation helps us continue broadcasting Hope, Faith, and give vital information across the Makona River Region. Every contribution makes a difference in someone's life.
              </span>
              <span data-i18n="donateBlurb" className="fr-text hidden">
                Votre don nous aide à continuer de diffuser la Foi, l'Espérance et des informations essentielles dans la région de la rivière Makona. Chaque contribution change une vie.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Donation Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-kioo-dark mb-6">Make a Donation</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Donation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Donation Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDonationType('one-time')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          donationType === 'one-time'
                            ? 'border-kioo-primary bg-kioo-primary bg-opacity-10 text-kioo-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl mb-1">💝</div>
                        <div className="font-semibold">One-time</div>
                        <div className="text-sm opacity-75">Single donation</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setDonationType('monthly')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          donationType === 'monthly'
                            ? 'border-kioo-primary bg-kioo-primary bg-opacity-10 text-kioo-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl mb-1">🔄</div>
                        <div className="font-semibold">Monthly</div>
                        <div className="text-sm opacity-75">Recurring support</div>
                      </button>
                    </div>
                  </div>

                  {/* Suggested Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Amount (USD)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {suggestedAmounts.map((suggestion) => (
                        <button
                          key={suggestion.amount}
                          type="button"
                          onClick={() => handleAmountSelect(suggestion.amount)}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            selectedAmount === suggestion.amount
                              ? 'border-kioo-primary bg-kioo-primary bg-opacity-10 text-kioo-primary'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-lg">${suggestion.amount}</div>
                          <div className="text-xs opacity-75">{suggestion.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Enter Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="donor_name"
                        value={formData.donor_name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="donor_email"
                        value={formData.donor_email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows="3"
                      placeholder="Share why you're supporting Kioo Radio..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                    />
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_anonymous"
                      name="is_anonymous"
                      checked={formData.is_anonymous}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-kioo-primary focus:ring-kioo-primary border-gray-300 rounded"
                    />
                    <label htmlFor="is_anonymous" className="ml-2 text-sm text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !currentAmount}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : `💖 Donate $${currentAmount}`}
                  </button>

                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${
                      submitMessage.includes('Thank you') 
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Impact of Donation */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">💡 Your Impact</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">🎙️</span>
                    <div className="text-sm">
                      <div className="font-semibold">Broadcasting</div>
                      <div className="text-gray-600">Keeps us on air 24/7</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">🔧</span>
                    <div className="text-sm">
                      <div className="font-semibold">Equipment</div>
                      <div className="text-gray-600">Maintains broadcast quality</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">👥</span>
                    <div className="text-sm">
                      <div className="font-semibold">Programming</div>
                      <div className="text-gray-600">Supports local content creation</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">💳 Payment Methods</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📱</span>
                    <span>Mobile Money (MTN, Orange)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🏦</span>
                    <span>Bank Transfer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💳</span>
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>Cash (Local Offices)</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    📧 After submitting this form, we'll send you secure payment instructions 
                    via email within 24 hours.
                  </p>
                </div>
              </div>

              {/* Contact for Large Donations */}
              <div className="bg-kioo-primary text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">🌟 Major Gift?</h3>
                <p className="text-green-100 text-sm mb-4">
                  For donations over $1,000 or to discuss partnership opportunities, 
                  please contact us directly.
                </p>
                <a
                  href="/contact"
                  className="bg-white text-kioo-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-2xl font-bold text-kioo-dark mb-4">📋 Important Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-semibold text-kioo-primary mb-2">🛡️ Security & Privacy</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your personal information is kept confidential</li>
                  <li>• Secure payment processing</li>
                  <li>• No information shared with third parties</li>
                  <li>• Option to donate anonymously</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-kioo-primary mb-2">📊 Transparency</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Annual financial reports available</li>
                  <li>• Regular updates on fund usage</li>
                  <li>• Impact stories from beneficiaries</li>
                  <li>• Open books policy</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                📧 <strong>Receipt:</strong> You will receive a donation receipt via email for your records. 
                Please consult with a tax professional regarding deductibility in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;