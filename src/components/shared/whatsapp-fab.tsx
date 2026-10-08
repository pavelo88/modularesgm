'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';

/** Mensaje inicial según la página: el asesor sabe de qué viene a hablar cada cliente. */
const MESSAGES: Array<[prefix: string, text: string]> = [
  ['/cocinas', 'Hola Modulares GM, quiero cotizar una cocina modular.'],
  ['/closets', 'Hola Modulares GM, quiero cotizar un clóset a medida.'],
  ['/muebles-bano', 'Hola Modulares GM, quiero cotizar un mueble de baño.'],
  ['/escritorios', 'Hola Modulares GM, quiero información sobre sus escritorios.'],
  ['/muebles-oficina', 'Hola Modulares GM, quiero cotizar muebles para mi oficina.'],
  ['/puertas', 'Hola Modulares GM, quiero cotizar puertas.'],
  ['/gamer', 'Hola Modulares GM, quiero cotizar un mueble gamer.'],
  ['/afiliados', 'Hola Modulares GM, quiero información para trabajar con ustedes como afiliado.'],
  ['/store', 'Hola Modulares GM, tengo una consulta sobre un producto de la tienda.'],
];
const DEFAULT_MESSAGE = 'Hola Modulares GM, solicito información sobre sus servicios de muebles y diseño.';

export function WhatsAppFAB({ phoneNumber }: { phoneNumber: string }) {
  const pathname = usePathname() ?? '/';
  if (!phoneNumber) return null;

  const message = MESSAGES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? DEFAULT_MESSAGE;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappHref(phoneNumber, message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        onClick={() => track('whatsapp_click', { location: 'boton_flotante', page: pathname })}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_5px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:bg-white hover:text-[#25D366] transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
