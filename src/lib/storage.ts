import type { NationData } from './types';

const STORAGE_KEY = 'inccalc_nation_data';

export function saveNationData(data: NationData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or disabled
  }
}

export function loadNationData(): NationData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as NationData;
  } catch {
    return null;
  }
}

export function clearNationData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
