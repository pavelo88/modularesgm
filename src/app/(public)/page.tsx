'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/home/hero';
import { BrandsCarousel } from '@/components/home/brands-carousel';
import { Services } from '@/components/home/services';
import { ContactSection } from '@/components/home/contact/contact-section';
import { defaultSiteContent } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteContent() {
      try {
        const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
        const docSnap = await getDoc(contentRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteContent;
           setSiteContent({
            ...defaultSiteContent,
            ...data,
            services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
            brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
            stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
            products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
          });
        } else {
          setSiteContent(defaultSiteContent);
        }
      } catch (error) {
        console.error("Error fetching site content, returning default.", error);
        setSiteContent(defaultSiteContent);
      } finally {
        setLoading(false);
      }
    }
    fetchSiteContent();
  }, []);

  if (loading || !siteContent) {
    return (
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-10 w-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
      </div>
    );
  }

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
