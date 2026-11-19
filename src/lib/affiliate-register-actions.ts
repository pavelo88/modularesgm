'use server';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getAffiliate } from '@/lib/affiliate-server';
import {
  AFFILIATES_COLLECTION,
  ALIASES_COLLECTION,
  ROOT_USERNAME,
  USER_INDEX_COLLECTION,
  normalizeUsername,
} from '@/lib/affiliate-core';

const RESERVED = new Set(['admin', 'root', 'soporte', 'support', 'modulares', 'modularesgm', ROOT_USERNAME]);

const CreateAffiliateSchema = z.object({
  sponsorUsername: z.string().trim().min(3, 'Patrocinador requerido'),
  name: z.string().trim().min(3, 'Nombre completo requerido (mínimo 3 caracteres)'),
  username: z.string().trim().min(3, 'Usuario mínimo 3 caracteres'),
  email: z.string().trim().email('Correo electrónico inválido'),
  cedula: z.string().trim().min(6, 'Cédula requerida (mínimo 6 dígitos, servirá de clave temporal)'),
  phone: z.string().trim().optional(),
});

export async function createDownlineAffiliateAction(
  data: z.infer<typeof CreateAffiliateSchema>
) {
  const parsed = CreateAffiliateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message || 'Datos incompletos.' };
  }

  const { sponsorUsername, name, username: rawUsername, email: rawEmail, cedula, phone } = parsed.data;
  const username = normalizeUsername(rawUsername);
  const cleanEmail = rawEmail.toLowerCase().trim();
  const cleanDni = cedula.trim();
  const cleanName = name.trim();
  const cleanPhone = (phone || '').trim();

  if (username.length < 3 || RESERVED.has(username)) {
    return { success: false as const, error: 'Ese nombre de usuario no está disponible o está reservado.' };
  }

  try {
    const db = adminDb();

    // 1. Verificar disponibilidad de username
    const [snap, alias] = await Promise.all([
      db.collection(AFFILIATES_COLLECTION).doc(username).get(),
      db.collection(ALIASES_COLLECTION).doc(username).get(),
    ]);

    if (snap.exists || alias.exists) {
      return { success: false as const, error: 'Ese nombre de usuario ya está registrado en el sistema.' };
    }

    // 2. Verificar o crear usuario en Firebase Authentication
    let userUid: string;
    try {
      const existingAuth = await adminAuth().getUserByEmail(cleanEmail);
      userUid = existingAuth.uid;
      // Actualizamos clave inicial a su cédula y nombre
      await adminAuth().updateUser(userUid, {
        password: cleanDni,
        displayName: cleanName,
      });
    } catch (authErr: any) {
      if (authErr.code === 'auth/user-not-found') {
        const newAuth = await adminAuth().createUser({
          email: cleanEmail,
          password: cleanDni,
          displayName: cleanName,
        });
        userUid = newAuth.uid;
      } else {
        throw authErr;
      }
    }

    // 3. Obtener el patrocinador
    const cleanSponsor = normalizeUsername(sponsorUsername);
    const sponsor = await getAffiliate(cleanSponsor);
    const parentId = sponsor && sponsor.status !== 'suspended' ? cleanSponsor : ROOT_USERNAME;
    const granId = parentId === ROOT_USERNAME ? ROOT_USERNAME : String(sponsor?.parentId || ROOT_USERNAME);

    const children = await db.collection(AFFILIATES_COLLECTION).where('parentId', '==', parentId).count().get();
    const parentRama = String((parentId === ROOT_USERNAME ? '1' : sponsor?.rama) || '1');

    const account = {
      id: username,
      username,
      email: cleanEmail,
      cedula: cleanDni,
      name: cleanName,
      phone: cleanPhone,
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
      forcePasswordChange: true, // Debe cambiar su clave en el primer acceso
      authUid: userUid,
      createdAt: new Date().toISOString(),
    };

    const batch = db.batch();
    batch.create(db.collection(AFFILIATES_COLLECTION).doc(username), account);
    batch.set(db.collection(USER_INDEX_COLLECTION).doc(userUid), { username });
    await batch.commit();

    return {
      success: true as const,
      username,
      message: `Afiliado @${username} registrado exitosamente. Clave temporal asignada: su cédula (${cleanDni}).`,
    };
  } catch (error: any) {
    console.error('[createDownlineAffiliateAction]', error);
    if (error?.code === 6 || /already exists/i.test(error?.message || '')) {
      return { success: false as const, error: 'Ese nombre de usuario ya está en uso.' };
    }
    return { success: false as const, error: error.message || 'Error al crear el afiliado en el servidor.' };
  }
}
