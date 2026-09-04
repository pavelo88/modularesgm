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
import { doc, getDoc } from 'firebase/firestore';
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
    let isMounted = true;
    const contentRef = doc(db, 'siteContent', 'main');
    
    getDoc(contentRef)
      .then((docSnap) => {
        if (!isMounted || !docSnap.exists()) return;
        const data = docSnap.data() as SiteContent;
        
        const rawBrands = data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands;
        const sanitizedBrands = rawBrands.map((b) => {
          const url = b.url || '';
          if (
            url.includes('briggsec.com') ||
            url.includes('wikimedia.org') ||
            url.includes('squarespace-cdn.com') ||
            url.includes('pelikano.com') ||
            url.includes('clearbit.com')
          ) {
            return { ...b, url: '' };
          }
          return b;
        });

        const rawServices = data.services && data.services.length > 0 ? data.services : defaultSiteContent.services;
        const sanitizedServices = rawServices.map((s) => {
          if (s.imgUrl && s.imgUrl.includes('photo-1556761175-b413da4b248b')) {
            return {
              ...s,
              imgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=60&w=500&fm=webp'
            };
          }
          return s;
        });

        setSiteContent({
          ...defaultSiteContent,
          ...data,
          services: sanitizedServices,
          brands: sanitizedBrands,
          stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
          products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
          seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
          theme: data.theme ? { ...defaultSiteContent.theme, ...data.theme } : defaultSiteContent.theme,
          socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
        });
      })
      .catch((error) => {
        console.warn("Using initial server data.", error);
      });
      
    return () => {
      isMounted = false;
    };
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
