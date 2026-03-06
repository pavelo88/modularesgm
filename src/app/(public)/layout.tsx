import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackgroundDecor, HeroBackground } from '@/components/shared/background-decor';
import { WhatsAppFAB } from '@/components/shared/whatsapp-fab';
import { ChatbotWidget } from '@/components/shared/chatbot/chatbot-widget';
import { defaultSiteContent } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { SiteContent } from '@/lib/types';
import { appId } from '@/lib/config';

async function getSiteContent(): Promise<SiteContent> {
  try {
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const docSnap = await getDoc(contentRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SiteContent;
      // Merge fetched data with defaults to avoid missing properties
      return {
        ...defaultSiteContent,
        ...data,
        services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
        brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
        stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
        products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
        seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
        socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
      };
    }
    return defaultSiteContent;
  } catch (error) {
    console.error("Error fetching site content, returning default.", error);
    return defaultSiteContent;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow relative">
        <BackgroundDecor />
        <HeroBackground heroMediaUrl={siteContent.heroMediaUrl} />
        {children}
      </main>
      <Footer 
        address={siteContent.address}
        whatsappNumber={siteContent.whatsappNumber}
        socialUrls={siteContent.socialUrls}
      />
      <WhatsAppFAB phoneNumber={siteContent.whatsappNumber} />
      <ChatbotWidget siteContent={siteContent} />
    </div>
  );
}
