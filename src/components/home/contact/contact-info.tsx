import { getIconComponent, IconName } from '@/lib/icons';
import { Card } from '@/components/ui/card';

interface ContactInfoProps {
  formTitle: string;
  formSubtitle: string;
  whatsappNumber: string;
  address: string;
  mapUrl: string;
}

const InfoCard = ({ icon, title, value }: { icon: IconName; title: string; value: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/50 transition-colors bg-background/60">
    <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center text-primary bg-muted">
      {getIconComponent(icon, { size: 24 })}
    </div>
    <div className="overflow-hidden">
      <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{title}</p>
      <p className="font-bold text-base md:text-lg truncate">{value}</p>
    </div>
  </div>
);

export function ContactInfo({ formTitle, formSubtitle, whatsappNumber, address, mapUrl }: ContactInfoProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4 leading-tight">{formTitle}</h2>
      <p className="text-muted-foreground font-headline text-base md:text-lg mb-8 leading-relaxed">{formSubtitle}</p>
      <div className="space-y-4 mb-8">
        <InfoCard icon="MessageCircle" title="Asesoría & Ventas" value="Contacto Directo" />
        <InfoCard icon="Settings" title="Línea Telefónica" value={`+${whatsappNumber}`} />
        <InfoCard icon="Map" title="Ubicación" value={address} />
      </div>
      {mapUrl && (
        <div className="w-full h-64 md:flex-1 min-h-[250px] rounded-2xl overflow-hidden border border-primary/20 opacity-90 hover:opacity-100 transition-opacity shadow-lg">
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
    </div>
  );
}
