'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackgroundDecor, HeroBackground } from '@/components/shared/background-decor';
import { WhatsAppFAB } from '@/components/shared/whatsapp-fab';
import { ChatbotWidget } from '@/components/shared/chatbot/chatbot-widget';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';
import { SiteContentContext } from '@/context/site-content-provider';
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
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        // Merge fetched data with defaults to avoid missing properties
        setSiteContent({
          ...defaultSiteContent,
          ...data,
          services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
          brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
          stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
          products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
          seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
          socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
        });
      } else {
        setSiteContent(defaultSiteContent);
      }
    }, (error) => {
      console.error("Error fetching site content snapshot, using stale data.", error);
    });
    
    return () => unsubscribe();
  }, []);

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
