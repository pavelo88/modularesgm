import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trabaja con nosotros: gana comisiones | Modulares GM',
  description: 'Regístrate gratis en el programa de afiliados de Modulares GM: recibe tu enlace y código, comparte y gana comisiones por cada venta.',
  alternates: { canonical: 'https://www.modularesgm.com/afiliados' },
  openGraph: {
    title: 'Trabaja con nosotros: gana comisiones | Modulares GM',
    description: 'Regístrate gratis en el programa de afiliados de Modulares GM: recibe tu enlace y código, comparte y gana comisiones por cada venta.',
    url: 'https://www.modularesgm.com/afiliados',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
