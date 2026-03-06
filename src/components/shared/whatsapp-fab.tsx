'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFAB({ phoneNumber }: { phoneNumber: string }) {
  if (!phoneNumber) return null;

  const message = encodeURIComponent(
    'Hola Modulares GM, solicito información sobre sus servicios de muebles y diseño.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_5px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:bg-white hover:text-[#25D366] transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
