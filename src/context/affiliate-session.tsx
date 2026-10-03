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
    let unsubIndex: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;
    let graceTimer: ReturnType<typeof setTimeout> | undefined;
    let currentUsername: string | undefined;

    const clearGrace = () => {
      if (graceTimer) {
        clearTimeout(graceTimer);
        graceTimer = undefined;
      }
    };

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      unsubIndex?.();
      unsubProfile?.();
      clearGrace();
      currentUsername = undefined;
      if (!user) {
        setValue((v) => ({ ...v, status: 'anon', user: null, affiliate: null }));
        return;
      }

      let settings = DEFAULT_AFFILIATE_SETTINGS;
      try {
        const settingsSnap = await getDoc(doc(db, 'siteContent', 'affiliate')).catch(() => null);
        settings = { ...DEFAULT_AFFILIATE_SETTINGS, ...(settingsSnap?.data() || {}) } as AffiliateSettings;
      } catch {}

      // Se escucha el índice del usuario (no solo el perfil): si el afiliado cambia su usuario,
      // el documento del perfil cambia de ID y hay que seguirlo en lugar de cerrar la sesión.
      unsubIndex = onSnapshot(
        doc(db, USER_INDEX_COLLECTION, user.uid),
        (idx) => {
          const username = idx.data()?.username as string | undefined;
          if (!username) {
            clearGrace();
            unsubProfile?.();
            currentUsername = undefined;
            setValue({ status: 'no_profile', user, affiliate: null, settings });
            return;
          }
          if (username === currentUsername) return;
          currentUsername = username;
          clearGrace();
          unsubProfile?.();
          unsubProfile = onSnapshot(
            doc(db, AFFILIATES_COLLECTION, username),
            (snap) => {
              if (!snap.exists()) {
                // Durante un cambio de usuario el documento viejo desaparece un instante antes de
                // que llegue el índice nuevo: se espera un momento antes de dar el perfil por perdido.
                clearGrace();
                graceTimer = setTimeout(() => setValue({ status: 'no_profile', user, affiliate: null, settings }), 1500);
                return;
              }
              clearGrace();
              const affiliate = snap.data() as AffiliateAccount;
              const status: Status = affiliate.status === 'suspended' ? 'suspended' : 'ready';
              setValue({ status, user, affiliate, settings });
            },
            () => setValue({ status: 'no_profile', user, affiliate: null, settings })
          );
        },
        () => setValue({ status: 'no_profile', user, affiliate: null, settings })
      );
    });

    return () => {
      unsubAuth();
      unsubIndex?.();
      unsubProfile?.();
      clearGrace();
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
