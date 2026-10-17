import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { toggleSkill } from './explorer';

type Lens = {
  selected: string[];
  /** True once this visitor has used the lens; the "try me" hint hides from then on. */
  touched: boolean;
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
  clear: () => void;
};

const LensContext = createContext<Lens | null>(null);
export const LENS_TOUCHED_KEY = 'lens-touched';

const readTouched = () => {
  try {
    return localStorage.getItem(LENS_TOUCHED_KEY) === '1';
  } catch {
    return false;
  }
};

/** Site-wide "skill lens": one selection shared by the hero graph, experience, and projects. */
export function LensProvider({ children, initial = [] }: { children: ReactNode; initial?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [touched, setTouched] = useState(readTouched);

  const markTouched = useCallback(() => {
    setTouched(true);
    try {
      localStorage.setItem(LENS_TOUCHED_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      markTouched();
      setSelected((s) => toggleSkill(s, id));
    },
    [markTouched],
  );
  const set = useCallback(
    (ids: string[]) => {
      markTouched();
      setSelected(ids);
    },
    [markTouched],
  );
  const clear = useCallback(() => setSelected([]), []);
  const value = useMemo(() => ({ selected, touched, toggle, set, clear }), [selected, touched, toggle, set, clear]);
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens(): Lens {
  const lens = useContext(LensContext);
  if (!lens) throw new Error('useLens must be used inside <LensProvider>');
  return lens;
}
