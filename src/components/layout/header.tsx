'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Lock,
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
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { getCartCount, setIsCartOpen, selectedCategory, setSelectedCategory } = useCart();
  const { siteContent } = useSiteContent();
  const cartCount = getCartCount();
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isStorePage = pathname.startsWith('/store');

  const products = siteContent?.products || [];
  const storeCategories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const navLinks = [
    { href: '/#top', label: 'Inicio', publicOnly: false, icon: <Home size={20} /> },
    { href: '/#soluciones', label: 'Diseños', publicOnly: true, icon: <LayoutGrid size={20} /> },
    { href: '/#contacto', label: 'Contacto', publicOnly: true, icon: <MessageSquare size={20} /> },
    { href: '/store', label: 'Tienda', publicOnly: false, icon: <Store size={20} /> },
  ];

  const NavLink = ({ href, label, publicOnly, icon }: (typeof navLinks)[0]) => {
    if (publicOnly && pathname !== '/') return null;
    const isActive = href === '/store' ? pathname.startsWith('/store') : false;

    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-1 transition-colors font-medium',
          isActive ? 'text-primary font-bold' : 'text-primary/70 hover:text-primary dark:text-muted-foreground dark:hover:text-primary'
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };
  
  const MobileNavLink = ({ href, label, publicOnly, icon }: (typeof navLinks)[0]) => {
     if (publicOnly && pathname !== '/') return null;
     const isActive = href === '/store' ? pathname.startsWith('/store') : (href === '/#top' && pathname === '/');
     return (
       <Link
         href={href}
         onClick={() => setIsMenuOpen(false)}
         className={cn("flex items-center gap-3 p-3 rounded-lg font-medium text-base",
            isActive ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
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
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center border-b",
      // MODO CLARO: Blanco Cristal (Vidrio esmerilado blanco). MODO OSCURO: Carbón Sólido.
      "bg-white/60 backdrop-blur-xl border-white/20 dark:bg-[#19242D] dark:border-white/10 dark:backdrop-blur-none"
    )}>
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src={logo} alt="Modulares GM Logo" width={40} height={40} className="rounded-md dark:hidden"/>
          <Image src={logo2} alt="Modulares GM Logo" width={40} height={40} className="rounded-md hidden dark:block"/>
          <div className="flex flex-col">
            <h2 className="text-base font-bold tracking-tight text-primary dark:text-white">
              MODULARES GM
            </h2>
            <p className="text-[10px] font-light text-secondary -mt-1 leading-tight">
              Cocinas y Cuarzos
            </p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium">
          {navLinks.map(link => <NavLink key={link.href} {...link}/>)}
        </nav>
        <div className="hidden md:flex items-center gap-2">
            <div className="h-6 w-px bg-primary/20 mx-2"></div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-primary"
                aria-label="Open shopping cart"
            >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                    {cartCount}
                </span>
                )}
            </Button>
            <ThemeToggleButton className="text-primary" />
            <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Link href="/admin">
                <Lock size={16} /> Admin
                </Link>
            </Button>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative text-primary"
            aria-label="Open shopping cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Button>
          
          {isClient && <ThemeToggleButton className="text-primary" />}

          {isClient ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu size={28} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs flex flex-col p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                   <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group">
                    <Image src={logo} alt="Modulares GM Logo" width={40} height={40} className="rounded-md dark:hidden"/>
                    <Image src={logo2} alt="Modulares GM Logo" width={40} height={40} className="rounded-md hidden dark:block"/>
                    <div className="flex flex-col">
                      <h2 className="text-base font-bold tracking-tight text-primary dark:text-white">
                        MODULARES GM
                      </h2>
                      <p className="text-[10px] font-light text-secondary -mt-1 leading-tight">
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
                          className={cn("flex items-center gap-3 p-3 rounded-lg font-medium text-base",
                            selectedCategory === category ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <span>{category}</span>
                        </Link>
                      ))}
                      <div className="my-2 border-t"></div>
                      <MobileNavLink href="/#top" label="Volver al Inicio" publicOnly={false} icon={<Home size={20} />} />
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
                            <a href={'https://instagram.com/modularesgm'} target="_blank" rel="noreferrer" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                        </Button>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}><Lock size={16} /> Admin</Link>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
             <Button variant="ghost" size="icon">
                <Menu size={28} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
