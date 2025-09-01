import React, { useState, useEffect } from 'react';

const About = () => {
  const [aboutSettings, setAboutSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch About page settings
  useEffect(() => {
    const fetchAboutSettings = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/about-page-settings`);
        if (response.ok) {
          const data = await response.json();
          setAboutSettings(data);
        }
      } catch (error) {
        console.error('Error fetching about settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSettings();
  }, []);

  const teamMembers = [
    {
      name: 'Rev. Samuel Johnson',
      role: 'Station Manager & Lead Pastor',
      bio: 'Over 15 years of radio ministry experience across West Africa',
      location: 'Betche Hill, Foya, Lofa County, Liberia'
    },
    {
      name: 'Sarah Williams',
      role: 'Program Director',
      bio: 'Multilingual broadcaster specializing in community programming',
      location: 'Gbarnga, Liberia'
    },
    {
      name: 'Emmanuel Koroma',
      role: 'Technical Director',
      bio: 'Broadcasting engineering specialist',
      location: 'Freetown, Sierra Leone'
    },
    {
      name: 'Marie Camara',
      role: 'Community Outreach Coordinator',
      bio: 'Connecting listeners across Guinea and building relationships',
      location: 'Conakry, Guinea'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              ℹ️ About Kioo Radio
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Broadcasting hope, faith, and community across the Makona River Region - An extension of God's 2006 vision that started with Vox Radio
            </p>
          </div>
        </div>
      </section>

      {/* The God-Given Call Section with Videos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-6">
              ✨ The God-Given Call
            </h2>
            <div className="max-w-4xl mx-auto text-left">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 mt-2">
                The vision to establish Kioo Radio came in 2005 when Joseph Kebbie was at Media Village, a media school of YWMA in Cape Town. 
                God placed a burden on his heart: 
                <em className="text-kioo-primary font-semibold"> "Return to Liberia and start a radio station to reach my people."</em> 
                Originally, God wanted us to start with the Kissi radio station, but He led us to establish Vox Radio first in 2017 in a shipping container. 
                Vox Radio now serves over 3.2 million people across 8 counties in Liberia with grant support from Elmer H. Schmidt Christian Broadcasting Fund. 
                Kioo Radio is the fulfillment of God's original vision - a gift of light for the Makona River Region.
              </p>
            </div>
          </div>

          {/* Videos Side by Side */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Vimeo Video */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
                  <iframe 
                    src="https://player.vimeo.com/video/222424083?badge=0&autopause=0&player_id=0&app_id=58479"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                    title="A Refugee's Story: Joseph Kebbie"
                  ></iframe>
                </div>
              </div>
              <div className="p-6">
                <p className="text-center text-sm text-gray-600 italic">
                  "A Refugee's Story: Joseph Kebbie" - The testimony of God's calling
                </p>
              </div>
            </div>

            {/* YouTube Video */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative" style={{paddingBottom: '56.25%', height: 0}}>
                  <iframe 
                    src="https://www.youtube.com/embed/E32TvugxsWs?si=F_FirykTExa69MXl"
                    title="Christian Leaders Request for a Radio Station"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                  ></iframe>
                </div>
              </div>
              <div className="p-6">
                <p className="text-center text-sm text-gray-600 italic">
                  "Christian Leaders Request for a Radio Station" - The prayers of God's people
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Vision to Launch Timeline - Moved directly after videos */}
      {!loading && aboutSettings && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-kioo-dark mb-4">
                🚀 {aboutSettings.timelineTitle}
              </h2>
              <p className="text-xl text-gray-600">The journey from divine vision to radio reality</p>
            </div>

            <div className="space-y-8">
              {aboutSettings.timelineItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="bg-kioo-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <span className="text-sm font-bold">{item.year}</span>
                    </div>
                  </div>
                  <div className="ml-6 flex-grow">
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-kioo-primary">
                      <p className="text-gray-800">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vision Documents Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">
              📄 Vision Documents
            </h2>
            <p className="text-xl text-gray-600">Historical documents and project proposals</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Radio Project Presentation Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-kioo-dark mb-2">Radio Project Presentation</h3>
                <p className="text-gray-600 mb-4">Click to download the original PowerPoint.</p>
              </div>
              
              <div className="p-6">
                <a 
                  href="/assets/docs/Radio Project11.ppt"
                  download
                  className="block group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src="/assets/images/radioproject11.jpg"
                      alt="Radio Project Presentation Thumbnail"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-kioo-primary text-white px-4 py-2 rounded-lg font-semibold">
                        📥 Download PPT
                      </div>
                    </div>
                  </div>
                </a>
                
                <div className="text-center">
                  <a 
                    href="/assets/docs/Radio Project11.ppt"
                    download
                    className="inline-flex items-center text-kioo-primary hover:text-kioo-secondary font-medium text-lg"
                  >
                    📥 Download PowerPoint ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Maru Radio Proposal PDF Viewer */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-kioo-dark mb-2">Maru Radio Proposal</h3>
                <p className="text-gray-600">Detailed project proposal and implementation plan</p>
              </div>
              
              <div className="relative">
                <iframe
                  src="/assets/docs/maru_radio_proposal.PDF"
                  width="100%"
                  style={{ height: '70vh', minHeight: '500px' }}
                  className="border-0"
                  title="Maru Radio Proposal (PDF viewer)"
                  tabIndex="0"
                  aria-label="Maru Radio Proposal PDF viewer with zoom and navigation controls"
                ></iframe>
              </div>
              
              <div className="p-6 bg-gray-50 border-t">
                <div className="text-center">
                  <a 
                    href="/assets/docs/maru_radio_proposal.PDF"
                    download
                    className="inline-flex items-center bg-kioo-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
                  >
                    📥 Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-kioo-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            📻 Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-3">Gospel Teaching</h3>
              <p className="text-green-100">
                Bringing Bible-based teaching and discipleship in local languages across the Makona River Region
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Community Unity</h3>
              <p className="text-green-100">
                Fostering peace, health education, and social development across Liberia, Sierra Leone, and Guinea
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold mb-3">Multilingual Ministry</h3>
              <p className="text-green-100">
                Broadcasting in Kissi, English, French, Mandingo, Fula, and Gbandi to reach every heart
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">👥 Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated servants called to serve the Makona River Region with excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-kioo-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-kioo-dark mb-2">{member.name}</h3>
                <p className="text-kioo-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-2">{member.bio}</p>
                <p className="text-xs text-gray-500">{member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kioo-secondary text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">🌟 Join God's Work</h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Be part of this testimony. Support Kioo Radio as we answer God's call to reach the Makona River Region with His love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/donate" 
              className="bg-white text-kioo-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              💖 Support Our Mission
            </a>
            <a 
              href="/get-involved" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-secondary transition-colors"
            >
              🤝 Get Involved
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;