import { defaultSiteContent } from '@/lib/data';
import type { SiteContent } from '@/lib/types';
import { PublicLayoutClient } from './layout-client';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// This is a server component that fetches the initial data from Firestore.
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialSiteContent: SiteContent = defaultSiteContent;

  try {
    const contentRef = doc(db, 'siteContent', 'main');
    const docSnap = await getDoc(contentRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Merge fetched data with defaults to ensure all required fields exist
      initialSiteContent = {
        ...defaultSiteContent,
        ...data,
        services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
        brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
      };
    }
  } catch (error) {
    console.error("Error fetching initial site content on server:", error);
    // Fallback to defaultSiteContent if fetching fails
  }

  return (
    <PublicLayoutClient initialSiteContent={initialSiteContent}>
      {children}
    </PublicLayoutClient>
  );
}
