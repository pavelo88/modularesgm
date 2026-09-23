'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface Props {
  orderId: string;
  onPaid: () => void;
  onError: (message: string) => void;
}

/** Botones de PayPal (tarjeta o cuenta PayPal). Monto y verificación viven en el servidor. */
export function PayPalButton({ orderId, onPaid, onError }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Los callbacks viven en refs: cambiar de identidad no debe volver a montar los botones.
  const onPaidRef = useRef(onPaid);
  const onErrorRef = useRef(onError);
  onPaidRef.current = onPaid;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      try {
        const cfg = await fetch('/api/paypal/config', { cache: 'no-store' });
        if (!cfg.ok) throw new Error('PayPal no está configurado.');
        const { clientId } = await cfg.json();

        if (!window.paypal) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons`;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('No se pudo cargar PayPal.'));
            document.head.appendChild(s);
          });
        }
        if (cancelled || !container.current) return;

        await window.paypal
          .Buttons({
            style: { layout: 'vertical', shape: 'pill', label: 'pay' },
            createOrder: async () => {
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'No se pudo iniciar el pago.');
              return data.id;
            },
            onApprove: async (data: { orderID: string }) => {
              const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
              });
              const out = await res.json();
              if (!res.ok) return onErrorRef.current(out.error || 'El pago no pudo confirmarse.');
              onPaidRef.current();
            },
            onError: () => onErrorRef.current('PayPal reportó un error. No se realizó ningún cobro.'),
          })
          .render(container.current);
        if (!cancelled) setReady(true);
      } catch (e) {
        onErrorRef.current((e as Error).message);
      }
    }
    mount();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div>
      {!ready && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando pago seguro…
        </p>
      )}
      <div ref={container} />
    </div>
  );
}
