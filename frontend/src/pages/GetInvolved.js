import React from 'react';
import { Link } from 'react-router-dom';

const GetInvolved = () => {
  const involvementOptions = [
    {
      icon: '🙏',
      title: 'Pray for Us',
      description: 'Support our mission through prayer and spiritual partnership',
      details: [
        'Pray for our broadcast reach and impact',
        'Support our technical team and equipment',
        'Pray for wisdom for our programming decisions',
        'Intercede for listeners across West Africa',
        'Pray for continued solar power sustainability'
      ],
      action: 'Join Prayer Team',
      actionLink: '/contact'
    },
    {
      icon: '🤝',
      title: 'Volunteer with Us',
      description: 'Use your skills and talents to help build our radio ministry',
      details: [
        'On-air hosts and program presenters',
        'Technical support and engineering',
        'Content creation and program development',
        'Community outreach and events',
        'Translation services (French, Kissi, Krio)',
        'Administrative and office support'
      ],
      action: 'Apply to Volunteer',
      actionLink: '/contact'
    },
    {
      icon: '💼',
      title: 'Partner with Us',
      description: 'Build strategic partnerships for greater community impact',
      details: [
        'Local business sponsorship opportunities',
        'Community organization collaborations',
        'Educational institution partnerships',
        'Health and agriculture program partnerships',
        'Technology and equipment partnerships',
        'Content sharing agreements'
      ],
      action: 'Explore Partnership',
      actionLink: '/contact'
    }
  ];

  const volunteerRoles = [
    {
      role: 'Radio Host',
      commitment: 'Part-time',
      requirements: 'Strong voice, community knowledge, bilingual preferred',
      icon: '🎙️'
    },
    {
      role: 'Technical Support',
      commitment: 'Flexible',
      requirements: 'Electronics knowledge, problem-solving skills',
      icon: '🔧'
    },
    {
      role: 'Content Creator',
      commitment: 'Project-based',
      requirements: 'Writing skills, cultural understanding, creativity',
      icon: '✍️'
    },
    {
      role: 'Community Outreach',
      commitment: 'Part-time',
      requirements: 'Local connections, communication skills, transportation',
      icon: '🚶'
    },
    {
      role: 'Translator',
      commitment: 'Flexible',
      requirements: 'Fluency in local languages, accuracy, attention to detail',
      icon: '🌐'
    },
    {
      role: 'Event Coordinator',
      commitment: 'Seasonal',
      requirements: 'Organization skills, event planning experience',
      icon: '🎉'
    }
  ];

  const prayerPoints = [
    {
      category: 'Technical Operations',
      points: [
        'Reliable solar power system performance',
        'Equipment longevity and proper functioning',
        'Clear signal transmission across all coverage areas',
        'Backup systems during maintenance periods'
      ]
    },
    {
      category: 'Programming & Content',
      points: [
        'Wisdom for content that truly serves our communities',
        'Talented hosts who connect with listeners',
        'Relevant and timely programming decisions',
        'Balance between entertainment and education'
      ]
    },
    {
      category: 'Community Impact',
      points: [
        'Hearts and minds opened to positive messages',
        'Transformation in individuals and families',
        'Strengthened community relationships',
        'Economic and social development in our region'
      ]
    },
    {
      category: 'Sustainability & Growth',
      points: [
        'Financial provision for ongoing operations',
        'Growing listener base across three nations',
        'Strategic partnerships for greater reach',
        'Environmental stewardship in all we do'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              🤝 Get Involved
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Join us in spreading the gift of good news across West Africa. Whether through prayer, 
              volunteering, or partnership, there's a meaningful way for you to make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Main Involvement Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {involvementOptions.map((option) => (
              <div key={option.title} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">{option.icon}</div>
                  <h2 className="text-2xl font-bold text-kioo-dark mb-4">{option.title}</h2>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  
                  <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
                    {option.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-kioo-primary">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={option.actionLink}
                    className="btn-primary inline-block w-full text-center"
                  >
                    {option.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Detail */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">🎯 Volunteer Opportunities</h2>
            <p className="text-lg text-gray-600">Specific ways you can contribute your skills and time</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteerRoles.map((volunteer) => (
              <div key={volunteer.role} className="bg-gray-50 rounded-xl p-6 card-hover">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-kioo-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">{volunteer.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-kioo-dark">{volunteer.role}</h3>
                    <p className="text-sm text-kioo-primary">{volunteer.commitment}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">{volunteer.requirements}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-kioo-primary bg-opacity-10 rounded-xl p-8">
              <h3 className="text-xl font-bold text-kioo-dark mb-4">Ready to Volunteer?</h3>
              <p className="text-gray-600 mb-6">
                We provide training, support, and a welcoming community for all our volunteers. 
                No experience? No problem! We'll help you develop the skills you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-kioo-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors"
                >
                  📝 Apply Now
                </Link>
                <button className="bg-gray-100 text-kioo-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  📞 Ask Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Partnership */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">🙏 Prayer Partnership</h2>
            <p className="text-lg text-gray-600">Specific areas where we need your prayers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {prayerPoints.map((category) => (
              <div key={category.category} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-kioo-primary mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-kioo-primary text-sm mt-1">🙏</span>
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Join Our Prayer Team</h3>
              <p className="text-green-100 mb-6">
                Receive monthly prayer updates and be part of our spiritual support network. 
                Your prayers make a real difference in our ministry and community impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email for prayer updates"
                  className="flex-1 max-w-md px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-white text-kioo-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Join Prayer Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kioo-dark mb-4">💼 Partnership Opportunities</h2>
            <p className="text-lg text-gray-600">Ways organizations can collaborate with us</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Corporate Sponsorship</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Program sponsorship opportunities</li>
                <li>• Equipment and infrastructure support</li>
                <li>• Community event partnerships</li>
                <li>• Employee volunteer programs</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">⛪</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Church Partnerships</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Content sharing and collaboration</li>
                <li>• Joint community outreach events</li>
                <li>• Prayer and spiritual support</li>
                <li>• Volunteer recruitment</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Educational Institutions</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Student internship programs</li>
                <li>• Educational content development</li>
                <li>• Research collaboration</li>
                <li>• Technical training partnerships</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">NGOs & Development</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Health and agriculture program partnerships</li>
                <li>• Community development initiatives</li>
                <li>• Information dissemination</li>
                <li>• Disaster response coordination</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Government Agencies</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Public service announcements</li>
                <li>• Emergency broadcast systems</li>
                <li>• Educational content distribution</li>
                <li>• Community information campaigns</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-kioo-dark mb-3">Technology Partners</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Equipment donation and support</li>
                <li>• Technical expertise and training</li>
                <li>• Software and system development</li>
                <li>• Solar and renewable energy support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-kioo-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🌟 Volunteer & Partner Testimonies</h2>
            <p className="text-green-100">Hear from those already making a difference</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <blockquote className="text-green-100 text-lg leading-relaxed mb-4">
                "Volunteering with Kioo Radio has been one of the most rewarding experiences of my life. 
                Seeing how our programs impact families and communities across West Africa motivates me every day."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah M., Radio Host</div>
                  <div className="text-green-200 text-sm">Volunteer since 2024</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <blockquote className="text-green-100 text-lg leading-relaxed mb-4">
                "Our church's partnership with Kioo Radio has amplified our community outreach efforts. 
                Together, we're reaching people we never could have reached alone."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span>⛪</span>
                </div>
                <div>
                  <div className="font-semibold">Pastor John K.</div>
                  <div className="text-green-200 text-sm">Community Church Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-kioo-dark mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Every form of involvement - whether prayer, volunteering, or partnership - helps us 
            reach more people with hope and practical help. Take the first step today.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/contact"
              className="bg-kioo-primary text-white p-6 rounded-xl hover:bg-kioo-secondary transition-colors"
            >
              <div className="text-3xl mb-3">📝</div>
              <div className="font-semibold mb-2">Get Started</div>
              <div className="text-sm opacity-90">Contact us about volunteering</div>
            </Link>
            
            <a
              href="tel:+2317783837O3"
              className="bg-kioo-secondary text-white p-6 rounded-xl hover:bg-kioo-primary transition-colors"
            >
              <div className="text-3xl mb-3">📞</div>
              <div className="font-semibold mb-2">Call Us</div>
              <div className="text-sm opacity-90">Speak with our team directly</div>
            </a>
            
            <Link
              to="/donate"
              className="bg-kioo-accent text-white p-6 rounded-xl hover:bg-green-600 transition-colors"
            >
              <div className="text-3xl mb-3">💖</div>
              <div className="font-semibold mb-2">Support Financially</div>
              <div className="text-sm opacity-90">Make a donation today</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;