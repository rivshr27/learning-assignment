import React, { createContext, useContext, useState, PropsWithChildren, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggle: () => void;
} | null>(null);

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const native = (useRNColorScheme() ?? 'light') as ThemeMode;
  const [mode, setMode] = useState<ThemeMode>(native);

  const toggle = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      console.log('Theme toggled from', prevMode, 'to', newMode);
      return newMode;
    });
  }, []);

  const contextValue = React.useMemo(() => ({ 
    mode, 
    toggle 
  }), [mode, toggle]);

  console.log('ThemeModeProvider rendering with mode:', mode);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    console.warn('useThemeMode called outside ThemeModeProvider');
    const native = (useRNColorScheme() ?? 'light') as ThemeMode;
    return { mode: native, toggle: () => {} };
  }
  return ctx;
}

export default ThemeModeContext;
