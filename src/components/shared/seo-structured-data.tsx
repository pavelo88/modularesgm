import React from 'react';

export function SEOStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Modulares GM",
    "image": "https://modularesgm.com/logo.jpg", // Assuming logo is at root based on src/app/logo.jpg
    "@id": "https://modularesgm.com",
    "url": "https://modularesgm.com",
    "telephone": "+593963064374",
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
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com/modularesgm",
      "https://instagram.com/modularesgm"
    ],
    "knowsAbout": [
      "Diseño y Producción de Cocinas Modulares",
      "Fabricación de Clósets, Vestidores y Armarios",
      "Instalación de Mesones de Cuarzo, Granito y Mármol",
      "Remodelación Integral de Baños y Cocinas",
      "Construcción de Casas Residenciales",
      "Construcción y Adecuación de Colegios y Oficinas",
      "Diseño y Construcción de Piscinas",
      "Acabados en Cerámica y Porcelanato",
      "Mobiliario Comercial, Góndolas y Estanterías",
      "Reparación y Mantenimiento de Mobiliario",
      "Muebles a Medida para Farmacias y Tiendas",
      "Centros de Entretenimiento y Paneles de TV",
      "Diseño de Interiores y Renders 3D Profesionales"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
