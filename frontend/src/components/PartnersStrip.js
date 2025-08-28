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

  useEffect(() => {
    // Runtime safety: if prefers-reduced-motion, disable animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const track = document.getElementById('partner-track');
      if (track) {
        track.style.animation = 'none';
        track.style.overflow = 'auto';
      }
    }
  }, []);

  return (
    <section className="partners-marquee" aria-labelledby="partners-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="partners-title" className="partners-title">
          Our Partners
        </h2>

        <div className="marquee-container">
          <ul className="partner-track" id="partner-track">
            {/* First set of logos with proper alt text */}
            {partners.map((partner, index) => (
              <li key={`first-${index}`} className="partner-item">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${partner.name}`}
                  className="partner-link"
                >
                  <img
                    src={`/partners/${partner.logo}`}
                    alt={partner.name}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="partner-logo-marquee"
                  />
                </a>
              </li>
            ))}
            {/* Duplicate set for seamless loop with aria-hidden */}
            {partners.map((partner, index) => (
              <li key={`second-${index}`} className="partner-item" aria-hidden="true">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${partner.name}`}
                  className="partner-link"
                  tabIndex="-1"
                >
                  <img
                    src={`/partners/${partner.logo}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="partner-logo-marquee"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Screen reader accessible text list */}
        <p className="sr-only">
          Our partners: {partners.map(p => p.name).join(', ')}
        </p>
      </div>
    </section>
  );
};

export default PartnersStrip;