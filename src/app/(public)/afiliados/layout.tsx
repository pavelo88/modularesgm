import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programa de Afiliados: Gana 10% Comisión | Modulares GM',
  description: 'Únete gratis al programa de afiliados de Modulares GM en Ecuador: gana 10% de comisión por venta recomendada de cocinas y muebles a medida.',
  alternates: { canonical: 'https://www.modularesgm.com/afiliados' },
  openGraph: {
    title: 'Programa de Afiliados: Gana 10% Comisión | Modulares GM',
    description: 'Únete gratis al programa de afiliados de Modulares GM en Ecuador: gana 10% de comisión por venta recomendada de cocinas y muebles a medida.',
    url: 'https://www.modularesgm.com/afiliados',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
