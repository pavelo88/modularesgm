'use client';

import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, shortDate } from '@/components/affiliates/portal-ui';

export default function ProfilePage() {
  const { affiliate, user } = useAffiliateAccount();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const rows: [string, string][] = [
    ['Nombre', affiliate.name],
    ['Usuario', `@${affiliate.username}`],
    ['Correo', affiliate.email],
    ['Teléfono', affiliate.phone || '—'],
    ['Cédula / ID', affiliate.cedula.replace(/.(?=.{3})/g, '•')],
    ['Miembro desde', shortDate(affiliate.createdAt)],
    ['Patrocinador', affiliate.parentId === affiliate.username ? '—' : `@${affiliate.parentId}`],
  ];

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ ok: false, text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    setBusy(true);
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email || '', current));
      await updatePassword(user, next);
      setCurrent('');
      setNext('');
      setMsg({ ok: true, text: 'Contraseña actualizada.' });
    } catch {
      setMsg({ ok: false, text: 'No se pudo cambiar. Verifica tu contraseña actual.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Cuenta" title="Mi perfil" />
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 rounded-2xl self-start">
          <dl className="divide-y">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Para corregir estos datos escribe a soporte.</p>
        </Card>

        <Card className="p-6 rounded-2xl self-start">
          <h2 className="font-bold mb-4">Cambiar contraseña</h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p-current">Contraseña actual</Label>
              <Input id="p-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-next">Nueva contraseña</Label>
              <Input id="p-next" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required />
            </div>
            {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-green-600' : 'text-destructive'}`}>{msg.text}</p>}
            <Button type="submit" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Actualizar</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
