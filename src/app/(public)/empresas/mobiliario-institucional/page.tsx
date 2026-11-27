import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'mobiliario-institucional')!;

export const metadata: Metadata = {
  title: 'Mobiliario Institucional y Educativo en Ecuador | Modulares GM',
  description: 'Fabricación de mobiliario para colegios, universidades, bibliotecas, lockers reforzados y áreas docentes en Quito y todo el Ecuador.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/mobiliario-institucional`,
  },
  openGraph: {
    title: 'Mobiliario Institucional y Educativo | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/mobiliario-institucional`,
    images: [{ url: `${SITE_BASE}${sector.heroImage}` }],
  },
};

export default function MobiliarioInstitucionalPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
