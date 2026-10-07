import type { CatalogProduct } from '@/components/catalog/catalog-page';

// Datos de ejemplo basados en imágenes extraídas
// TODO: Reemplazar con datos de Firebase

export const catalogSections = [
  { id: 'escritorios', label: 'Escritorios Estudiantiles', icon: 'BookOpen' },
  { id: 'cocinas', label: 'Cocinas', icon: 'Home' },
  { id: 'closets', label: 'Closets y Vestidores', icon: 'Hanger' },
  { id: 'bano', label: 'Muebles de Baño', icon: 'Droplet' },
  { id: 'gamer', label: 'Muebles Gamer', icon: 'Zap' },
  { id: 'oficina', label: 'Muebles de Oficina', icon: 'Briefcase' },
  { id: 'puertas', label: 'Puertas', icon: 'Door' },
  { id: 'estimulacion', label: 'Circuitos de Estimulación', icon: 'Brain' },
];

export const escritoriosProducts: CatalogProduct[] = [
  {
    id: 'edt-001',
    sku: 'EDL-0200',
    nombre: 'Escritorio Estudiantil Básico',
    descripcion: 'Escritorio compacto ideal para habitaciones pequeñas. Estructura resistente en melamina.',
    precio: 165,
    dimensiones: '140×70 cm',
    imagen: '/placeholder-escritorio-1.webp',
    disponible: true,
  },
  {
    id: 'edt-002',
    sku: 'EDL-0300',
    nombre: 'Escritorio con Estante Superior',
    descripcion: 'Escritorio con almacenamiento integrado. Perfecto para estudiantes.',
    precio: 220,
    dimensiones: '150×75 cm',
    imagen: '/placeholder-escritorio-2.webp',
    disponible: true,
  },
  {
    id: 'edt-003',
    sku: 'ELC-600',
    nombre: 'Escritorio Premium Modular',
    descripcion: 'Diseño moderno con acabados premium. Modular para adaptarse a cualquier espacio.',
    precio: 350,
    precioDescuento: 290,
    dimensiones: '160×80 cm',
    imagen: '/placeholder-escritorio-3.webp',
    disponible: true,
  },
];

export const cocinasProducts: CatalogProduct[] = [
  {
    id: 'coc-001',
    sku: 'COC-001',
    nombre: 'Cocina Modular Básica',
    descripcion: 'Muebles altos y bajos en melamina RH, herrajes estándar. Totalmente personalizable.',
    precio: 250,
    dimensiones: 'Metro lineal',
    imagen: '/placeholder-cocina-1.webp',
    disponible: true,
  },
  {
    id: 'coc-002',
    sku: 'ISLA-001',
    nombre: 'Isla de Cocina con Tope de Cuarzo',
    descripcion: 'Isla central con almacenamiento inferior y acabado premium en cuarzo.',
    precio: 950,
    precioDescuento: 850,
    imagen: '/placeholder-cocina-2.webp',
    disponible: true,
  },
];

export const closetsProducts: CatalogProduct[] = [
  {
    id: 'cls-001',
    sku: 'CLS-0100',
    nombre: 'Clóset Modular Estándar',
    descripcion: 'Módulo interno con cajoneras y tubos colgadores. Herrajes Blum.',
    precio: 180,
    dimensiones: '1m lineal',
    imagen: '/placeholder-closet-1.webp',
    disponible: true,
  },
  {
    id: 'cls-002',
    sku: 'WIC-PREMIUM',
    nombre: 'Walk-in Closet Premium',
    descripcion: 'Diseño amplio con herrajes Blum y cajones iluminados. Lujo total.',
    precio: 1500,
    precioDescuento: 1200,
    imagen: '/placeholder-closet-2.webp',
    disponible: true,
  },
];

export const banoProducts: CatalogProduct[] = [
  {
    id: 'bano-001',
    sku: 'VAN-001',
    nombre: 'Mueble de Baño Flotante 60cm',
    descripcion: 'Resistente a la humedad con tope de cuarzo. Moderno y elegante.',
    precio: 350,
    precioDescuento: 290,
    imagen: '/placeholder-bano-1.webp',
    disponible: true,
  },
];

export const gamerProducts: CatalogProduct[] = [
  {
    id: 'gmr-001',
    sku: 'SILLA-GAMER',
    nombre: 'Silla Gamer Profesional',
    descripcion: 'Silla ergonómica con soporte lumbar y reposabrazos 4D.',
    precio: 120,
    precioDescuento: 90,
    imagen: '/placeholder-gamer-1.webp',
    disponible: true,
  },
];

export const oficinaProducts: CatalogProduct[] = [
  {
    id: 'of-001',
    sku: 'DESK-CORP',
    nombre: 'Escritorio Corporativo',
    descripcion: 'Escritorio minimalista con estructura metálica. Ideal para oficinas.',
    precio: 180,
    precioDescuento: 150,
    imagen: '/placeholder-oficina-1.webp',
    disponible: true,
  },
];

export const puertasProducts: CatalogProduct[] = [
  {
    id: 'pue-001',
    sku: 'PUERTA-MDF',
    nombre: 'Puerta Lacada Premium',
    descripcion: 'Puerta interior en MDF lacado blanco o colores. Herrajes silenciosos.',
    precio: 400,
    precioDescuento: 350,
    imagen: '/placeholder-puerta-1.webp',
    disponible: true,
  },
];

export const estimulacionProducts: CatalogProduct[] = [
  {
    id: 'est-001',
    sku: 'CIRC-001',
    nombre: 'Circuito de Estimulación Táctil',
    descripcion: 'Juego educativo para desarrollo sensorial. Colores vivos.',
    precio: 89,
    imagen: '/placeholder-estimulacion-1.webp',
    disponible: true,
  },
];

export const catalogData: Record<string, CatalogProduct[]> = {
  escritorios: escritoriosProducts,
  cocinas: cocinasProducts,
  closets: closetsProducts,
  bano: banoProducts,
  gamer: gamerProducts,
  oficina: oficinaProducts,
  puertas: puertasProducts,
  estimulacion: estimulacionProducts,
};
