import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';

export default function RootLayout() {
  const { settings, isLoaded } = useSettings();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;

    const inOnboarding = segments[0] === '(onboarding)';

    // Only redirect if not already in the right place — prevents loop
    if (!settings.onboardingComplete && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoaded, settings.onboardingComplete, segments, router]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="privacy" options={{ presentation: 'modal', headerShown: true, title: 'Privacy' }} />
          <Stack.Screen name="terms" options={{ presentation: 'modal', headerShown: true, title: 'Terms' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
