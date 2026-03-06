import { Hero } from '@/components/home/hero';
import { BrandsCarousel } from '@/components/home/brands-carousel';
import { Services } from '@/components/home/services';
import { ContactSection } from '@/components/home/contact/contact-section';
import { defaultSiteContent } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';

// Re-export metadata from layout until Next.js supports it better for pages
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Modulares GM | Muebles, Diseño y Construcción',
  description: 'Expertos en cocinas modulares, cuarzos, clósets y remodelación en Quito y todo el Ecuador.',
};


async function getSiteContent(): Promise<SiteContent> {
  try {
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const docSnap = await getDoc(contentRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
       return {
        ...defaultSiteContent,
        ...data,
        services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
        brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
      };
    }
    return defaultSiteContent;
  } catch (error) {
    console.error("Error fetching site content, returning default.", error);
    return defaultSiteContent;
  }
}

export default async function HomePage() {
  const siteContent = await getSiteContent();

  return (
    <>
      <div id="top" className="h-0 pt-24"></div>
      <Hero
        heroTitle={siteContent.heroTitle}
        heroSubtitle={siteContent.heroSubtitle}
        ctaText={siteContent.ctaText}
        stats={siteContent.stats}
      />
      <BrandsCarousel brands={siteContent.brands} />
      <Services services={siteContent.services} />
      <ContactSection siteContent={siteContent} />
    </>
  );
}
