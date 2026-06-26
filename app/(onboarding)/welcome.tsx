import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { BedIllustration } from '@/components/BedIllustration';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Bed illustration in fresh state — first impression sets the tone */}
        <View style={styles.illustrationContainer}>
          <BedIllustration band="fresh" size={200} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Meet your bed.</Text>
          <Text style={styles.subtitle}>
            Freshy tracks how fresh your sheets are — just for fun.
          </Text>
          <Text style={styles.disclaimer}>
            Fun reminder tool only. Not medical or hygiene advice.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/(onboarding)/preferences')}
          accessibilityRole="button"
          accessibilityLabel="Get started"
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationContainer: {
    marginBottom: Spacing.xxxl,
    // No explicit width/height — SVG handles its own size via the `size` prop
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLG,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.labelLG,
    color: Colors.white,
    fontSize: 17,
  },
});
