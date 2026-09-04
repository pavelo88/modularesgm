import React from 'react';

export function SEOStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.modularesgm.com/#business",
        "name": "Modulares GM",
        "url": "https://www.modularesgm.com",
        "image": "https://www.modularesgm.com/logo.svg",
        "logo": "https://www.modularesgm.com/logo.svg",
        "telephone": "+593963064374",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rosa Yeira 420 y Serpaio Japeravi",
          "addressLocality": "Quito",
          "addressRegion": "Pichincha",
          "addressCountry": "EC"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -0.252232,
          "longitude": -78.534770
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "08:30",
          "closes": "18:30"
        },
        "sameAs": [
          "https://facebook.com/modularesgm",
          "https://instagram.com/modularesgm"
        ],
        "knowsAbout": [
          "Diseño y Producción de Cocinas Modulares de Alta Gama",
          "Fabricación de Clósets, Vestidores y Armarios a Medida",
          "Instalación de Mesones de Cuarzo, Granito y Mármol",
          "Remodelación Integral de Espacios y Obra Civil",
          "Diseño de Interiores y Planos Renders 3D"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.modularesgm.com/#website",
        "url": "https://www.modularesgm.com",
        "name": "Modulares GM",
        "description": "Expertos en cocinas modulares, cuarzos, clósets y remodelación en Quito y todo el Ecuador.",
        "publisher": {
          "@id": "https://www.modularesgm.com/#business"
        },
        "inLanguage": "es-EC"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
