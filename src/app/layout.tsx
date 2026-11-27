import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import { SEOStructuredData } from '@/components/shared/seo-structured-data';
import { WhatsAppAnalyticsTracker } from '@/components/shared/whatsapp-analytics-tracker';
import { ConsentManager } from '@/components/shared/consent-manager';

/** ID de medición GA4 (flujo web «modularesgm»). Es público; la variable de entorno lo puede reemplazar. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-2LKR039L8Y';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.modularesgm.com'),
  applicationName: 'Modulares GM',
  title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
  description: 'Diseño, fabricación e instalación de cocinas modulares, closets, muebles de oficina y mesones de cuarzo en Quito y Ecuador. Cotiza tu proyecto a medida.',
  keywords: [
    'Modulares GM', 'cocinas modulares Quito', 'cocinas integrales a medida Quito', 'muebles de cocina a medida Ecuador',
    'muebles de oficina Ecuador', 'mobiliario corporativo Quito', 'closets a medida Quito', 'walk in closet Quito',
    'mesones de cuarzo Quito', 'mesones de granito Ecuador', 'remodelación de cocinas Quito',
    'góndolas comerciales', 'estanterías para locales', 'adecuaciones de oficinas', 
    'remodelaciones quito', 'reparación de muebles', 'mesones de cuarzo quito', 
    'granito para cocinas', 'clósets y vestidores', 'construcción de casas ecuador',
    'construcción de colegios', 'construcción de piscinas quito', 'cerámica y acabados',
    'remodelación de baños', 'muebles de cocina a medida', 'vestidores modernos',
    'centros de entretenimiento tv', 'muebles para farmacias', 'mobiliario corporativo', 
    'adecuaciones comerciales quito', 'reparaciones técnicas muebles', 
    'diseño de interiores Ecuador', 'fabricación de muebles a medida Quito', 'muebles modulares Ecuador'
  ],
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
    description: 'Diseño, fabricación e instalación de cocinas modulares, closets, muebles de oficina y mesones de cuarzo en Quito y Ecuador. Cotiza tu proyecto a medida.',
    url: 'https://www.modularesgm.com',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: 'https://www.modularesgm.com/og-image.jpg',
        secureUrl: 'https://www.modularesgm.com/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Modulares GM Cocinas y Cuarzos Ecuador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
    description: 'Diseño, fabricación e instalación de cocinas modulares, closets, muebles de oficina y mesones de cuarzo en Quito y Ecuador.',
    images: ['https://www.modularesgm.com/og-image.jpg'],
  },
  authors: [{ name: 'Modulares GM' }],
  creator: 'Modulares GM',
  publisher: 'Modulares GM',
  category: 'Mobiliario, construcción y diseño de interiores',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta property="og:image" content="https://www.modularesgm.com/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://www.modularesgm.com/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://www.modularesgm.com/og-image.jpg" />
        <link 
          rel="preload" 
          as="image" 
          type="image/webp"
          href="/images/heroes/hero-home-cocina.webp" 
          fetchPriority="high" 
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <SEOStructuredData />
            <WhatsAppAnalyticsTracker />
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
        
        {/* Analytics Diferida (Zero-Blocking) */}
        {GA_ID && (
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
        )}
        {GA_ID && (
          <Script
            id="google-analytics-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied'
                });
                gtag('config', '${GA_ID}', {
                  send_page_view: true
                });
                ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
              `,
            }}
          />
        )}
        {/* Ahrefs Web Analytics (proyecto modularesgm.com) */}
        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="nxZ46GgcTfj/BPSFcmmgKw"
          strategy="afterInteractive"
        />
        <ConsentManager />
      </body>
    </html>
  );
}
