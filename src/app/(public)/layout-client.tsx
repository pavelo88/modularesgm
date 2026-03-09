
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

// Helper to convert hex to HSL string (space separated) as expected by Shadcn
function hexToHSL(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(s => s + s).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

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
        // Inject colors as HSL components to maintain Shadcn functionality
        try {
          root.style.setProperty('--primary', hexToHSL(siteContent.theme.primary));
          root.style.setProperty('--secondary', hexToHSL(siteContent.theme.secondary));
          root.style.setProperty('--background', hexToHSL(siteContent.theme.background));
          root.style.setProperty('--foreground', hexToHSL(siteContent.theme.foreground));
          root.style.setProperty('--accent', hexToHSL(siteContent.theme.accent));
        } catch (e) {
          console.error("Error setting theme colors:", e);
        }
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
