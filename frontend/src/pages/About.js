import React from 'react';

const About = () => {
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

  const milestones = [
    { year: '2024', event: 'Broadcasting license approved by Liberian authorities' },
    { year: '2024', event: 'Studio construction and equipment installation' },
    { year: '2024', event: 'Multi-language programming development begins' },
    { year: '2025', event: 'Official launch scheduled for November 13, 2025' }
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
              Broadcasting hope, faith, and community across the Makona River Region - A testimony of God's calling and His people's prayers
            </p>
          </div>
        </div>
      </section>

      {/* The God-Given Call Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-6">
              ✨ The God-Given Call
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                In Cape Town, during the Lausanne 2010 gathering, God placed a burden on Joseph Kebbie's heart: 
                <em className="text-kioo-primary font-semibold"> "Return to Liberia and start a radio station to reach my people."</em> 
                This calling gave birth to Kioo Radio, a gift of light for the Makona River Region.
              </p>
            </div>
          </div>

          {/* Vimeo Video Embed - Responsive */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
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
            <p className="text-center text-sm text-gray-600 mt-4 italic">
              "A Refugee's Story: Joseph Kebbie" - The testimony of God's calling
            </p>
          </div>
        </div>
      </section>

      {/* The Cry of the People Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kioo-dark mb-6">
              🙏 The Cry of the People
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                Christian leaders across Liberia, Sierra Leone, and Guinea prayed for a station that could bring the Gospel, 
                discipleship, and community programs in the languages of their heart. 
                <strong className="text-kioo-primary"> Kioo Radio is the answer to those prayers.</strong>
              </p>
            </div>
          </div>

          {/* YouTube Video Embed - Responsive */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
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
            <p className="text-center text-sm text-gray-600 mt-4 italic">
              "Christian Leaders Request for a Radio Station" - The prayers of God's people
            </p>
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
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-3">Gospel Teaching</h3>
              <p className="text-green-100">
                Bringing Bible-based teaching and discipleship in local languages across the Makona River Region
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Community Unity</h3>
              <p className="text-green-100">
                Fostering peace, health education, and social development across Liberia, Sierra Leone, and Guinea
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
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
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
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

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📅 Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in God's faithfulness</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="bg-kioo-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <span className="text-sm font-bold">{milestone.year}</span>
                  </div>
                </div>
                <div className="ml-6 flex-grow">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className="text-gray-800">{milestone.event}</p>
                  </div>
                </div>
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
              Broadcasting hope, faith, and community across West Africa with the power of solar energy 
              and the gift of good news that transforms lives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-kioo-dark mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To broadcast the gift of good news across West Africa, bringing hope, faith, 
                education, and community together through the power of radio ministry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">👁️</span>
              </div>
              <h2 className="text-2xl font-bold text-kioo-dark mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A West Africa where every person has access to encouraging, educational, 
                and faith-building content that transforms communities and strengthens families.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-kioo-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💝</span>
              </div>
              <h2 className="text-2xl font-bold text-kioo-dark mb-4">Our Values</h2>
              <p className="text-gray-600 leading-relaxed">
                Faith, integrity, community service, cultural respect, environmental sustainability, 
                and excellence in everything we do for our listeners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📖 Our Story</h2>
            <p className="text-lg text-gray-600">How Kioo Radio came to be</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Kioo Radio was born from a vision to bring hope and practical help to communities across 
                West Africa. In 2024, a group of passionate broadcasters, engineers, and community leaders 
                came together with a shared dream: to create a radio station powered entirely by solar energy 
                that could reach millions with messages of faith, education, and encouragement.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The name "Kioo" means "mirror" in Swahili, reflecting our mission to be a mirror of hope 
                and positivity in our communities. We believe that radio has the unique power to connect 
                hearts across borders, languages, and cultures.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Based in Monrovia, Liberia, our 98.1 FM signal reaches across three nations - Liberia, 
                Sierra Leone, and Guinea - covering over 7 million people within our 150+ mile broadcast radius. 
                Our commitment to solar power ensures we can broadcast 24/7 while maintaining environmental responsibility.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                With programming in English, French, Kissi, and Krio, we serve diverse communities with 
                content that matters: news, music, agricultural updates, health education, youth programs, 
                and spiritual encouragement. Every day, we're privileged to be part of stories of 
                transformation and hope across West Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">📅 Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in building Kioo Radio</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-kioo-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{milestone.year}</span>
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
                  <p className="text-gray-700 font-medium">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">👥 Our Team</h2>
            <p className="text-lg text-gray-600">Meet the people bringing Kioo Radio to life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 bg-kioo-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl">👤</span>
                </div>
                <h3 className="text-lg font-bold text-kioo-dark mb-2">{member.name}</h3>
                <p className="text-kioo-primary font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-2">{member.bio}</p>
                <p className="text-gray-500 text-xs">📍 {member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-16 bg-kioo-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">✝️ Statement of Faith</h2>
            <p className="text-green-100">Our foundational beliefs that guide our ministry</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8">
            <div className="space-y-6 text-green-100">
              <p>
                <strong className="text-white">• The Bible:</strong> We believe the Bible is the inspired, 
                inerrant Word of God and our ultimate authority for faith and practice.
              </p>
              <p>
                <strong className="text-white">• God:</strong> We believe in one God, eternally existing 
                in three persons: Father, Son, and Holy Spirit.
              </p>
              <p>
                <strong className="text-white">• Salvation:</strong> We believe salvation is by grace 
                through faith in Jesus Christ alone, not by works.
              </p>
              <p>
                <strong className="text-white">• The Church:</strong> We believe in the universal church 
                as the body of Christ, called to serve and love our communities.
              </p>
              <p>
                <strong className="text-white">• Ministry:</strong> We believe we are called to serve 
                all people with love, respect, and dignity, regardless of background or beliefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">⚙️ Technical Specifications</h2>
            <p className="text-lg text-gray-600">Our broadcast infrastructure</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">📡</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Broadcast Details</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Frequency: 98.1 FM</li>
                <li>• Power Output: 1000W</li>
                <li>• Coverage: 150+ mile radius</li>
                <li>• Antenna Height: 120 meters</li>
                <li>• Transmitter: Solid State FM</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Solar Power System</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Solar Panel Capacity: 50kW</li>
                <li>• Battery Storage: 200kWh</li>
                <li>• Backup Generator: Diesel</li>
                <li>• Power Efficiency: 95%+</li>
                <li>• Green Energy: 100% Solar</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">🎙️</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Studio Equipment</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Digital Audio Console</li>
                <li>• 4 Studio Microphones</li>
                <li>• Audio Processing Suite</li>
                <li>• Streaming Encoder</li>
                <li>• Backup Recording System</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">🤝 Our Partners</h2>
            <p className="text-lg text-gray-600">Organizations supporting our mission</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400">🏢</span>
              </div>
              <h3 className="font-semibold text-kioo-dark">Local Churches</h3>
              <p className="text-sm text-gray-600">Community partnerships</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400">🏛️</span>
              </div>
              <h3 className="font-semibold text-kioo-dark">Government Agencies</h3>
              <p className="text-sm text-gray-600">Regulatory support</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400">🌍</span>
              </div>
              <h3 className="font-semibold text-kioo-dark">NGOs</h3>
              <p className="text-sm text-gray-600">Development programs</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400">💼</span>
              </div>
              <h3 className="font-semibold text-kioo-dark">Local Businesses</h3>
              <p className="text-sm text-gray-600">Community support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-kioo-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get to Know Us Better</h2>
          <p className="text-green-100 mb-8 text-lg">
            Have questions about our mission, want to visit our studio, or interested in partnerships? 
            We'd love to hear from you!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-kioo-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              📞 Contact Us
            </a>
            <a
              href="/get-involved"
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-kioo-secondary transition-all"
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