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
import { GOVERNMENT_INFRA_ELIGIBLE, GOVERNMENT_MILITARY_ELIGIBLE } from '@/lib/data/resources';

interface NationDataContextType {
  nation: NationData;
  isLoaded: boolean;
  setNation: (data: NationData) => void;
  clearNation: () => void;
  /** All active resources + bonuses as lowercase array for infra/upkeep/tech calculators */
  allResources: string[];
  /** All active resources + bonuses as lowercase array for mobilize calculator */
  allMilitaryResources: string[];
  /** Whether infra government modifier applies */
  hasInfraGovernmentModifier: boolean;
  /** Whether military government modifier applies */
  hasMilitaryGovernmentModifier: boolean;
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

  const hasInfraGovernmentModifier = GOVERNMENT_INFRA_ELIGIBLE.some(
    (g) => nation.government.includes(g)
  );

  const hasMilitaryGovernmentModifier = GOVERNMENT_MILITARY_ELIGIBLE.some(
    (g) => nation.government.includes(g)
  );

  const baseResources = [
    ...nation.connectedResources.map((r) => r.toLowerCase()),
    ...nation.bonusResources.map((r) => r.toLowerCase()),
  ];

  // Infra/upkeep/tech calculators use the infra government modifier
  const allResources = [
    ...baseResources,
    ...(hasInfraGovernmentModifier ? ['government'] : []),
  ];

  // Mobilize calculator uses the military government modifier
  const allMilitaryResources = [
    ...baseResources,
    ...(hasMilitaryGovernmentModifier ? ['government'] : []),
  ];

  return (
    <NationDataContext.Provider
      value={{
        nation,
        isLoaded,
        setNation,
        clearNation,
        allResources,
        allMilitaryResources,
        hasInfraGovernmentModifier,
        hasMilitaryGovernmentModifier,
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
