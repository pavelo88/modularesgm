import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { createPayPalOrder } from '@/lib/paypal';

export const runtime = 'nodejs';

const bodySchema = z.object({ orderId: z.string().min(5).max(64) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });

  try {
    const ref = adminDb().collection('orders').doc(parsed.data.orderId);
    const order = (await ref.get()).data();
    if (!order || order.paymentMethod !== 'paypal' || order.paidAt) {
      return NextResponse.json({ error: 'Pedido no disponible para pago' }, { status: 409 });
    }
    // El monto sale SIEMPRE del pedido guardado en el servidor, nunca del navegador.
    const paypalOrder = await createPayPalOrder({
      amount: Number(order.total),
      reference: parsed.data.orderId,
      description: `Pedido Modulares GM ${parsed.data.orderId}`,
    });
    await ref.update({ paypalOrderId: paypalOrder.id });
    return NextResponse.json({ id: paypalOrder.id });
  } catch (error) {
    console.error('[paypal-create]', error);
    return NextResponse.json({ error: 'No se pudo iniciar el pago' }, { status: 500 });
  }
}
