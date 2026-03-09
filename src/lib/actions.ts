
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ADMIN_PASSWORD } from '@/lib/config';
import type { CartItem, SiteContent } from './types';

// AI Flow Imports
import { publicAIChatbot } from '@/ai/flows/public-ai-chatbot-flow';
import { adminLeadAnalysis } from '@/ai/flows/admin-lead-analysis-flow';
import { generateProposal } from '@/ai/flows/admin-proposal-generation-flow';
import { generateProductDescription } from '@/ai/flows/admin-product-description-drafting-flow';
import { generateAdminSEO } from '@/ai/flows/admin-seo-generation-flow';

// --- Authentication Actions ---

const SESSION_COOKIE = 'modulares-gm-session';

export async function login(password: string) {
  if (password === ADMIN_PASSWORD) {
    cookies().set(SESSION_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin/dashboard');
  }
  return { error: 'Contraseña incorrecta.' };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect('/admin');
}

export async function verifySession() {
  const cookie = cookies().get(SESSION_COOKIE);
  return !!cookie;
}


// --- Public Actions ---

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10),
});

export async function handleLeadSubmit(values: z.infer<typeof LeadSchema>) {
  try {
    await addDoc(collection(db, 'leads'), {
      ...values,
      status: 'Nuevo',
      createdAt: Date.now(),
    });
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
  paymentMethod: z.enum(['transferencia', 'tarjeta', 'efectivo'], {
    required_error: 'Debe seleccionar un método de pago',
  }),
  transferRef: z.string().optional(),
}).refine((data) => {
    if (data.paymentMethod === 'transferencia') {
        return !!data.transferRef && data.transferRef.length > 3;
    }
    return true;
}, {
    message: "El número de referencia es requerido y debe ser válido.",
    path: ["transferRef"],
});


export async function handleCheckout(
  values: z.infer<typeof checkoutSchema>,
  cart: CartItem[]
) {
  if (cart.length === 0) {
    return { success: false, error: 'El carrito está vacío.' };
  }

  const total = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const orderData = {
    ...values,
    items: cart,
    total: total,
    status: 'Pendiente',
    createdAt: Date.now(),
  };

  try {
    await addDoc(collection(db, 'orders'), orderData);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al registrar el pedido.' };
  }
}

export async function handleSendChatMessage(userMessage: string, siteContent: SiteContent) {
  try {
    const servicesContext = siteContent.services.map(s => s.title).join(', ');
    const productsContext = siteContent.products.map(p => `${p.title} ($${p.price})`).join(', ');

    const response = await publicAIChatbot({
      userMessage,
      servicesContext,
      productsContext
    });

    return { success: true, data: response.botResponse };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'AI service is unavailable.' };
  }
}


// --- Admin Actions (protected) ---

async function protectedAction() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    throw new Error('Not authenticated');
  }
}

export async function saveSiteContent(content: SiteContent) {
  await protectedAction();
  try {
    const contentRef = doc(db, 'siteContent', 'main');
    // Ensure nested objects aren't lost if they are undefined
    const cleanContent = JSON.parse(JSON.stringify(content));
    await setDoc(contentRef, cleanContent);
    revalidatePath('/');
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'No se pudo guardar el contenido.' };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await protectedAction();
  try {
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, { status }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status.' };
  }
}


// --- Admin AI Actions ---

export async function getLeadAnalysis(message: string) {
  await protectedAction();
  try {
    const result = await adminLeadAnalysis({ message });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI analysis failed.' };
  }
}

export async function getProposal(leadMessage: string) {
  await protectedAction();
  try {
    const result = await generateProposal({ leadMessage });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI proposal generation failed.' };
  }
}

export async function getProductDescription(productTitle: string, productCategory: string) {
  await protectedAction();
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
  await protectedAction();
  try {
    const result = await generateAdminSEO({ heroTitle, heroSubtitle });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'AI SEO generation failed.' };
  }
}
