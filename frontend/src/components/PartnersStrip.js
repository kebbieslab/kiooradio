import React, { useState, useEffect } from 'react';

const PartnersStrip = () => {
  // Updated partner data with correct URLs and logos
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
      "url": "https://galcomusa.com"
    },
    {
      "name": "Galcom Canada",
      "logo": "galcom-canada-updated.png", 
      "url": "https://galcom.org"
    },
    {
      "name": "Reaching People far from God",
      "logo": "rpffg.webp",
      "url": "https://www.rpffg.org"
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

  const [partners] = useState(partnersData);
  const [logoHeight] = useState(64); // Increased for better uniformity

  useEffect(() => {
    // Set CSS custom property for uniform logo height
    document.documentElement.style.setProperty('--logo-h', `${logoHeight}px`);
    
    // Runtime safety: if prefers-reduced-motion, disable animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const track = document.getElementById('partners-track');
      if (track) {
        track.style.animation = 'none';
      }
    }
  }, [logoHeight]);

  // Create screen reader accessible text
  const partnersListText = partners.map(p => p.name).join(', ');

  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="partners-title" data-i18n="partnersTitle" className="partners-title">
          Our Partners
        </h2>

        <div className="logo-scroller" role="region" aria-label="Partner logos (scrolling)">
          <div className="logo-track" id="partners-track">
            {/* First set of logos */}
            {partners.map((partner, index) => (
              <a
                key={`first-${index}`}
                className="logo-container"
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
              >
                <img
                  src={`/partners/${partner.logo}`}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="partner-logo-uniform"
                />
              </a>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <a
                key={`second-${index}`}
                className="logo-container"
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
              >
                <img
                  src={`/partners/${partner.logo}`}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="partner-logo-uniform"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Screen reader accessible text list */}
        <p className="sr-only" id="partners-list">
          Our partners: {partnersListText}
        </p>
      </div>
    </section>
  );
};

export default PartnersStrip;