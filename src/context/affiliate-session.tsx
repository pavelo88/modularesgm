'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  AFFILIATES_COLLECTION,
  DEFAULT_AFFILIATE_SETTINGS,
  USER_INDEX_COLLECTION,
  type AffiliateAccount,
  type AffiliateSettings,
} from '@/lib/affiliate-core';

type Status = 'loading' | 'anon' | 'no_profile' | 'suspended' | 'ready';

interface SessionValue {
  status: Status;
  user: User | null;
  affiliate: AffiliateAccount | null;
  /** Reglas del plan: solo visibles para afiliados con sesión, nunca para el público. */
  settings: AffiliateSettings;
}

const SessionContext = createContext<SessionValue | undefined>(undefined);

export function AffiliateSessionProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<SessionValue>({
    status: 'loading',
    user: null,
    affiliate: null,
    settings: DEFAULT_AFFILIATE_SETTINGS,
  });

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      unsubProfile?.();
      if (!user) {
        setValue((v) => ({ ...v, status: 'anon', user: null, affiliate: null }));
        return;
      }
      try {
        const [index, settingsSnap] = await Promise.all([
          getDoc(doc(db, USER_INDEX_COLLECTION, user.uid)),
          getDoc(doc(db, 'siteContent', 'affiliate')).catch(() => null),
        ]);
        const settings = { ...DEFAULT_AFFILIATE_SETTINGS, ...(settingsSnap?.data() || {}) } as AffiliateSettings;
        const username = index.data()?.username as string | undefined;
        if (!username) {
          setValue({ status: 'no_profile', user, affiliate: null, settings });
          return;
        }
        unsubProfile = onSnapshot(
          doc(db, AFFILIATES_COLLECTION, username),
          (snap) => {
            const affiliate = snap.exists() ? (snap.data() as AffiliateAccount) : null;
            const status: Status = !affiliate ? 'no_profile' : affiliate.status === 'suspended' ? 'suspended' : 'ready';
            setValue({ status, user, affiliate, settings });
          },
          () => setValue({ status: 'no_profile', user, affiliate: null, settings })
        );
      } catch {
        setValue((v) => ({ ...v, status: 'no_profile', user }));
      }
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAffiliateSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useAffiliateSession must be used within AffiliateSessionProvider');
  return ctx;
}

/** Igual que `useAffiliateSession` pero garantiza un perfil listo (dentro del portal ya validado). */
export function useAffiliateAccount() {
  const { affiliate, settings, user } = useAffiliateSession();
  if (!affiliate || !user) throw new Error('Perfil de afiliado no disponible');
  return { affiliate, settings, user };
}

export const affiliateSignOut = () => signOut(auth);
