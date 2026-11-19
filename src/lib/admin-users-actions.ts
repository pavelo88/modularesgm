'use server';

import { z } from 'zod';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-session';

export interface AdminUserRecord {
  id: string;
  uid: string;
  nombre: string;
  dni: string;
  email: string;
  rol: 'admin' | 'vendedor' | 'disenador' | 'instalador' | 'afiliado_vip';
  activo: boolean;
  primerIngreso?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const toIsoDateString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (typeof val === 'number') return new Date(val).toISOString();
  return '';
};

export async function listAdminUsersAction() {
  await requireAdmin();
  try {
    const snap = await adminDb().collection('usuarios').get();
    const users: AdminUserRecord[] = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      const rawRol = String(data.rol || data.role || 'vendedor').toLowerCase();
      const validRol: AdminUserRecord['rol'] =
        rawRol === 'admin' || rawRol === 'super'
          ? 'admin'
          : rawRol === 'disenador' || rawRol === 'designer'
          ? 'disenador'
          : rawRol === 'instalador' || rawRol === 'technician'
          ? 'instalador'
          : rawRol === 'afiliado_vip'
          ? 'afiliado_vip'
          : 'vendedor';

      return {
        id: docSnap.id,
        uid: data.uid || docSnap.id,
        nombre: data.nombre || data.name || '',
        dni: data.dni || data.cedula || '',
        email: data.email || docSnap.id,
        rol: validRol,
        activo: data.activo !== false && data.active !== false,
        primerIngreso: data.primerIngreso === true,
        createdAt: toIsoDateString(data.createdAt) || new Date().toISOString(),
        updatedAt: toIsoDateString(data.updatedAt),
      };
    });
    return { success: true, users };
  } catch (error: any) {
    console.error('[listAdminUsersAction]', error);
    return { success: false, error: 'No se pudieron cargar los usuarios.' };
  }
}

const CreateUserSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  dni: z.string().min(6, 'La cédula debe tener al menos 6 caracteres para ser usada como clave temporal.'),
  email: z.string().email('Correo electrónico inválido.'),
  rol: z.enum(['admin', 'vendedor', 'disenador', 'instalador', 'afiliado_vip']),
});

export async function createAdminUserAction(data: z.infer<typeof CreateUserSchema>) {
  await requireAdmin();
  const parsed = CreateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Datos inválidos.' };
  }

  const { nombre, dni, email, rol } = parsed.data;
  const cleanEmail = email.toLowerCase().trim();
  const cleanDni = dni.trim();
  const cleanNombre = nombre.trim();

  try {
    let userUid: string;
    try {
      const existingUser = await adminAuth().getUserByEmail(cleanEmail);
      userUid = existingUser.uid;
      await adminAuth().updateUser(userUid, {
        password: cleanDni,
        displayName: cleanNombre,
      });
    } catch (authErr: any) {
      if (authErr.code === 'auth/user-not-found') {
        const newUser = await adminAuth().createUser({
          email: cleanEmail,
          password: cleanDni,
          displayName: cleanNombre,
        });
        userUid = newUser.uid;
      } else {
        throw authErr;
      }
    }

    const now = new Date().toISOString();
    await adminDb().collection('usuarios').doc(cleanEmail).set(
      {
        uid: userUid,
        nombre: cleanNombre,
        name: cleanNombre,
        dni: cleanDni,
        cedula: cleanDni,
        email: cleanEmail,
        rol,
        role: rol,
        activo: true,
        active: true,
        primerIngreso: true,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    return { success: true, message: `Usuario ${cleanEmail} creado exitosamente con contraseña temporal: ${cleanDni}` };
  } catch (error: any) {
    console.error('[createAdminUserAction]', error);
    return { success: false, error: error.message || 'Error al registrar el usuario en Firebase.' };
  }
}

export async function updateAdminUserAction(data: {
  email: string;
  nombre: string;
  dni: string;
  rol: 'admin' | 'vendedor' | 'disenador' | 'instalador' | 'afiliado_vip';
  activo: boolean;
}) {
  await requireAdmin();
  const cleanEmail = data.email.toLowerCase().trim();
  try {
    const now = new Date().toISOString();
    await adminDb().collection('usuarios').doc(cleanEmail).set(
      {
        nombre: data.nombre.trim(),
        name: data.nombre.trim(),
        dni: data.dni.trim(),
        cedula: data.dni.trim(),
        rol: data.rol,
        role: data.rol,
        activo: data.activo,
        active: data.activo,
        updatedAt: now,
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    console.error('[updateAdminUserAction]', error);
    return { success: false, error: 'Error al actualizar usuario.' };
  }
}

export async function deleteAdminUserAction(email: string) {
  await requireAdmin();
  const cleanEmail = email.toLowerCase().trim();
  try {
    try {
      const user = await adminAuth().getUserByEmail(cleanEmail);
      if (user?.uid) {
        await adminAuth().deleteUser(user.uid);
      }
    } catch (authErr: any) {
      console.warn('[deleteAdminUserAction] Auth deletion skipped:', authErr.message);
    }

    await adminDb().collection('usuarios').doc(cleanEmail).delete();
    return { success: true };
  } catch (error: any) {
    console.error('[deleteAdminUserAction]', error);
    return { success: false, error: 'Error al eliminar usuario.' };
  }
}

export async function resetAdminUserPasswordAction(email: string) {
  await requireAdmin();
  const cleanEmail = email.toLowerCase().trim();
  try {
    const snap = await adminDb().collection('usuarios').doc(cleanEmail).get();
    if (!snap.exists) return { success: false, error: 'Usuario no encontrado.' };

    const dni = String(snap.data()?.dni || snap.data()?.cedula || '').trim();
    if (!dni || dni.length < 6) {
      return { success: false, error: 'El usuario no tiene una cédula de al menos 6 dígitos registrada.' };
    }

    const user = await adminAuth().getUserByEmail(cleanEmail);
    await adminAuth().updateUser(user.uid, { password: dni });
    await adminDb().collection('usuarios').doc(cleanEmail).update({
      primerIngreso: true,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: `Clave restablecida a la cédula (${dni}). Se solicitará cambio al ingresar.` };
  } catch (error: any) {
    console.error('[resetAdminUserPasswordAction]', error);
    return { success: false, error: error.message || 'Error al restablecer clave.' };
  }
}
