/**
 * Crea (o repara) el usuario fundador de Modulares GM:
 *  - usuario de Firebase Auth (correo verificado)
 *  - perfil raíz de afiliado `pablofgarciaf` (recibe ventas orgánicas y bonos huérfanos)
 *  - registro `usuarios/{uid}` con rol `super` (acceso al panel /admin)
 *  - forcePasswordChange = true → pedirá cambiar la clave en el primer ingreso
 *
 * Uso:
 *   npm run create-founder -- <cedula>          (la cédula es la clave inicial)
 *   npm run create-founder -- <cedula> --reset  (vuelve a fijar la clave inicial y el cambio obligatorio)
 *
 * Requiere credenciales de servidor en .env:
 *   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'   (una sola línea)
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 * y el proveedor "Correo y contraseña" habilitado en Firebase → Authentication.
 */
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const EMAIL = 'pablofgarciaf@gmail.com';
const USERNAME = 'pablofgarciaf';
const NAME = 'Pablo Fabricio García Flores';

const args = process.argv.slice(2);
const cedula = args.find((a) => !a.startsWith('--'));
const reset = args.includes('--reset');

if (!cedula || cedula.length < 6) {
  console.error('Falta la cédula (será la clave inicial).\n  npm run create-founder -- <cedula>');
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!projectId) {
  console.error('Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID en .env');
  process.exit(1);
}

initializeApp({
  credential: raw ? cert(JSON.parse(raw)) : applicationDefault(),
  projectId,
});
const auth = getAuth();
const db = getFirestore();

async function main() {
  let user;
  let created = false;
  try {
    user = await auth.getUserByEmail(EMAIL);
    if (reset) await auth.updateUser(user.uid, { password: cedula, emailVerified: true, displayName: NAME });
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
    user = await auth.createUser({ email: EMAIL, password: cedula, emailVerified: true, displayName: NAME });
    created = true;
  }

  const affRef = db.collection('affiliates').doc(USERNAME);
  const existing = await affRef.get();
  const forceChange = created || reset || !existing.exists;

  await affRef.set(
    {
      id: USERNAME,
      username: USERNAME,
      email: EMAIL,
      cedula,
      name: NAME,
      phone: existing.data()?.phone || '',
      referralCode: USERNAME,
      parentId: USERNAME,
      granId: USERNAME,
      rama: '1',
      rank: 'Empresario',
      status: 'active',
      authUid: user.uid,
      forcePasswordChange: forceChange ? true : existing.data()?.forcePasswordChange ?? false,
      createdAt: existing.data()?.createdAt || new Date().toISOString(),
      // Los saldos solo se inicializan la primera vez; nunca se pisan.
      ...(!existing.exists && {
        totalEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        salesCount: 0,
        monthlyVolume: 0,
        networkVolume: 0,
        cumulativePersonalVolume: 0,
      }),
    },
    { merge: true }
  );
  await db.collection('userIndex').doc(user.uid).set({ username: USERNAME });
  await db.collection('usuarios').doc(user.uid).set(
    { email: EMAIL, name: NAME, role: 'super', active: true, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  console.log(created ? '✔ Usuario creado en Firebase Auth' : '✔ Usuario ya existía en Firebase Auth');
  console.log(`✔ Afiliado raíz: ${USERNAME}  ·  Rol admin: super`);
  console.log(forceChange ? '✔ Pedirá cambio de contraseña en el primer ingreso' : '• No se forzó cambio de contraseña (usa --reset para forzarlo)');
}

main().catch((error) => {
  console.error('✖', error.code || '', error.message);
  if (error.code === 'auth/operation-not-allowed' || /identity toolkit/i.test(error.message)) {
    console.error('  Habilita "Correo y contraseña" en Firebase Console → Authentication → Sign-in method.');
  }
  process.exit(1);
});
