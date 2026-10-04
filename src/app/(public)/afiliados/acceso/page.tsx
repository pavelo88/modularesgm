'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Phone,
  Loader2,
  Users,
} from 'lucide-react';
import {
  isUsernameAvailable,
  registerAffiliateAccount,
  resolveLoginEmail,
  sendCustomVerificationEmail,
} from '@/lib/affiliate-actions';
import { normalizeUsername } from '@/lib/affiliate-core';
import { REF_STORAGE_KEY } from '@/context/affiliate-provider';
import { PasswordSetupDialog } from '@/components/affiliates/password-setup-dialog';
import { Segmented, enter, fieldClass, fieldLabel, surface } from '@/components/affiliates/portal-ui';
import { ThemeToggle, usePortalTheme } from '@/components/affiliates/portal-theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function AffiliatesAuthContent() {
  usePortalTheme();
  const router = useRouter();

  // Tabs: 'login' | 'register' | 'forgot'
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login state
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSponsor, setRegSponsor] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Force Password Change Modal
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);

  // Client-side search params reading to avoid SSR hydration issues
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab');
    if (initialTab === 'registro' || initialTab === 'register') {
      setTab('register');
    } else if (initialTab === 'forgot') {
      setTab('forgot');
    }

    const err = params.get('error');
    if (err === 'suspended') {
      setErrorMsg('CUENTA SUSPENDIDA: Tu cuenta de afiliado se encuentra inactiva. Contacta a soporte.');
    } else if (err === 'not_found') {
      setErrorMsg('CUENTA NO ENCONTRADA: No existe registro de afiliado para este usuario.');
    }

    let sponsorFromLink = params.get('sponsor') || '';
    if (!sponsorFromLink) {
      try {
        sponsorFromLink = JSON.parse(localStorage.getItem(REF_STORAGE_KEY) || '{}').code || '';
      } catch {}
    }
    if (sponsorFromLink) {
      setRegSponsor(sponsorFromLink);
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          const indexSnap = await getDoc(doc(db, 'userIndex', user.uid));
          const username = indexSnap.exists() ? indexSnap.data()?.username : null;
          
          if (username) {
            const affSnap = await getDoc(doc(db, 'affiliates', username));
            if (affSnap.exists()) {
              const affData = affSnap.data();
              if (affData.status === 'suspended') {
                setErrorMsg('CUENTA SUSPENDIDA: Tu cuenta de afiliado se encuentra inactiva.');
                await signOut(auth);
                return;
              }
              if (affData.forcePasswordChange) {
                setShowForcePasswordModal(true);
                return;
              }
              router.replace('/afiliados/portal');
            }
          }
        } catch (err) {
          console.error('Error al verificar estado de autenticación:', err);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Auto-suggest username when user types email
  const handleEmailChange = (val: string) => {
    setRegEmail(val);
    if (!regUsername && val.includes('@')) {
      const suggested = val.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');
      setRegUsername(suggested);
      checkUsername(suggested);
    }
  };

  const checkUsername = async (u: string) => {
    const clean = normalizeUsername(u);
    if (clean.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    try {
      const avail = await isUsernameAvailable(clean);
      setUsernameStatus(avail ? 'available' : 'taken');
    } catch {
      setUsernameStatus('idle');
    }
  };

  /**
   * Una sola puerta para afiliados y equipo (como en Vermilion):
   * - afiliado con perfil -> portal (si su rol no es affiliate/founder, se deniega);
   * - cuenta del equipo (documento usuarios/{correo} con rol de staff) -> panel /admin;
   * - cualquier otro caso conserva el comportamiento anterior (portal).
   */
  const routeAfterLogin = async (uid: string, email: string): Promise<'portal' | 'admin' | 'denied'> => {
    try {
      const idx = await getDoc(doc(db, 'userIndex', uid));
      const username = idx.exists() ? (idx.data()?.username as string | undefined) : undefined;
      if (username) {
        const aff = await getDoc(doc(db, 'affiliates', username));
        const role = String(aff.data()?.role || 'affiliate').toLowerCase().trim();
        if (aff.exists() && role !== 'affiliate' && role !== 'founder') return 'denied';
        return 'portal';
      }
      const staff = await getDoc(doc(db, 'usuarios', email.trim().toLowerCase()));
      const staffRole = String(staff.data()?.role || '').toLowerCase().trim();
      if (staff.exists() && staff.data()?.active !== false && ['super', 'admin', 'financial', 'sales'].includes(staffRole)) {
        return 'admin';
      }
    } catch (err) {
      console.warn('No se pudo resolver el destino del acceso:', err);
    }
    return 'portal';
  };

  // ── 1. LOGIN HANDLER ──────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmailOrUser || !loginPassword) {
      setErrorMsg('Ingresa tu correo (o usuario) y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const { email: resolvedEmail } = await resolveLoginEmail(loginEmailOrUser);
      if (!resolvedEmail) {
        throw new Error('No encontramos una cuenta con ese usuario o correo.');
      }

      let destination: 'portal' | 'admin' | 'denied' = 'portal';
      if (auth) {
        try {
          await setPersistence(auth, browserLocalPersistence);
        } catch {}
        const cred = await signInWithEmailAndPassword(auth, resolvedEmail, loginPassword.trim());
        destination = await routeAfterLogin(cred.user.uid, resolvedEmail);
      }

      if (destination === 'denied') {
        if (auth) await signOut(auth).catch(() => {});
        setErrorMsg('ACCESO DENEGADO (403): Tu cuenta no dispone de permisos para ingresar a este portal.');
        return;
      }
      if (destination === 'admin') {
        setSuccessMsg('Cuenta del equipo detectada. Te llevamos al panel de administración…');
        router.push('/admin');
        return;
      }

      router.push('/afiliados/portal');
    } catch (err: any) {
      console.error('[Login Error]', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Contraseña o cédula incorrecta. Si es tu 1er ingreso, tu clave es tu cédula.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMsg('No existe una cuenta registrada con este correo.');
      } else {
        setErrorMsg(err.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── 2. REGISTER HANDLER ───────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName || !regEmail || !regUsername || !regCedula) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    if (regCedula.trim().length < 8) {
      setErrorMsg('La cédula/pasaporte debe tener al menos 8 dígitos.');
      return;
    }

    if (usernameStatus === 'taken') {
      setErrorMsg('El usuario elegido ya está en uso. Por favor elige otro.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = regEmail.trim().toLowerCase();
      const cleanCedula = regCedula.trim();

      // 1. Crear usuario en Firebase Auth con la cédula como contraseña provisional.
      //    Si el correo ya existe, puede ser un registro anterior que quedó a medias (usuario
      //    creado pero sin perfil): entrar con la misma cédula demuestra que es la misma persona
      //    y permite completar el perfil en lugar de dejarla atascada.
      let userCred;
      let createdNow = true;
      try {
        userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanCedula);
      } catch (createErr: any) {
        if (createErr?.code !== 'auth/email-already-in-use') throw createErr;
        try {
          userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanCedula);
          createdNow = false;
        } catch {
          setErrorMsg('Ese correo ya está registrado. Por favor inicia sesión (tu clave inicial es tu cédula).');
          setLoading(false);
          return;
        }
      }
      const idToken = await userCred.user.getIdToken();

      // 2. Crear perfil en Firestore. Si la llamada al servidor se cae (no solo si responde con
      //    error), se trata igual: así nunca queda un usuario en Auth sin perfil.
      let res: { success: boolean; error?: string };
      try {
        res = await registerAffiliateAccount(idToken, {
          name: regFullName.trim(),
          username: regUsername.trim().toLowerCase(),
          cedula: cleanCedula,
          phone: regPhone.trim(),
          sponsor: regSponsor.trim() || undefined,
        });
      } catch (serverErr) {
        console.error('[Register Error] el servidor no respondió', serverErr);
        res = { success: false, error: 'El servidor no pudo crear tu perfil. Intenta de nuevo en unos minutos.' };
      }

      if (!res.success) {
        // Cuenta recién creada: se revierte. Cuenta recuperada: se conserva para reintentar.
        if (createdNow) await userCred.user.delete().catch(() => signOut(auth));
        else await signOut(auth).catch(() => {});
        setErrorMsg(res.error || 'Error al registrar el perfil.');
        setLoading(false);
        return;
      }

      // 3. Enviar correo de notificación por Nodemailer
      await sendCustomVerificationEmail(cleanEmail, `${window.location.origin}/afiliados/acceso`);

      setSuccessMsg('¡Cuenta creada exitosamente! Ahora define tu contraseña definitiva por seguridad.');

      // Abrir modal de definición de contraseña definitiva
      setTimeout(() => {
        setShowForcePasswordModal(true);
      }, 500);

    } catch (err: any) {
      console.error('[Register Error]', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Ese correo ya está registrado. Por favor inicia sesión.');
      } else {
        setErrorMsg(err.message || 'Error al crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── 3. FORGOT PASSWORD HANDLER ────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotEmail) {
      setErrorMsg('Ingresa tu correo electrónico registrado.');
      return;
    }

    setLoading(true);
    try {
      const { email: targetEmail } = await resolveLoginEmail(forgotEmail);
      if (auth && targetEmail) {
        await sendPasswordResetEmail(auth, targetEmail);
      }

      setSuccessMsg(`Enviamos un enlace de recuperación a ${targetEmail || forgotEmail}. Revisa tu bandeja de entrada.`);
    } catch (err: any) {
      console.error('[Reset Error]', err);
      setErrorMsg(err.message || 'Error al enviar correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="portal-scope relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground antialiased">
      {/* Luz ambiental */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-12rem] h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-secondary/10 blur-[110px]" />

      {/* Encabezado */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Image src="/logo.png" alt="Modulares GM" width={40} height={40} className="h-10 w-10 object-contain" priority />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">Modulares GM</span>
            <span className="block text-[11px] text-muted-foreground">Programa de afiliados</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-95"
          >
            ← Volver al sitio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Tarjeta principal */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-2">
        <div className={cn(surface, enter, 'w-full max-w-[26rem] p-6 sm:p-8')}>
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
              <Image src="/logo.png" alt="" width={34} height={34} className="object-contain" />
            </span>
            <h1 className="mt-4 font-headline text-[1.7rem] font-bold leading-tight tracking-tight">
              {tab === 'login' && 'Acceso de afiliados'}
              {tab === 'register' && 'Únete como afiliado'}
              {tab === 'forgot' && 'Recuperar contraseña'}
            </h1>
            <p className="mx-auto mt-1.5 max-w-[19rem] text-[13px] leading-relaxed text-muted-foreground">
              {tab === 'login' && 'Entra a tu panel para ver tus ventas, tu red y tus comisiones.'}
              {tab === 'register' && 'Sin contraseña inicial: tu cédula será tu clave temporal.'}
              {tab === 'forgot' && 'Te enviaremos un enlace seguro a tu correo.'}
            </p>
          </div>

          {tab !== 'forgot' && (
            <div className="mt-6 [&>div]:flex [&>div]:w-full [&>div>button]:flex-1 [&>div>button]:py-2.5">
              <Segmented
                label="Iniciar sesión o crear cuenta"
                value={tab}
                onChange={(v) => {
                  setTab(v as 'login' | 'register');
                  clearMessages();
                }}
                options={[
                  { value: 'login', label: 'Iniciar sesión' },
                  { value: 'register', label: 'Crear cuenta' },
                ]}
              />
            </div>
          )}

          {/* Mensajes */}
          {errorMsg && (
            <p
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl bg-destructive/10 px-3.5 py-3 text-[13px] leading-snug text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)] animate-in fade-in-0 duration-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
          {successMsg && (
            <p
              role="status"
              className="mt-5 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 px-3.5 py-3 text-[13px] leading-snug text-emerald-700 shadow-[inset_0_0_0_1px_hsl(152_60%_40%/0.25)] animate-in fade-in-0 duration-200 dark:text-emerald-300"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </p>
          )}

          {/* ── Iniciar sesión ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-user" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                  <Mail size={13} className="text-primary" /> Correo o usuario
                </label>
                <input
                  id="login-user"
                  type="text"
                  required
                  name="username"
                  autoComplete="username"
                  value={loginEmailOrUser}
                  onChange={(e) => setLoginEmailOrUser(e.target.value)}
                  placeholder="correo@ejemplo.com o tu_usuario"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="login-pass" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                    <Lock size={13} className="text-primary" /> Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      clearMessages();
                    }}
                    className="rounded text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    name="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className={cn(fieldClass, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-0.5 top-0.5 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-95"
                  >
                    {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">Si aún no la cambiaste, tu clave de acceso es tu cédula.</p>
              </div>

              <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-[15px] font-semibold">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar a mi panel <ArrowRight size={17} className="ml-2" /></>}
              </Button>
            </form>
          )}

          {/* ── Crear cuenta ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              {regSponsor && (
                <p className="flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2.5 text-[13px] text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
                  <Users size={15} className="shrink-0" /> Te invitó <strong className="font-semibold">@{normalizeUsername(regSponsor)}</strong>
                </p>
              )}

              <div className="space-y-1.5">
                <label htmlFor="reg-name" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                  <User size={13} className="text-primary" /> Nombre completo
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  name="name"
                  autoComplete="name"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="María López"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-email" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                  <Mail size={13} className="text-primary" /> Correo electrónico
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="tu_correo@gmail.com"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="reg-user" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                    <AtSign size={13} className="text-primary" /> Tu usuario (será tu código)
                  </label>
                  {usernameStatus === 'checking' && <span className="text-[11px] text-muted-foreground">Comprobando…</span>}
                  {usernameStatus === 'available' && <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">✓ Disponible</span>}
                  {usernameStatus === 'taken' && <span className="text-[11px] font-semibold text-destructive">✕ En uso</span>}
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">@</span>
                  <input
                    id="reg-user"
                    type="text"
                    required
                    name="username"
                    autoComplete="username"
                    value={regUsername}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '');
                      setRegUsername(val);
                      checkUsername(val);
                    }}
                    placeholder="maria.lopez"
                    className={cn(
                      fieldClass,
                      'pl-8 font-mono',
                      usernameStatus === 'taken' && 'shadow-[0_0_0_1px_hsl(var(--destructive))] focus:shadow-[0_0_0_2px_hsl(var(--destructive))]',
                      usernameStatus === 'available' && 'shadow-[0_0_0_1px_hsl(152_60%_40%/0.8)] focus:shadow-[0_0_0_2px_hsl(152_60%_40%)]'
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="reg-id" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                    <CreditCard size={13} className="text-primary" /> Cédula
                  </label>
                  <input
                    id="reg-id"
                    type="text"
                    required
                    name="cedula"
                    autoComplete="off"
                    inputMode="numeric"
                    value={regCedula}
                    onChange={(e) => setRegCedula(e.target.value)}
                    placeholder="172179…"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                    <Phone size={13} className="text-primary" /> Teléfono <span className="normal-case tracking-normal opacity-70">(opcional)</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="099 123 4567"
                    className={fieldClass}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-[15px] font-semibold">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear mi cuenta'}
              </Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Al crear tu cuenta aceptas recibir comunicaciones sobre tus comisiones y tu red.
              </p>
            </form>
          )}

          {/* ── Recuperar contraseña ── */}
          {tab === 'forgot' && (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className={cn(fieldLabel, 'flex items-center gap-1.5')}>
                  <Mail size={13} className="text-primary" /> Correo registrado
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="tu_correo@gmail.com"
                  className={fieldClass}
                />
              </div>
              <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-[15px] font-semibold">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar enlace'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  clearMessages();
                }}
                className="mx-auto block rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                ← Volver a iniciar sesión
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 px-4 pb-6 text-center text-[11px] text-muted-foreground">© 2026 Modulares GM. Todos los derechos reservados.</footer>

      {/* Primer cambio de clave */}
      <PasswordSetupDialog
        open={showForcePasswordModal}
        onDone={() => {
          setShowForcePasswordModal(false);
          router.replace('/afiliados/portal');
        }}
      />
    </div>
  );
}

export default function AffiliateAccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="portal-scope grid min-h-screen place-items-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AffiliatesAuthContent />
    </React.Suspense>
  );
}
