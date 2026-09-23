import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso de afiliados | Modulares GM',
  description: 'Ingresa o crea tu cuenta de afiliado de Modulares GM para obtener tu enlace personal y ver tus ventas.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.modularesgm.com/afiliados/acceso' },
};

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
