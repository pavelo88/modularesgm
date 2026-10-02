'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico para recuperar la contraseña.');
      return;
    }
    setIsResetting(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch {
      setError('Ocurrió un error al intentar enviar el correo de recuperación. Revisa que el correo sea válido.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="relative grid min-h-[100svh] place-items-center bg-[#07090b] px-4 py-12 selection:bg-primary/30 selection:text-white">
      {/* Luces de fondo ambient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/10 opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[380px]">
        {/* Header del Login */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="group relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95">
             <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
             <Image src="/logo.png" alt="Modulares GM" width={36} height={36} className="object-contain drop-shadow-lg" priority />
          </Link>
          <h1 className="font-headline text-2xl font-semibold tracking-tight text-white drop-shadow-sm">Panel de Control</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Ingreso seguro para administración
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#11161a]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {resetSent ? (
            <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Correo enviado</h3>
              <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
                Hemos enviado un enlace a <br/><strong className="text-white font-medium">{email}</strong><br/> para restablecer tu contraseña.
              </p>
              <Button onClick={() => setResetSent(false)} variant="outline" className="w-full h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                Volver a intentar
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in duration-500">
              {/* Campo Correo */}
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Correo Electrónico</Label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@modularesgm.com"
                    className="h-11 rounded-xl border-white/10 bg-black/40 pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-primary/50 focus-visible:bg-black/60 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Contraseña</Label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {isResetting ? 'Enviando...' : '¿Olvidaste tu clave?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="admin-password"
                    type={show ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/10 bg-black/40 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-primary/50 focus-visible:bg-black/60 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 animate-in slide-in-from-top-1 fade-in duration-200">
                  <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">{error}</p>
                </div>
              )}

              {/* Botón Acceder */}
              <Button type="submit" disabled={isPending} className="mt-2 h-11 w-full rounded-xl bg-white text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-[0.98]">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 opacity-50" />}
                {isPending ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300">
            <ArrowLeft size={14} /> Volver al sitio web
          </Link>
        </div>
      </div>
    </main>
  );
}
