import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'arquitectos-disenadores')!;

export const metadata: Metadata = {
  title: 'Fabricación para Arquitectos y Diseñadores | Modulares GM',
  description: 'Alianza técnica de manufactura CNC para estudios de arquitectura y diseñadores de interiores en Ecuador. Precisión y acabados de autor.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/arquitectos-disenadores`,
  },
  openGraph: {
    title: 'Fabricación para Arquitectos y Diseñadores | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/arquitectos-disenadores`,
    images: [
      {
        url: `${SITE_BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Modulares GM Fabricación para Arquitectos',
      },
    ],
  },
};

export default function ArquitectosDisenadoresPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
