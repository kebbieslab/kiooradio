import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitMessage('Thank you! Your message has been sent. We will get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone',
      details: '+231 77 838 3703',
      subtitle: 'Call us 24/7',
      action: 'tel:+2317783837O3'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      details: '+231 77 838 3703',
      subtitle: 'Quick messages',
      action: 'https://wa.me/+2317783837O3'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: 'info@kiooradio.org',
      subtitle: 'Send us an email',
      action: 'mailto:info@kiooradio.org'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'Monrovia, Liberia',
      subtitle: 'Studio location',
      action: '#location'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 8:00 PM' },
    { day: 'Sunday', hours: '7:00 AM - 9:00 PM' },
    { day: 'Emergency', hours: '24/7 WhatsApp Available' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              📞 Get in Touch
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              We're here to listen, help, and connect with you. Whether you have questions, 
              feedback, prayer requests, or want to get involved, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.action}
                className="bg-white rounded-xl shadow-lg p-6 text-center card-hover group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-kioo-dark mb-2">{method.title}</h3>
                <p className="text-kioo-primary font-semibold mb-1">{method.details}</p>
                <p className="text-gray-600 text-sm">{method.subtitle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-kioo-dark mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                        placeholder="+231 77 838 3703"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Program Feedback">Program Feedback</option>
                        <option value="Prayer Request">Prayer Request</option>
                        <option value="Volunteer Opportunity">Volunteer Opportunity</option>
                        <option value="Partnership/Sponsorship">Partnership/Sponsorship</option>
                        <option value="Technical Issues">Technical Issues</option>
                        <option value="Donation Questions">Donation Questions</option>
                        <option value="Studio Visit">Studio Visit Request</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-kioo-primary"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : '📧 Send Message'}
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

            {/* Contact Information Sidebar */}
            <div className="space-y-8">
              
              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">🕐 Office Hours</h3>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">{schedule.day}</span>
                      <span className="text-kioo-primary font-medium text-sm">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-kioo-primary bg-opacity-10 rounded-lg">
                  <p className="text-kioo-primary text-xs">
                    📻 <strong>Broadcasting:</strong> We're on-air 24/7, but office hours are for 
                    administrative matters and studio visits.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+2317783837O3"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xl">📞</span>
                    <div>
                      <div className="font-semibold text-kioo-dark text-sm">Call Now</div>
                      <div className="text-gray-600 text-xs">Speak with our team</div>
                    </div>
                  </a>
                  
                  <a
                    href="https://wa.me/+2317783837O3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xl">💬</span>
                    <div>
                      <div className="font-semibold text-kioo-dark text-sm">WhatsApp</div>
                      <div className="text-gray-600 text-xs">Quick message</div>
                    </div>
                  </a>
                  
                  <a
                    href="/listen-live"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xl">📻</span>
                    <div>
                      <div className="font-semibold text-kioo-dark text-sm">Listen Live</div>
                      <div className="text-gray-600 text-xs">Join our broadcast</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-800 mb-4">🚨 Emergency</h3>
                <p className="text-red-700 text-sm mb-4">
                  For urgent prayer requests or emergency broadcasts, contact us immediately:
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+2317783837O3"
                    className="block bg-red-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    📞 Emergency Line
                  </a>
                  <a
                    href="https://wa.me/+2317783837O3?text=EMERGENCY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-green-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    💬 Emergency WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Directions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📍 Visit Our Studio</h2>
            <p className="text-lg text-gray-600">Come see us in person and experience radio in action</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Location Info */}
            <div>
              <div className="bg-gray-100 rounded-xl p-8 h-64 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-600">Interactive map coming soon</p>
                  <p className="text-kioo-primary font-semibold">Kioo Radio Studio</p>
                  <p className="text-gray-600 text-sm">Monrovia, Liberia</p>
                </div>
              </div>
              
              <div className="bg-kioo-primary text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">🚗 Getting Here</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li>• Located in central Monrovia</li>
                  <li>• Accessible by public transportation</li>
                  <li>• Parking available on-site</li>
                  <li>• Look for our distinctive radio tower</li>
                  <li>• Call ahead for studio tours</li>
                </ul>
              </div>
            </div>

            {/* Studio Visit Info */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">🏢 Studio Tours</h3>
                <p className="text-gray-600 mb-4">
                  We welcome visitors to see how radio magic happens! Our guided tours include:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Behind-the-scenes look at our studios</li>
                  <li>• Meet our radio hosts and team</li>
                  <li>• See our solar power system</li>
                  <li>• Learn about radio broadcasting</li>
                  <li>• Q&A session with staff</li>
                </ul>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    📅 <strong>Tours available:</strong> Monday-Friday, 10 AM - 4 PM
                    <br />Please call 24 hours in advance to schedule.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-kioo-dark mb-4">📍 Address & Directions</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <span>🏢</span>
                    <div>
                      <div className="font-semibold">Kioo Radio 98.1 FM</div>
                      <div className="text-gray-600">Central Broadcasting District</div>
                      <div className="text-gray-600">Monrovia, Montserrado County</div>
                      <div className="text-gray-600">Liberia, West Africa</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span>📫</span>
                    <div>
                      <div className="font-semibold">Mailing Address</div>
                      <div className="text-gray-600">P.O. Box 1234</div>
                      <div className="text-gray-600">Monrovia 10001, Liberia</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span>🚌</span>
                    <div>
                      <div className="font-semibold">Public Transport</div>
                      <div className="text-gray-600">Bus routes 15, 23, 45</div>
                      <div className="text-gray-600">5-minute walk from Unity Station</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">❓ Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-kioo-dark mb-2">What are your broadcast hours?</h3>
              <p className="text-gray-600 text-sm">We broadcast 24 hours a day, 7 days a week on 98.1 FM and online.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-kioo-dark mb-2">How can I request a song or dedication?</h3>
              <p className="text-gray-600 text-sm">Call us during live shows, send a WhatsApp message, or fill out our contact form above.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibent text-kioo-dark mb-2">Can I advertise on Kioo Radio?</h3>
              <p className="text-gray-600 text-sm">Yes! We offer various advertising packages. Contact us to discuss rates and availability.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-kioo-dark mb-2">How do I report technical issues?</h3>
              <p className="text-gray-600 text-sm">Use the "Technical Issues" subject in the contact form above, or call our technical support line.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;