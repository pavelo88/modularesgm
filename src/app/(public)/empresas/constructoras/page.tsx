import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'constructoras')!;

export const metadata: Metadata = {
  title: 'Mobiliario para Edificios y Constructoras | Modulares GM',
  description: 'Fabricación y suministro de cocinas, clósets y vanities a gran escala para proyectos inmobiliarios y torres residenciales en Quito y Ecuador.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/constructoras`,
  },
  openGraph: {
    title: 'Mobiliario para Edificios y Constructoras | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/constructoras`,
    images: [
      {
        url: `${SITE_BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Modulares GM Mobiliario para Constructoras',
      },
    ],
  },
};

export default function ConstructorasPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
