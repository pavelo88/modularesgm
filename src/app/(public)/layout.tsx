import { defaultSiteContent } from '@/lib/data';
import type { SiteContent } from '@/lib/types';
import { PublicLayoutClient } from './layout-client';

// This is a server component that fetches the initial data.
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily using default site content to bring the site back online.
  // The Firebase connection needs to be re-established.
  const initialSiteContent: SiteContent = defaultSiteContent;

  return (
    <PublicLayoutClient initialSiteContent={initialSiteContent}>
      {children}
    </PublicLayoutClient>
  );
}
