import React from 'react';
import { Link } from 'react-router-dom';

const Volunteer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              🤝 Volunteer Today
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Join the Mission Field and be part of God's work across the Makona River Region
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-kioo-dark mb-6 text-center">
              Join the Mission Field!
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 text-center">
              Volunteer with us in areas such as:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-kioo-primary bg-opacity-10 rounded-xl p-6">
                <div className="text-4xl mb-4 text-center">⛪</div>
                <h3 className="text-xl font-semibold text-kioo-dark mb-3 text-center">Village Ministry</h3>
                <p className="text-gray-600 text-center">
                  Reach remote communities with the Gospel message and build relationships across the tri-border region.
                </p>
              </div>

              <div className="bg-kioo-primary bg-opacity-10 rounded-xl p-6">
                <div className="text-4xl mb-4 text-center">⚽</div>
                <h3 className="text-xl font-semibold text-kioo-dark mb-3 text-center">Sports Ministry</h3>
                <p className="text-gray-600 text-center">
                  Use sports as a bridge to connect with youth and families in local communities.
                </p>
              </div>

              <div className="bg-kioo-primary bg-opacity-10 rounded-xl p-6">
                <div className="text-4xl mb-4 text-center">🎭</div>
                <h3 className="text-xl font-semibold text-kioo-dark mb-3 text-center">Drama Ministry</h3>
                <p className="text-gray-600 text-center">
                  Share biblical stories and messages through creative performances and theater.
                </p>
              </div>

              <div className="bg-kioo-primary bg-opacity-10 rounded-xl p-6">
                <div className="text-4xl mb-4 text-center">🏥</div>
                <h3 className="text-xl font-semibold text-kioo-dark mb-3 text-center">Medical Outreach</h3>
                <p className="text-gray-600 text-center">
                  Provide healthcare and wellness services to underserved communities in need.
                </p>
              </div>
            </div>

            <div className="bg-kioo-secondary bg-opacity-10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-kioo-dark mb-4 text-center">
                Not sure you have the skills? Think again!
              </h3>
              <p className="text-lg text-gray-700 text-center leading-relaxed">
                There is a place for you to serve and be a blessing to the communities we reach. 
                Every skill, every heart, and every willing spirit can be used for God's glory.
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-kioo-primary to-kioo-secondary text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Kioo is not just a Radio… it's a tool to bring people to the knowledge of Christ.
                </h3>
                <p className="text-green-100 text-lg">
                  When you volunteer with us, you're not just helping a radio station - 
                  you're participating in God's mission to reach hearts and transform lives across West Africa.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-kioo-dark mb-6">
                Ready to Make a Difference?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-kioo-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-kioo-secondary transition-colors inline-flex items-center justify-center"
                >
                  📝 Get Started Today
                </Link>
                <a
                  href="tel:+231778383703"
                  className="bg-kioo-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-kioo-primary transition-colors inline-flex items-center justify-center"
                >
                  📞 Call Us Now
                </a>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Contact us to learn more about volunteer opportunities and how you can serve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;