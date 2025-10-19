import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeModeProvider } from '@/hooks/theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function InnerLayout() {
  const colorScheme = useColorScheme();
  
  // Create theme objects with React.useMemo to ensure proper re-rendering
  // the obj will be created 
  const paperTheme = React.useMemo(() => {
    const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    console.log('Creating paperTheme for:', colorScheme, theme);
    return theme;
  }, [colorScheme]);
  
  const navigationTheme = React.useMemo(() => {
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    console.log('Creating navigationTheme for:', colorScheme, theme);
    return theme;
  }, [colorScheme]);

  console.log('InnerLayout rendering with colorScheme:', colorScheme);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <Stack key={`stack-${colorScheme}`}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <InnerLayout />
    </ThemeModeProvider>
  );
}
