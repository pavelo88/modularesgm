export interface PortalHeaderInfo {
  title: string;
  desc: string;
}

export const PORTAL_PAGES_INFO: Record<string, PortalHeaderInfo> = {
  '/afiliados/portal': {
    title: 'Resumen',
    desc: 'Así va tu negocio hoy. Comparte tu enlace y gana por cada venta.',
  },
  '/afiliados/portal/ganancias': {
    title: 'Ganancias',
    desc: 'Cada comisión que generan tus ventas y las de tu red, en tiempo real.',
  },
  '/afiliados/portal/red': {
    title: 'Mi red',
    desc: 'Las personas que invitaste y las que ellas invitaron. Ganas una parte de sus ventas.',
  },
  '/afiliados/portal/retiros': {
    title: 'Retiros',
    desc: 'Retira tus ganancias cuando quieras. Seguimiento en tiempo real de tus pagos.',
  },
  '/afiliados/portal/recursos': {
    title: 'Recursos para vender',
    desc: 'Enlaces y textos listos para compartir. Cambia el destino y cópialos con un clic.',
  },
  '/afiliados/portal/perfil': {
    title: 'Mi perfil',
    desc: 'Tus datos, tu usuario y la seguridad de tu cuenta.',
  },
};

export function getPortalHeaderInfo(pathname: string): PortalHeaderInfo {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  if (PORTAL_PAGES_INFO[cleanPath]) {
    return PORTAL_PAGES_INFO[cleanPath];
  }
  for (const [key, value] of Object.entries(PORTAL_PAGES_INFO)) {
    if (key !== '/afiliados/portal' && cleanPath.startsWith(key)) {
      return value;
    }
  }
  return PORTAL_PAGES_INFO['/afiliados/portal'];
}
