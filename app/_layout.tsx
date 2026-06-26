import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';

export default function RootLayout() {
  const { settings, isLoaded } = useSettings();

  // Wait for settings to load from MMKV before routing
  if (!isLoaded) {
    return null;
  }

  if (!settings.onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
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
