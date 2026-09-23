'use server';

import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-session';
import { getAffiliate, getSettings } from '@/lib/affiliate-server';
import {
  AFFILIATES_COLLECTION,
  CLICKS_COLLECTION,
  ROOT_USERNAME,
  USER_INDEX_COLLECTION,
  WITHDRAWALS_COLLECTION,
  normalizeUsername,
  roundMoney,
  type AffiliateSettings,
} from '@/lib/affiliate-core';
import { isValidEcuadorId } from '@/lib/ecuador-id';

const RESERVED = new Set(['admin', 'root', 'soporte', 'support', 'modulares', 'modularesgm', ROOT_USERNAME]);

async function verifyAffiliateToken(idToken: string) {
  const decoded = await adminAuth().verifyIdToken(idToken);
  const index = await adminDb().collection(USER_INDEX_COLLECTION).doc(decoded.uid).get();
  const username = index.data()?.username as string | undefined;
  return { uid: decoded.uid, email: (decoded.email || '').toLowerCase(), username };
}

// --- Visitas / atribución ---------------------------------------------------

/** Valida un código de referido y (opcionalmente) registra el clic. Nunca revela comisiones. */
export async function validateReferral(rawCode: string, trackClick: boolean) {
  const username = normalizeUsername(rawCode || '');
  if (!username) return { valid: false as const };
  const aff = await getAffiliate(username);
  if (!aff || aff.status === 'suspended') return { valid: false as const };
  const settings = await getSettings();
  if (trackClick) {
    await adminDb().collection(CLICKS_COLLECTION).add({ username, createdAt: Date.now() }).catch(() => {});
  }
  return {
    valid: true as const,
    code: username,
    name: String(aff.name || username),
    discount: settings.customerDiscount,
    cookieDays: settings.cookieDays,
  };
}

// --- Registro y sesión -------------------------------------------------------

export async function isUsernameAvailable(rawUsername: string) {
  try {
    const username = normalizeUsername(rawUsername);
    if (username.length < 3 || RESERVED.has(username)) return false;
    const snap = await adminDb().collection(AFFILIATES_COLLECTION).doc(username).get();
    return !snap.exists;
  } catch (error) {
    console.warn('isUsernameAvailable warning (skipping admin check):', error);
    return true;
  }
}

const registerSchema = z.object({
  name: z.string().trim().min(3, 'Nombre requerido (mínimo 3 caracteres)'),
  username: z.string().trim().min(3, 'Usuario mínimo 3 caracteres'),
  cedula: z.string().trim().min(5, 'Cédula o identificación requerida (mínimo 5 caracteres)'),
  phone: z.string().trim().optional(),
  sponsor: z.string().trim().optional(),
});

/**
 * Crea el perfil de afiliado. El usuario de Firebase Auth ya existe (lo crea el navegador);
 * aquí se verifica su token y se arma el árbol (padre/abuelo) en el servidor.
 */
export async function registerAffiliateAccount(idToken: string, values: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message || 'Datos inválidos.' };
  const data = parsed.data;

  try {
    const { uid, email, username: existing } = await verifyAffiliateToken(idToken);
    if (existing) return { success: false as const, error: 'Esta cuenta ya tiene un perfil de afiliado.' };

    const username = normalizeUsername(data.username);
    if (username.length < 3 || RESERVED.has(username)) {
      return { success: false as const, error: 'Ese nombre de usuario no está disponible.' };
    }

    const sponsorName = normalizeUsername(data.sponsor || '');
    const sponsor = sponsorName && sponsorName !== username ? await getAffiliate(sponsorName) : null;
    const parentId = sponsor && sponsor.status !== 'suspended' ? sponsorName : ROOT_USERNAME;
    const granId = parentId === ROOT_USERNAME ? ROOT_USERNAME : String(sponsor?.parentId || ROOT_USERNAME);

    const db = adminDb();
    const children = await db.collection(AFFILIATES_COLLECTION).where('parentId', '==', parentId).count().get();
    const parentRama = String((parentId === ROOT_USERNAME ? '1' : sponsor?.rama) || '1');

      const account = {
        id: username,
        username,
        email,
        cedula: data.cedula,
        name: data.name,
        phone: data.phone,
        referralCode: username,
        parentId,
        granId,
        rama: `${parentRama}.${children.data().count + 1}`,
        rank: 'Standard',
        status: 'active',
        totalEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        salesCount: 0,
        monthlyVolume: 0,
        networkVolume: 0,
        cumulativePersonalVolume: 0,
        forcePasswordChange: true, // Forzamos cambio de clave tras el 1er login con cédula
        authUid: uid,
        createdAt: new Date().toISOString(),
      };

      const batch = db.batch();
      batch.create(db.collection(AFFILIATES_COLLECTION).doc(username), account);
      batch.set(db.collection(USER_INDEX_COLLECTION).doc(uid), { username });
      await batch.commit();
      return { success: true as const, username };
    } catch (error: any) {
      if (error?.code === 6 || /already exists/i.test(error?.message || '')) {
        return { success: false as const, error: 'Ese nombre de usuario ya está en uso.' };
      }
      console.error('[register-affiliate]', error);
      return { success: false as const, error: 'No se pudo crear el perfil. Intenta nuevamente.' };
    }
}

/** Resuelve el correo de login a partir de un usuario o correo (login por username). */
export async function resolveLoginEmail(usernameOrEmail: string) {
  const value = usernameOrEmail.trim().toLowerCase();
  if (value.includes('@')) return { email: value };
  const aff = await getAffiliate(normalizeUsername(value));
  return { email: aff?.email ? String(aff.email) : null };
}

export async function markPasswordChanged(idToken: string) {
  const { username } = await verifyAffiliateToken(idToken);
  if (!username) return { success: false };
  await adminDb().collection(AFFILIATES_COLLECTION).doc(username).update({ forcePasswordChange: false });
  return { success: true };
}

export async function sendCustomVerificationEmail(toEmail: string, link: string) {
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'tu-correo@modularesgm.com',
        pass: process.env.SMTP_PASS || 'tu-contraseña',
      },
    });

    await transporter.sendMail({
      from: '"Modulares GM" <tu-correo@modularesgm.com>',
      to: toEmail,
      subject: 'Verifica tu cuenta de afiliado - Modulares GM',
      text: `Hola, bienvenido al programa de afiliados de Modulares GM. \n\nPor favor, verifica tu correo ingresando al siguiente enlace:\n${link}\n\nUna vez verificado, podrás ingresar usando tu cédula como contraseña provisional.\n\nSaludos,\nEquipo Modulares GM`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">Verifica tu cuenta</h2>
          <p>Hola, bienvenido al programa de afiliados de Modulares GM.</p>
          <p>Por favor, haz clic en el siguiente botón para verificar tu correo electrónico:</p>
          <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #CA8A04; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verificar Correo</a>
          <p>Una vez verificado, podrás iniciar sesión. <strong>Tu contraseña provisional es tu número de cédula.</strong></p>
          <p>Saludos,<br>Equipo Modulares GM</p>
        </div>
      `
    });
    return { success: true };
  } catch (err) {
    console.error('Nodemailer Error:', err);
    return { success: false, error: 'No se pudo enviar el correo.' };
  }
}

// --- Retiros -----------------------------------------------------------------

const withdrawalSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['Transferencia bancaria', 'PayPal', 'Efectivo en oficina']),
  details: z.string().trim().min(5, 'Indica los datos para el pago'),
});

export async function requestWithdrawal(idToken: string, values: z.infer<typeof withdrawalSchema>) {
  const parsed = withdrawalSchema.safeParse(values);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message || 'Datos inválidos.' };
  const { amount, method, details } = parsed.data;

  try {
    const { username } = await verifyAffiliateToken(idToken);
    if (!username) return { success: false as const, error: 'Perfil no encontrado.' };
    const settings = await getSettings();
    const amountUsd = roundMoney(amount);
    if (amountUsd < settings.minWithdrawal) {
      return { success: false as const, error: `El retiro mínimo es de $${settings.minWithdrawal.toFixed(2)}.` };
    }

    const db = adminDb();
    const ref = db.collection(AFFILIATES_COLLECTION).doc(username);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const aff = snap.data();
      if (!aff || aff.status === 'suspended') throw new Error('ACCOUNT');
      if ((aff.availableBalance || 0) < amountUsd) throw new Error('BALANCE');
      tx.update(ref, {
        availableBalance: FieldValue.increment(-amountUsd),
        pendingBalance: FieldValue.increment(amountUsd),
      });
      tx.set(db.collection(WITHDRAWALS_COLLECTION).doc(), {
        affiliateUsername: username,
        affiliateName: aff.name,
        amountUsd,
        method,
        accountDetails: details,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    });
    return { success: true as const };
  } catch (error: any) {
    if (error?.message === 'BALANCE') return { success: false as const, error: 'El monto supera tu balance disponible.' };
    console.error('[withdrawal]', error);
    return { success: false as const, error: 'No se pudo registrar la solicitud.' };
  }
}

// --- Administración (solo staff) ---------------------------------------------

export async function processWithdrawal(withdrawalId: string, decision: 'paid' | 'rejected', note?: string) {
  await requireAdmin();
  const db = adminDb();
  try {
    await db.runTransaction(async (tx) => {
      const wRef = db.collection(WITHDRAWALS_COLLECTION).doc(withdrawalId);
      const w = (await tx.get(wRef)).data();
      if (!w || w.status !== 'pending') throw new Error('STATE');
      const aRef = db.collection(AFFILIATES_COLLECTION).doc(w.affiliateUsername);
      tx.update(aRef, {
        pendingBalance: FieldValue.increment(-w.amountUsd),
        ...(decision === 'rejected' && { availableBalance: FieldValue.increment(w.amountUsd) }),
      });
      tx.update(wRef, {
        status: decision,
        note: note || '',
        processedAt: new Date().toISOString(),
      });
    });
    return { success: true };
  } catch {
    return { success: false, error: 'La solicitud ya fue procesada o no existe.' };
  }
}

export async function saveAffiliateSettings(settings: AffiliateSettings) {
  await requireAdmin();
  const num = z.number().min(0).max(100);
  const parsed = z
    .object({
      sellerRate: num,
      parentRate: num,
      grandparentRate: num,
      customerDiscount: num,
      cookieDays: z.number().min(1).max(365),
      minWithdrawal: z.number().min(0),
    })
    .safeParse(settings);
  if (!parsed.success) return { success: false, error: 'Valores inválidos.' };
  await adminDb().doc('siteContent/affiliate').set(parsed.data, { merge: true });
  return { success: true };
}

export async function setAffiliateStatus(username: string, status: 'active' | 'suspended') {
  await requireAdmin();
  await adminDb().collection(AFFILIATES_COLLECTION).doc(username).update({ status });
  return { success: true };
}

