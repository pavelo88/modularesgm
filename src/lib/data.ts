import type { Service, Product, Brand, Stat, SiteContent } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';

export const defaultServices: Service[] = [
  { 
    id: 1, 
    title: 'Cocinas Integrales & Mesones de Cuarzo', 
    desc: 'Cocinas modulares a medida con tableros hidrófugos Pelikano RH de 18mm, herrajes Blum con cierre lento e islas con cuarzo Calacatta.', 
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.webp', 
    icon: 'Home', 
    catalogUrl: '/cocinas' 
  },
  { 
    id: 2, 
    title: 'Topes de Cuarzo, Granito & Dekton', 
    desc: 'Cortes CNC computarizados de alta precisión, cascadas ingleteadas y superficies antibacterianas para mesones de cocina y baño.', 
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-006.webp', 
    icon: 'Grid', 
    catalogUrl: '/catalogo' 
  },
  { 
    id: 3, 
    title: 'Clósets, Armarios & Walk-in Closets', 
    desc: 'Vestidores personalizados con pantaloneras extraíbles, zapateras deslizables, iluminación LED 3000K y puertas en vidrio templado.', 
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-017.webp', 
    icon: 'LayoutGrid', 
    catalogUrl: '/closets' 
  },
  { 
    id: 4, 
    title: 'Vanities & Muebles de Baño', 
    desc: 'Muebles de baño flotantes en melamina marina RH resistente a la condensación, con mesones en cuarzo y espejos táctiles retroiluminados.', 
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp', 
    icon: 'Briefcase', 
    catalogUrl: '/muebles-bano' 
  },
  { 
    id: 5, 
    title: 'Puertas Pivotantes Monumentales', 
    desc: 'Puertas de ingreso principal de hasta 3 metros de altura con pivotes axiales inoxidables de alto tonelaje y cerraduras inteligentes.', 
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.webp', 
    icon: 'Shield', 
    catalogUrl: '/puertas' 
  },
  { 
    id: 6, 
    title: 'Centros de TV & Mobiliario Gamer', 
    desc: 'Paneles de TV flotantes con repisas retroiluminadas, ranurado acústico y organizadores de periféricos con cableado 100% oculto.', 
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp', 
    icon: 'MonitorPlay', 
    catalogUrl: '/gamer' 
  },
  { 
    id: 7, 
    title: 'Mobiliario Corporativo & Oficinas', 
    desc: 'Counters de recepción monolíticos, estaciones de trabajo modulares para equipos, credenzas ejecutivas y mesas de reuniones.', 
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp', 
    icon: 'Store', 
    catalogUrl: '/muebles-oficina' 
  },
  { 
    id: 8, 
    title: 'Escritorios Estudiantiles & Ergonomía', 
    desc: 'Estaciones de estudio y teletrabajo con tableros antirrayas de 18mm, pasacables de diseño y cajoneras móviles con cerradura.', 
    imgUrl: '/images/catalog/extracted_estudiantiles/img-000.webp', 
    icon: 'Palette', 
    catalogUrl: '/escritorios' 
  },
  { 
    id: 9, 
    title: 'Circuitos de Estimulación Infantil', 
    desc: 'Módulos psicomotrices en madera y melamina segura, estanterías Montessori y adecuaciones para guarderías y espacios de estimulación temprana.', 
    imgUrl: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp', 
    icon: 'Sparkles', 
    catalogUrl: '/store' 
  }
];

import { ALL_CATALOG_PRODUCTS } from './catalog-full';

export const defaultProducts: Product[] = ALL_CATALOG_PRODUCTS;


export const defaultBrands: Brand[] = [
  { id: 1, name: 'NOVOPAN', url: '/brands/novopan.webp' },
  { id: 2, name: 'PELIKANO', url: '/brands/pelikano.webp' },
  { id: 3, name: 'BLUM', url: '/brands/blum.svg' },
  { id: 4, name: 'HAFELE', url: '/brands/hafele.svg' },
  { id: 5, name: 'SILESTONE', url: '/brands/silestone.svg' },
  { id: 6, name: 'DEKTON', url: '/brands/dekton.svg' },
  { id: 7, name: 'TEKA', url: '/brands/teka.svg' },
  { id: 8, name: 'BRIGGS', url: '/brands/briggs.webp' },
  { id: 9, name: 'COSENTINO', url: '/brands/cosentino.svg' }
];


export const defaultStats: Stat[] = [
  { id: 1, value: '18+', label: 'AÑOS EXP.', icon: 'Globe' },
  { id: 2, value: '1000+', label: 'PROYECTOS', icon: 'Home' },
  { id: 3, value: '100%', label: 'PERSONALIZADO', icon: 'Ruler' },
  { id: 4, value: 'EC', label: 'NIVEL NACIONAL', icon: 'MapPin' }
];

export const defaultSiteContent: SiteContent = {
  heroTitle: 'Diseño y Construcción de Espacios Únicos',
  heroSubtitle: 'Expertos en muebles modulares, cocinas modernas y topes de cuarzo. Transformamos tus ideas en realidad con calidad y elegancia en todo el Ecuador.',
  heroMediaUrl: '/images/catalog/extracted_DE_COCINAS/img-004.webp',
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
    primary: '#252A32',
    secondary: '#AD823B',
    background: '#111316',
    foreground: '#F6F4ED',
    accent: '#AD823B'
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