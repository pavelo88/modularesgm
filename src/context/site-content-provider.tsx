'use client';
import { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/types';

interface SiteContentContextType {
  siteContent: SiteContent | null;
  loading: boolean;
}

export const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const defaultSiteContent: SiteContentContextType = {
  siteContent: null,
  loading: false,
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  return context ?? defaultSiteContent;
};
