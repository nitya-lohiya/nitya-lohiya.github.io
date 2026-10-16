import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { toggleSkill } from './explorer';

type Lens = {
  selected: string[];
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
  clear: () => void;
};

const LensContext = createContext<Lens | null>(null);

/** Site-wide "skill lens": one selection shared by the hero graph, experience, and projects. */
export function LensProvider({ children, initial = [] }: { children: ReactNode; initial?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = useCallback((id: string) => setSelected((s) => toggleSkill(s, id)), []);
  const clear = useCallback(() => setSelected([]), []);
  const value = useMemo(() => ({ selected, toggle, set: setSelected, clear }), [selected, toggle, clear]);
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens(): Lens {
  const lens = useContext(LensContext);
  if (!lens) throw new Error('useLens must be used inside <LensProvider>');
  return lens;
}
