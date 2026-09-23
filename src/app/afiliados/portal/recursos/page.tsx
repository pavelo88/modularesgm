'use client';

import { useState } from 'react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { SITE_BASE } from '@/lib/site';
import { Card } from '@/components/ui/card';
import { CopyButton, PageHeader } from '@/components/affiliates/portal-ui';

const DESTINATIONS = [
  { label: 'Inicio', path: '/' },
  { label: 'Tienda', path: '/store' },
  { label: 'Cotizar un proyecto', path: '/#contacto' },
];

export default function ResourcesPage() {
  const { affiliate, settings } = useAffiliateAccount();
  const [dest, setDest] = useState(DESTINATIONS[1].path);

  const url = (() => {
    const [path, hash] = dest.split('#');
    return `${SITE_BASE}${path}?vid=${affiliate.username}${hash ? `#${hash}` : ''}`;
  })();

  const captions = [
    { title: 'WhatsApp', text: `Hola 👋 Te recomiendo Modulares GM para cocinas, clósets y muebles a medida en Ecuador. Con mi enlace tienes ${settings.customerDiscount}% de descuento: ${url}` },
    { title: 'Instagram / Facebook', text: `¿Renovando tu cocina o clósets? Modulares GM fabrica a medida, con diseño 3D e instalación incluida. Usa mi enlace y obtén ${settings.customerDiscount}% de descuento 👉 ${url}` },
    { title: 'Correo', text: `Asunto: Tu proyecto de cocina o clósets\n\nHola, trabajo con Modulares GM, fabricantes de muebles modulares a medida. Si te interesa cotizar, entra por mi enlace y recibe ${settings.customerDiscount}% de descuento: ${url}` },
  ];

  return (
    <>
      <PageHeader eyebrow="Herramientas" title="Recursos para vender" />

      <Card className="p-6 rounded-2xl mb-8">
        <h2 className="font-bold mb-4">Generador de enlaces</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {DESTINATIONS.map((d) => (
            <button
              key={d.path}
              type="button"
              onClick={() => setDest(d.path)}
              className={`rounded-full border px-4 py-1.5 text-sm ${dest === d.path ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs md:text-sm break-all rounded-lg bg-muted px-4 py-3 mb-3">{url}</p>
        <CopyButton text={url} label="Copiar enlace" />
      </Card>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {captions.map((c) => (
          <Card key={c.title} className="p-5 rounded-2xl flex flex-col">
            <h3 className="font-bold mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line flex-1 mb-4">{c.text}</p>
            <CopyButton text={c.text} label="Copiar texto" />
          </Card>
        ))}
      </div>

      <Card className="p-6 rounded-2xl">
        <h2 className="font-bold mb-4">Cómo se calculan tus ganancias</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>{settings.sellerRate}%</strong> de cada venta pagada con tu enlace o código.</li>
          <li><strong>{settings.parentRate}%</strong> de las ventas de quienes invitaste directamente (nivel 1).</li>
          <li><strong>{settings.grandparentRate}%</strong> de las ventas de los invitados de tus invitados (nivel 2).</li>
          <li>Las comisiones se acreditan cuando el pago del cliente queda verificado, y se revierten si el pedido se cancela.</li>
          <li>Retiro mínimo: <strong>${settings.minWithdrawal}</strong>.</li>
        </ul>
      </Card>
    </>
  );
}
