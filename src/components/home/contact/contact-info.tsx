import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Phone } from 'lucide-react';
import type { SocialURLs } from '@/lib/types';

interface ContactInfoProps {
  whatsappNumber: string;
  address: string;
  mapUrl: string;
  socialUrls: SocialURLs;
}

export function ContactInfo({ whatsappNumber, address, mapUrl, socialUrls }: ContactInfoProps) {
  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Phone & Socials */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-bold text-lg hover:underline"
        >
          <Phone size={20} className="text-primary" />
          +{whatsappNumber}
        </a>
        <div className="flex gap-2">
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

      {/* Map */}
      {mapUrl && (
        <div className="w-full h-64 md:flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-primary/20 opacity-90 hover:opacity-100 transition-opacity shadow-lg">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location"
            className="dark:grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      )}

      {/* Address */}
      <div className="text-center">
        <p className="font-semibold text-muted-foreground">{address}</p>
      </div>
    </div>
  );
}
