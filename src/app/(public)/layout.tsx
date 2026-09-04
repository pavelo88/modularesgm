import { defaultSiteContent } from '@/lib/data';
import { PublicLayoutClient } from './layout-client';

// This is a server component that renders initial site content instantly.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayoutClient initialSiteContent={defaultSiteContent}>
      {children}
    </PublicLayoutClient>
  );
}

