/** PayPal REST v2 (servidor). Cobra en USD; las credenciales nunca salen al navegador. */

const CLIENT_ID = () => process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = () => process.env.PAYPAL_CLIENT_SECRET || '';
const API_BASE = () =>
  (process.env.PAYPAL_MODE || 'sandbox') === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

export const isPayPalConfigured = () => Boolean(CLIENT_ID() && CLIENT_SECRET());
export const paypalClientId = () => CLIENT_ID();
export const paypalEnvironment = () => ((process.env.PAYPAL_MODE || 'sandbox') === 'live' ? 'live' : 'sandbox');

async function accessToken(): Promise<string> {
  if (!isPayPalConfigured()) throw new Error('PAYPAL_NOT_CONFIGURED');
  const basic = Buffer.from(`${CLIENT_ID()}:${CLIENT_SECRET()}`).toString('base64');
  const res = await fetch(`${API_BASE()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PayPal OAuth ${res.status}`);
  return (await res.json()).access_token;
}

export async function createPayPalOrder(params: { amount: number; reference: string; description: string }) {
  const token = await accessToken();
  const res = await fetch(`${API_BASE()}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.reference,
          custom_id: params.reference,
          description: params.description.slice(0, 127),
          amount: { currency_code: 'USD', value: params.amount.toFixed(2) },
        },
      ],
      application_context: {
        brand_name: 'Modulares GM',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PayPal create order ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await accessToken();
  const res = await fetch(`${API_BASE()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PayPal capture ${res.status}: ${await res.text()}`);
  return res.json();
}
