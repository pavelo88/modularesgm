'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
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

export async function handleSendChatMessage(userMessage: string, siteContent: SiteContent, history: any[] = []) {
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
    console.error(error);
    return { success: false, error: 'AI service is unavailable.' };
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
