'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Copy, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { getAnalyticsReport } from '@/lib/actions';
import type { AnalyticsDays, AnalyticsReport, AnalyticsSetupError } from '@/lib/ga-report';
import { cn } from '@/lib/utils';

const PERIODS: { days: AnalyticsDays; label: string }[] = [
  { days: 7, label: '7 días' },
  { days: 28, label: '28 días' },
  { days: 90, label: '90 días' },
];

const chartConfig = { users: { label: 'Visitantes', color: 'hsl(var(--primary))' } } satisfies ChartConfig;

const fmt = (n: number) => n.toLocaleString('es-EC');
const dayLabel = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-EC', { timeZone: 'UTC', ...opts });

export function AnalyticsDashboard() {
  const [days, setDays] = useState<AnalyticsDays>(28);
  const [data, setData] = useState<AnalyticsReport | AnalyticsSetupError | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback((d: AnalyticsDays) => {
    startTransition(async () => {
      try {
        setData(await getAnalyticsReport(d));
      } catch {
        setData({ ok: false, reason: 'other', message: 'Tu sesión expiró. Vuelve a iniciar sesión.', propertyId: '' });
      }
    });
  }, []);

  useEffect(() => load(days), [days, load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Visitas de modularesgm.com</h2>
          <p className="text-sm text-muted-foreground">Datos de Google Analytics. Pueden tardar hasta 24 horas en aparecer.</p>
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Periodo" className="inline-flex rounded-lg border bg-background p-1">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setDays(p.days)}
                aria-pressed={days === p.days}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  days === p.days ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => load(days)} disabled={isPending} aria-label="Actualizar">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!data ? (
        <LoadingState />
      ) : data.ok ? (
        <ReportView report={data} />
      ) : (
        <SetupState error={data} />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(value)}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function RankedList({ title, rows, unit }: { title: string; rows: { label: string; value: number }[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos en este periodo.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.label} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate" title={r.label}>{r.label}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{fmt(r.value)} {unit}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ReportView({ report }: { report: AnalyticsReport }) {
  const { totals, events, daily } = report;
  const tickEvery = Math.ceil(daily.length / 7);

  return (
    <div className="space-y-6">
      <section aria-label="Tráfico" className="grid gap-4 sm:grid-cols-3">
        <Stat label="Visitantes" value={totals.users} />
        <Stat label="Sesiones" value={totals.sessions} />
        <Stat label="Páginas vistas" value={totals.views} />
      </section>

      <section aria-label="Conversiones" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Clics a WhatsApp" value={events.whatsapp_click} hint="Botones de WhatsApp del sitio" />
        <Stat label="Cotizaciones" value={events.generate_lead} hint="Formulario de contacto" />
        <Stat label="Afiliados nuevos" value={events.sign_up} hint="Registros en /afiliados" />
        <Stat label="Compras" value={events.purchase} hint="Pedidos en la tienda" />
      </section>

      {totals.users === 0 && (
        <p className="rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground">
          Todavía no hay visitas registradas en este periodo. Google Analytics tarda hasta 24 horas en mostrar los primeros datos.
          Mientras tanto, revisa <strong>Informes → Tiempo real</strong> en Google Analytics.
        </p>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Visitantes por día</CardTitle>
          <CardDescription>Últimos {report.days} días</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                interval={tickEvery - 1}
                tickFormatter={(v: string) => dayLabel(v, { day: 'numeric', month: 'short' })}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
              <ChartTooltip
                cursor
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const iso = payload?.[0]?.payload?.date;
                      return iso ? dayLabel(iso, { weekday: 'long', day: 'numeric', month: 'long' }) : '';
                    }}
                  />
                }
              />
              <Area
                dataKey="users"
                type="monotone"
                stroke="var(--color-users)"
                strokeWidth={2}
                fill="var(--color-users)"
                fillOpacity={0.15}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <RankedList title="De dónde llegan" unit="sesiones" rows={report.channels.map((c) => ({ label: c.name, value: c.sessions }))} />
        <RankedList title="Páginas más vistas" unit="vistas" rows={report.pages.map((p) => ({ label: p.path, value: p.views }))} />
        <RankedList title="Ciudades" unit="visitantes" rows={report.cities.map((c) => ({ label: c.name, value: c.users }))} />
      </div>
    </div>
  );
}

function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
      <code className="min-w-0 flex-1 break-all text-xs">{text}</code>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        <Copy className="mr-1 h-3.5 w-3.5" /> {copied ? 'Copiado' : 'Copiar'}
      </Button>
    </div>
  );
}

function SetupState({ error }: { error: AnalyticsSetupError }) {
  const needsApi = error.reason === 'api_disabled' || error.reason === 'permission';
  return (
    <Card className="border-amber-500/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5 text-amber-500" />{' '}
          {error.reason === 'other' ? 'No se pudo cargar Google Analytics' : 'Falta conectar Google Analytics'}
        </CardTitle>
        <CardDescription>
          {error.reason === 'no_credentials'
            ? 'El panel no tiene la cuenta de servicio de Google configurada en Vercel (FIREBASE_SERVICE_ACCOUNT_JSON).'
            : error.reason === 'other'
              ? 'Intenta de nuevo en unos minutos. Si sigue fallando, envía el detalle técnico.'
              : 'Son dos pasos de una sola vez en Google. Después, esta pestaña muestra tus visitas.'}
        </CardDescription>
      </CardHeader>
      {error.reason !== 'no_credentials' && error.reason !== 'other' && (
        <CardContent className="space-y-5 text-sm">
          {needsApi && error.enableApiUrl && (
            <div className="space-y-2">
              <p className="font-semibold">1. Activa la API de Google Analytics</p>
              <p className="text-muted-foreground">Abre este enlace y pulsa «Habilitar».</p>
              <Button asChild variant="outline" size="sm">
                <a href={error.enableApiUrl} target="_blank" rel="noopener noreferrer">
                  Abrir Google Cloud <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          )}
          {error.serviceAccount && (
            <div className="space-y-2">
              <p className="font-semibold">2. Da acceso de lectura a este correo en Google Analytics</p>
              <p className="text-muted-foreground">
                Google Analytics → Administrar → Gestión del acceso a la propiedad → «+» → Añadir usuarios → pega el correo → rol
                «Lector» → Añadir.
              </p>
              <CopyText text={error.serviceAccount} />
            </div>
          )}
        </CardContent>
      )}
      <CardContent className="pt-0">
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Detalle técnico</summary>
          <p className="mt-2 break-all">{error.message}</p>
          {error.propertyId && <p className="mt-1">Propiedad GA4: {error.propertyId}</p>}
        </details>
      </CardContent>
    </Card>
  );
}
