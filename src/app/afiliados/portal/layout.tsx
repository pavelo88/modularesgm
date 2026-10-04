import type { Metadata } from 'next';
import { PortalShellLayout } from '@/components/affiliates/portal-shell';

export const metadata: Metadata = {
  title: 'Portal de afiliados | Modulares GM',
  robots: { index: false, follow: false },
};

/** `.portal-scope` fija la paleta del portal desde el primer pintado (claro y oscuro). */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-scope min-h-screen bg-background text-foreground antialiased">
      <PortalShellLayout>{children}</PortalShellLayout>
    </div>
  );
}
