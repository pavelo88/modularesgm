import type { Metadata } from 'next';
import { CATEGORIES_SEO, getProductsByCategory } from '@/lib/catalog-full';
import { CategoryShowcase } from '@/components/catalog/category-showcase';

const config = CATEGORIES_SEO['muebles-bano'];

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  alternates: {
    canonical: `https://www.modularesgm.com/${config.slug}`,
  },
  openGraph: {
    title: config.title,
    description: config.metaDescription,
    url: `https://www.modularesgm.com/${config.slug}`,
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function MueblesBanoPage() {
  const products = getProductsByCategory('Muebles de Baño');
  return <CategoryShowcase config={config} products={products} />;
}
