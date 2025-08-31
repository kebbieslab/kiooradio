import React from 'react';
import { Helmet } from 'react-helmet-async';
import MajorGifts from '../components/MajorGifts';

const MajorGiftsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* SEO Head */}
      <Helmet>
        <title>Major Gifts — Kioo Radio | Transform Communities Across the Makona Region</title>
        <meta 
          name="description" 
          content="Partner with Kioo Radio at a leadership level. Explore naming opportunities, pledge options, bank transfer, and impact documents. Transform communities across Liberia, Sierra Leone, and Guinea through gospel broadcasting."
        />
        <meta property="og:title" content="Major Gifts — Kioo Radio | Transform Communities Across the Makona Region" />
        <meta property="og:description" content="Partner with Kioo Radio at a leadership level. Explore naming opportunities, pledge options, bank transfer, and impact documents." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/donate/major-gifts`} />
        
        {/* Additional SEO */}
        <meta name="keywords" content="major gifts, kioo radio, liberia donation, sierra leone radio, guinea broadcasting, gospel radio donation, leadership giving, naming opportunities" />
        <link rel="canonical" href={`${window.location.origin}/donate/major-gifts`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary via-kioo-secondary to-green-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Partner at a Leadership Level
          </h1>
          <p className="text-2xl lg:text-3xl text-green-100 leading-relaxed">
            Let's build lasting gospel impact across the Makona River Region together.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-green-200">Miles Coverage</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-green-200">Countries Reached</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold">6</div>
              <div className="text-sm text-green-200">Languages Broadcast</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-green-200">Broadcasting Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transform Communities Through Gospel Broadcasting
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Kioo Radio 98.1 FM reaches across borders to bring hope, faith, and vital information to communities in Liberia, Sierra Leone, and Guinea. Your major gift investment ensures sustainable, professional broadcasting that changes lives across the Makona River Region.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🌅</div>
              <h3 className="text-2xl font-semibold mb-3 text-kioo-primary">Solar-Powered Reliability</h3>
              <p className="text-gray-600">
                Ensure 24/7 broadcasting with sustainable solar power systems that keep the station running even during power outages.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">🎙️</div>
              <h3 className="text-2xl font-semibold mb-3 text-kioo-primary">Professional Studios</h3>
              <p className="text-gray-600">
                State-of-the-art recording and broadcasting facilities for high-quality programming that reaches across national borders.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-2xl font-semibold mb-3 text-kioo-primary">Cross-Border Impact</h3>
              <p className="text-gray-600">
                Programming in multiple languages (Kissi, English, French, Mandingo, Fula, Gbandi) reaches diverse communities.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-3 text-kioo-primary">Youth Development</h3>
              <p className="text-gray-600">
                Engaging programs that mentor young people and provide educational content for the next generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Major Gifts Component */}
      <MajorGifts isStandalonePage={true} />

      {/* Impact Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Your Investment Creates Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-kioo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⛪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Church Partnerships</h3>
              <p className="text-gray-600">
                41+ partner churches across 3 countries provide local connection and pastoral care.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-kioo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Regional Reach</h3>
              <p className="text-gray-600">
                Broadcasting from Foya, Liberia with signals reaching deep into Sierra Leone and Guinea.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-kioo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Life Transformation</h3>
              <p className="text-gray-600">
                Daily programs providing hope, education, and spiritual growth to thousands of listeners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-kioo-secondary to-kioo-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Transformational Gift?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Let's discuss how your leadership investment can expand gospel broadcasting across West Africa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@kiooradio.org?subject=Major Gift Inquiry"
              className="bg-white text-kioo-primary py-4 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              📧 Email Us Directly
            </a>
            
            <a
              href="tel:+231778383703"
              className="bg-kioo-secondary text-white py-4 px-8 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              📞 Call Now
            </a>
            
            <a
              href="https://wa.me/231778383703?text=I'm interested in making a major gift to Kioo Radio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-4 px-8 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MajorGiftsPage;