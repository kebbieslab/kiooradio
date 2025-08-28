import React from 'react';

const PartnersStrip = () => {
  // Partner data directly in component for now
  const partnersData = [
    {
      "name": "Thru the Bible",
      "logo": "ttb-updated.png",
      "url": "https://ttb.org"
    },
    {
      "name": "Your Network of Praise", 
      "logo": "ynop-updated.png",
      "url": "https://www.ynop.org"
    },
    {
      "name": "Community Foundation of the North State",
      "logo": "community-foundation.webp", 
      "url": "https://cfns.org"
    },
    {
      "name": "Galcom USA",
      "logo": "galcom-usa.webp",
      "url": "https://galcom.org"
    },
    {
      "name": "Galcom Canada",
      "logo": "galcom-canada-updated.png", 
      "url": "https://galcom.ca"
    },
    {
      "name": "RPFFG",
      "logo": "rpffg.webp",
      "url": "#"
    },
    {
      "name": "SonSet Solutions",
      "logo": "sonset-solutions.webp",
      "url": "https://sonsetsolutions.com"
    },
    {
      "name": "Nations One",
      "logo": "nations-one-square.webp",
      "url": "https://nationsone.org"
    },
    {
      "name": "Diguna",
      "logo": "diguna.webp",
      "url": "#"
    }
  ];

  return (
    <section className="partners bg-white py-16 border-t border-gray-200" aria-labelledby="partners-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="partners-title" className="partners-title text-center text-2xl font-bold text-gray-900 mb-12">
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