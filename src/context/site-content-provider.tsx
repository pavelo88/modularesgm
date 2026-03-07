'use client';
import { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/types';

interface SiteContentContextType {
  siteContent: SiteContent | null;
  loading: boolean;
}

export const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
