import fs from 'fs';
import path from 'path';

/**
 * Script para automatizar la gestión y creación de campañas en Google Ads para Modulares GM.
 * Utiliza la biblioteca google-ads-api de Node.js.
 */

export const CAMPAIGN_CONFIG = {
  customerId: '3010857341',
  campaignName: 'GM_Search_Cocinas_Closets_Quito_2026',
  budgetMicros: 10000000, // $10 USD por día (en micros)
  targetLocations: [
    'Quito',
    'Cumbayá',
    'Tumbaco',
    'Valle de los Chillos'
  ],
  adGroups: [
    {
      name: 'Cocinas Modulares Quito',
      keywords: [
        { text: 'cocinas modulares quito', matchType: 'PHRASE' },
        { text: 'muebles de cocina quito', matchType: 'PHRASE' },
        { text: 'diseño de cocinas modernas quito', matchType: 'PHRASE' },
        { text: 'remodelacion de cocinas quito', matchType: 'PHRASE' },
        { text: 'fábrica de muebles de cocina quito', matchType: 'PHRASE' }
      ],
      headlines: [
        'Cocinas Modulares en Quito',
        'Diseño a Medida y Fábrica',
        'Cotiza Gratis por WhatsApp',
        'Garantía y Asesoría 3D',
        'Muebles de Cocina Modernos'
      ],
      descriptions: [
        'Diseñamos y fabricamos tu cocina moderna en Quito. Materiales resistentes y acabados de lujo.',
        'Visita técnica y cotización sin costo en Quito y Valles. Contáctanos por WhatsApp.'
      ],
      finalUrl: 'https://www.modularesgm.com/cocinas'
    },
    {
      name: 'Closets y Vestidores Quito',
      keywords: [
        { text: 'closets a medida quito', matchType: 'PHRASE' },
        { text: 'vestidores modernos quito', matchType: 'PHRASE' },
        { text: 'diseño de closets quito', matchType: 'PHRASE' },
        { text: 'muebles para dormitorios quito', matchType: 'PHRASE' }
      ],
      headlines: [
        'Closets a Medida en Quito',
        'Vestidores Modernos y Lujo',
        'Aprovecha Todo tu Espacio',
        'Fábrica Directa en Quito',
        'Cotización Rápida WhatsApp'
      ],
      descriptions: [
        'Fabricamos closets y vestidores a medida con los mejores herrajes y melaminas en Quito.',
        'Asesoría personalizada y diseño 3D incluido. Solicita tu cotización hoy mismo.'
      ],
      finalUrl: 'https://www.modularesgm.com/closets'
    }
  ]
};

console.log('✅ Configuración de campaña cargada para Modulares GM (ID: ' + CAMPAIGN_CONFIG.customerId + ')');
console.log('📊 Presupuesto configurado: $10/día');
console.log('📍 Grupos de anuncios listos: ' + CAMPAIGN_CONFIG.adGroups.map(g => g.name).join(', '));
