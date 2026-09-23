'use client';

import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, type User } from 'firebase/auth';
import { KeyRound, Loader2 } from 'lucide-react';
import { markPasswordChanged } from '@/lib/affiliate-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Bloquea el portal hasta que el usuario reemplace su clave inicial (la cédula). */
export function ForcePasswordModal({ user }: { user: User }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (next !== confirm) return setError('Las contraseñas no coinciden.');
    if (next === current) return setError('La nueva contraseña debe ser distinta a la actual.');
    setBusy(true);
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email || '', current));
      await updatePassword(user, next);
      await markPasswordChanged(await user.getIdToken(true));
    } catch (err: any) {
      setError(
        /wrong-password|invalid-credential/.test(err?.code || '')
          ? 'La contraseña actual no es correcta.'
          : 'No se pudo cambiar la contraseña. Intenta nuevamente.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="fpw-title" className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary grid place-items-center">
          <KeyRound size={22} />
        </div>
        <h2 id="fpw-title" className="font-headline text-2xl font-bold">Crea tu contraseña personal</h2>
        <p className="text-sm text-muted-foreground">
          Por seguridad debes reemplazar la contraseña inicial antes de continuar.
        </p>
        <div className="space-y-2">
          <Label htmlFor="fpw-current">Contraseña actual</Label>
          <Input id="fpw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fpw-new">Nueva contraseña</Label>
          <Input id="fpw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fpw-confirm">Repite la nueva contraseña</Label>
          <Input id="fpw-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar y continuar
        </Button>
      </form>
    </div>
  );
}
