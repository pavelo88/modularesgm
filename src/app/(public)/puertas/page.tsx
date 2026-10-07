import type { Metadata } from 'next';
import { CATEGORIES_SEO, getProductsByCategory } from '@/lib/catalog-full';
import { CategoryShowcase } from '@/components/catalog/category-showcase';

const config = CATEGORIES_SEO.puertas;

export const metadata: Metadata = {
  title: 'Puertas Principales y de Interior en Quito | GM 24/7',
  description: config.metaDescription,
  alternates: {
    canonical: `https://www.modularesgm.com/${config.slug}`,
  },
  openGraph: {
    title: 'Puertas Principales y de Interior en Quito | GM 24/7',
    description: config.metaDescription,
    url: `https://www.modularesgm.com/${config.slug}`,
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function PuertasPage() {
  const products = getProductsByCategory('Puertas');
  return <CategoryShowcase config={config} products={products} />;
}
