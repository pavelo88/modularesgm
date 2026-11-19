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
        'h-9 w-9 rounded-full border border-stone-300 dark:border-stone-700 bg-background/80 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-95 shadow-xs shrink-0 grid place-items-center relative',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Sun
        size={16}
        className={cn(
          'text-amber-500 transition-transform duration-200',
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0 absolute'
        )}
      />
      <Moon
        size={16}
        className={cn(
          'text-slate-700 dark:text-slate-300 transition-transform duration-200',
          dark ? 'rotate-90 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'
        )}
      />
    </button>
  );
}
