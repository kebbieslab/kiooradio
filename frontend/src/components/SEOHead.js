import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  partner = null 
}) => {
  const defaultTitle = "Kioo Radio 98.1 FM - Partner Churches";
  const defaultDescription = "Connect with trusted pastors and churches across the Makona River Region";
  const defaultImage = "https://customer-assets.emergentagent.com/job_ab37571b-81ea-4716-830b-4dd3875c42b0/artifacts/3n0kpvfn_KIOO%20RADIO.png";
  
  const siteUrl = window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  
  // Generate face-centered OG image for partner
  const getPartnerOGImage = (partner) => {
    if (partner?.photoUrl) {
      // In a real implementation, this would generate a custom OG image with face-centered cropping
      return partner.photoUrl;
    }
    return defaultImage;
  };

  const ogImage = partner ? getPartnerOGImage(partner) : (image || defaultImage);
  const ogTitle = title || (partner ? `${partner.pastorName} - ${partner.churchName}` : defaultTitle);
  const ogDescription = description || (partner 
    ? `Connect with ${partner.pastorName} from ${partner.churchName} in ${partner.city}, ${partner.country}`
    : defaultDescription
  );

  return (
    <Helmet>
      <title>{ogTitle}</title>
      <meta name="description" content={ogDescription} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Kioo Radio 98.1 FM" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
      
      {partner && (
        <>
          <meta property="article:author" content={partner.pastorName} />
          <meta property="article:section" content="Partner Churches" />
          <meta name="geo.region" content={partner.country} />
          <meta name="geo.placename" content={partner.city} />
        </>
      )}
    </Helmet>
  );
};

export default SEOHead;