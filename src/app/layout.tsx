import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import { SEOStructuredData } from '@/components/shared/seo-structured-data';

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
  title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
  description: 'Líderes en cocinas modulares, mobiliario de oficina y remodelaciones en Quito. Calidad premium en cuarzo y madera. Servicio técnico 24/7 en Ecuador.',
  keywords: [
    'Modulares GM', 'cocinas modulares quito', 'muebles de oficina ecuador', 
    'góndolas comerciales', 'estanterías para locales', 'adecuaciones de oficinas', 
    'remodelaciones quito', 'reparación de muebles', 'mesones de cuarzo quito', 
    'granito para cocinas', 'clósets y vestidores', 'construcción de casas ecuador',
    'construcción de colegios', 'construcción de piscinas quito', 'cerámica y acabados',
    'remodelación de baños', 'muebles de cocina a medida', 'vestidores modernos',
    'centros de entretenimiento tv', 'muebles para farmacias', 'mobiliario corporativo', 
    'adecuaciones comerciales quito', 'reparaciones técnicas muebles', 
    'diseño de interiores ecuador', 'producción de mobiliario modular'
  ],
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
    description: 'Líderes en cocinas modulares, mobiliario de oficina y remodelaciones en Quito. Calidad premium en cuarzo y madera. Servicio técnico 24/7 en Ecuador.',
    url: 'https://www.modularesgm.com',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Modulares GM Cocinas y Cuarzos Ecuador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modulares GM | Cocinas, Oficinas y Construcción en Ecuador',
    description: 'Líderes en cocinas modulares, mobiliario de oficina y remodelaciones en Quito. Calidad premium en cuarzo y madera.',
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'],
  },
  authors: [{ name: 'Modulares GM' }],
  creator: 'Modulares GM',
  publisher: 'Modulares GM',
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
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <SEOStructuredData />
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
        
        {/* Analytics Diferida (Zero-Blocking) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            id="google-analytics"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            id="google-analytics-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  send_page_view: true
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
