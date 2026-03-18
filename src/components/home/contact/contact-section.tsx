import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';
import type { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ContactSection({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      id="contacto"
      className="px-4 sm:px-6 py-12 sm:py-20 relative z-10"
    >
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className={cn(
          "text-4xl md:text-5xl font-headline font-bold mb-4 leading-tight",
          "text-primary dark:text-white"
        )}>
            {siteContent.formTitle}
        </h2>
        <p className={cn(
          "font-headline text-lg max-w-3xl mx-auto font-bold",
          "text-primary/80 dark:text-primary"
        )}>
            {siteContent.formSubtitle}
        </p>
      </div>

      <div className={cn(
        "max-w-7xl mx-auto rounded-3xl p-6 md:p-12 border shadow-2xl relative overflow-hidden",
        "bg-primary/20 backdrop-blur-xl border-white/30 dark:bg-[#19242D] dark:border-[#B88E44]/40 dark:backdrop-blur-none"
      )}>
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/40 blur-[150px] opacity-30 pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative">
          <ContactInfo
            whatsappNumber={siteContent.whatsappNumber}
            address={siteContent.address}
            mapUrl={siteContent.mapUrl}
            socialUrls={siteContent.socialUrls}
          />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
