export interface HeroSlide {
  id: number;
  serviceId: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  tags: string[];
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary: {
    text: string;
    href: string;
  };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    serviceId: 'cocinas',
    badge: 'Servicio Estrella • Calidad Certificada',
    title: 'Cocinas Modulares de Alta Gama',
    subtitle: 'Diseño Fotorrealista 3D y Herrajes Cierre Lento',
    description: 'Transformamos tu cocina en el corazón de tu hogar con diseños ergonómicos, melamina RH resistente a la humedad y acabados en cuarzo.',
    imageUrl: '/images/catalog/extracted_DE_COCINAS/img-004.jpg',
    tags: ['Cierre Lento Blum/Hafele', 'Resistente a Humedad', 'Medición Gratis'],
    ctaPrimary: {
      text: 'Cotizar Mi Cocina',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Ver Catálogo',
      href: '/cocinas',
    },
  },
  {
    id: 2,
    serviceId: 'closets',
    badge: 'Organización Inteligente • A Medida',
    title: 'Clósets & Walk-in Boutique',
    subtitle: 'Iluminación LED Integrada y Espacios Optimizados',
    description: 'Maximizamos cada centímetro de tu dormitorio con vestidores boutique, puertas en vidrio bronce, pantaloneras extraíbles y zapateras retroiluminadas.',
    imageUrl: '/images/catalog/extracted_CLOSETS_1/img-017.png',
    tags: ['Diseño Personalizado', 'Luces LED Ocultas', 'Accesorios Premium'],
    ctaPrimary: {
      text: 'Cotizar Clóset',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Ver Diseños',
      href: '/closets',
    },
  },
  {
    id: 3,
    serviceId: 'puertas',
    badge: 'Arquitectura & Seguridad • Alta Gama',
    title: 'Puertas Pivotantes Monumentales',
    subtitle: 'Pivotes de Alta Carga y Diseños Exclusivos',
    description: 'Puertas de ingreso monumentales de hasta 3 metros de altura con apertura suave, cerraduras digitales y acabados en madera maciza y melamina RH.',
    imageUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.jpg',
    tags: ['Pivotes 360°', 'Madera & Melamina RH', 'Seguridad Digital'],
    ctaPrimary: {
      text: 'Cotizar Puerta',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Ver Catálogo',
      href: '/puertas',
    },
  },
  {
    id: 4,
    serviceId: 'cuarzos',
    badge: 'Acabados de Lujo • Importación Directa',
    title: 'Topes de Cuarzo, Granito y Mármol',
    subtitle: 'Cortes CNC de Alta Precisión e Instalación Limpia',
    description: 'Mesones de cocina y baño con pulidos perfectos, cascadas ingleteadas y alta resistencia a manchas, rayones y calor extremo.',
    imageUrl: '/images/catalog/extracted_DE_COCINAS/img-006.jpg',
    tags: ['Silestone & Dekton', 'Antibacteriano', 'Cortes CNC'],
    ctaPrimary: {
      text: 'Solicitar Muestras',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Explorar Tienda',
      href: '/store',
    },
  },
  {
    id: 5,
    serviceId: 'remodelaciones',
    badge: 'Obra Civil & Adecuaciones • Llave en Mano',
    title: 'Remodelación Integral de Espacios',
    subtitle: 'Gypsum, Pintura, Pisos SPC y Electricidad',
    description: 'Nos encargamos de tu proyecto llave en mano. Desde la demolición hasta los últimos detalles de acabado sin estrés ni sobrecostos.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=65&w=900&fm=webp',
    tags: ['Llave en Mano', 'Personal Calificado', 'Entrega a Tiempo'],
    ctaPrimary: {
      text: 'Asesoría Gratuita',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Nuestros Proyectos',
      href: '/store',
    },
  },
];
