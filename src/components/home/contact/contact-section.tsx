import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';
import type { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ContactSection({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      id="contacto"
      className="relative z-10 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 dark:from-secondary/10" />
      
      <div className={cn(
        "mx-auto max-w-7xl relative overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-500",
        "bg-white/40 backdrop-blur-3xl border-zinc-200/50 dark:bg-black/40 dark:border-white/10"
      )}>
        {/* Decorative blur blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[120px] dark:bg-secondary/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-secondary/20 blur-[120px] dark:bg-primary/20" />
        
        <div className="relative z-10 px-6 py-12 md:p-16 lg:p-20">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary dark:border-secondary/20 dark:bg-secondary/10 dark:text-secondary">
              Contáctenos
            </span>
            <h2 className={cn(
              "font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6",
              "text-zinc-900 dark:text-white"
            )}>
              {siteContent.formTitle}
            </h2>
            <p className={cn(
              "mx-auto max-w-2xl text-lg md:text-xl",
              "text-zinc-600 dark:text-zinc-400"
            )}>
              {siteContent.formSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <ContactInfo
                whatsappNumber={siteContent.whatsappNumber}
                address={siteContent.address}
                mapUrl={siteContent.mapUrl}
                socialUrls={siteContent.socialUrls}
              />
            </div>
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
