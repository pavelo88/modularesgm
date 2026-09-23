'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { validateReferral } from '@/lib/affiliate-actions';

export const REF_STORAGE_KEY = 'modulares_vid';

interface AffiliateContextType {
  /** Código de referido activo (username del afiliado). */
  code: string | null;
  affiliateName: string | null;
  /** Descuento para el comprador. Las comisiones del afiliado NO se exponen al público. */
  discountPercent: number;
  applyCode: (code: string) => Promise<boolean>;
  clearCode: () => void;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

function readStored(): string | null {
  try {
    const raw = localStorage.getItem(REF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { code?: string; exp?: number };
    if (!parsed.code || !parsed.exp || parsed.exp < Date.now()) {
      localStorage.removeItem(REF_STORAGE_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

export function AffiliateProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string | null>(null);
  const [affiliateName, setAffiliateName] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const validate = useCallback(async (raw: string, track: boolean) => {
    try {
      const alreadyCounted = track && sessionStorage.getItem(`modulares_click_${raw}`);
      const res = await validateReferral(raw, track && !alreadyCounted);
      if (!res.valid) return false;
      if (track) sessionStorage.setItem(`modulares_click_${raw}`, '1');
      setCode(res.code);
      setAffiliateName(res.name);
      setDiscount(res.discount);
      localStorage.setItem(
        REF_STORAGE_KEY,
        JSON.stringify({ code: res.code, exp: Date.now() + res.cookieDays * 86400000 })
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Lectura en cliente (sin useSearchParams) para no des-optimizar el SSR de las páginas públicas.
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('vid') || params.get('ref');
    if (fromUrl) {
      validate(fromUrl, true);
      return;
    }
    const stored = readStored();
    if (stored) validate(stored, false);
  }, [validate]);

  const clearCode = () => {
    setCode(null);
    setAffiliateName(null);
    setDiscount(0);
    try {
      localStorage.removeItem(REF_STORAGE_KEY);
    } catch {}
  };

  return (
    <AffiliateContext.Provider
      value={{ code, affiliateName, discountPercent: code ? discount : 0, applyCode: (c) => validate(c, false), clearCode }}
    >
      {children}
    </AffiliateContext.Provider>
  );
}

export const useAffiliate = () => {
  const ctx = useContext(AffiliateContext);
  if (!ctx) throw new Error('useAffiliate must be used within AffiliateProvider');
  return ctx;
};
