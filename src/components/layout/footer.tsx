import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Home, Instagram, Linkedin } from 'lucide-react';
import type { SocialURLs } from '@/lib/types';
import { Button } from '@/components/ui/button';
import logo from '@/app/logo.jpg';

interface FooterProps {
  address: string;
  whatsappNumber: string;
  socialUrls: SocialURLs;
}

export function Footer({ address, whatsappNumber, socialUrls }: FooterProps) {
  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-center text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
           <div className="flex items-center gap-3 mb-4">
             <Image src={logo} alt="Modulares GM Logo" width={48} height={48} />
            <div>
                <h2 className="text-xl font-bold tracking-tight text-primary">
                    MODULARES
                </h2>
                 <p className="text-xs font-light text-secondary -mt-1 leading-tight">
                    Cocinas y Cuarzos
                </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-headline max-w-xs">
            Muebles • Diseño • Construcción. Creando espacios excepcionales.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">
            Síguenos
          </p>
          <div className="flex gap-4">
            {socialUrls?.facebook && (
              <Button asChild variant="outline" size="icon" className="rounded-full">
                <a href={socialUrls.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              </Button>
            )}
            {socialUrls?.instagram && (
              <Button asChild variant="outline" size="icon" className="rounded-full">
                <a href={socialUrls.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </Button>
            )}
            {socialUrls?.linkedin && (
              <Button asChild variant="outline" size="icon" className="rounded-full">
                <a href={socialUrls.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end text-sm space-y-2 font-headline text-muted-foreground">
          <p>{address}</p>
          <p>Ecuador</p>
          <p>+{whatsappNumber}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 text-center border-t pt-8 text-muted-foreground">
        <p className="text-xs font-sans">
          &copy; {new Date().getFullYear()} MODULARES GM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
