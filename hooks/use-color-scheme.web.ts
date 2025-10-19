import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import ThemeModeContext from './theme-context';

/**

 */
export function useColorScheme() {
  const [hasHydrated, setHydrated] = useState(false);
  const ctx = useContext(ThemeModeContext);
  const nativeColorScheme = useRNColorScheme();

  useEffect(() => {
    setHydrated(true);
  }, []);


  if (ctx) {
    console.log('Web useColorScheme using context mode:', ctx.mode);
    return ctx.mode;
  }

 
  if (hasHydrated) {
    console.log('Web useColorScheme using native:', nativeColorScheme);
    return nativeColorScheme ?? 'light';
  }

  
  return 'light';
}
