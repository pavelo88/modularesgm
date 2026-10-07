import type { Metadata } from 'next';
import { CATEGORIES_SEO, getProductsByCategory } from '@/lib/catalog-full';
import { CategoryShowcase } from '@/components/catalog/category-showcase';

const config = CATEGORIES_SEO.closets;

export const metadata: Metadata = {
  title: 'Closets a Medida y Walk-in Closets en Quito | GM 24/7',
  description: config.metaDescription,
  alternates: {
    canonical: `https://www.modularesgm.com/${config.slug}`,
  },
  openGraph: {
    title: 'Closets a Medida y Walk-in Closets en Quito | GM 24/7',
    description: config.metaDescription,
    url: `https://www.modularesgm.com/${config.slug}`,
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function ClosetsPage() {
  const products = getProductsByCategory('Closets');
  return <CategoryShowcase config={config} products={products} />;
}
