'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { clearAdminSession, createAdminSession, requireAdmin } from '@/lib/admin-session';
import { applyOrderStatus, getSettings, priceCart, resolveAttribution } from '@/lib/affiliate-server';
import { priceWithDiscount } from '@/lib/affiliate-core';
import type { CartItem, SiteContent } from './types';
import { fetchAnalyticsReport, type AnalyticsDays } from '@/lib/ga-report';

// AI Flow Imports
import { publicAIChatbot } from '@/ai/flows/public-ai-chatbot-flow';
import { adminLeadAnalysis } from '@/ai/flows/admin-lead-analysis-flow';
import { generateProposal } from '@/ai/flows/admin-proposal-generation-flow';
import { generateProductDescription } from '@/ai/flows/admin-product-description-drafting-flow';
import { generateAdminSEO } from '@/ai/flows/admin-seo-generation-flow';

// --- Authentication Actions (Firebase Auth + cookie de sesión verificada) ---

export async function loginAdmin(idToken: string) {
  try {
    const identity = await createAdminSession(idToken);
    if (!identity) return { error: 'Tu cuenta no tiene acceso al panel.' };
    return { success: true as const };
  } catch (error) {
    console.error('[admin-login]', error);
    return { error: 'No se pudo validar la sesión. Intenta nuevamente.' };
  }
}

export async function logout() {
  await clearAdminSession();
  redirect('/admin');
}

// --- Public Actions ---

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10),
});

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Aviso por correo de cada cotización nueva, para que ningún lead se quede sin respuesta.
 * Solo se envía si SMTP_USER y SMTP_PASS están configurados; LEADS_NOTIFY_EMAIL define el destino.
 */
async function notifyNewLead(lead: z.infer<typeof LeadSchema>) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return;
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({ host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user, pass } });
    await transporter.sendMail({
      from: `"Web Modulares GM" <${user}>`,
      to: process.env.LEADS_NOTIFY_EMAIL || user,
      replyTo: lead.email,
      subject: `Nueva cotización: ${lead.name}`,
      text: `Nombre: ${lead.name}\nTeléfono: ${lead.phone}\nCorreo: ${lead.email}\n\n${lead.message}\n\nResponde en menos de 15 minutos: los leads se enfrían rápido.`,
      html: `<p><strong>Nombre:</strong> ${escapeHtml(lead.name)}<br><strong>Teléfono:</strong> ${escapeHtml(lead.phone)}<br><strong>Correo:</strong> ${escapeHtml(lead.email)}</p><p>${escapeHtml(lead.message)}</p><p><em>Responde en menos de 15 minutos: los leads se enfrían rápido.</em></p>`,
    });
  } catch (err) {
    console.error('[lead-notify]', err);
  }
}

export async function handleLeadSubmit(values: z.infer<typeof LeadSchema>) {
  const parsed = LeadSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Datos inválidos.' };
  try {
    await adminDb().collection('leads').add({
      ...parsed.data,
      status: 'Nuevo',
      createdAt: Date.now(),
    });
    await notifyNewLead(parsed.data);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error de conexión. Intente nuevamente.' };
  }
}

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(7, { message: 'Teléfono es requerido' }),
  address: z.string().min(5, { message: 'Dirección es requerida' }),
  paymentMethod: z.enum(['transferencia', 'paypal', 'efectivo']),
  transferRef: z.string().optional(),
});

/**
 * Crea el pedido. Los precios se recalculan en el servidor a partir del catálogo;
 * el descuento y la atribución del afiliado también se resuelven aquí.
 */
export async function handleCheckout(
  values: z.infer<typeof checkoutSchema>,
  cart: CartItem[],
  affiliateCode?: string
) {
  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Datos inválidos.' };
  const data = parsed.data;
  if (data.paymentMethod === 'transferencia' && (!data.transferRef || data.transferRef.length < 4)) {
    return { success: false, error: 'El número de referencia es requerido.' };
  }

  const { items, subtotal } = await priceCart(cart);
  if (items.length === 0) return { success: false, error: 'El carrito está vacío.' };

  try {
    const settings = await getSettings();
    const attribution = await resolveAttribution(affiliateCode, data.email);
    const { discountAmount, codeDiscountAmount, transferDiscountAmount, total } = priceWithDiscount(
      subtotal,
      !!attribution,
      settings,
      data.paymentMethod
    );

    const ref = await adminDb().collection('orders').add({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      transferRef: data.transferRef || '',
      items,
      subtotal,
      discountAmount,
      codeDiscountAmount,
      transferDiscountAmount,
      total,
      affiliateCode: attribution?.username || '',
      status: 'Pendiente',
      createdAt: Date.now(),
    });
    return { success: true, orderId: ref.id, total };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al registrar el pedido.' };
  }
}

function nativeSalesAdvisorResponse(message: string, siteContent: SiteContent): string {
  const q = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (q.includes('cocina') || q.includes('meson') || q.includes('cuarzo') || q.includes('isla')) {
    return '¡Hola! Con mucho gusto te asesoro sobre nuestras **Cocinas Integrales de Alta Gama** 🍳. Fabricamos a medida con tableros Pelikano RH de 18mm (100% resistentes a la humedad y vapor), herrajes alemanes Blum con cierre amortiguado y mesones en cuarzo Calacatta, Silestone o granito natural.\n\nPuedes explorar nuestros diseños y modelos destacados en nuestro [Catálogo de Cocinas](/cocinas).\n\n¿Qué tipo de distribución tienes en mente (en L, lineal, con isla central)? Déjanos tu número de WhatsApp para coordinar una visita técnica y render 3D sin costo en Quito y valles.';
  }

  if (q.includes('closet') || q.includes('vestidor') || q.includes('ropa') || q.includes('armario')) {
    return '¡Excelente! Nuestros **Clósets y Walk-in Closets** 🚪 son fabricados a medida para aprovechar al máximo cada espacio. Incluyen iluminación LED integrada, pantaloneros extraíbles, zapateras deslizables y frentes en vidrio templado o melamina Pelikano RH de 18mm.\n\nPuedes ver fotos reales y proyectos en nuestro [Catálogo de Clósets](/closets).\n\n¿De cuántos metros de ancho dispones para tu clóset? Déjanos tu WhatsApp y te enviamos una cotización preliminar de inmediato.';
  }

  if (q.includes('bano') || q.includes('vanity') || q.includes('lavamanos')) {
    return 'Nuestros **Muebles de Baño y Vanities Flotantes** 🚿 combinan tableros marinos RH antihumedad con elegantes mesones de cuarzo antibacterial y espejos con iluminación LED táctil.\n\nPuedes conocer nuestras colecciones en el [Catálogo de Muebles de Baño](/muebles-bano).\n\n¿Deseas que un diseñador te visite en obra para tomar medidas exactas? Déjanos tu teléfono para coordinar.';
  }

  if (q.includes('precio') || q.includes('costo') || q.includes('cuanto') || q.includes('cotiz')) {
    return 'En **Modulares GM** fabricamos 100% a medida. Las cocinas modulares inician desde **$220 por metro lineal** en melamina Pelikano RH y los mesones de cuarzo desde **$140 el metro lineal**. Puedes revisar la lista detallada en nuestra página de [Precios y Cotizaciones](/precios) o visitar la [Tienda Oficial](/store).\n\nSi nos dejas tu número de WhatsApp y las dimensiones aproximadas, un arquitecto te contacta en minutos para cotizarte sin compromiso.';
  }

  if (q.includes('escritorio') || q.includes('oficina') || q.includes('estudio') || q.includes('counter')) {
    return 'Diseñamos **Escritorios Ergonómicos y Mobiliario Corporativo** 💻 con melamina de alta densidad, pasacables integrados y cajoneras con cerradura. Ideales para teletrabajo, estudios o counters de recepción ejecutivos.\n\nExplora los modelos en nuestro [Catálogo de Escritorios](/escritorios) o [Mobiliario de Oficina](/muebles-oficina).\n\n¿Buscas para hogar o para empresa? Déjanos tus datos para brindarte asesoría.';
  }

  if (q.includes('puerta') || q.includes('pivotante')) {
    return 'Fabricamos **Puertas Pivotantes Monumentales** 🚪 de hasta 3 metros de altura con pivote axial y núcleo aislante, además de puertas de interior con marcos envolventes en acabado madera noble o lacado.\n\nPuedes ver nuestros modelos en el [Catálogo de Puertas](/puertas).\n\n¿Para qué tipo de entrada la necesitas? Déjanos tu contacto para asesorarte.';
  }

  if (q.includes('afiliado') || q.includes('trabaj') || q.includes('comision') || q.includes('arquitecto')) {
    return '¡Bienvenido! En nuestro **Programa de Afiliados GM** puedes ganar entre el 5% y 10% de comisión directa por cada proyecto cerrado con tu recomendación. Además tus clientes reciben un 5% de descuento.\n\nPuedes registrarte gratis en [modularesgm.com/afiliados](/afiliados) o ingresar a tu panel en [Acceso de Afiliados](/afiliados/acceso).';
  }

  return '¡Hola! Soy el ✨ **Asesor de Ventas y Diseño de Modulares GM**. Con más de 12 años de experiencia en Quito, fabricamos cocinas integrales, clósets, muebles de baño, escritorios y puertas a medida con tableros Pelikano RH de 18mm y garantía oficial de 3 a 5 años.\n\nPuedes revisar todos nuestros espacios en el [Índice de Catálogos](/catalogo) o indicarme qué ambiente te gustaría renovar para guiarte paso a paso.';
}

export async function handleSendChatMessage(
  userMessage: string,
  siteContent: SiteContent,
  history: any[] = []
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    const servicesContext = siteContent.services.map(s => s.title).join(', ');
    const productsContext = siteContent.products.map(p => `${p.title} ($${p.price})`).join(', ');

    const response = await publicAIChatbot({
      userMessage,
      history,
      servicesContext,
      productsContext
    });

    // --- GUARDADO AUTOMÁTICO DE LEADS ---
    if (response.extractedLead && (response.extractedLead.name || response.extractedLead.phone)) {
       await adminDb().collection('leads').add({
         name: response.extractedLead.name || 'Desconocido',
         email: 'ia-auto-captured@modularesgm.com',
         phone: response.extractedLead.phone || 'Pendiente',
         message: `PROYECTO: ${response.extractedLead.project || 'No especificado'} | CITA: ${response.extractedLead.appointmentDate || 'No agendada'}`,
         address: response.extractedLead.address || 'No proporcionada',
         status: 'Nuevo (IA)',
         createdAt: Date.now(),
       });
    }

    return { success: true, data: response.botResponse };
  } catch (error) {
    console.warn('[AI fallback activation]:', error);
    // Asesor nativo inteligente en caso de que el proveedor de IA esté desconectado
    const botResponse = nativeSalesAdvisorResponse(userMessage, siteContent);

    // Detección básica de teléfono/lead en el mensaje
    const phoneMatch = userMessage.match(/(\+?593|0)[\d\s-]{8,12}/);
    if (phoneMatch) {
      try {
        await adminDb().collection('leads').add({
          name: 'Cliente Chat Web',
          email: 'contacto-web@modularesgm.com',
          phone: phoneMatch[0].replace(/\s+/g, ''),
          message: `Consulta: ${userMessage}`,
          address: 'Quito / Ecuador',
          status: 'Nuevo (Chat)',
          createdAt: Date.now(),
        });
      } catch {}
    }

    return { success: true, data: botResponse };
  }
}


// --- Admin Actions (protegidas con sesión verificada) ---

export async function saveSiteContent(content: SiteContent) {
  await requireAdmin();
  try {
    // Ensure nested objects aren't lost if they are undefined
    const cleanContent = JSON.parse(JSON.stringify(content));
    await adminDb().doc('siteContent/main').set(cleanContent);
    revalidatePath('/');
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'No se pudo guardar el contenido.' };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  try {
    await applyOrderStatus(orderId, status);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'No se pudo actualizar el estado.' };
  }
}


// --- Admin AI Actions ---

export async function getLeadAnalysis(message: string) {
  await requireAdmin();
  try {
    const result = await adminLeadAnalysis({ message });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI analysis failed.' };
  }
}

export async function getProposal(leadMessage: string) {
  await requireAdmin();
  try {
    const result = await generateProposal({ leadMessage });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI proposal generation failed.' };
  }
}

export async function getProductDescription(productTitle: string, productCategory: string) {
  await requireAdmin();
  try {
    const result = await generateProductDescription({
      productId: '', // Not strictly needed by the prompt
      productTitle,
      productCategory,
    });
    return { success: true, data: result.description };
  } catch (error) {
    return { success: false, error: 'AI description generation failed.' };
  }
}

export async function getSeoSuggestions(heroTitle: string, heroSubtitle: string) {
  await requireAdmin();
  try {
    const result = await generateAdminSEO({ heroTitle, heroSubtitle });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI SEO generation failed.' };
  }
}

// --- Analítica (Google Analytics 4) ---

export async function getAnalyticsReport(days: AnalyticsDays) {
  await requireAdmin();
  const safeDays: AnalyticsDays = days === 7 || days === 90 ? days : 28;
  return fetchAnalyticsReport(safeDays);
}

// --- Gestión de Usuarios y Roles (Estilo Apple / EnergyEngine) ---

export interface AdminUserRecord {
  id: string;
  uid?: string;
  nombre: string;
  dni: string;
  email: string;
  rol: 'admin' | 'vendedor' | 'disenador' | 'instalador' | 'afiliado_vip';
  activo: boolean;
  primerIngreso: boolean;
  createdAt: string;
  updatedAt?: string;
}

export async function listAdminUsersAction(): Promise<{ success: boolean; users?: AdminUserRecord[]; error?: string }> {
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
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
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
      // Si el usuario ya existe en Auth, actualizamos su clave a la cédula
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
