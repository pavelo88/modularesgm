import { NextResponse } from 'next/server';
import { isPayPalConfigured, paypalClientId, paypalEnvironment } from '@/lib/paypal';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isPayPalConfigured()) return NextResponse.json({ enabled: false }, { status: 503 });
  return NextResponse.json({ enabled: true, clientId: paypalClientId(), environment: paypalEnvironment() });
}
