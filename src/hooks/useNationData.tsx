'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { NationData } from '@/lib/types';
import { createEmptyNation } from '@/lib/types';
import { saveNationData, loadNationData, clearNationData } from '@/lib/storage';
import { GOVERNMENT_MODIFIER_ELIGIBLE } from '@/lib/data/resources';

interface NationDataContextType {
  nation: NationData;
  isLoaded: boolean;
  setNation: (data: NationData) => void;
  clearNation: () => void;
  /** All active resources + bonuses as lowercase array for calculator input */
  allResources: string[];
  /** Whether government modifier applies */
  hasGovernmentModifier: boolean;
}

const NationDataContext = createContext<NationDataContextType | null>(null);

export function NationDataProvider({ children }: { children: ReactNode }) {
  const [nation, setNationState] = useState<NationData>(createEmptyNation());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadNationData();
    if (stored) {
      setNationState(stored);
      setIsLoaded(true);
    }
  }, []);

  const setNation = useCallback((data: NationData) => {
    setNationState(data);
    setIsLoaded(true);
    saveNationData(data);
  }, []);

  const clearNation = useCallback(() => {
    setNationState(createEmptyNation());
    setIsLoaded(false);
    clearNationData();
  }, []);

  const hasGovernmentModifier = GOVERNMENT_MODIFIER_ELIGIBLE.some(
    (g) => nation.government.includes(g)
  );

  // Combine connected + bonus resources as lowercase, plus "government" if eligible
  const allResources = [
    ...nation.connectedResources.map((r) => r.toLowerCase()),
    ...nation.bonusResources.map((r) => r.toLowerCase()),
    ...(hasGovernmentModifier ? ['government'] : []),
  ];

  return (
    <NationDataContext.Provider
      value={{
        nation,
        isLoaded,
        setNation,
        clearNation,
        allResources,
        hasGovernmentModifier,
      }}
    >
      {children}
    </NationDataContext.Provider>
  );
}

export function useNationData(): NationDataContextType {
  const ctx = useContext(NationDataContext);
  if (!ctx) {
    throw new Error('useNationData must be used within NationDataProvider');
  }
  return ctx;
}
