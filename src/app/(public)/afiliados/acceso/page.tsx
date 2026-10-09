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
import { track } from '@/lib/analytics';
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

    if (!regFullName || !regCedula || !regPhone || !regEmail || !regUsername) {
      setErrorMsg('Por favor completa todos los campos requeridos (incluyendo cédula y teléfono).');
      return;
    }

    if (regCedula.trim().length < 8) {
      setErrorMsg('La cédula/pasaporte debe tener al menos 8 dígitos.');
      return;
    }

    if (regPhone.trim().length < 8) {
      setErrorMsg('Ingresa un número de teléfono o WhatsApp válido.');
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

      track('sign_up', { method: 'afiliado' });

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

      {/* Encabezado con tabs móviles a la derecha del logo para ahorrar toda una línea */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Image src="/logo.png" alt="Modulares GM" width={38} height={38} className="h-9 w-9 object-contain" priority />
            <span className="hidden sm:inline-block leading-tight">
              <span className="block text-sm font-bold tracking-tight">Modulares GM</span>
              <span className="block text-[11px] text-muted-foreground">Programa de afiliados</span>
            </span>
          </Link>

          {/* En celulares: Botones de Iniciar / Únete justo a la derecha del logo */}
          {tab !== 'forgot' && (
            <div className="flex sm:hidden items-center bg-stone-200/70 dark:bg-stone-800 p-0.5 rounded-full border border-border/60">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  clearMessages();
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                  tab === 'login' ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Iniciar
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  clearMessages();
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                  tab === 'register' ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Únete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            ← Volver al sitio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Contenedor Principal: Grilla 2 Columnas en Escritorio / Tarjeta Compacta en Móvil */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-2 sm:pt-4">
        <div className="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Columna Izquierda (Escritorio): Dossier de Beneficios y Programa */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 pr-4">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                ✦ Red de Afiliados GM
              </span>
              <h2 className="font-headline text-3xl xl:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                Monetice sus recomendaciones en cada proyecto.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Sin inversión ni inventario. Gane comisiones directas por cada venta de cocinas integrales, clósets y mesones de cuarzo cerrada con su código.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
                <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Comisión Directa del 5% al 10%</h4>
                  <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                    Transferencias bancarias a cualquier entidad financiera del Ecuador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
                <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Cupón de 5% OFF para sus Clientes</h4>
                  <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                    Sus recomendados reciben descuento inmediato en acabados Pelikano RH y cuarzos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Panel en Vivo & Métricas</h4>
                  <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                    Monitoreo de clics, cotizaciones activas, comisiones y retiros en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta del Formulario Esculpida */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className={cn(surface, enter, 'w-full p-5 sm:p-7 rounded-3xl shadow-xl border border-border/80')}>
              <div className="text-center">
                {/* Logo interior oculto en móvil para ahorrar espacio vertical */}
                <span className="hidden sm:grid mx-auto h-12 w-12 place-items-center rounded-2xl bg-primary/12 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
                  <Image src="/logo.png" alt="" width={30} height={30} className="object-contain" />
                </span>
                <h1 className="mt-1 sm:mt-3 font-headline text-xl sm:text-2xl font-bold leading-tight tracking-tight">
                  {tab === 'login' && 'Acceso de afiliados'}
                  {tab === 'register' && 'Únete como afiliado'}
                  {tab === 'forgot' && 'Recuperar contraseña'}
                </h1>
                <p className="mx-auto mt-1 max-w-[20rem] text-xs leading-relaxed text-muted-foreground">
                  {tab === 'login' && 'Entra a tu panel para ver tus ventas, tu red y tus comisiones.'}
                  {tab === 'register' && 'Sin contraseña inicial: tu cédula será tu clave temporal.'}
                  {tab === 'forgot' && 'Te enviaremos un enlace seguro a tu correo.'}
                </p>
              </div>

              {/* Selector de pestañas en escritorio (en móvil ya está en el header) */}
              {tab !== 'forgot' && (
                <div className="hidden sm:block mt-5 [&>div]:flex [&>div]:w-full [&>div>button]:flex-1 [&>div>button]:py-2">
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

              {/* Mensajes de Alerta */}
              {errorMsg && (
                <p
                  role="alert"
                  className="mt-4 flex items-start gap-2.5 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-xs leading-snug text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)] animate-in fade-in-0 duration-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
              {successMsg && (
                <p
                  role="status"
                  className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-xs leading-snug text-emerald-700 shadow-[inset_0_0_0_1px_hsl(152_60%_40%/0.25)] animate-in fade-in-0 duration-200 dark:text-emerald-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </p>
              )}

              {/* ── Iniciar sesión ── */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
                  <div className="space-y-1">
                    <label htmlFor="login-user" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
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

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor="login-pass" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
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
                        placeholder="Tu contraseña o cédula"
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
                    <p className="text-[11px] leading-relaxed text-muted-foreground">Si aún no la cambiaste, tu clave de acceso es tu cédula.</p>
                  </div>

                  <Button type="submit" disabled={loading} className="h-11 sm:h-12 w-full rounded-xl text-sm font-semibold mt-2">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar a mi panel <ArrowRight size={16} className="ml-2" /></>}
                  </Button>
                </form>
              )}

              {/* ── Crear cuenta (Cédula y Teléfono OBLIGATORIOS antes que Correo) ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
                  {regSponsor && (
                    <p className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
                      <Users size={14} className="shrink-0" /> Te invitó <strong className="font-semibold">@{normalizeUsername(regSponsor)}</strong>
                    </p>
                  )}

                  {/* Nombre Completo */}
                  <div className="space-y-1">
                    <label htmlFor="reg-name" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
                      <User size={13} className="text-primary" /> Nombre completo *
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

                  {/* Cédula y Teléfono (OBLIGATORIO) ANTES que correo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="reg-id" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
                        <CreditCard size={13} className="text-primary" /> Cédula *
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
                    <div className="space-y-1">
                      <label htmlFor="reg-phone" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
                        <Phone size={13} className="text-primary" /> Teléfono WhatsApp *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
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

                  {/* Correo y Usuario */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="reg-email" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
                        <Mail size={13} className="text-primary" /> Correo electrónico *
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
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <label htmlFor="reg-user" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold truncate')}>
                          <AtSign size={13} className="text-primary" /> Usuario (código) *
                        </label>
                        {usernameStatus === 'checking' && <span className="text-[10px] text-muted-foreground">Revisando…</span>}
                        {usernameStatus === 'available' && <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">✓ Libre</span>}
                        {usernameStatus === 'taken' && <span className="text-[10px] font-semibold text-destructive">✕ En uso</span>}
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">@</span>
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
                            'pl-7 font-mono text-xs',
                            usernameStatus === 'taken' && 'shadow-[0_0_0_1px_hsl(var(--destructive))] focus:shadow-[0_0_0_2px_hsl(var(--destructive))]',
                            usernameStatus === 'available' && 'shadow-[0_0_0_1px_hsl(152_60%_40%/0.8)] focus:shadow-[0_0_0_2px_hsl(152_60%_40%)]'
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="h-11 sm:h-12 w-full rounded-xl text-sm font-semibold mt-2">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear mi cuenta'}
                  </Button>
                  <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                    Al crear tu cuenta aceptas recibir comunicaciones sobre tus comisiones y tu red.
                  </p>
                </form>
              )}

              {/* ── Recuperar contraseña ── */}
              {tab === 'forgot' && (
                <form onSubmit={handleResetPassword} className="mt-5 space-y-3.5">
                  <div className="space-y-1">
                    <label htmlFor="forgot-email" className={cn(fieldLabel, 'flex items-center gap-1.5 text-xs font-bold')}>
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
                  <Button type="submit" disabled={loading} className="h-11 sm:h-12 w-full rounded-xl text-sm font-semibold">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar enlace'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      clearMessages();
                    }}
                    className="mx-auto block rounded text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    ← Volver a iniciar sesión
                  </button>
                </form>
              )}
            </div>
          </div>
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
