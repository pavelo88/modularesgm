import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'oficinas-corporativas')!;

export const metadata: Metadata = {
  title: 'Mobiliario para Oficinas Corporativas | Modulares GM',
  description: 'Estaciones de trabajo modulares, salas de reuniones ejecutivas, counters de recepción y divisiones ergonómicas para empresas en Ecuador.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/oficinas-corporativas`,
  },
  openGraph: {
    title: 'Mobiliario Corporativo y Oficinas | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/oficinas-corporativas`,
    images: [{ url: `${SITE_BASE}${sector.heroImage}` }],
  },
};

export default function OficinasCorporativasPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
