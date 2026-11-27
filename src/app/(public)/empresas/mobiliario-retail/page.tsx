import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'mobiliario-retail')!;

export const metadata: Metadata = {
  title: 'Mobiliario para Retail y Supermercados | Modulares GM',
  description: 'Fabricación de góndolas para supermercados, fruteros modulares, estanterías comerciales y counters de cobro resistentes en Quito y Ecuador.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/mobiliario-retail`,
  },
  openGraph: {
    title: 'Mobiliario para Retail y Supermercados | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/mobiliario-retail`,
    images: [
      {
        url: `${SITE_BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Modulares GM Mobiliario para Retail',
      },
    ],
  },
};

export default function MobiliarioRetailPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
