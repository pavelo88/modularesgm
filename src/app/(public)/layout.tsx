import { defaultSiteContent } from '@/lib/data';
import { PublicLayoutClient } from './layout-client';
import { adminDb } from '@/lib/firebase-admin';
import type { SiteContent } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getInitialSiteContent(): Promise<SiteContent> {
  try {
    const snap = await adminDb().doc('siteContent/main').get();
    if (snap.exists) {
      const data = snap.data() as Partial<SiteContent>;
      const rawBrands = data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands;
      const sanitizedBrands = rawBrands.map((b) => {
        const url = b.url || '';
        if (
          url.includes('briggsec.com') ||
          url.includes('wikimedia.org') ||
          url.includes('squarespace-cdn.com') ||
          url.includes('pelikano.com') ||
          url.includes('clearbit.com')
        ) {
          return { ...b, url: '' };
        }
        return b;
      });

      const rawServices = data.services && data.services.length > 0 ? data.services : defaultSiteContent.services;
      const sanitizedServices = rawServices.map((s) => {
        if (s.imgUrl && s.imgUrl.includes('photo-1556761175-b413da4b248b')) {
          return {
            ...s,
            imgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=60&w=500&fm=webp',
          };
        }
        return s;
      });

      return {
        ...defaultSiteContent,
        ...data,
        services: sanitizedServices,
        brands: sanitizedBrands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
        seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
        theme: data.theme ? { ...defaultSiteContent.theme, ...data.theme } : defaultSiteContent.theme,
        socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
      };
    }
  } catch (error) {
    console.warn('[PublicLayout] Usando defaultSiteContent como fallback:', error);
  }
  return defaultSiteContent;
}

// This is a server component that renders initial site content instantly at Byte 0.
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSiteContent = await getInitialSiteContent();
  return (
    <PublicLayoutClient initialSiteContent={initialSiteContent}>
      {children}
    </PublicLayoutClient>
  );
}


