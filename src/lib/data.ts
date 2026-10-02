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
  { id: 101, title: 'Cocina Modular Básica', desc: 'Muebles altos y bajos en melamina RH, incluye herrajes estándar.', price: 250, discountPrice: null, imgUrl: getImage('product-101'), category: 'Cocinas', priceUnit: 'metro_lineal', inStock: true, featured: true },
  { id: 102, title: 'Isla de Cocina con Tope de Cuarzo', desc: 'Isla central con almacenamiento inferior y acabado premium.', price: 950, discountPrice: 850, imgUrl: getImage('product-102'), category: 'Cocinas', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 103, title: 'Mueble de Baño Flotante (Vanity)', desc: 'Mueble resistente a la humedad con tope de cuarzo moderno.', price: 350, discountPrice: 290, imgUrl: getImage('product-103'), category: 'Baño', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 104, title: 'Centro de Entretenimiento TV 65"', desc: 'Panel ranurado Pelikano con iluminación LED integrada.', price: 480, discountPrice: 420, imgUrl: getImage('product-104'), category: 'Oficina', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 105, title: 'Clóset Modular Estándar', desc: 'Módulo interno con cajoneras y tubos colgadores.', price: 180, discountPrice: 150, imgUrl: getImage('product-105'), category: 'Closets', priceUnit: 'metro_lineal', inStock: true, featured: true },
  { id: 106, title: 'Walk-in Closet Premium', desc: 'Diseño amplio con herrajes Blum y cajones iluminados.', price: 1500, discountPrice: 1200, imgUrl: getImage('product-106'), category: 'Closets', priceUnit: 'metro_cuadrado', inStock: true, featured: true },
  { id: 107, title: 'Escritorio Corporativo', desc: 'Escritorio minimalista con estructura metálica.', price: 180, discountPrice: 150, imgUrl: getImage('product-107'), category: 'Oficina', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 108, title: 'Silla Gamer Profesional', desc: 'Silla ergonómica con soporte lumbar y reposabrazos 4D.', price: 120, discountPrice: 90, imgUrl: getImage('product-108'), category: 'Gamer', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 109, title: 'Escritorio Estudiantil Compacto', desc: 'Escritorio con estante superior ideal para habitaciones pequeñas.', price: 60, discountPrice: 45, imgUrl: getImage('product-109'), category: 'Escritorios', priceUnit: 'unidad', inStock: true, featured: false },
  { id: 110, title: 'Puerta Lacada Premium', desc: 'Puerta interior en MDF lacado blanco o colores con herrajes silenciosos.', price: 400, discountPrice: 350, imgUrl: getImage('product-110'), category: 'Puertas', priceUnit: 'unidad', inStock: true, featured: false },
];

export const defaultBrands: Brand[] = [
  { id: 1, name: 'NOVOPAN', url: '' },
  { id: 2, name: 'PELIKANO', url: '' },
  { id: 3, name: 'BLUM', url: '' },
  { id: 4, name: 'HAFELE', url: '' },
  { id: 5, name: 'SILESTONE', url: 'https://www.cosentino.com/wp-content/uploads/2023/05/Logo-Silestone-menu.svg' },
  { id: 6, name: 'DEKTON', url: 'https://www.cosentino.com/wp-content/uploads/2023/05/Logo-Dekton-menu.svg' },
  { id: 7, name: 'TEKA', url: '' },
  { id: 8, name: 'BRIGGS', url: '' },
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
  whatsappNumber: '0963064374',
  address: 'Rosa Yeira 420 y Serpaio Japeravi, Quito, Ecuador',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7796588557444!2d-78.5347701!3d-0.2522322999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5991c8015c583%3A0x4766de73906f7d5f!2sRosa%20Yeira%20420%2C%20Quito%20170148!5e0!3m2!1ses-419!2sec!4v1772991627819!5m2!1ses-419!2sec',
  socialUrls: {
    facebook: 'https://facebook.com/modularesgm',
    instagram: 'https://www.instagram.com/modularesgm2020/',
    linkedin: ''
  },
  theme: {
    primary: '#2C5F6D',
    secondary: '#B88E44',
    background: '#19242D',
    foreground: '#F5F1E5',
    accent: '#B88E44'
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