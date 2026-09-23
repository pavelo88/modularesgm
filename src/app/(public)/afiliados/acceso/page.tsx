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
} from 'lucide-react';
import {
  isUsernameAvailable,
  registerAffiliateAccount,
  resolveLoginEmail,
  sendCustomVerificationEmail,
} from '@/lib/affiliate-actions';
import { normalizeUsername } from '@/lib/affiliate-core';
import { REF_STORAGE_KEY } from '@/context/affiliate-provider';
import { ForcePasswordChangeModal } from '@/components/auth/force-password-change-modal';

function AffiliatesAuthContent() {
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

      if (auth) {
        try {
          await setPersistence(auth, browserLocalPersistence);
        } catch {}
        await signInWithEmailAndPassword(auth, resolvedEmail, loginPassword.trim());
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

      // 1. Crear usuario en Firebase Auth con la cédula como contraseña provisional
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanCedula);
      const idToken = await userCred.user.getIdToken();

      // 2. Crear perfil en Firestore
      const res = await registerAffiliateAccount(idToken, {
        name: regFullName.trim(),
        username: regUsername.trim().toLowerCase(),
        cedula: cleanCedula,
        phone: regPhone.trim(),
        sponsor: regSponsor.trim() || undefined,
      });

      if (!res.success) {
        await userCred.user.delete().catch(() => signOut(auth));
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

  return (
    <div className="min-h-screen bg-[#0B131E] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-hidden font-sans">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-slate-700/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
              <Image src="/logo.png" alt="Modulares GM" width={24} height={24} className="object-contain" priority />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block">
              MODULARES GM <span className="text-amber-400 font-normal">AFILIADOS</span>
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
              Portal Oficial de Afiliación & Ventas
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-wider font-semibold"
        >
          ← Volver al Sitio
        </Link>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-[#131E2B]/80 backdrop-blur-2xl border border-[#233549] rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-950/60 space-y-6">
          
          {/* Brand Icon Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto p-2.5 shadow-lg shadow-amber-500/10">
              <Image src="/logo.png" alt="Modulares GM Icon" width={36} height={36} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {tab === 'login' && 'Acceso de Afiliados'}
              {tab === 'register' && 'Únete como Afiliado'}
              {tab === 'forgot' && 'Recuperar Contraseña'}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {tab === 'login' && 'Ingresa tus credenciales para acceder a tu panel y comisiones.'}
              {tab === 'register' && 'Sin contraseña inicial. Tu cédula será tu clave temporal.'}
              {tab === 'forgot' && 'Te enviaremos un enlace seguro a tu correo verificado.'}
            </p>
          </div>

          {/* Tab Selector Buttons */}
          {tab !== 'forgot' && (
            <div className="flex rounded-2xl bg-black/40 p-1 border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-amber-500 text-black shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  tab === 'register'
                    ? 'bg-amber-500 text-black shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Crear Cuenta
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-600/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── TAB 1: LOGIN FORM ────────────────────────────────────────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico (o Usuario) *</span>
                </label>
                <input
                  type="text"
                  required
                  name="username"
                  autoComplete="username"
                  value={loginEmailOrUser}
                  onChange={(e) => setLoginEmailOrUser(e.target.value)}
                  placeholder="ej: correo@ejemplo.com o tu_usuario"
                  className="w-full px-4 py-3 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contraseña o Cédula *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 underline font-semibold transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    name="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu contraseña (o cédula si es tu 1er ingreso)"
                    className="w-full px-4 py-3 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 block">
                  💡 Nota: Si aún no has cambiado tu contraseña, tu clave de acceso es tu Cédula.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar a mi Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── TAB 2: REGISTER FORM ────────────────────────────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              {/* 1. Nombre Completo */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  autoComplete="name"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="ej: Maria Lopez"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 2. Correo Electrónico */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico *</span>
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="ej: tu_correo@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3. Usuario Único */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Usuario Único (tu código) *</span>
                  </label>
                  {usernameStatus === 'checking' && <span className="text-[10px] text-zinc-500">Comprobando...</span>}
                  {usernameStatus === 'available' && <span className="text-[10px] text-emerald-400 font-bold">✓ Disponible</span>}
                  {usernameStatus === 'taken' && <span className="text-[10px] text-rose-400 font-bold">✕ En uso</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">@</span>
                  <input
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
                    className="w-full pl-8 pr-3.5 py-2.5 bg-black/40 border border-zinc-700 rounded-xl text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 4. Cédula */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cédula *</span>
                </label>
                <input
                  type="text"
                  required
                  name="cedula"
                  autoComplete="off"
                  value={regCedula}
                  onChange={(e) => setRegCedula(e.target.value)}
                  placeholder="172179..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>CREAR MI CUENTA AHORA</span>
                )}
              </button>
            </form>
          )}

          {/* ── TAB 3: FORGOT PASSWORD ───────────────────────────────────── */}
          {tab === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico Registrado *</span>
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="ej: tu_correo@gmail.com"
                  className="w-full px-4 py-3 bg-black/40 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  ← Volver al Login
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Enviar Enlace</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] text-zinc-500 z-10">
        © 2026 Modulares GM. Todos los derechos reservados.
      </footer>

      {/* MODAL DE PRIMER CAMBIO DE CLAVE */}
      <ForcePasswordChangeModal isOpen={showForcePasswordModal} />

    </div>
  );
}

export default function AffiliateAccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0B131E] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AffiliatesAuthContent />
    </React.Suspense>
  );
}
