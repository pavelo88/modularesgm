'use client';

import { useState } from 'react';
import { Link2, Mail, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { SITE_BASE } from '@/lib/site';
import { CopyButton, LinkField, PageHeader, SectionTitle, Segmented, enter, surface } from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

const DESTINATIONS = [
  { value: '/', label: 'Inicio' },
  { value: '/store', label: 'Tienda' },
  { value: '/#contacto', label: 'Cotizar un proyecto' },
];

export default function ResourcesPage() {
  const { affiliate, settings } = useAffiliateAccount();
  const [dest, setDest] = useState('/store');

  const url = (() => {
    const [path, hash] = dest.split('#');
    return `${SITE_BASE}${path}?vid=${affiliate.username}${hash ? `#${hash}` : ''}`;
  })();

  const captions = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      text: `Hola 👋 Te recomiendo Modulares GM para cocinas, clósets y muebles a medida en Ecuador. Con mi enlace tienes ${settings.customerDiscount}% de descuento: ${url}`,
    },
    {
      icon: Share2,
      title: 'Instagram / Facebook',
      text: `¿Renovando tu cocina o clósets? Modulares GM fabrica a medida, con diseño 3D e instalación incluida. Usa mi enlace y obtén ${settings.customerDiscount}% de descuento 👉 ${url}`,
    },
    {
      icon: Mail,
      title: 'Correo',
      text: `Asunto: Tu proyecto de cocina o clósets\n\nHola, trabajo con Modulares GM, fabricantes de muebles modulares a medida. Si te interesa cotizar, entra por mi enlace y recibe ${settings.customerDiscount}% de descuento: ${url}`,
    },
  ];

  const earnings = [
    { pct: settings.sellerRate, title: 'Tus ventas', text: 'De cada venta pagada con tu enlace o código.' },
    { pct: settings.parentRate, title: 'Nivel 1', text: 'De las ventas de quienes invitaste directamente.' },
    { pct: settings.grandparentRate, title: 'Nivel 2', text: 'De las ventas de los invitados de tus invitados.' },
  ];

  return (
    <>
      <PageHeader eyebrow="Herramientas" title="Recursos para vender" subtitle="Enlaces y textos listos para compartir. Cambia el destino y cópialos con un clic." />

      <section style={{ animationDelay: '60ms' }} className={cn(surface, enter, 'relative mb-6 overflow-hidden p-5 md:mb-8 md:p-6')}>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="relative space-y-4">
          <SectionTitle icon={Link2} title="Generador de enlaces" hint="Elige a qué página quieres llevar a tu cliente." />
          <Segmented label="Destino del enlace" value={dest} onChange={setDest} options={DESTINATIONS} />
          <LinkField value={url} label="Copiar enlace" />
        </div>
      </section>

      <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-3">
        {captions.map((c, i) => (
          <article
            key={c.title}
            style={{ animationDelay: `${100 + i * 40}ms` }}
            className={cn(surface, enter, 'flex min-w-0 flex-col p-5')}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.22)]">
                <c.icon size={17} />
              </span>
              <h3 className="font-semibold">{c.title}</h3>
            </div>
            <p className="mb-4 flex-1 whitespace-pre-line break-words rounded-xl bg-muted/50 p-3.5 text-[13px] leading-relaxed text-muted-foreground shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
              {c.text}
            </p>
            <CopyButton text={c.text} label="Copiar texto" />
          </article>
        ))}
      </div>

      <section style={{ animationDelay: '240ms' }} className={cn(surface, enter, 'p-5 md:p-6')}>
        <SectionTitle icon={Sparkles} title="Cómo se calculan tus ganancias" hint="Se acreditan cuando el pago del cliente queda verificado." />
        <ul className="grid gap-3 sm:grid-cols-3">
          {earnings.map((e) => (
            <li key={e.title} className="rounded-xl bg-muted/50 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
              <p className="font-headline text-3xl font-bold tabular-nums text-primary">{e.pct}%</p>
              <p className="mt-1 text-sm font-semibold">{e.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.text}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <li>• Si el pedido se cancela, la comisión se revierte.</li>
          <li>
            • Retiro mínimo: <strong className="text-foreground">${settings.minWithdrawal}</strong>.
          </li>
        </ul>
      </section>
    </>
  );
}
