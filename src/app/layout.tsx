import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable
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
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
