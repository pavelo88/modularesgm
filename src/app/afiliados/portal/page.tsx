'use client';

import { MousePointerClick, PiggyBank, ShoppingBag, TrendingUp, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { buildAffiliateLink } from '@/lib/affiliate-core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton, EmptyState, PageHeader, StatCard, money, shortDate, useClickCount, useUserDocs } from '@/components/affiliates/portal-ui';

interface Commission {
  id: string;
  createdAt: string;
  role: string;
  level: number;
  commissionAmount: number;
  customerFirstName?: string;
  status: 'credited' | 'reversed';
}

export default function PortalDashboardPage() {
  const { affiliate, settings } = useAffiliateAccount();
  const clicks = useClickCount(affiliate.username);
  const { docs, loading } = useUserDocs<Commission>('affiliate_commissions', 'affiliateUsername', affiliate.username);
  const recent = [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  const link = buildAffiliateLink(affiliate.username);
  const conversion = clicks > 0 ? ((affiliate.salesCount / clicks) * 100).toFixed(1) : '0.0';
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(
    `Cocinas, clósets y muebles a medida con Modulares GM. Compra con mi enlace y obtén ${settings.customerDiscount}% de descuento: ${link}`
  )}`;

  return (
    <>
      <PageHeader eyebrow="Resumen" title={`Hola, ${affiliate.name.split(' ')[0]}`}>
        <Badge variant="outline" className="text-xs">{affiliate.rank}</Badge>
      </PageHeader>

      <Card className="p-6 md:p-8 rounded-3xl mb-8 bg-primary text-primary-foreground">
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Tu enlace personal</p>
        <p className="mt-3 font-mono text-sm md:text-base break-all rounded-xl bg-primary-foreground/10 px-4 py-3">{link}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyButton text={link} label="Copiar enlace" variant="secondary" />
          <CopyButton text={affiliate.username} label={`Copiar código · ${affiliate.username}`} variant="secondary" />
          <Button asChild size="sm" variant="secondary">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">Compartir por WhatsApp</a>
          </Button>
        </div>
        <p className="mt-4 text-sm opacity-90">
          Tus clientes reciben {settings.customerDiscount}% de descuento y tú ganas {settings.sellerRate}% de cada venta pagada.
        </p>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard tone="primary" icon={Wallet} label="Disponible para retirar" value={money(affiliate.availableBalance)} hint={affiliate.pendingBalance ? `${money(affiliate.pendingBalance)} en proceso de retiro` : undefined} />
        <StatCard icon={PiggyBank} label="Ganancias totales" value={money(affiliate.totalEarnings)} />
        <StatCard icon={ShoppingBag} label="Ventas propias" value={String(affiliate.salesCount)} hint={`Volumen personal ${money(affiliate.monthlyVolume)}`} />
        <StatCard icon={MousePointerClick} label="Clics en tu enlace" value={String(clicks)} hint={`Conversión ${conversion}%`} />
        <StatCard icon={Users} label="Volumen de tu red" value={money(affiliate.networkVolume)} />
        <StatCard icon={TrendingUp} label="Rango" value={affiliate.rank} />
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-bold">Últimas comisiones</h2>
          <Button asChild variant="link" size="sm"><Link href="/afiliados/portal/ganancias">Ver todas</Link></Button>
        </div>
        {loading ? (
          <EmptyState>Cargando…</EmptyState>
        ) : recent.length === 0 ? (
          <EmptyState>Aún no tienes comisiones. Comparte tu enlace para empezar.</EmptyState>
        ) : (
          <ul className="divide-y">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium">{c.role}</p>
                  <p className="text-xs text-muted-foreground">{shortDate(c.createdAt)}{c.customerFirstName ? ` · ${c.customerFirstName}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{money(c.commissionAmount)}</p>
                  {c.status === 'reversed' && <Badge variant="destructive" className="text-[10px]">Revertida</Badge>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
