'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  MapPin,
  Clock,
  Compass,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import type { SocialURLs } from '@/lib/types';
import { formatPhone, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';

interface ContactInfoProps {
  whatsappNumber: string;
  address: string;
  mapUrl: string;
  socialUrls: SocialURLs;
}

export function ContactInfo({ whatsappNumber, address, mapUrl, socialUrls }: ContactInfoProps) {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const prefilledWhatsappUrl = `${whatsappHref(whatsappNumber)}?text=${encodeURIComponent(
    'Hola Modulares GM, me comunico desde la web para solicitar asesoría técnica y cotización para un proyecto modular/cuarzo.'
  )}`;

  return (
    <div className="flex flex-col h-full justify-between space-y-5 rounded-[2rem] border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#12161A] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      {/* Cabecera del Atelier */}
      <div>
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">
              Atelier & Showroom
            </span>
            <h3 className="font-headline text-2xl font-semibold text-stone-950 dark:text-white mt-0.5">
              Atención Directa
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {socialUrls?.facebook && (
              <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white">
                <a href={socialUrls.facebook} target="_blank" rel="noreferrer" aria-label="Facebook de Modulares GM">
                  <Facebook size={15} />
                </a>
              </Button>
            )}
            {socialUrls?.instagram && (
              <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white">
                <a href={socialUrls.instagram} target="_blank" rel="noreferrer" aria-label="Instagram de Modulares GM">
                  <Instagram size={15} />
                </a>
              </Button>
            )}
            {socialUrls?.linkedin && (
              <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white">
                <a href={socialUrls.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn de Modulares GM">
                  <Linkedin size={15} />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tarjeta Unificada de Contacto Telefónico y WhatsApp */}
        <div className="mt-5 space-y-3.5">
          <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-extrabold text-stone-800 dark:text-stone-200">
                    Línea Telefónica & WhatsApp
                  </p>
                  <p className="text-base sm:text-lg font-bold text-stone-950 dark:text-white tracking-tight">
                    {formatPhone(whatsappNumber)}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                ● En línea
              </span>
            </div>

            {/* Dos Botones Discretos de Acción */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={prefilledWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { location: 'seccion_contacto_boton_wa' })}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1b736b] hover:bg-[#155b55] text-white font-bold text-xs shadow-sm active:scale-95 transition-all text-center"
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${whatsappNumber}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all text-center"
              >
                <Phone size={14} />
                <span>Llamar</span>
              </a>
            </div>
          </div>

          {/* Email para Planos y Proyectos */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40">
            <div className="h-9 w-9 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-800 dark:text-stone-200">
              <Compass size={17} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-stone-700 dark:text-stone-300">
                Email para Planos & Proyectos
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-950 dark:text-white truncate">
                <span>info</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">&#64;</span>
                <span>modularesgm.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación & Mapa */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-stone-900 dark:text-stone-100 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-stone-950 dark:text-white">
                {address || 'Quito, Pichincha, Ecuador'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                <Clock size={12} />
                <span>Lun - Vie: 08:30 - 18:30 · Sáb: 09:00 - 14:00</span>
              </div>
            </div>
          </div>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-stone-900 dark:text-stone-100 hover:underline inline-flex items-center gap-1 shrink-0"
              title="Abrir mapa en Google Maps"
            >
              <span>Ver mapa</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {mapUrl && (
          <div
            ref={mapRef}
            className="w-full h-36 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 relative flex items-center justify-center shadow-inner"
          >
            {showMap ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Modulares GM Showroom"
                className="border-0 dark:grayscale dark:contrast-125 dark:invert-[0.88] dark:hue-rotate-180 transition-all duration-700"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-stone-600 dark:text-stone-400 gap-2">
                <MapPin size={22} className="text-stone-900 dark:text-stone-100 animate-bounce" />
                <p className="text-xs font-semibold">Cargando ubicación del Atelier...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
