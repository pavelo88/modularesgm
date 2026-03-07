'use client';

import { Hero } from '@/components/home/hero';
import { BrandsCarousel } from '@/components/home/brands-carousel';
import { Services } from '@/components/home/services';
import { ContactSection } from '@/components/home/contact/contact-section';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteContent } from '@/context/site-content-provider';

export default function HomePage() {
  const { siteContent, loading } = useSiteContent();

  if (loading || !siteContent) {
    return (
      <div className="pt-20">
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
      <div id="top" className="h-0 pt-20"></div>
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
