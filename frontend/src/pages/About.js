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
    { year: '2006', event: 'Vision received in Cape Town while studying Video and Radio Production' },
    { year: '2006+', event: 'Vox Radio established, now reaching 3.2M+ people in 8 counties' },
    { year: '2024', event: 'Broadcasting license approved for Kioo Radio extension' },
    { year: '2024', event: 'Studio construction and equipment installation in Foya' },
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
              Broadcasting hope, faith, and community across the Makona River Region - An extension of God's 2006 vision that started with Vox Radio
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
                The vision to establish Kioo Radio came in 2006 when Joseph Kebbie was in Cape Town studying Video and Radio Production. 
                God placed a burden on his heart: 
                <em className="text-kioo-primary font-semibold"> "Return to Liberia and start a radio station to reach my people."</em> 
                This vision started with Vox Radio, which now broadcasts to over 3.2 million people in 8 counties in Liberia. 
                Kioo Radio is the extension of this calling - a gift of light for the Makona River Region.
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