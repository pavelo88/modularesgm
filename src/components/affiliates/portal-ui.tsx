'use client';

import { useEffect, useId, useState } from 'react';
import { collection, getCountFromServer, onSnapshot, query, where } from 'firebase/firestore';
import { Check, Copy, Inbox } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const money = (n: number | undefined) => `$${(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const shortDate = (iso: string | number) => new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });

/** Suscripción en vivo a los documentos de una colección filtrados por campo. */
export function useUserDocs<T extends { id: string }>(collectionName: string, field: string, value: string | undefined) {
  const [docs, setDocs] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!value) return;
    const unsub = onSnapshot(
      query(collection(db, collectionName), where(field, '==', value)),
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [collectionName, field, value]);

  return { docs, loading };
}

export function useClickCount(username: string | undefined) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!username) return;
    getCountFromServer(query(collection(db, 'affiliateClicks'), where('username', '==', username)))
      .then((s) => setCount(s.data().count))
      .catch(() => {});
  }, [username]);
  return count;
}

/* ───────────────────────── Superficies ───────────────────────── */

/** Superficie estándar: sombra en anillo translúcida (en vez de un borde duro) y elevación suave. */
export const surface =
  'rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_hsl(var(--border)/0.85),var(--portal-shadow)]';

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(surface, className)} {...props} />;
}

/** Entrada suave de contenido: aparece desde 8px abajo, rápido y sin rebotes. */
export const enter = 'animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-emil-out motion-reduce:animate-none fill-mode-both';

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8', enter)}>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="mt-1.5 font-headline text-[1.85rem] font-bold leading-[1.1] tracking-tight md:text-[2.4rem]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.22)]">
            <Icon size={17} />
          </span>
        )}
        <div>
          <h2 className="font-semibold leading-tight">{title}</h2>
          {hint && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ───────────────────────── Métricas ───────────────────────── */

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  action,
  delay = 0,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** `primary` = tarjeta destacada (la única de cada pantalla). */
  tone?: 'primary';
  action?: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const featured = tone === 'primary';
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card p-5 text-card-foreground',
        enter,
        className,
        featured
          ? 'shadow-[0_0_0_1px_hsl(var(--primary)/0.45),0_20px_46px_-26px_hsl(var(--primary)/0.55)]'
          : 'shadow-[0_0_0_1px_hsl(var(--border)/0.85),var(--portal-shadow)]'
      )}
    >
      {featured && (
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.22)]">
          <Icon size={18} />
        </span>
        {action}
      </div>
      <p className={cn('relative mt-4 font-headline text-[1.65rem] font-bold tabular-nums leading-none tracking-tight md:text-[1.85rem]', featured && 'text-primary')}>
        {value}
      </p>
      <p className="relative mt-2 text-[13px] text-muted-foreground">{label}</p>
      {hint && <p className="relative mt-1.5 text-[11px] leading-snug text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

/* ───────────────────────── Etiquetas de estado ───────────────────────── */

const PILL_TONES = {
  success: 'bg-emerald-500/12 text-emerald-700 ring-emerald-600/25 dark:text-emerald-300 dark:ring-emerald-400/25',
  warn: 'bg-amber-500/14 text-amber-800 ring-amber-600/25 dark:text-amber-300 dark:ring-amber-400/25',
  danger: 'bg-red-500/12 text-red-700 ring-red-600/25 dark:text-red-300 dark:ring-red-400/25',
  neutral: 'bg-muted text-muted-foreground ring-border',
  brand: 'bg-primary/12 text-primary ring-primary/25',
} as const;

export function StatusPill({
  tone = 'neutral',
  icon: Icon,
  children,
  className,
}: {
  tone?: keyof typeof PILL_TONES;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset', PILL_TONES[tone], className)}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

/* ───────────────────────── Formularios ───────────────────────── */

export const fieldClass =
  'h-11 w-full rounded-xl bg-background/60 px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 ' +
  'shadow-[0_0_0_1px_hsl(var(--border))] transition-shadow duration-150 focus:shadow-[0_0_0_2px_hsl(var(--primary))] disabled:opacity-60';

export const fieldLabel = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground';

export function TextField({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input id={id} {...props} className={cn(fieldClass, className)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Selector de opciones en píldoras (filtros, destinos…). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-muted/70 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color,box-shadow,transform] duration-150 ease-emil-out active:scale-[0.97] motion-reduce:transition-none',
              active ? 'bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.18),0_0_0_1px_hsl(var(--border)/0.8)]' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Círculo con iniciales. */
export function Initials({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const text = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/65 font-semibold text-primary-foreground shadow-[0_6px_16px_-8px_hsl(var(--primary)/0.7)]',
        className
      )}
      aria-hidden
    >
      {text || '·'}
    </span>
  );
}

/* ───────────────────────── Acciones y estados vacíos ───────────────────────── */

export function CopyButton({
  text,
  label,
  variant = 'outline',
  className,
}: {
  text: string;
  label: string;
  variant?: 'outline' | 'secondary' | 'default' | 'ghost';
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant={variant}
      className={cn('h-10 rounded-xl px-4 font-medium', className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
    >
      {copied ? <Check size={15} className="mr-2" /> : <Copy size={15} className="mr-2" />}
      {copied ? 'Copiado' : label}
    </Button>
  );
}

/** Enlace o código con su botón de copiar dentro del propio campo: una sola acción obvia. */
export function LinkField({ value, label = 'Copiar' }: { value: string; label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-background/70 p-1.5 pl-4 shadow-[0_0_0_1px_hsl(var(--primary)/0.32)]">
      <p className="min-w-0 flex-1 truncate font-mono text-[13px] md:text-sm" title={value}>
        {value}
      </p>
      <CopyButton text={value} label={label} variant="default" className="shrink-0" />
    </div>
  );
}

export function EmptyState({ children, icon: Icon = Inbox }: { children: React.ReactNode; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-sm leading-relaxed text-muted-foreground">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-muted-foreground/80">
        <Icon size={20} />
      </span>
      <p className="max-w-xs">{children}</p>
    </div>
  );
}
