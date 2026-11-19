import { defaultSiteContent } from '@/lib/data';
import type { SiteContent } from '@/lib/types';
import type { AdminTab } from './admin-header-utils';

export function restoreTabDefaults(
  activeTab: AdminTab,
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>
): boolean {
  if (activeTab === 'general') {
    if (confirm('¿Restaurar los valores por defecto de la sección Inicio y Contacto?')) {
      setSiteContent((prev) => ({
        ...prev,
        heroTitle: defaultSiteContent.heroTitle,
        heroSubtitle: defaultSiteContent.heroSubtitle,
        heroMediaUrl: defaultSiteContent.heroMediaUrl,
        ctaText: defaultSiteContent.ctaText,
        whatsappNumber: defaultSiteContent.whatsappNumber,
        address: defaultSiteContent.address,
        mapUrl: defaultSiteContent.mapUrl,
        socialUrls: defaultSiteContent.socialUrls,
        seo: defaultSiteContent.seo,
        trustTitle: defaultSiteContent.trustTitle,
        trustSubtitle: defaultSiteContent.trustSubtitle,
      }));
      return true;
    }
  } else if (activeTab === 'theme') {
    if (confirm('¿Restablecer colores a los valores por defecto?')) {
      setSiteContent((prev) => ({ ...prev, theme: defaultSiteContent.theme }));
      return true;
    }
  } else if (activeTab === 'services') {
    if (confirm('¿Restaurar todos los servicios a los valores originales de fábrica?')) {
      setSiteContent((prev) => ({ ...prev, services: defaultSiteContent.services }));
      return true;
    }
  } else if (activeTab === 'products') {
    if (confirm('¿Restaurar todos los productos a los valores por defecto?')) {
      setSiteContent((prev) => ({ ...prev, products: defaultSiteContent.products }));
      return true;
    }
  } else if (activeTab === 'brands') {
    if (confirm('¿Restaurar Marcas y Estadísticas a los valores originales?')) {
      setSiteContent((prev) => ({
        ...prev,
        brands: defaultSiteContent.brands,
        stats: defaultSiteContent.stats,
      }));
      return true;
    }
  }
  return false;
}
