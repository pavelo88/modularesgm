import type { Service, Product, Brand, Stat, SiteContent } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';

export const defaultServices: Service[] = [
  { id: 1, title: 'Diseño de Cocinas', desc: 'Cocinas modulares a medida con acabados premium, herrajes de cierre lento y optimización de espacios.', imgUrl: getImage('service-1'), icon: 'Home', catalogUrl: '' },
  { id: 2, title: 'Topes de Cuarzo y Granito', desc: 'Instalación de mesones en cuarzo, granito y mármol para cocinas y baños con cortes precisos.', imgUrl: getImage('service-2'), icon: 'Grid', catalogUrl: '' },
  { id: 3, title: 'Clósets y Vestidores', desc: 'Armarios, walk-in closets y organizadores personalizados para maximizar el almacenamiento.', imgUrl: getImage('service-3'), icon: 'LayoutGrid', catalogUrl: '' },
  { id: 4, title: 'Construcción y Remodelación', desc: 'Obras civiles menores, gypsum, pintura y adecuaciones completas de espacios residenciales y comerciales.', imgUrl: getImage('service-4'), icon: 'Hammer', catalogUrl: '' },
  { id: 5, title: 'Muebles de Baño (Vanities)', desc: 'Muebles resistentes a la humedad, lavabos y espejos modernos para renovar tu cuarto de baño.', imgUrl: getImage('service-5'), icon: 'Briefcase', catalogUrl: '' },
  { id: 6, title: 'Centros de Entretenimiento', desc: 'Paneles de TV a medida con iluminación LED integrada, repisas flotantes y paso de cables oculto.', imgUrl: getImage('service-6'), icon: 'MonitorPlay', catalogUrl: '' },
  { id: 7, title: 'Pisos Flotantes y SPC', desc: 'Suministro e instalación de pisos laminados, vinílicos y SPC de alto tráfico y resistencia al agua.', imgUrl: getImage('service-7'), icon: 'Palette', catalogUrl: '' },
  { id: 8, title: 'Asesoría y Diseño 3D', desc: 'Renders fotorrealistas y planos técnicos para visualizar tu proyecto antes de la fabricación.', imgUrl: getImage('service-8'), icon: 'Sofa', catalogUrl: '' },
  { id: 9, title: 'Mobiliario Comercial', desc: 'Soluciones para locales, oficinas y restaurantes: mostradores, estanterías y estaciones de trabajo.', imgUrl: getImage('service-9'), icon: 'Store', catalogUrl: '' }
];

export const defaultProducts: Product[] = [
  { id: 101, title: 'Cocina Modular Básica (Metro Lineal)', desc: 'Muebles altos y bajos en melamina RH, incluye bisagras estándar y tiradores de aluminio.', price: 250, discountPrice: null, imgUrl: getImage('product-101'), category: 'Cocinas' },
  { id: 102, title: 'Isla de Cocina con Tope de Cuarzo', desc: 'Isla central de 1.5m x 0.9m con almacenamiento inferior y tope de cuarzo blanco estelar.', price: 950, discountPrice: 850, imgUrl: getImage('product-102'), category: 'Cocinas' },
  { id: 103, title: 'Mueble de Baño Flotante (Vanity)', desc: 'Mueble resistente a la humedad de 80cm con tope de cuarzo blanco y lavabo sobrepuesto.', price: 350, discountPrice: 290, imgUrl: getImage('product-103'), category: 'Baños' },
  { id: 104, title: 'Centro de Entretenimiento TV 65"', desc: 'Panel ranurado MDF Pelikano con luces LED integradas y repisa flotante inferior. (200x180cm).', price: 480, discountPrice: 420, imgUrl: getImage('product-104'), category: 'Salas' },
  { id: 105, title: 'Clóset Modular Estándar (Metro Lineal)', desc: 'Módulo interno para clóset con cajoneras, tubos colgadores y maletero. Sin puertas.', price: 180, discountPrice: 150, imgUrl: getImage('product-105'), category: 'Dormitorios' },
  { id: 106, title: 'Walk-in Closet Premium', desc: 'Diseño en "L" para espacios amplios. Incluye iluminación LED en cajones y herrajes Blum.', price: 1500, discountPrice: 1200, imgUrl: getImage('product-106'), category: 'Dormitorios' },
  { id: 107, title: 'Escritorio Corporativo Minimalista', desc: 'Escritorio de 120x60cm en melamina texturizada con estructura metálica electrostática.', price: 180, discountPrice: 150, imgUrl: getImage('product-107'), category: 'Oficina' },
  { id: 108, title: 'Mesa de Centro Estilo Industrial', desc: 'Mesa de 80x80cm. Superficie de madera rústica y bases de acero negro mate.', price: 120, discountPrice: 90, imgUrl: getImage('product-108'), category: 'Salas' },
  { id: 109, title: 'Set de 3 Repisas Flotantes', desc: 'Repisas de 60cm de largo con soportes invisibles. Ideales para decoración y libros.', price: 60, discountPrice: 45, imgUrl: getImage('product-109'), category: 'Decoración' },
  { id: 110, title: 'Barra Desayunadora Moderna', desc: 'Mueble de 1.2m ideal para dividir espacios. Incluye espacio para 2 taburetes y luces LED.', price: 400, discountPrice: 350, imgUrl: getImage('product-110'), category: 'Cocinas' }
];

export const defaultBrands: Brand[] = [
  { id: 1, name: 'NOVOPAN', url: 'https://images.squarespace-cdn.com/content/v1/657a358b4134183f81a43eab/1722361668270-YQ7R06OODR20I2P5P4P6/Logo_Novopan_Color.png' },
  { id: 2, name: 'PELIKANO', url: 'https://www.pelikano.com/wp-content/uploads/2021/09/logo-pelikano.png' },
  { id: 3, name: 'BLUM', url: 'https://media.blum.com/asset/unofficial/layout/logo_blum.svg' },
  { id: 4, name: 'HAFELE', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/H%C3%A4fele_GmbH_%26_Co_KG_Logo.svg' },
  { id: 5, name: 'SILESTONE', url: 'https://www.cosentino.com/wp-content/uploads/2023/05/Logo-Silestone-menu.svg' },
  { id: 6, name: 'DEKTON', url: 'https://www.cosentino.com/wp-content/uploads/2023/05/Logo-Dekton-menu.svg' },
  { id: 7, name: 'TEKA', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Logo_Teka_svg.svg' },
  { id: 8, name: 'BRIGGS', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Case%2C_Briggs_logo_%28plumbing_fixtures%29.svg' },
  { id: 9, name: 'COSENTINO', url: 'https://www.cosentino.com/wp-content/themes/b2c-child/img/logo-cosentino-white.svg' }
];

export const defaultStats: Stat[] = [
  { id: 1, value: '10+', label: 'AÑOS EXP.', icon: 'Globe' },
  { id: 2, value: '1000+', label: 'PROYECTOS', icon: 'Home' },
  { id: 3, value: '100%', label: 'PERSONALIZADO', icon: 'Ruler' },
  { id: 4, value: 'EC', label: 'NIVEL NACIONAL', icon: 'MapPin' }
];

export const defaultSiteContent: SiteContent = {
  heroTitle: 'Diseño y Construcción de Espacios Únicos',
  heroSubtitle: 'Expertos en muebles modulares, cocinas modernas y topes de cuarzo. Transformamos tus ideas en realidad con calidad y elegancia en todo el Ecuador.',
  heroMediaUrl: getImage('hero'),
  ctaText: 'Solicitar Cotización',
  formTitle: 'Cotiza tu Proyecto a Medida',
  formSubtitle: 'Déjenos sus datos y un experto se pondrá en contacto para asesorarle en su próximo proyecto.',
  whatsappNumber: '593999999999',
  address: 'Rosa Yeira 420 y Serpaio Japeravi, Quito, Ecuador',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.814674112109!2d-78.4716!3d-0.0911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d58fbc8d6263e1%3A0xc3b44b9d3b45167a!2sQuito!5e0!3m2!1sen!2sec!4v1680000000000!5m2!1sen!2sec',
  socialUrls: {
    facebook: 'https://facebook.com/modularesgm',
    instagram: 'https://instagram.com/modularesgm',
    linkedin: ''
  },
  seo: {
    title: 'Modulares GM | Muebles, Diseño y Construcción',
    description: 'Expertos en cocinas modulares, cuarzos, clósets y remodelación en Quito y todo el Ecuador.',
    keywords: 'Muebles modulares, Cocinas modernas, Cuarzo, Diseño de interiores, Remodelación, Quito, Ecuador, Modulares GM'
  },
  services: defaultServices,
  stats: defaultStats,
  brands: defaultBrands,
  products: defaultProducts
};
