import React, { useState, useEffect } from 'react';
import partnersData from '../data/partners.json';

const PartnersStrip = () => {
  const [partners] = useState(partnersData);
  const [logoHeight] = useState(32); // From our resize script output

  useEffect(() => {
    // Set CSS custom property for logo height (determined by resize script)
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
    <section className="partners" aria-labelledby="partners-title">
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
                className="logo"
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
                />
              </a>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <a
                key={`second-${index}`}
                className="logo"
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