'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer, onSnapshot, query, where } from 'firebase/firestore';
import { Check, Copy } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
        <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1">{title}</h1>
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
    <Card className={`p-5 rounded-2xl ${tone === 'primary' ? 'bg-primary text-primary-foreground' : ''}`}>
      <Icon size={18} className={tone === 'primary' ? 'opacity-80' : 'text-primary'} />
      <p className="font-headline text-2xl md:text-3xl font-bold mt-3">{value}</p>
      <p className={`text-xs mt-1 ${tone === 'primary' ? 'opacity-80' : 'text-muted-foreground'}`}>{label}</p>
      {hint && <p className={`text-[11px] mt-2 ${tone === 'primary' ? 'opacity-70' : 'text-muted-foreground'}`}>{hint}</p>}
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
  return <div className="p-10 text-center text-sm text-muted-foreground">{children}</div>;
}
