'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Aplica la paleta del portal también a lo que se pinta fuera de su contenedor
 * (diálogos, menús, avisos). Se quita al salir del portal.
 */
export function usePortalTheme() {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add('portal-theme');
    return () => el.classList.remove('portal-theme');
  }, []);
}

/** Botón claro / oscuro. El tema se guarda (next-themes) y respeta el del sistema la primera vez. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Antes de montar no se sabe el tema real: se asume oscuro (el valor por defecto del sitio).
  const dark = mounted ? resolvedTheme === 'dark' : true;
  const label = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid h-10 w-10 place-items-center rounded-xl text-muted-foreground',
        'transition-[background-color,color,transform] duration-150 ease-emil-out hover:bg-muted hover:text-foreground active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Sun
        size={18}
        className={cn(
          'absolute transition-[transform,opacity] duration-200 ease-emil-out motion-reduce:transition-none',
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        )}
      />
      <Moon
        size={18}
        className={cn(
          'absolute transition-[transform,opacity] duration-200 ease-emil-out motion-reduce:transition-none',
          dark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
      />
    </button>
  );
}
