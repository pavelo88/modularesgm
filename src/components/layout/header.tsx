'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Menu,
  Moon,
  ShoppingCart,
  Store,
  Home,
  LayoutGrid,
  MessageSquare,
  Facebook,
  Instagram,
  Sun,
  Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import logo from '@/app/logo.jpg';
import logo2 from '@/app/logo2.jpg';
import { useSiteContent } from '@/context/site-content-provider';

export function Header() {
  const pathname = usePathname() ?? '';
  const { theme, setTheme } = useTheme();
  const { getCartCount, setIsCartOpen, selectedCategory, setSelectedCategory } = useCart();
  const { siteContent } = useSiteContent();
  const cartCount = getCartCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.classList.add('mobile-nav-open');
    } else {
      document.documentElement.classList.remove('mobile-nav-open');
    }
    return () => {
      document.documentElement.classList.remove('mobile-nav-open');
    };
  }, [isMenuOpen]);

  const isStorePage = pathname.startsWith('/store');
  const isAffiliatesPage = pathname.startsWith('/afiliados');
  // Solo las páginas con hero oscuro arrancan transparentes; el resto usa cristal desde el inicio.
  const overHero = (pathname === '/' || pathname === '/afiliados') && !scrolled;

  const products = siteContent?.products || [];
  const storeCategories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const navLinks = [
    { href: '/#top', label: 'Inicio', publicOnly: false, icon: <Home size={20} /> },
    { href: '/catalogo', label: 'Catálogo', publicOnly: false, icon: <LayoutGrid size={20} /> },
    { href: '/#contacto', label: 'Contacto', publicOnly: true, icon: <MessageSquare size={20} /> },
    { href: '/store', label: 'Tienda', publicOnly: false, icon: <Store size={20} /> },
    { href: '/afiliados', label: 'Trabaja con nosotros', publicOnly: false, icon: <Handshake size={20} /> },
  ];

  const NavLink = ({ href, label, publicOnly, icon }: (typeof navLinks)[0]) => {
    if (publicOnly && pathname !== '/') return null;
    const isActive = href === '/afiliados' ? pathname.startsWith('/afiliados') : href === '/store' ? pathname.startsWith('/store') : false;

    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-1.5 transition-colors font-medium text-sm',
          overHero
            ? (isActive ? 'text-white font-extrabold' : 'text-white/85 hover:text-white')
            : (isActive ? 'text-stone-950 dark:text-white font-extrabold' : 'text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white')
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };
  
  const MobileNavLink = ({ href, label, publicOnly, icon }: (typeof navLinks)[0]) => {
     if (publicOnly && pathname !== '/') return null;
     const isActive = href === '/store' ? pathname.startsWith('/store') : href === '/afiliados' ? pathname.startsWith('/afiliados') : (href === '/#top' && pathname === '/');
     return (
       <Link
         href={href}
         onClick={() => setIsMenuOpen(false)}
         className={cn("flex items-center gap-3 p-3 rounded-lg font-medium text-base transition-colors",
            isActive ? "bg-stone-200/70 dark:bg-stone-800 text-stone-950 dark:text-white font-bold" : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
         )}
       >
        {icon}
        <span>{label}</span>
       </Link>
     );
  }

  const ThemeToggleButton = ({className}: {className?: string}) => (
    <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title="Toggle theme"
        className={className}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
    </Button>
  )

  return (
    <header
      data-over-hero={overHero}
      className={cn(
        'fixed w-full z-50 h-20 flex items-center transition-[top,background-color,box-shadow,backdrop-filter] duration-300',
        scrolled ? 'top-0' : 'top-9',
        overHero
          ? 'bg-transparent'
          : 'bg-white/95 dark:bg-[#0c0e12]/95 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
      )}>
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Modulares GM Logo" width={42} height={42} className="w-10 h-10 object-contain drop-shadow-md" priority />
          <div className="flex flex-col">
            <span className={cn(
              "block text-base font-bold tracking-tight transition-colors",
              overHero ? "text-white" : "text-stone-950 dark:text-white"
            )}>
              MODULARES GM
            </span>
            <p className={cn(
              "text-[10px] font-semibold transition-colors -mt-1 leading-tight",
              overHero ? "text-white/80" : "text-stone-600 dark:text-stone-400"
            )}>
              Cocinas y Cuarzos
            </p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium">
          {isAffiliatesPage ? (
            <NavLink href="/store" label="Ir a la Tienda" publicOnly={false} icon={<Store size={20} />} />
          ) : (
            navLinks.map(link => <NavLink key={link.href} {...link}/>)
          )}
        </nav>
        <div className="hidden md:flex items-center gap-2">
            <div className={cn("h-6 w-px mx-2 transition-colors", overHero ? "bg-white/20" : "bg-stone-300 dark:bg-stone-700")}></div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className={cn(
                  "relative transition-colors",
                  overHero ? "text-white hover:text-white" : "text-stone-800 hover:text-stone-950 dark:text-stone-200 dark:hover:text-white"
                )}
                aria-label="Open shopping cart"
            >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                    {cartCount}
                </span>
                )}
            </Button>
            <ThemeToggleButton className={cn(
              "transition-colors",
              overHero ? "text-white hover:text-white" : "text-stone-800 hover:text-stone-950 dark:text-stone-200 dark:hover:text-white"
            )} />
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className={cn(
              "relative transition-colors",
              overHero ? "text-white" : "text-stone-800 dark:text-stone-200"
            )}
            aria-label="Open shopping cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Button>
          
          <ThemeToggleButton className={cn(
            "transition-colors",
            overHero ? "text-white" : "text-stone-800 dark:text-stone-200"
          )} />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  overHero ? "text-white" : "text-stone-800 dark:text-stone-200"
                )}
                aria-label="Toggle menu"
              >
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs flex flex-col p-0 bg-white dark:bg-[#0c0e12] border-r border-stone-200 dark:border-stone-800">
              <SheetHeader className="border-b border-stone-200 dark:border-stone-800 p-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                 <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group">
                  <Image src="/logo.png" alt="Modulares GM Logo" width={42} height={42} className="w-10 h-10 object-contain drop-shadow-md" />
                  <div className="flex flex-col">
                    <span className="block text-base font-bold tracking-tight text-stone-950 dark:text-white">
                      MODULARES GM
                    </span>
                    <p className="text-[10px] font-semibold text-stone-600 dark:text-stone-400 -mt-1 leading-tight">
                      Cocinas y Cuarzos
                    </p>
                  </div>
                </Link>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {isStorePage ? (
                   <>
                    <p className="px-3 text-sm font-semibold text-muted-foreground">Categorías</p>
                    {storeCategories.map(category => (
                      <Link
                        href="/store"
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsMenuOpen(false);
                        }}
                        className={cn("flex items-center gap-3 p-3 rounded-lg font-medium text-base transition-colors",
                          selectedCategory === category ? "bg-stone-200 dark:bg-stone-800 text-stone-950 dark:text-white font-bold" : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
                        )}
                      >
                        <span>{category}</span>
                      </Link>
                    ))}
                    <div className="my-2 border-t"></div>
                    <MobileNavLink href="/#top" label="Volver al Inicio" publicOnly={false} icon={<Home size={20} />} />
                    <MobileNavLink href="/afiliados" label="Trabaja con nosotros" publicOnly={false} icon={<Handshake size={20} />} />
                  </>
                ) : isAffiliatesPage ? (
                  <>
                    <MobileNavLink href="/store" label="Ir a la Tienda" publicOnly={false} icon={<Store size={20} />} />
                  </>
                ) : (
                  navLinks.map(link => <MobileNavLink key={link.href} {...link} />)
                )}
              </nav>
              <div className="mt-auto border-t p-4 space-y-4">
                  <div className="flex gap-2 justify-center">
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                          <a href={'https://facebook.com/modularesgm'} target="_blank" rel="noreferrer" aria-label="Facebook">
                              <Facebook size={18} />
                          </a>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                          <a href={'https://www.instagram.com/modularesgm2020/'} target="_blank" rel="noreferrer" aria-label="Instagram">
                              <Instagram size={18} />
                          </a>
                      </Button>
                  </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
