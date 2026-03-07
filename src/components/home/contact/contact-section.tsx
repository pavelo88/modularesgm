import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';
import type { SiteContent } from '@/lib/types';

export function ContactSection({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      id="contacto"
      className="px-4 sm:px-6 py-12 relative z-10 bg-gradient-to-b from-transparent to-muted/30"
    >
      <div className="max-w-7xl mx-auto rounded-3xl p-6 md:p-12 border shadow-2xl relative overflow-hidden bg-card">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative">
          <ContactInfo
            formTitle={siteContent.formTitle}
            formSubtitle={siteContent.formSubtitle}
            whatsappNumber={siteContent.whatsappNumber}
            address={siteContent.address}
            mapUrl={siteContent.mapUrl}
          />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
