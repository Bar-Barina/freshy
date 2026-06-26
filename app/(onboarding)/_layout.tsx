import { Stack } from 'expo-router';
import { Colors } from '@/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
