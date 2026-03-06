import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { defaultSiteContent } from '@/lib/data';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';
import { AdminDashboardClient } from '@/components/admin/dashboard-client';

async function getSiteContent(): Promise<SiteContent> {
  try {
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const docSnap = await getDoc(contentRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
      // Merge fetched data with defaults to avoid missing properties
      return {
        ...defaultSiteContent,
        ...data,
        services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
        brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
        seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
        socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
      };
    }
    return defaultSiteContent;
  } catch (error) {
    console.error("Error fetching site content, returning default.", error);
    return defaultSiteContent;
  }
}

export default async function AdminDashboardPage() {
  const siteContent = await getSiteContent();
  return <AdminDashboardClient initialSiteContent={siteContent} />;
}
