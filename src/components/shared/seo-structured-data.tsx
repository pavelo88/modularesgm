import React from 'react';
import { toWhatsAppNumber } from '@/lib/site';

export function SEOStructuredData({ phone }: { phone?: string } = {}) {
  const telephone = phone ? `+${toWhatsAppNumber(phone)}` : '+593963064374';
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.modularesgm.com/#business",
        "name": "Modulares GM",
        "url": "https://www.modularesgm.com",
        "image": "https://www.modularesgm.com/logo.png",
        "logo": "https://www.modularesgm.com/logo.png",
        "telephone": telephone,
        "priceRange": "$$",
        "areaServed": [
          { "@type": "City", "name": "Quito" },
          { "@type": "AdministrativeArea", "name": "Pichincha" },
          { "@type": "Country", "name": "Ecuador" }
        ],
        "serviceType": [
          "Cocinas modulares a medida",
          "Closets y walk-in closets a medida",
          "Mesones de cuarzo y granito",
          "Muebles de oficina y mobiliario corporativo",
          "Muebles de baño y vanities",
          "Diseño, fabricación e instalación de muebles"
        ],
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
          "https://www.instagram.com/modularesgm2020/"
        ],
        "knowsAbout": [
          "Diseño y Producción de Cocinas Modulares de Alta Gama",
          "Fabricación de Clósets, Vestidores y Armarios a Medida",
          "Instalación de Mesones de Cuarzo, Granito y Mármol",
          "Remodelación Integral de Espacios y Obra Civil",
          "Diseño de Interiores y Planos Renders 3D"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios de mobiliario a medida",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cocinas modulares", "url": "https://www.modularesgm.com/cocinas" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Closets a medida", "url": "https://www.modularesgm.com/closets" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Muebles de oficina", "url": "https://www.modularesgm.com/muebles-oficina" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Muebles de baño", "url": "https://www.modularesgm.com/muebles-bano" } }
          ]
        }
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
