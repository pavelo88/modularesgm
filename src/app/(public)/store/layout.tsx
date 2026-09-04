import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Muebles & Cocinas | Modulares GM Ecuador',
  description: 'Explora nuestro catálogo exclusivo de cocinas modulares, mesones de cuarzo, clósets y vanities a medida en Quito y todo el Ecuador.',
  keywords: [
    'catálogo de muebles quito', 'cocinas modulares ecuador', 'comprar muebles de cocina',
    'tienda de cuarzo quito', 'clósets a medida ecuador', 'muebles de baño vanities'
  ],
  alternates: {
    canonical: 'https://www.modularesgm.com/store',
  },
  openGraph: {
    title: 'Catálogo de Muebles & Cocinas | Modulares GM Ecuador',
    description: 'Explora nuestro catálogo exclusivo de cocinas modulares, mesones de cuarzo, clósets y vanities a medida en Quito y todo el Ecuador.',
    url: 'https://www.modularesgm.com/store',
    type: 'website',
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
