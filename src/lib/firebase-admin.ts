import { applicationDefault, cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK (solo servidor). Inicialización perezosa para que
 * `next build` no falle cuando aún no hay credenciales.
 *
 * Credenciales, en orden de prioridad:
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON  (JSON de la cuenta de servicio, en una línea)
 *  2. Application Default Credentials (automáticas en Firebase App Hosting / Cloud Run,
 *     o localmente con GOOGLE_APPLICATION_CREDENTIALS).
 */
function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (raw) {
    return initializeApp({ credential: cert(JSON.parse(raw)), projectId });
  }
  return initializeApp({ credential: applicationDefault(), projectId });
}

export const adminDb = () => getFirestore(getAdminApp());
export const adminAuth = () => getAuth(getAdminApp());
