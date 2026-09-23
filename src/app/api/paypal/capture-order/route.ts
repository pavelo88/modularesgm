import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { capturePayPalOrder } from '@/lib/paypal';
import { distributeCommissions } from '@/lib/affiliate-server';

export const runtime = 'nodejs';

const bodySchema = z.object({ orderId: z.string().min(5).max(64), paypalOrderId: z.string().min(5).max(64) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  const { orderId, paypalOrderId } = parsed.data;

  try {
    const ref = adminDb().collection('orders').doc(orderId);
    const order = (await ref.get()).data();
    if (!order || order.paypalOrderId !== paypalOrderId) {
      return NextResponse.json({ error: 'Pedido no coincide' }, { status: 409 });
    }
    if (order.paidAt) return NextResponse.json({ success: true, alreadyPaid: true });

    const result = await capturePayPalOrder(paypalOrderId);
    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
    const paidOk =
      result?.status === 'COMPLETED' &&
      capture?.status === 'COMPLETED' &&
      capture?.amount?.currency_code === 'USD' &&
      Number(capture?.amount?.value).toFixed(2) === Number(order.total).toFixed(2);

    if (!paidOk) {
      console.error('[paypal-capture] pago no verificable', { orderId, status: result?.status });
      return NextResponse.json({ error: 'El pago no pudo verificarse' }, { status: 402 });
    }

    await ref.update({
      status: 'Pago Verificado',
      paidAt: Date.now(),
      paypalCaptureId: capture.id,
      transferRef: `PayPal ${capture.id}`,
    });
    await distributeCommissions(orderId); // idempotente
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[paypal-capture]', error);
    return NextResponse.json({ error: 'No se pudo confirmar el pago' }, { status: 500 });
  }
}
