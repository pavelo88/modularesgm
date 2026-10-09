'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Sparkles, Phone, X, Bot, ArrowRight, ChevronUp } from 'lucide-react';
import { whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import type { SiteContent } from '@/lib/types';
import { ChatWindow } from './chatbot/chat-window';
import { cn } from '@/lib/utils';

const ROUTE_MESSAGES: Array<[prefix: string, topic: string, message: string]> = [
  ['/cocinas', 'Cocinas Integrales', '¡Hola Modulares GM! Quiero cotizar una cocina modular y mesón de cuarzo.'],
  ['/closets', 'Clósets & Vestidores', '¡Hola Modulares GM! Quiero cotizar un clóset a medida.'],
  ['/muebles-bano', 'Muebles de Baño', '¡Hola Modulares GM! Quiero cotizar un mueble de baño flotante.'],
  ['/escritorios', 'Escritorios', '¡Hola Modulares GM! Deseo información sobre escritorios y estaciones de trabajo.'],
  ['/muebles-oficina', 'Mobiliario Corporativo', '¡Hola Modulares GM! Quiero cotizar mobiliario para mi oficina.'],
  ['/puertas', 'Puertas Pivotantes', '¡Hola Modulares GM! Deseo cotizar puertas pivotantes o de paso.'],
  ['/gamer', 'Mobiliario Gamer', '¡Hola Modulares GM! Quiero cotizar un setup para habitación gamer.'],
  ['/afiliados', 'Red de Afiliados', '¡Hola Modulares GM! Deseo información para unirme como afiliado.'],
  ['/store', 'Tienda en Línea', '¡Hola Modulares GM! Tengo una consulta sobre los productos de la tienda.'],
];

const DEFAULT_TOPIC = 'Asesoría de Diseño & Cotizaciones';
const DEFAULT_MESSAGE = '¡Hola Modulares GM! Deseo solicitar asesoría técnica y cotización para mi proyecto de mobiliario a medida.';

export function ConciergeFAB({ siteContent }: { siteContent: SiteContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  const routeMatch = ROUTE_MESSAGES.find(([prefix]) => pathname.startsWith(prefix));
  const activeTopic = routeMatch ? routeMatch[1] : DEFAULT_TOPIC;
  const activeMessage = routeMatch ? routeMatch[2] : DEFAULT_MESSAGE;
  const phoneNumber = siteContent.whatsappNumber || '+593963064374';

  const handleOpenWhatsApp = () => {
    track('whatsapp_click', { location: 'concierge_fab', page: pathname, topic: activeTopic });
    window.open(whatsappHref(phoneNumber, activeMessage), '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenAIChat = () => {
    track('ai_chat_open', { location: 'concierge_fab', page: pathname });
    setIsChatWindowOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Ventana Flotante del Asistente IA */}
      {isChatWindowOpen && (
        <div className="mb-3 animate-in slide-in-from-bottom-5">
          <ChatWindow
            siteContent={siteContent}
            onClose={() => setIsChatWindowOpen(false)}
          />
        </div>
      )}

      {/* Menú Flotante Unificado (WhatsApp + IA Asesor + Llamada) */}
      {isOpen && !isChatWindowOpen && (
        <div 
          role="dialog"
          aria-label="Menú de atención y asesoría GM"
          className="mb-3 w-[310px] sm:w-[340px] rounded-3xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/95 dark:bg-[#12161A]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] p-4 text-stone-900 dark:text-stone-100 animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {/* Cabecera del Menú */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <h4 className="text-xs font-bold tracking-tight text-foreground">Atención Inmediata GM</h4>
                <p className="text-[10px] text-muted-foreground">Quito y valles • Envíos a todo el país</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-stone-200/50 dark:hover:bg-stone-800 transition"
              aria-label="Cerrar opciones"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {/* Opción 1: WhatsApp Humano */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full group flex items-start gap-3 p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] transition-all text-left"
            >
              <div className="h-9 w-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <MessageCircle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">Asesor por WhatsApp</h5>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Directo</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-normal">
                  Habla con un diseñador para {activeTopic.toLowerCase()}
                </p>
              </div>
              <ArrowRight size={14} className="text-emerald-600 dark:text-emerald-400 mt-2 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Opción 2: Asistente IA 24/7 */}
            <button
              type="button"
              onClick={handleOpenAIChat}
              className="w-full group flex items-start gap-3 p-3 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 active:scale-[0.98] transition-all text-left"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Sparkles size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">Asistente Virtual IA</h5>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">24 / 7</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-normal">
                  Consulta medidas, materiales Pelikano y precios
                </p>
              </div>
              <ArrowRight size={14} className="text-primary mt-2 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Opción 3: Llamar Directo */}
            <a
              href="tel:+593963064374"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-200/40 dark:hover:bg-stone-800/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <Phone size={14} className="text-stone-700 dark:text-stone-300" />
              <span>Llamar a taller / oficina: +593 96 306 4374</span>
            </a>
          </div>
        </div>
      )}

      {/* Botón Principal FUSIONADO (WhatsApp + IA) */}
      {!isChatWindowOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú de asesoría" : "Abrir asesoría técnica por WhatsApp e Inteligencia Artificial"}
          className={cn(
            "relative group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.25)] border transition-all duration-300 active:scale-95",
            isOpen 
              ? "bg-stone-900 text-white border-stone-700 dark:bg-white dark:text-stone-900" 
              : "bg-[#1f2937] dark:bg-[#111827] text-white border-amber-500/40 hover:border-amber-400 hover:shadow-[0_10px_40px_rgba(210,142,27,0.3)]"
          )}
        >
          {isOpen ? (
            <>
              <X size={22} className="shrink-0" />
              <span className="text-xs font-bold hidden sm:inline">Cerrar</span>
            </>
          ) : (
            <>
              {/* Icono Dual: WhatsApp + Chispas IA */}
              <div className="relative flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                  <MessageCircle size={18} />
                </div>
                <div className="absolute -top-1 -right-1.5 h-4 w-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow border border-white dark:border-stone-900">
                  <Sparkles size={9} />
                </div>
              </div>

              <div className="text-left hidden sm:block">
                <span className="block text-[11px] font-bold leading-none tracking-tight text-white">
                  Asesoría & IA
                </span>
                <span className="block text-[9px] text-amber-300 font-medium leading-tight mt-0.5">
                  WhatsApp 24/7
                </span>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}
