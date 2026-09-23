import type { Metadata } from 'next';
import { PortalShellLayout } from '@/components/affiliates/portal-shell';

export const metadata: Metadata = {
  title: 'Portal de afiliados | Modulares GM',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShellLayout>{children}</PortalShellLayout>;
}
