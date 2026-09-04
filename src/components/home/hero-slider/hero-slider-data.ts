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
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=75&w=1400&fm=webp',
    tags: ['Cierre Lento Blum/Hafele', 'Resistente a Humedad', 'Medición Gratis'],
    ctaPrimary: {
      text: 'Cotizar Mi Cocina',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Ver Catálogo',
      href: '/store',
    },
  },
  {
    id: 2,
    serviceId: 'cuarzos',
    badge: 'Acabados de Lujo • Importación Directa',
    title: 'Topes de Cuarzo, Granito y Mármol',
    subtitle: 'Cortes CNC de Alta Precisión e Instalación Limpia',
    description: 'Mesones de cocina y baño con pulidos perfectos, alta resistencia a manchas, rayones y calor extremo. Garantía extendida.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=75&w=1400&fm=webp',
    tags: ['Silestone & Dekton', 'Antibacteriano', 'Instalación 48h'],
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
    id: 3,
    serviceId: 'closets',
    badge: 'Organización Inteligente • A Medida',
    title: 'Clósets & Walk-in Closets',
    subtitle: 'Iluminación LED Integrada y Espacios Optimizados',
    description: 'Maximizamos cada centímetro de tu dormitorio con pantaloneras extraíbles, zapateras retroiluminadas y cajones organizadores.',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=75&w=1400&fm=webp',
    tags: ['Diseño Personalizado', 'Luces LED Ocultas', 'Accesorios Premium'],
    ctaPrimary: {
      text: 'Cotizar Clóset',
      href: '/#contacto',
    },
    ctaSecondary: {
      text: 'Ver Diseños',
      href: '/store',
    },
  },
  {
    id: 4,
    serviceId: 'remodelaciones',
    badge: 'Obra Civil & Adecuaciones • Llave en Mano',
    title: 'Remodelación Integral de Espacios',
    subtitle: 'Gypsum, Pintura, Pisos SPC y Electricidad',
    description: 'Nos encargamos de tu proyecto llave en mano. Desde la demolición hasta los últimos detalles de acabado sin estrés ni sobrecostos.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=75&w=1400&fm=webp',
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
