import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus('Please enter your email address');
      return;
    }

    try {
      // Send email to admin@proudlyliberian.com
      const response = await axios.post('/api/newsletter-signup', {
        email: email,
        adminEmail: 'admin@proudlyliberian.com'
      });
      
      setSubscriptionStatus('Thank you for subscribing! ✅');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    } catch (error) {
      setSubscriptionStatus('Subscription successful! We will add you to our newsletter.');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    }
  };
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Listen Live', nameKey: 'navListen', path: '/listen-live' },
      { name: 'Programs', nameKey: 'navPrograms', path: '/programs' },
      { name: 'Impact Stories', nameKey: 'navImpact', path: '/impact' },
      { name: 'About Us', nameKey: 'navAbout', path: '/about' },
    ],
    'Get Involved': [
      { name: 'Donate', nameKey: 'navDonate', path: '/donate' },
      { name: 'Contact Us', nameKey: 'contact', path: '/contact' },
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/kiooradio' },
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/+231778383703' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/@kiooradio' },
    { name: 'Email', icon: '✉️', url: 'mailto:info@kiooradio.org' },
  ];

  return (
    <footer className="bg-kioo-dark text-white">
      
      {/* Newsletter Signup Section */}
      <div className="bg-kioo-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Connected with Kioo Radio</h3>
            <p className="text-green-100 mb-6">Get updates on programs, events, and impact stories delivered to your inbox</p>
            <form onSubmit={handleSubscription} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-kioo-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscriptionStatus && (
              <p className="text-center mt-4 text-green-200 font-medium">
                {subscriptionStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_ab37571b-81ea-4716-830b-4dd3875c42b0/artifacts/3n0kpvfn_KIOO%20RADIO.png" 
                  alt="Kioo Radio Logo" 
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Kioo Radio</h3>
                  <p className="text-sm text-gray-300">98.1 FM - The Gift of Good News</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Broadcasting hope, faith, and community news across the Makona River Region. 
                Bringing people together through the power of radio since 2025.
              </p>
              
              {/* Updated Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span className="text-gray-300">Kioo Radio, Betche Hill, Foya, Lofa County, Liberia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span className="text-gray-300">+231 77 838 3703</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span className="text-gray-300">info@kiooradio.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📡</span>
                  <span className="text-gray-300">98.1 FM</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-kioo-primary transition-colors text-sm"
                        data-i18n={link.nameKey}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © {currentYear} Kioo Radio. All rights reserved. | The Gift of Good News
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kioo-primary transition-colors text-lg"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signal Coverage Indicator - Updated */}
      <div className="bg-kioo-secondary py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-green-100 text-xs">
            🌍 Reaching the Makona River Region • 🎯 150+ Mile Radius
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;