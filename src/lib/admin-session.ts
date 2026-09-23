import { cookies } from 'next/headers';
import { adminAuth, adminDb } from './firebase-admin';
import { ROOT_EMAIL } from './affiliate-core';

export const SESSION_COOKIE = 'modulares-gm-session';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;
const STAFF_ROLES = ['super', 'admin', 'financial', 'sales'];

const founderEmails = () =>
  [ROOT_EMAIL, 'info@modularesgm.com', ...(process.env.ADMIN_EMAILS || '').split(',')]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export interface AdminIdentity {
  uid: string;
  email: string;
  role: string;
}

/** ¿El usuario autenticado puede entrar al panel? Fundador por correo, o rol en `usuarios`. */
async function resolveAdmin(uid: string, email: string | undefined): Promise<AdminIdentity | null> {
  const mail = (email || '').toLowerCase();
  if (mail && founderEmails().includes(mail)) return { uid, email: mail, role: 'super' };
  const snap = await adminDb().collection('usuarios').doc(uid).get();
  const role = String(snap.data()?.role || '').toLowerCase();
  if (snap.exists && STAFF_ROLES.includes(role) && snap.data()?.active !== false) {
    return { uid, email: mail, role };
  }
  return null;
}

/** Canjea un ID token de Firebase Auth por una cookie de sesión httpOnly. */
export async function createAdminSession(idToken: string): Promise<AdminIdentity | null> {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const identity = await resolveAdmin(decoded.uid, decoded.email);
  if (!identity) return null;
  const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_MS / 1000,
    path: '/',
  });
  return identity;
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Verifica la cookie contra Firebase (no solo su existencia). Lanza si no es válida. */
export async function requireAdmin(): Promise<AdminIdentity> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  if (!cookie) throw new Error('Not authenticated');
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    const identity = await resolveAdmin(decoded.uid, decoded.email);
    if (!identity) throw new Error('Forbidden');
    return identity;
  } catch {
    throw new Error('Not authenticated');
  }
}
