import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';
import { BedProvider } from '@/features/bed/BedProvider';
import { storageGet, STORAGE_KEYS } from '@/services/storage/mmkv';
import { deserializeSettings } from '@/services/storage/serializers';

export default function RootLayout() {
  const { isLoaded } = useSettings();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;

    // Read fresh from MMKV — the hook's useState can be stale after
    // another hook instance (e.g. onboarding screen) updates MMKV.
    const freshSettings = deserializeSettings(storageGet<unknown>(STORAGE_KEYS.SETTINGS));
    const inOnboarding = segments[0] === '(onboarding)';

    if (!freshSettings.onboardingComplete && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoaded, segments, router]);

  return (
    <BedProvider>
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
    </BedProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
