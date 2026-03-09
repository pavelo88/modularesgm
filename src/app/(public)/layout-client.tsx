'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackgroundDecor, HeroBackground } from '@/components/shared/background-decor';
import { WhatsAppFAB } from '@/components/shared/whatsapp-fab';
import { ChatbotWidget } from '@/components/shared/chatbot/chatbot-widget';
import type { SiteContent } from '@/lib/types';
import { SiteContentContext } from '@/context/site-content-provider';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { defaultSiteContent } from '@/lib/data';

export function PublicLayoutClient({
  children,
  initialSiteContent,
}: {
  children: React.ReactNode;
  initialSiteContent: SiteContent;
}) {
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);

  useEffect(() => {
    const contentRef = doc(db, 'siteContent', 'main');
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        setSiteContent({
          ...defaultSiteContent,
          ...data,
          services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
          brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
          stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
          products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
          seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
          theme: data.theme ? { ...defaultSiteContent.theme, ...data.theme } : defaultSiteContent.theme,
          socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
        });
      }
    }, (error) => {
      console.warn("Using initial server data. Firestore real-time updates may be restricted by rules.", error);
    });
    
    return () => unsubscribe();
  }, []);

  // Dynamically inject theme colors from siteContent
  useEffect(() => {
    if (siteContent?.theme) {
        const root = document.documentElement;
        // Function to convert hex to HSL for CSS variables if needed, 
        // but for simplicity we'll just set them directly as hex if we change globals.css to accept hex 
        // OR we use the hex values directly. 
        // Since Shadcn uses HSL variables, we'll just update the key colors.
        root.style.setProperty('--primary', siteContent.theme.primary);
        root.style.setProperty('--secondary', siteContent.theme.secondary);
        root.style.setProperty('--background', siteContent.theme.background);
        root.style.setProperty('--foreground', siteContent.theme.foreground);
        root.style.setProperty('--accent', siteContent.theme.accent);
    }
  }, [siteContent?.theme]);

  const value = { siteContent, loading: !siteContent };

  return (
    <SiteContentContext.Provider value={value}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow relative">
          <BackgroundDecor />
          {siteContent && <HeroBackground heroMediaUrl={siteContent.heroMediaUrl} />}
          {children}
        </main>
        <Footer 
          address={siteContent.address}
          whatsappNumber={siteContent.whatsappNumber}
          socialUrls={siteContent.socialUrls}
        />
        <WhatsAppFAB phoneNumber={siteContent.whatsappNumber} />
        {siteContent && <ChatbotWidget siteContent={siteContent} />}
      </div>
    </SiteContentContext.Provider>
  );
}
