import type { ReactNode } from 'react';
import type { AnalyticsDays } from '@/lib/ga-report';

export type AdminTab =
  | 'analytics'
  | 'users'
  | 'general'
  | 'theme'
  | 'services'
  | 'products'
  | 'brands'
  | 'leads'
  | 'orders'
  | 'affiliates';

export interface MenuItem {
  id: AdminTab;
  label: string;
  icon: ReactNode;
}

export const ANALYTICS_PERIODS: { days: AnalyticsDays; label: string }[] = [
  { days: 7, label: '7 días' },
  { days: 28, label: '28 días' },
  { days: 90, label: '90 días' },
];

export const getTabHeaderInfo = (activeTab: AdminTab, servicesCount: number, productsCount: number) => {
  switch (activeTab) {
    case 'general':
      return {
        title: 'Configuración de Inicio',
        desc: 'Modifica el Hero, contacto, garantías y SEO del sitio.',
      };
    case 'analytics':
      return {
        title: 'Visitas de modularesgm.com',
        desc: 'Datos de Google Analytics. Pueden tardar hasta 24 horas en aparecer.',
      };
    case 'users':
      return {
        title: 'Directorio de Usuarios & Roles',
        desc: 'Gestión centralizada del equipo GM. Los usuarios creados ingresan con cédula y exigen cambio de clave.',
      };
    case 'services':
      return {
        title: 'Gestión de Servicios',
        desc: `${servicesCount} servicios activos en la web.`,
      };
    case 'theme':
      return {
        title: 'Apariencia y Colores',
        desc: 'Personaliza la paleta de colores y la identidad visual de la marca.',
      };
    case 'products':
      return {
        title: 'Catálogo de la Tienda Online',
        desc: `${productsCount} productos registrados en la plataforma.`,
      };
    case 'brands':
      return {
        title: 'Marcas y Experiencia (Stats)',
        desc: 'Gestiona los logos de proveedores y las métricas oficiales del Hero.',
      };
    case 'leads':
      return {
        title: 'Leads y Contactos',
        desc: 'Bandeja centralizada de solicitudes de cotización recibidas en la web.',
      };
    case 'orders':
      return {
        title: 'Órdenes de Compra',
        desc: 'Seguimiento en tiempo real de pedidos y comprobantes de pago.',
      };
    case 'affiliates':
      return {
        title: 'Sistema de Afiliados',
        desc: 'Plan 10-3-2 de comisiones, red multinivel y pagos a embajadores.',
      };
    default:
      return {
        title: 'Panel Administrativo',
        desc: 'Gestión general de Modulares GM.',
      };
  }
};

export interface JumpMatch {
  tab: AdminTab;
  elementId?: string;
  feedback: string;
}

export const getTabNavLabel = (activeTab: AdminTab): string => {
  switch (activeTab) {
    case 'analytics': return 'Analítica';
    case 'users': return 'Directorio de Usuarios & Roles';
    case 'general': return 'Inicio y Contacto';
    case 'theme': return 'Apariencia y Colores';
    case 'services': return 'Gestión de Servicios';
    case 'products': return 'Catálogo de la Tienda Online';
    case 'brands': return 'Marcas y Experiencia';
    case 'leads': return 'Leads y Contactos';
    case 'orders': return 'Órdenes de Compra';
    case 'affiliates': return 'Sistema de Afiliados';
  }
};

export function findJumpMatch(query: string): JumpMatch | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  if (q.includes('tranquilidad') || q.includes('garantia') || q.includes('hogar') || q.includes('contrato') || q.includes('retraso')) {
    return { tab: 'general', elementId: 'section-trust', feedback: 'Navegando a Garantías y Diferenciales en Inicio.' };
  }
  if (q.includes('hero') || q.includes('cocina') || q.includes('diseño') || q.includes('espacio') || q.includes('marquesina') || q.includes('topbar')) {
    return { tab: 'general', elementId: 'heroTitle', feedback: 'Navegando a Banner Principal (Hero).' };
  }
  if (q.includes('color') || q.includes('paleta') || q.includes('tema') || q.includes('apariencia')) {
    return { tab: 'theme', feedback: 'Navegando a Apariencia y Colores.' };
  }
  if (q.includes('servicio') || q.includes('cuarzo') || q.includes('mueble') || q.includes('closet')) {
    return { tab: 'services', feedback: 'Navegando a Gestión de Servicios.' };
  }
  if (q.includes('precio') || q.includes('producto') || q.includes('tienda') || q.includes('gamer') || q.includes('escritorio')) {
    return { tab: 'products', feedback: 'Navegando a Tienda Online.' };
  }
  if (q.includes('usuario') || q.includes('clave') || q.includes('rol') || q.includes('cedula') || q.includes('dni')) {
    return { tab: 'users', feedback: 'Navegando a Usuarios y Roles.' };
  }
  if (q.includes('visita') || q.includes('analitica') || q.includes('analytics') || q.includes('grafico')) {
    return { tab: 'analytics', feedback: 'Navegando a Analítica.' };
  }
  if (q.includes('lead') || q.includes('contacto') || q.includes('mensaje')) {
    return { tab: 'leads', feedback: 'Navegando a Leads y Contactos.' };
  }
  if (q.includes('orden') || q.includes('pedido') || q.includes('pago')) {
    return { tab: 'orders', feedback: 'Navegando a Órdenes de Compra.' };
  }
  if (q.includes('afiliado') || q.includes('comision') || q.includes('embajador')) {
    return { tab: 'affiliates', feedback: 'Navegando a Sistema de Afiliados.' };
  }
  return null;
}

