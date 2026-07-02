import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoNotifications from 'expo-notifications';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';
import { useBed } from '@/features/bed/useBed';
import { OnboardingProgress } from '@/components/OnboardingProgress';

export default function NotificationsScreen() {
  const { updateSettings } = useSettings();
  const { initializeBed } = useBed();
  const [requesting, setRequesting] = useState(false);

  const completeOnboarding = async (notificationsEnabled: boolean) => {
    updateSettings({ notificationsEnabled, onboardingComplete: true });
    initializeBed();
    router.replace('/(tabs)');
  };

  const handleEnable = async () => {
    setRequesting(true);
    try {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      await completeOnboarding(status === 'granted');
    } catch {
      await completeOnboarding(false);
    } finally {
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    completeOnboarding(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress step={3} totalSteps={3} />
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft color={Colors.textSecondary} size={24} strokeWidth={2} />
      </Pressable>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Bell color={Colors.soon} size={40} strokeWidth={1.6} />
        </View>

        <Text style={styles.title}>Stay on top of it</Text>
        <Text style={styles.subtitle}>
          Freshy can remind you when your estimated freshness gets low.
        </Text>
        <Text style={styles.subtitleNote}>
          No spam — just a gentle nudge.
        </Text>

        <View style={styles.featureList}>
          <FeatureItem text="Reminders when freshness drops" />
          <FeatureItem text="Max one notification per day" />
          <FeatureItem text="Turn off anytime in Settings" />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryButton, requesting && styles.primaryButtonDisabled]}
          onPress={handleEnable}
          disabled={requesting}
          accessibilityRole="button"
          accessibilityLabel="Enable notifications"
        >
          <Text style={styles.primaryButtonText}>
            {requesting ? 'Just a moment…' : 'Enable notifications'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureDot}>•</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.soonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.md, textAlign: 'center' },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  subtitleNote: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  featureList: { gap: Spacing.sm, alignSelf: 'stretch', paddingHorizontal: Spacing.xl },
  featureItem: { flexDirection: 'row', gap: Spacing.sm },
  featureDot: { ...Typography.bodyMD, color: Colors.cta },
  featureText: { ...Typography.bodyMD, color: Colors.textSecondary, flex: 1 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, gap: Spacing.sm },
  primaryButton: {
    backgroundColor: Colors.cta,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { ...Typography.labelLG, color: Colors.white, fontSize: 17 },
  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  skipButtonText: { ...Typography.labelMD, color: Colors.textMuted },
});
