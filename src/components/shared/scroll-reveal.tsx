'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
  delay?: number; // ms
  duration?: number; // ms
  distance?: number; // px for custom transform
  className?: string;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

/**
 * Componente ScrollReveal para apariciones cinematográficas en scroll.
 * Basado en las guías de Emil Kowalski y Apple Design:
 * - Curva de aceleración --ease-out-emil: cubic-bezier(0.23, 1, 0.32, 1)
 * - Transform y opacity acelerados por GPU (translate3d)
 * - Soporte nativo para prefers-reduced-motion
 * - Seguro para SSR y motores de búsqueda (contenido siempre en el DOM)
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 750,
  className,
  threshold = 0.12,
  once = true,
  as: Component = 'div',
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Si el usuario prefiere reducir movimiento, revelar de inmediato sin animación
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // Activar ligeramente antes de que entre totalmente
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  return (
    <Component
      ref={ref}
      data-direction={direction}
      className={cn('reveal-init', isRevealed && 'is-revealed', className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Contenedor de cascada para elementos en grilla (stagger effect).
 * Envuelve una lista de hijos y les asigna retardos progresivos (ej. 70ms cada uno).
 */
export function ScrollRevealGroup({
  children,
  staggerMs = 80,
  baseDelay = 0,
  direction = 'up',
  duration = 700,
  className,
  as: Component = 'div',
  ...props
}: {
  children: React.ReactNode;
  staggerMs?: number;
  baseDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
  duration?: number;
  className?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>) {
  const childArray = React.Children.toArray(children);

  return (
    <Component className={className} {...props}>
      {childArray.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerMs}
          duration={duration}
        >
          {child}
        </ScrollReveal>
      ))}
    </Component>
  );
}
