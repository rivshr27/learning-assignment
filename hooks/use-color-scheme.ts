import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import ThemeModeContext from './theme-context';

/**
 * Returns the app color scheme. If ThemeModeProvider is present it uses that value,
 * otherwise falls back to the native device color scheme.
 */
export function useColorScheme() {
  const ctx = useContext(ThemeModeContext);
  const nativeScheme = useRNColorScheme() ?? 'light';
  
  // Always prefer context mode over native when available
  const result = ctx ? ctx.mode : nativeScheme;
  
  console.log('useColorScheme - ctx:', ctx, 'result:', result);
  
  return result;
}
