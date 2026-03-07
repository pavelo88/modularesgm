import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { appId } from '@/lib/config';
import { defaultSiteContent } from '@/lib/data';
import type { SiteContent } from '@/lib/types';
import { PublicLayoutClient } from './layout-client';

// This is a server component that fetches the initial data.
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialSiteContent: SiteContent;

  try {
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const docSnap = await getDoc(contentRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
      // Merge fetched data with defaults to avoid missing properties
      initialSiteContent = {
        ...defaultSiteContent,
        ...data,
        services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
        brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
        seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
        socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
      };
    } else {
      initialSiteContent = defaultSiteContent;
    }
  } catch (error) {
    console.error("Error fetching initial site content on server, returning default.", error);
    initialSiteContent = defaultSiteContent;
  }

  return (
    <PublicLayoutClient initialSiteContent={initialSiteContent}>
      {children}
    </PublicLayoutClient>
  );
}
