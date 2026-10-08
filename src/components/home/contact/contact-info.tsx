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
  Layers,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import type { SocialURLs } from '@/lib/types';
import { formatPhone, whatsappHref } from '@/lib/site';

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
    <div className="flex flex-col h-full justify-between space-y-6 rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/50">
      {/* Cabecera del Atelier */}
      <div>
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              Atelier & Showroom
            </span>
            <h3 className="font-headline text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
              Atención Directa
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500">
            {socialUrls?.facebook && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800">
                <a href={socialUrls.facebook} target="_blank" rel="noreferrer" aria-label="Facebook de Modulares GM">
                  <Facebook size={16} />
                </a>
              </Button>
            )}
            {socialUrls?.instagram && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800">
                <a href={socialUrls.instagram} target="_blank" rel="noreferrer" aria-label="Instagram de Modulares GM">
                  <Instagram size={16} />
                </a>
              </Button>
            )}
            {socialUrls?.linkedin && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800">
                <a href={socialUrls.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn de Modulares GM">
                  <Linkedin size={16} />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tarjetas de Contacto Inmediato */}
        <div className="mt-6 space-y-3">
          {/* WhatsApp Direct Concierge */}
          <a
            href={prefilledWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/70 hover:bg-white hover:border-secondary/60 hover:shadow-md transition-all active:scale-[0.98] dark:border-stone-800 dark:bg-stone-950/40 dark:hover:bg-stone-900"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                  Concierge WhatsApp
                </p>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-secondary transition-colors">
                  {formatPhone(whatsappNumber)}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              En línea
            </span>
          </a>

          {/* Teléfono & Email Ofuscado (Regla 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${whatsappNumber}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-950/30 dark:hover:bg-stone-900 transition-all text-stone-800 dark:text-stone-200"
            >
              <div className="h-9 w-9 rounded-lg bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-700 dark:text-stone-300">
                <Phone size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Línea Directa</p>
                <p className="text-xs font-medium truncate">{formatPhone(whatsappNumber)}</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-950/30 text-stone-800 dark:text-stone-200">
              <div className="h-9 w-9 rounded-lg bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center shrink-0 text-stone-700 dark:text-stone-300">
                <Compass size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Email Proyectos</p>
                {/* Email Ofuscado estrictamente conforme a Regla 4 */}
                <p className="text-xs font-medium truncate">
                  <span>info</span>
                  <span className="text-secondary font-bold">&#64;</span>
                  <span>modularesgm.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares de Compromiso y Calidad Arquitectónica */}
        <div className="mt-6 pt-5 border-t border-stone-200/80 dark:border-stone-800 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-stone-400 dark:text-stone-500">
            Estándar de Ejecución GM
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Layers size={15} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug">
                <strong className="text-stone-900 dark:text-stone-200 font-medium">Modelado 3D & Despiece:</strong> Renders fotorrealistas y planimetría precisa antes de corte.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={15} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug">
                <strong className="text-stone-900 dark:text-stone-200 font-medium">Cuarzos & Herrajes Europeos:</strong> Superficies antibacteriales y sistemas de cierre suave con garantía.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación & Mapa */}
      <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-stone-900 dark:text-stone-100">
                {address || 'Quito, Pichincha, Ecuador'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
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
              className="text-[11px] font-medium text-secondary hover:underline inline-flex items-center gap-1 shrink-0"
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
            className="w-full h-44 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 relative flex items-center justify-center shadow-inner"
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
              <div className="flex flex-col items-center justify-center p-4 text-center text-stone-400 gap-2">
                <MapPin size={24} className="text-secondary animate-bounce" />
                <p className="text-xs font-medium">Cargando ubicación del Atelier...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
