'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { loginAdmin } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const result = await loginAdmin(await cred.user.getIdToken());
        if ('error' in result) {
          await signOut(auth);
          setError(result.error ?? 'No se pudo iniciar sesión.');
          return;
        }
        router.push('/admin/dashboard');
      } catch {
        setError('Correo o contraseña incorrectos.');
      }
    });
  };

  return (
    <main className="relative grid min-h-[100svh] place-items-center bg-[#0a0f12] px-4 py-12 selection:bg-secondary/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 opacity-50 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="group relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 active:scale-95">
             <Image src="/logo.png" alt="Modulares GM" width={48} height={48} className="object-contain drop-shadow-md" priority />
          </Link>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-white drop-shadow-sm">Panel Privado</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Ingreso exclusivo para administración
          </p>
        </div>

        <form onSubmit={onSubmit} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Correo Electrónico</Label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@modularesgm.com"
                  className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 text-white placeholder:text-zinc-600 focus-visible:border-secondary focus-visible:bg-black/40 focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-0 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contraseña</Label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 pr-12 text-white placeholder:text-zinc-600 focus-visible:border-secondary focus-visible:bg-black/40 focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <ShieldCheck size={16} className="text-red-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isPending} className="h-12 w-full rounded-xl bg-secondary text-base font-bold text-secondary-foreground shadow-[0_0_20px_rgba(202,138,4,0.15)] hover:bg-secondary/90 hover:shadow-[0_0_25px_rgba(202,138,4,0.25)] transition-all active:scale-[0.98]">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isPending ? 'Verificando...' : 'Acceder'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300">
            <ArrowLeft size={16} /> Volver al sitio principal
          </Link>
        </div>
      </div>
    </main>
  );
}
