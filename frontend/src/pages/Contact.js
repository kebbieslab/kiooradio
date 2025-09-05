import React, { useEffect } from 'react';

const Contact = () => {
  useEffect(() => {
    // Open contact popup when accessing /contact directly
    if (window.openContactPopup) {
      window.openContactPopup();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-kioo-dark mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">Our contact form should have opened automatically.</p>
        <button
          onClick={() => window.openContactPopup && window.openContactPopup()}
          className="bg-kioo-primary text-white px-6 py-3 rounded-lg hover:bg-kioo-secondary transition-colors"
        >
          Open Contact Form
        </button>
      </div>
    </div>
  );
};

export default Contact;

export default Contact;