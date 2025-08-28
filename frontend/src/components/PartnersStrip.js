import React from 'react';
import partnersData from '../data/partners.json';

const PartnersStrip = () => {
  return (
    <section className="partners bg-white py-16 border-t border-gray-200" aria-labelledby="partners-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="partners-title" data-i18n="partnersTitle" className="partners-title text-center text-2xl font-bold text-gray-900 mb-12">
          Our Partners
        </h2>

        <ul className="logo-grid">
          {partnersData.map((partner, index) => (
            <li key={partner.name} className="logo-card">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
                className="logo-link"
              >
                <img
                  src={`/partners/${partner.logo}`}
                  alt={partner.name}
                  width="160"
                  height="96"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="partner-logo"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Screen reader accessible text list */}
        <p className="sr-only" id="partners-list">
          Our partners: {partnersData.map(p => p.name).join(', ')}
        </p>
      </div>
    </section>
  );
};

export default PartnersStrip;