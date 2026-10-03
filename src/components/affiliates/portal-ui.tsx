'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer, onSnapshot, query, where } from 'firebase/firestore';
import { Check, Copy } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
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

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="mt-1 font-headline text-3xl font-bold leading-tight tracking-tight md:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone }: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone?: 'primary';
}) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-0 p-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-emil-out motion-reduce:animate-none',
        tone === 'primary'
          ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_14px_34px_-16px_hsl(var(--primary)/0.7)]'
          : 'bg-card shadow-[0_0_0_1px_hsl(var(--border)/0.7),0_10px_30px_-20px_rgb(0_0_0/0.5)]'
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          tone === 'primary' ? 'bg-black/15' : 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]'
        )}
      >
        <Icon size={18} />
      </span>
      <p className="mt-4 font-headline text-2xl font-bold tabular-nums tracking-tight md:text-3xl">{value}</p>
      <p className={cn('mt-1 text-[13px]', tone === 'primary' ? 'opacity-85' : 'text-muted-foreground')}>{label}</p>
      {hint && <p className={cn('mt-2 text-[11px]', tone === 'primary' ? 'opacity-75' : 'text-muted-foreground')}>{hint}</p>}
    </Card>
  );
}

export function CopyButton({ text, label, variant = 'outline' }: { text: string; label: string; variant?: 'outline' | 'secondary' | 'default' }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
    >
      {copied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
      {copied ? 'Copiado' : label}
    </Button>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-12 text-center text-sm leading-relaxed text-muted-foreground">{children}</div>;
}
