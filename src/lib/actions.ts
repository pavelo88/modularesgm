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

import { headers } from 'next/headers';

const LeadSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100, 'El nombre es demasiado largo.'),
  email: z.string().trim().email('Correo electrónico inválido.').max(120, 'El correo es demasiado largo.'),
  phone: z.string().trim().min(7, 'El teléfono debe tener al menos 7 dígitos.').max(30, 'El teléfono es demasiado largo.'),
  message: z.string().trim().min(10, 'El mensaje debe tener al menos 10 caracteres.').max(2000, 'El mensaje es demasiado largo.'),
  website_hp: z.string().optional(),
});

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Rate Limiter en memoria para envíos de leads (cooldown de 45 segundos por IP)
const leadRateLimitMap = new Map<string, number>();

function checkLeadRateLimit(clientIp: string): { allowed: boolean; remainingSec: number } {
  const now = Date.now();
  const COOLDOWN_MS = 45 * 1000; // 45 segundos de cooldown entre envíos

  // Limpieza preventiva de entradas viejas si el mapa crece
  if (leadRateLimitMap.size > 2000) {
    for (const [ip, timestamp] of leadRateLimitMap.entries()) {
      if (now - timestamp > COOLDOWN_MS) {
        leadRateLimitMap.delete(ip);
      }
    }
  }

  const lastSubmit = leadRateLimitMap.get(clientIp);
  if (lastSubmit && now - lastSubmit < COOLDOWN_MS) {
    const remainingSec = Math.ceil((COOLDOWN_MS - (now - lastSubmit)) / 1000);
    return { allowed: false, remainingSec };
  }

  leadRateLimitMap.set(clientIp, now);
  return { allowed: true, remainingSec: 0 };
}

/**
 * Aviso por correo de cada cotización nueva, para que ningún lead se quede sin respuesta.
 * Solo se envía si SMTP_USER y SMTP_PASS están configurados; LEADS_NOTIFY_EMAIL define el destino.
 * Blindado con timeout y try/catch para que un fallo o ataque de red SMTP jamás tumbe la solicitud.
 */
async function notifyNewLead(lead: { name: string; email: string; phone: string; message: string }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return;

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 5000, // 5 segundos max
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });

    const sanitizedName = escapeHtml(lead.name);
    const sanitizedEmail = escapeHtml(lead.email);
    const sanitizedPhone = escapeHtml(lead.phone);
    const sanitizedMsg = escapeHtml(lead.message);

    await transporter.sendMail({
      from: `"Web Modulares GM" <${user}>`,
      to: process.env.LEADS_NOTIFY_EMAIL || user,
      replyTo: lead.email,
      subject: `Nueva cotización: ${sanitizedName}`,
      text: `Nombre: ${lead.name}\nTeléfono: ${lead.phone}\nCorreo: ${lead.email}\n\n${lead.message}\n\nResponde en menos de 15 minutos: los leads se enfrían rápido.`,
      html: `<p><strong>Nombre:</strong> ${sanitizedName}<br><strong>Teléfono:</strong> ${sanitizedPhone}<br><strong>Correo:</strong> ${sanitizedEmail}</p><p>${sanitizedMsg.replace(/\n/g, '<br>')}</p><p><em>Responde en menos de 15 minutos: los leads se enfrían rápido.</em></p>`,
    });
  } catch (err: any) {
    // Registro interno seguro sin exponer trazas al cliente
    console.error('[lead-notify-smtp-warning] Error enviando correo de notificación:', err?.message || err);
  }
}

export async function handleLeadSubmit(values: z.infer<typeof LeadSchema>) {
  // 1. Detección y bloqueo inmediato de Honeypot anti-bots
  if (values.website_hp && values.website_hp.trim() !== '') {
    console.warn('[honeypot-triggered] Bot detectado rellenando campo trampa invisible.');
    // Retorno silencioso exitoso para engañar al bot sin procesar nada en Firestore ni SMTP
    return { success: true };
  }

  // 2. Validación estricta con Zod y sanitización de longitud
  const parsed = LeadSchema.safeParse(values);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Datos de contacto inválidos.';
    return { success: false, error: firstError };
  }

  // 3. Rate limiting por IP del cliente
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get('x-forwarded-for');
    const realIp = headerList.get('x-real-ip');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    const rateCheck = checkLeadRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Has enviado una solicitud recientemente. Por favor espera ${rateCheck.remainingSec} segundos antes de enviar otra.`,
      };
    }
  } catch (ipErr) {
    // Si no se pueden obtener cabeceras (ej: en test runner), permitimos continuar
    console.warn('[lead-submit-ip-check]', ipErr);
  }

  const { name, email, phone, message } = parsed.data;

  // 4. Guardado en Firestore
  try {
    await adminDb().collection('leads').add({
      name,
      email,
      phone,
      message,
      status: 'Nuevo',
      createdAt: Date.now(),
    });

    // 5. Notificación SMTP asíncrona y tolerante a fallos
    notifyNewLead({ name, email, phone, message }).catch((smtpErr) => {
      console.error('[lead-notify-async-error]', smtpErr);
    });

    return { success: true };
  } catch (error) {
    console.error('[handleLeadSubmit-db-error]', error);
    return { success: false, error: 'Error de conexión. Intente nuevamente en unos instantes.' };
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

  return '¡Hola! Soy el ✨ **Asesor de Ventas y Diseño de Modulares GM**. Con más de 12 años de experiencia en Quito, fabricamos cocinas integrales, clósets, muebles de baño, escritorios y puertas a medida con tableros Pelikano RH de 18mm y garantía oficial de 3 a 10 años según el producto.\n\nPuedes revisar todos nuestros espacios en el [Índice de Catálogos](/catalogo) o indicarme qué ambiente te gustaría renovar para guiarte paso a paso.';
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
    await adminDb().doc('siteContent/main').set(cleanContent, { merge: true });
    revalidatePath('/');
    revalidatePath('/store');
    revalidatePath('/catalogo');
    revalidatePath('/', 'layout');
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

