import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { SectorPageTemplate } from '@/components/corporate/sector-page-template';
import { SITE_BASE } from '@/lib/site';

const sector = CORPORATE_SECTORS.find((s) => s.slug === 'espacios-de-atencion')!;

export const metadata: Metadata = {
  title: 'Mobiliario para Espacios de Atención | Modulares GM',
  description: 'Mobiliario arquitectónico para recepciones, salas de espera, counters de atención al cliente y áreas administrativas en centros de servicios.',
  alternates: {
    canonical: `${SITE_BASE}/empresas/espacios-de-atencion`,
  },
  openGraph: {
    title: 'Mobiliario para Espacios de Atención | Modulares GM',
    description: sector.description,
    url: `${SITE_BASE}/empresas/espacios-de-atencion`,
    images: [
      {
        url: `${SITE_BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Modulares GM Espacios de Atención y Recepción',
      },
    ],
  },
};

export default function EspaciosDeAtencionPage() {
  if (!sector) notFound();
  return <SectorPageTemplate sector={sector} />;
}
