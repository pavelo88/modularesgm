'use client';

import { Hero } from '@/components/home/hero';
import { BrandsCarousel } from '@/components/home/brands-carousel';
import { HomeSeoContent } from '@/components/home/home-seo-content';
import { AffiliateBand, CatalogSection, FeaturedProducts } from '@/components/home/storefront-sections';
import { ContactSection } from '@/components/home/contact/contact-section';
import { useSiteContent } from '@/context/site-content-provider';
import { defaultSiteContent } from '@/lib/data';

export default function HomePage() {
  const { siteContent } = useSiteContent();
  const content = siteContent || defaultSiteContent;

  return (
    <>
      <div id="top" />
      <Hero
        heroTitle={content.heroTitle}
        heroSubtitle={content.heroSubtitle}
        ctaText={content.ctaText}
        stats={content.stats}
      />
      <CatalogSection services={content.services} products={content.products} />
      <BrandsCarousel brands={content.brands} />
      <FeaturedProducts products={content.products} />
      <HomeSeoContent />
      <AffiliateBand />
      <ContactSection siteContent={content} />
    </>
  );
}
