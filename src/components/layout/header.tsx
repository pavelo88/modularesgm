'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Lock,
  Menu,
  Moon,
  ShoppingCart,
  Store,
  Sun,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();

  const navLinks = [
    { href: '/#top', label: 'Inicio', publicOnly: false },
    { href: '/#soluciones', label: 'Diseños', publicOnly: true },
    { href: '/#contacto', label: 'Contacto', publicOnly: true },
    { href: '/store', label: 'Tienda', publicOnly: false, icon: <Store size={16} /> },
  ];

  const NavLink = ({ href, label, publicOnly, icon }: (typeof navLinks)[0]) => {
    if (publicOnly && pathname !== '/') return null;
    const isActive = href === '/store' ? pathname === '/store' : false;

    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors',
          isActive && 'font-bold text-primary'
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };
  
  const MobileNavLink = ({ href, label, publicOnly }: (typeof navLinks)[0]) => {
     if (publicOnly && pathname !== '/') return null;
     return <Link href={href} className="block py-2 text-lg text-muted-foreground border-b border-border">{label}</Link>
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] tracking-[0.2em] text-secondary font-bold">
              MUEBLES • DISEÑO • CONSTRUCCIÓN
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">
              MODULARES <span className="text-primary">GM</span>
            </h1>
            <span className="text-[10px] tracking-widest text-primary mt-1">
              — COCINAS & CUARZOS —
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium">
          {navLinks.map(link => <NavLink key={link.href} {...link}/>)}
          
          <div className="h-6 w-px bg-border mx-2"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative"
            aria-label="Open shopping cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/admin">
              <Lock size={16} /> Admin
            </Link>
          </Button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                 {navLinks.map(link => <MobileNavLink key={link.href} {...link} />)}

                 <Button asChild className="w-full mt-4">
                  <Link href="/admin"><Lock size={16} /> Admin</Link>
                </Button>

                 <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full">
                   {theme === 'dark' ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
                   Cambiar Tema
                 </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
