'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackgroundDecor, HeroBackground } from '@/components/shared/background-decor';
import { WhatsAppFAB } from '@/components/shared/whatsapp-fab';
import { ChatbotWidget } from '@/components/shared/chatbot/chatbot-widget';
import { defaultSiteContent } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';
import { SiteContentContext } from '@/context/site-content-provider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }, (error) => {
      console.error("Error fetching site content, returning default.", error);
      setSiteContent(defaultSiteContent);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = { siteContent, loading };

  const renderLayout = (content: SiteContent | null, isLoading: boolean) => {
    const displayContent = content || defaultSiteContent;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow relative">
          <BackgroundDecor />
          {!isLoading && content && <HeroBackground heroMediaUrl={content.heroMediaUrl} />}
          {children}
        </main>
        <Footer 
          address={displayContent.address}
          whatsappNumber={displayContent.whatsappNumber}
          socialUrls={displayContent.socialUrls}
        />
        <WhatsAppFAB phoneNumber={displayContent.whatsappNumber} />
        {!isLoading && content && <ChatbotWidget siteContent={content} />}
      </div>
    );
  }

  return (
    <SiteContentContext.Provider value={value}>
      {renderLayout(siteContent, loading)}
    </SiteContentContext.Provider>
  );
}
