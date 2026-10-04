'use client';

import Link from 'next/link';
import { ArrowUpRight, Award, Link2, MessageCircle, MousePointerClick, PiggyBank, Share2, ShoppingBag, TrendingUp, Users, Wallet } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { buildAffiliateLink } from '@/lib/affiliate-core';
import { Button } from '@/components/ui/button';
import {
  CopyButton,
  Initials,
  LinkField,
  PageHeader,
  StatCard,
  StatusPill,
  enter,
  money,
  shortDate,
  surface,
  useClickCount,
  useUserDocs,
} from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

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

  const steps = [
    { icon: Link2, title: 'Copia tu enlace', text: 'Es único y lleva tu usuario: todo lo que se compre con él cuenta para ti.' },
    { icon: Share2, title: 'Compártelo', text: 'WhatsApp, redes, correo o en persona. Hay textos listos en Recursos.' },
    { icon: PiggyBank, title: 'Gana por cada venta', text: `Recibes ${settings.sellerRate}% de cada venta pagada, y más por tu red.` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Resumen"
        title={`Hola, ${affiliate.name.split(' ')[0]}`}
        subtitle="Así va tu negocio hoy. Comparte tu enlace y gana por cada venta."
      >
        <StatusPill tone="brand" icon={Award} className="px-3 py-1 text-xs">
          {affiliate.rank}
        </StatusPill>
      </PageHeader>

      {/* ───────── Enlace personal ───────── */}
      <section style={{ animationDelay: '60ms' }} className={cn(surface, enter, 'relative mb-6 overflow-hidden p-5 md:mb-8 md:p-8')}>
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.22)]">
              <Link2 size={16} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Tu enlace personal</p>
          </div>

          <div className="mt-4">
            <LinkField value={link} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={affiliate.username} label={`Código · ${affiliate.username}`} variant="outline" className="w-full sm:w-auto" />
            <Button asChild variant="outline" className="h-10 w-full rounded-xl px-4 font-medium sm:w-auto">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} className="mr-2 text-emerald-600 dark:text-emerald-400" /> Compartir por WhatsApp
              </a>
            </Button>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            <li>
              <StatusPill tone="success">Tu cliente recibe {settings.customerDiscount}% de descuento</StatusPill>
            </li>
            {settings.transferDiscount > 0 && (
              <li>
                <StatusPill tone="warn">+{settings.transferDiscount}% extra si paga por transferencia</StatusPill>
              </li>
            )}
            <li>
              <StatusPill tone="brand">Tú ganas {settings.sellerRate}% por venta</StatusPill>
            </li>
            <li>
              <StatusPill>
                +{settings.parentRate}% y +{settings.grandparentRate}% por tu red
              </StatusPill>
            </li>
          </ul>
        </div>
      </section>

      {/* ───────── Métricas ───────── */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-4 lg:grid-cols-3">
        <StatCard
          tone="primary"
          delay={100}
          className="col-span-2 lg:col-span-1"
          icon={Wallet}
          label="Disponible para retirar"
          value={money(affiliate.availableBalance)}
          hint={affiliate.pendingBalance ? `${money(affiliate.pendingBalance)} en proceso de retiro` : undefined}
          action={
            <Link
              href="/afiliados/portal/retiros"
              className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-[transform,filter] duration-150 hover:brightness-110 active:scale-95"
            >
              Retirar <ArrowUpRight size={13} />
            </Link>
          }
        />
        <StatCard delay={140} icon={PiggyBank} label="Ganancias totales" value={money(affiliate.totalEarnings)} />
        <StatCard delay={180} icon={ShoppingBag} label="Ventas propias" value={String(affiliate.salesCount)} hint={`Volumen personal ${money(affiliate.monthlyVolume)}`} />
        <StatCard delay={220} icon={MousePointerClick} label="Clics en tu enlace" value={String(clicks)} hint={`Conversión ${conversion}%`} />
        <StatCard delay={260} icon={Users} label="Volumen de tu red" value={money(affiliate.networkVolume)} />
        <StatCard delay={300} icon={TrendingUp} label="Rango" value={affiliate.rank} className="col-span-2 lg:col-span-1" />
      </div>

      {/* ───────── Últimas comisiones ───────── */}
      <section style={{ animationDelay: '340ms' }} className={cn(surface, enter, 'overflow-hidden')}>
        <div className="flex items-center justify-between gap-3 px-5 py-4 shadow-[0_1px_0_hsl(var(--border)/0.7)]">
          <h2 className="font-semibold">Últimas comisiones</h2>
          <Link href="/afiliados/portal/ganancias" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todas <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">Cargando…</p>
        ) : recent.length === 0 ? (
          <div className="p-5">
            <p className="mb-4 text-sm text-muted-foreground">Aún no tienes comisiones. Así empiezas:</p>
            <ol className="grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-xl bg-muted/50 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/12 text-primary">
                      <s.icon size={16} />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Paso {i + 1}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-muted/40">
                <Initials name={c.customerFirstName || 'Venta'} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {shortDate(c.createdAt)}
                    {c.customerFirstName ? ` · ${c.customerFirstName}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className={cn('text-sm font-bold tabular-nums', c.status === 'credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground line-through')}>
                    +{money(c.commissionAmount)}
                  </p>
                  {c.status === 'reversed' && <StatusPill tone="danger">Revertida</StatusPill>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
