'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, MapPin, Phone, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import type { SocialURLs } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatPhone, whatsappHref } from '@/lib/site';

interface FooterProps {
  address: string;
  whatsappNumber: string;
  socialUrls: SocialURLs;
}

export function Footer({ address, whatsappNumber, socialUrls }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-stone-300/80 dark:border-stone-800/80 bg-[#FAF8F5] dark:bg-[#0c0e12] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-stone-300/70 dark:border-stone-800/80">
          {/* Col 1: Marca y Filosofía (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <Image
                  src="/logo.png"
                  alt="Modulares GM Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain drop-shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="block text-lg font-bold tracking-tight text-stone-950 dark:text-white">
                    MODULARES GM
                  </span>
                  <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 -mt-1 leading-tight">
                    Cocinas y Cuarzos
                  </p>
                </div>
              </Link>
              <p className="text-sm text-stone-800 dark:text-stone-300 leading-relaxed max-w-sm mb-5">
                Diseño planimétrico, fabricación e instalación de mobiliario modular de autor y mesones de cuarzo en Ecuador.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-[11px] font-bold text-stone-900 dark:text-stone-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Pelikano RH 18mm · Herrajes Europeos</span>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-2.5 mt-6">
              {socialUrls?.facebook && (
                <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white hover:border-stone-400">
                  <a href={socialUrls.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                </Button>
              )}
              {socialUrls?.instagram && (
                <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white hover:border-stone-400">
                  <a href={socialUrls.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                </Button>
              )}
              {socialUrls?.linkedin && (
                <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white hover:border-stone-400">
                  <a href={socialUrls.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Col 2: Colecciones (3 cols) */}
          <div className="lg:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stone-950 dark:text-white mb-4">
              Colecciones GM
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cocinas" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Cocinas Integrales con Cuarzo
                </Link>
              </li>
              <li>
                <Link href="/closets" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Walk-in Closets & Vestidores
                </Link>
              </li>
              <li>
                <Link href="/muebles-bano" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Vanities & Muebles de Baño
                </Link>
              </li>
              <li>
                <Link href="/puertas" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Puertas Pivotantes Monumentales
                </Link>
              </li>
              <li>
                <Link href="/escritorios" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Escritorios Estudiantiles & Home Office
                </Link>
              </li>
              <li>
                <Link href="/muebles-oficina" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Mobiliario Corporativo
                </Link>
              </li>
              <li>
                <Link href="/gamer" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Setups Gamer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Empresa y Portal de Afiliados (2 cols) */}
          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stone-950 dark:text-white mb-4">
              Empresa
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/afiliados" className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold transition-colors inline-flex items-center gap-1">
                  <span>Trabaja con nosotros</span>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Catálogo Digital
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Tienda Online
                </Link>
              </li>
              <li>
                <Link href="/precios" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Precios & Modelos
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium transition-colors">
                  Cotización Directa
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-medium transition-colors">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Atelier & Contacto Directo (3 cols) */}
          <div className="lg:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stone-950 dark:text-white mb-4">
              Atelier & Showroom
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-stone-800 dark:text-stone-300">
                <MapPin size={16} className="text-stone-950 dark:text-white shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">
                  {address || 'Rosa Yeira 420 y Serpaio Japeravi, Quito, Ecuador'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-300">
                <Phone size={16} className="text-stone-950 dark:text-white shrink-0" />
                <a href={`tel:${whatsappNumber}`} className="text-xs font-bold hover:underline">
                  {formatPhone(whatsappNumber)}
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-300">
                <MessageCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href={whatsappHref(whatsappNumber, 'Hola Modulares GM, me comunico desde la web.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold hover:underline"
                >
                  WhatsApp: {formatPhone(whatsappNumber)}
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-300">
                <Mail size={16} className="text-stone-950 dark:text-white shrink-0" />
                <p className="text-xs font-medium">
                  <span>info</span>
                  <span className="font-bold text-stone-950 dark:text-white">&#64;</span>
                  <span>modularesgm.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-700 dark:text-stone-400">
          <p>
            &copy; {currentYear} MODULARES GM. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/afiliados" className="hover:text-stone-950 dark:hover:text-white transition-colors">
              Programa de Afiliados
            </Link>
            <Link href="/precios" className="hover:text-stone-950 dark:hover:text-white transition-colors">
              Catálogo de Precios
            </Link>
            <Link href="/#contacto" className="hover:text-stone-950 dark:hover:text-white transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
