import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/theme';

interface OnboardingProgressProps {
  step: number;
  totalSteps: number;
}

/**
 * Thin progress bar for the onboarding flow.
 * Fills proportionally based on current step / totalSteps.
 */
export function OnboardingProgress({ step, totalSteps }: OnboardingProgressProps) {
  const progress = step / totalSteps;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { flex: progress }]} />
      <View style={{ flex: 1 - progress }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: Colors.cta,
    borderRadius: BorderRadius.sm,
  },
});
