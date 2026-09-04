import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel de Control & Administración | Modulares GM',
  description: 'Acceso privado de administración para la gestión de catálogo, servicios y solicitudes de cotizaciones.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.modularesgm.com/admin',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-muted/40">{children}</div>;
}
