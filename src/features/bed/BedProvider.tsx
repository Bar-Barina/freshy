import { createContext, useContext, type ReactNode } from 'react';
import { useBedState, type UseBedReturn } from './useBedState';

const BedContext = createContext<UseBedReturn | null>(null);

/** Single shared bed state for all tabs — fixes score not updating across screens. */
export function BedProvider({ children }: { children: ReactNode }) {
  const value = useBedState();
  return <BedContext.Provider value={value}>{children}</BedContext.Provider>;
}

export function useBed(): UseBedReturn {
  const ctx = useContext(BedContext);
  if (ctx === null) {
    throw new Error('useBed must be used within BedProvider');
  }
  return ctx;
}
