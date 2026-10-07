import { CatalogPage } from '@/components/catalog/catalog-page';
import { catalogSections, catalogData } from '@/lib/catalog-data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return catalogSections.map((section) => ({
    category: section.id,
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const section = catalogSections.find((s) => s.id === params.category);
  if (!section) return {};

  return {
    title: `${section.label} | Modulares GM`,
    description: `Catálogo de ${section.label.toLowerCase()}. Diseños personalizados y fabricación a medida.`,
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const section = catalogSections.find((s) => s.id === params.category);
  const products = catalogData[params.category];

  if (!section || !products) {
    notFound();
  }

  return (
    <CatalogPage
      title={section.label}
      description="Explora nuestros diseños en esta categoría. Todos personalizables según tus necesidades."
      products={products}
      backHref="/catalogo"
    />
  );
}
