import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';

const Launch = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [formData, setFormData] = useState({
    fullName: '',
    arrivalDate: '',
    arrivalTime: '',
    airline: '',
    flightNumber: '',
    departureDate: '',
    departureTime: '',
    specialNeeds: '',
    openToMinistry: 'no',
    email: '',
    phone: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { t } = useTranslation();

  const tabs = [
    { id: 'welcome', label: 'Welcome & Overview', icon: '🏠' },
    { id: 'travel', label: 'Travel & Visa', icon: '✈️' },
    { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { id: 'schedule', label: 'Schedule & Activities', icon: '📅' },
    { id: 'logistics', label: 'Road to Foya', icon: '🚗' },
    { id: 'safety', label: 'Safety & Emergency', icon: '🆘' },
    { id: 'form', label: 'Registration Form', icon: '📝' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the form data for submission
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString()
    };

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `🎉 KIOO RADIO LAUNCH - GUEST REGISTRATION\n\n` +
      `Name: ${formData.fullName}\n` +
      `Arrival: ${formData.arrivalDate} at ${formData.arrivalTime}\n` +
      `Flight: ${formData.airline} ${formData.flightNumber}\n` +
      `Departure: ${formData.departureDate} at ${formData.departureTime}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Special Needs: ${formData.specialNeeds || 'None'}\n` +
      `Open to Ministry: ${formData.openToMinistry}\n\n` +
      `Submitted via kiooradio.org/launch`
    );

    // Open WhatsApp
    window.open(`https://wa.me/17197268610?text=${whatsappMessage}`, '_blank');

    // Create email with pre-filled data
    const emailSubject = encodeURIComponent('Kioo Radio Launch - Guest Registration');
    const emailBody = encodeURIComponent(
      `Dear Joseph,\n\nPlease find my registration details for the Kioo Radio Launch event below:\n\n` +
      `Full Name: ${formData.fullName}\n` +
      `Arrival Date & Time: ${formData.arrivalDate} at ${formData.arrivalTime}\n` +
      `Airline & Flight Number: ${formData.airline} ${formData.flightNumber}\n` +
      `Departure Date & Time: ${formData.departureDate} at ${formData.departureTime}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Special Needs: ${formData.specialNeeds || 'None'}\n` +
      `Open to Ministry: ${formData.openToMinistry}\n\n` +
      `Thank you for organizing this wonderful event.\n\nBlessings,\n${formData.fullName}`
    );

    // Open email client
    window.open(`mailto:admin@proudlyliberian.com?subject=${emailSubject}&body=${emailBody}`, '_blank');

    setFormSubmitted(true);
  };

  const downloadPDF = () => {
    // For now, we'll show an alert. In a full implementation, you'd generate a PDF
    alert('PDF download will be available soon. Please bookmark this page for offline access.');
  };

  const renderWelcomeTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-kioo-primary to-green-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🎉 Welcome to the Kioo Radio Launch!</h2>
        <p className="text-lg leading-relaxed">
          Dear beloved guests, we are thrilled to welcome you to this historic moment as we dedicate Kioo Radio 98.1FM 
          to serve the Makona River Region with faith, hope, and love. Your presence makes this celebration complete.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📅 Key Dates Overview</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl">🛬</div>
            <div>
              <h4 className="font-semibold text-blue-800">November 10 - Arrivals</h4>
              <p className="text-blue-700">International guests arrive in Monrovia via Roberts International Airport</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="text-2xl">📻</div>
            <div>
              <h4 className="font-semibold text-green-800">November 11 - Orientation</h4>
              <p className="text-green-700">Welcome orientation + optional visit to Vox Radio station</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl">🚗</div>
            <div>
              <h4 className="font-semibold text-orange-800">November 12 - Journey to Foya</h4>
              <p className="text-orange-700">Early morning convoy departure from Monrovia to Foya (450km journey)</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl">🙏</div>
            <div>
              <h4 className="font-semibold text-purple-800">November 13 - Dedication Ceremony</h4>
              <p className="text-purple-700">Official dedication ceremony at Betche Hill - the heart of our celebration!</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-teal-50 rounded-lg">
            <div className="text-2xl">❤️</div>
            <div>
              <h4 className="font-semibold text-teal-800">November 14 - Community Outreach</h4>
              <p className="text-teal-700">Evangelism outreach, Unity Prayer at Makona River, Soccer Tournament</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl">🎵</div>
            <div>
              <h4 className="font-semibold text-pink-800">November 15 - Gospel Concert</h4>
              <p className="text-pink-700">Celebration through music and worship with local and visiting artists</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl">⛪</div>
            <div>
              <h4 className="font-semibold text-indigo-800">November 16 - Farewell Service</h4>
              <p className="text-indigo-700">Morning church service in Foya, followed by departures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTravelTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">✈️ Airport & Entry</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">🛬</div>
            <div>
              <h4 className="font-semibold">Roberts International Airport (ROB)</h4>
              <p className="text-gray-600">Primary entry point for all international guests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Visa Requirements</h3>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Recommended: e-Visa</h4>
            <p className="text-green-700 mb-3">Apply online and print your approval letter</p>
            <div className="space-y-2">
              <a 
                href="https://www.evisaliberia.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-green-600 text-white px-4 py-2 rounded text-center hover:bg-green-700 transition-colors"
              >
                Official Liberia eVisa Portal
              </a>
              <a 
                href="https://www.mfa.gov.lr/visa-information" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-green-100 text-green-800 px-4 py-2 rounded text-center border border-green-300 hover:bg-green-200 transition-colors"
              >
                Government eVisa Info Page
              </a>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🏛️ Alternative Options</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Visa on Arrival (print e-visa approval)</li>
              <li>• Embassy applications (still accepted)</li>
              <li>• 3-year multiple-entry visa for U.S. citizens (USD $180)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏥 Health Requirements</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-800">Required: Yellow Fever Vaccination</h4>
              <p className="text-yellow-700">Must present vaccination card at entry</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-blue-600 text-xl">💊</div>
            <div>
              <h4 className="font-semibold text-blue-800">Strongly Advised: Malaria Prophylaxis</h4>
              <p className="text-blue-700">Consult your doctor for appropriate medication</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Money & Communication</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">💵 Currency</h4>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• Bring USD cash in small bills</li>
              <li>• Liberia is a cash-heavy economy</li>
              <li>• Credit cards rarely accepted outside Monrovia</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">📱 SIM Cards</h4>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Orange Liberia (RIA airport shop)</li>
              <li>• Lonestar/MTN (in Monrovia)</li>
              <li>• Limited coverage in rural areas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccommodationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏨 Monrovia Accommodation</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">ELWA/SIM Compound</h4>
          <p className="text-blue-700">All international guests will stay at the ELWA/SIM Compound until departure for Foya. This is a well-established missionary compound with proper facilities and security.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏠 Foya Accommodation</h3>
        <div className="space-y-4">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-2">👩 Women's Accommodation</h4>
            <p className="text-pink-700">We are making arrangements for a guesthouse specifically for our female guests to ensure comfort and privacy.</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">👨 Men's Accommodation</h4>
            <p className="text-blue-700">Male guests will be in group lodging arrangements. Rooms will be shared with fellow guests.</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Note</h4>
            <p className="text-yellow-700">Foya is a remote location. Please do not expect the same amenities as in Monrovia. Basic but clean accommodations will be provided.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎒 What to Bring</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Essential Items:</h4>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Mosquito net (recommended)</li>
              <li>• Insect repellent</li>
              <li>• Flashlight/headlamp</li>
              <li>• Hand sanitizer</li>
              <li>• Personal medications</li>
              <li>• Sunscreen</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Clothing:</h4>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Lightweight, breathable fabrics</li>
              <li>• Long sleeves for evenings</li>
              <li>• Comfortable walking shoes</li>
              <li>• Formal attire for ceremony</li>
              <li>• Rain jacket (rainy season)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">📅 Complete Schedule</h2>
        <p className="text-lg">November 10-16, 2025 | Kioo Radio Launch Week</p>
      </div>

      <div className="space-y-4">
        {/* November 10 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🛬 Sunday, November 10 - Arrivals</h3>
          <div className="space-y-2 text-gray-700">
            <p>• International guests arrive at Roberts International Airport (ROB)</p>
            <p>• Transportation to ELWA/SIM Compound</p>
            <p>• Welcome dinner and rest</p>
            <p>• Briefing about the week ahead</p>
          </div>
        </div>

        {/* November 11 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-800 mb-3">📻 Monday, November 11 - Orientation</h3>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>Morning:</strong> Welcome orientation and cultural briefing</p>
            <p>• <strong>Afternoon:</strong> Optional visit to Vox Radio station</p>
            <p>• Meet the Kioo Radio team</p>
            <p>• Final preparations for Foya journey</p>
            <p>• Early dinner and rest (early departure tomorrow)</p>
          </div>
        </div>

        {/* November 12 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">🚗 Tuesday, November 12 - Journey to Foya</h3>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>5:30 AM:</strong> Convoy departs ELWA/SIM Compound</p>
            <p>• <strong>Route:</strong> Monrovia → Gbarnga → Zorzor → Voinjama → Foya</p>
            <p>• <strong>Distance:</strong> ~450km (6-10 hours depending on conditions)</p>
            <p>• Regular stops for rest and meals</p>
            <p>• <strong>Evening:</strong> Arrival in Foya, check-in, dinner</p>
          </div>
        </div>

        {/* November 13 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">🙏 Wednesday, November 13 - DEDICATION CEREMONY</h3>
          <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-3">
            <p className="text-purple-800 font-semibold">🎉 THE MAIN EVENT - Betche Hill</p>
          </div>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>Morning:</strong> Final preparations and setup</p>
            <p>• <strong>Ceremony:</strong> Official dedication of Kioo Radio 98.1FM</p>
            <p>• Speeches from dignitaries and partners</p>
            <p>• Blessing and commissioning of the station</p>
            <p>• <strong>Evening:</strong> Celebration feast</p>
          </div>
        </div>

        {/* November 14 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
          <h3 className="text-lg font-semibold text-teal-800 mb-3">❤️ Thursday, November 14 - Community Outreach</h3>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>Morning:</strong> Evangelism outreach in local communities</p>
            <p>• <strong>Midday:</strong> Unity Prayer gathering at the Makona River</p>
            <p>• <strong>Afternoon:</strong> Community Soccer Tournament</p>
            <p>• Fellowship with local church leaders</p>
            <p>• <strong>Evening:</strong> Community dinner</p>
          </div>
        </div>

        {/* November 15 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
          <h3 className="text-lg font-semibold text-pink-800 mb-3">🎵 Friday, November 15 - Gospel Music Concert</h3>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>Afternoon:</strong> Sound check and rehearsals</p>
            <p>• <strong>Evening:</strong> Grand Gospel Music Concert</p>
            <p>• Local and visiting artists performing</p>
            <p>• Celebration of faith through music</p>
            <p>• Late evening fellowship</p>
          </div>
        </div>

        {/* November 16 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">⛪ Saturday, November 16 - Farewell</h3>
          <div className="space-y-2 text-gray-700">
            <p>• <strong>Morning:</strong> Church service in Foya</p>
            <p>• Final testimonies and blessings</p>
            <p>• <strong>After Service:</strong> Departures begin</p>
            <p>• Convoy returns to Monrovia for airport transfers</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogisticsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🚗 The Road to Foya</h2>
        <p className="text-lg">Your journey into the heart of the Makona River Region</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">⏰ Departure Details</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-red-800 mb-2">🚨 Early Start Required</h4>
          <p className="text-red-700"><strong>Departure Time:</strong> 5:30 AM sharp from ELWA/SIM Compound</p>
          <p className="text-red-700 text-sm mt-1">Please be ready by 5:15 AM - the convoy cannot wait for late arrivals</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🗺️ Route Information</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📍 Journey Overview</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• <strong>Total Distance:</strong> Approximately 450 kilometers</li>
              <li>• <strong>Estimated Time:</strong> 6-10 hours (depending on road conditions and weather)</li>
              <li>• <strong>Vehicle Type:</strong> 4x4 convoy with experienced local drivers</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🛣️ Convoy Route & Stops</h4>
            <div className="space-y-2 text-green-700">
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-green-200 px-2 py-1 rounded text-xs">START</span>
                <span>Monrovia (ELWA/SIM Compound)</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500">↓</span>
                <span className="text-sm">~2 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-blue-200 px-2 py-1 rounded text-xs">STOP</span>
                <span>Gbarnga (Rest & Fuel)</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500">↓</span>
                <span className="text-sm">~2 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-blue-200 px-2 py-1 rounded text-xs">STOP</span>
                <span>Zorzor (Lunch Break)</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500">↓</span>
                <span className="text-sm">~1.5 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-blue-200 px-2 py-1 rounded text-xs">STOP</span>
                <span>Voinjama (Final Rest)</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-green-500">↓</span>
                <span className="text-sm">~1.5 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-red-200 px-2 py-1 rounded text-xs">END</span>
                <span>Foya (Destination)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎒 Travel Preparations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">🥤 For the Journey</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Plenty of water</li>
              <li>• Light snacks</li>
              <li>• Motion sickness medication (if needed)</li>
              <li>• Comfortable clothing</li>
              <li>• Pillow for rest</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">📱 Stay Connected</h4>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Fully charged phone</li>
              <li>• Portable battery pack</li>
              <li>• Download offline maps</li>
              <li>• Emergency contact numbers</li>
              <li>• WhatsApp for convoy updates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🌧️ Weather & Road Conditions</h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">⚠️ Important Notes</h4>
          <ul className="text-orange-700 space-y-1">
            <li>• Road conditions can vary significantly with weather</li>
            <li>• Rainy season may affect travel time</li>
            <li>• 4x4 vehicles are essential for the final stretches</li>
            <li>• Our experienced drivers know these roads well</li>
            <li>• Flexibility with timing is appreciated</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSafetyTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🆘 Safety & Emergency Information</h2>
        <p className="text-lg">Your safety is our top priority during this incredible journey</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Key Contact Leads</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🏨 Monrovia Logistics Lead</h4>
            <p className="text-blue-700">Responsible for Monrovia accommodation and city coordination</p>
            <p className="text-blue-600 text-sm">Contact details will be provided upon arrival</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🚗 Convoy Lead</h4>
            <p className="text-green-700">Leads the convoy to Foya and manages travel logistics</p>
            <p className="text-green-600 text-sm">Contact details will be provided before departure</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">🏠 Foya Guesthouse Contact</h4>
            <p className="text-purple-700">Manages accommodation arrangements in Foya</p>
            <p className="text-purple-600 text-sm">Contact details will be provided upon arrival in Foya</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Primary Emergency Contact</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <h4 className="font-bold text-red-800 text-lg mb-2">Joseph Kebbie</h4>
            <p className="text-red-700 mb-4">Event Coordinator & Emergency Contact</p>
            <div className="space-y-2">
              <a 
                href="mailto:admin@proudlyliberian.com"
                className="block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                📧 admin@proudlyliberian.com
              </a>
              <a 
                href="https://wa.me/17197268610"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                📱 WhatsApp: +1 719 726 8610
              </a>
            </div>
            <p className="text-red-600 text-sm mt-3">Available 24/7 during the event period</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🛡️ Safety Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 text-sm mb-1">✅ DO</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Stay with the group at all times</li>
                <li>• Follow convoy leader instructions</li>
                <li>• Keep emergency contacts handy</li>
                <li>• Inform leaders of any health issues</li>
                <li>• Drink plenty of bottled water</li>
                <li>• Use insect repellent regularly</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-semibold text-red-800 text-sm mb-1">❌ DON'T</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Wander off alone</li>
                <li>• Drink tap water</li>
                <li>• Ignore health precautions</li>
                <li>• Miss convoy departure times</li>
                <li>• Bring valuable items unnecessarily</li>
                <li>• Disregard local customs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏥 Health & Medical</h3>
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💊 Medical Preparations</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Bring all personal medications with extras</li>
              <li>• Pack a basic first aid kit</li>
              <li>• Include anti-diarrheal medication</li>
              <li>• Consider altitude sickness medication</li>
              <li>• Have your travel insurance information ready</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🚨 Emergency Procedures</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Immediately notify the convoy leader of any emergency</li>
              <li>• Contact Joseph Kebbie for serious situations</li>
              <li>• Keep medical information card with you</li>
              <li>• Know the location of nearest medical facilities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🌍 Cultural Sensitivity</h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🤝 Respectful Interaction</h4>
          <ul className="text-purple-700 space-y-1 text-sm">
            <li>• Respect local customs and traditions</li>
            <li>• Dress modestly, especially during religious events</li>
            <li>• Ask permission before taking photos of people</li>
            <li>• Be patient with different ways of doing things</li>
            <li>• Show appreciation for local hospitality</li>
            <li>• Learn basic greetings in local languages</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderFormTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">📝 Arrival & Departure Registration</h2>
        <p className="text-lg">Please complete this form to help us prepare for your visit</p>
      </div>

      {formSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">Registration Submitted!</h3>
          <p className="text-green-700 mb-4">
            Thank you for registering! Your information has been sent to our coordination team.
          </p>
          <p className="text-green-600 text-sm">
            You should receive a confirmation shortly via email or WhatsApp.
          </p>
          <button
            onClick={() => setFormSubmitted(false)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit Another Registration
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-4">✈️ Arrival Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Airline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.airline}
                    onChange={(e) => setFormData({...formData, airline: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                    placeholder="e.g., Delta, United, Brussels Airlines"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({...formData, flightNumber: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                    placeholder="e.g., DL123, UA456"
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-4">🛫 Departure Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Needs (Dietary, Medical, etc.)
              </label>
              <textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                placeholder="Please describe any dietary restrictions, medical needs, accessibility requirements, etc."
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are you open to ministering in a local church during your stay?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="openToMinistry"
                    value="yes"
                    checked={formData.openToMinistry === 'yes'}
                    onChange={(e) => setFormData({...formData, openToMinistry: e.target.value})}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Yes, I'm open to ministry opportunities</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="openToMinistry"
                    value="no"
                    checked={formData.openToMinistry === 'no'}
                    onChange={(e) => setFormData({...formData, openToMinistry: e.target.value})}
                    className="mr-2"
                  />
                  <span className="text-gray-700">No, I prefer to participate as a guest</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📞 Submission Process</h4>
              <p className="text-gray-600 text-sm mb-3">
                When you submit this form, it will automatically open both WhatsApp and your email client 
                with your information pre-filled. This ensures we receive your registration through multiple channels.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Your information will be sent to:</strong><br/>
                📧 admin@proudlyliberian.com<br/>
                📱 WhatsApp: +1 719 726 8610
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-kioo-primary to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-kioo-primary/90 hover:to-green-600/90 transition-all duration-200 transform hover:scale-105"
            >
              🚀 Submit Registration
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-kioo-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                🎉 Kioo Radio Launch Guest Guide
              </h1>
              <p className="text-xl opacity-90">
                November 10-16, 2025 | Foya, Liberia
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={downloadPDF}
                className="bg-white text-kioo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <span>📄</span>
                <span>Download PDF Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-kioo-primary text-kioo-primary bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'welcome' && renderWelcomeTab()}
        {activeTab === 'travel' && renderTravelTab()}
        {activeTab === 'accommodation' && renderAccommodationTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'logistics' && renderLogisticsTab()}
        {activeTab === 'safety' && renderSafetyTab()}
        {activeTab === 'form' && renderFormTab()}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">🤝 Questions or Need Help?</h3>
            <div className="space-y-2">
              <a 
                href="mailto:admin@proudlyliberian.com"
                className="block text-blue-300 hover:text-blue-200"
              >
                📧 admin@proudlyliberian.com
              </a>
              <a 
                href="https://wa.me/17197268610"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-300 hover:text-green-200"
              >
                📱 WhatsApp: +1 719 726 8610
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400">
              © 2025 Kioo Radio 98.1FM | Reaching Hearts across the Makona River Region
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launch;