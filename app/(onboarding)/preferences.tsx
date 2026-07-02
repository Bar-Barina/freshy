import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import type { Gender } from '@/types';

const INTERVAL_OPTIONS = [5, 7, 10, 14] as const;
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'skip', label: 'Skip' },
];

export default function PreferencesScreen() {
  const { settings, updateSettings } = useSettings();
  const [interval, setInterval] = useState(settings.defaultIntervalDays);
  const [gender, setGender] = useState<Gender>(settings.gender);
  const [hasPets, setHasPets] = useState(settings.hasPets);
  const [sweatsOften, setSweatsOften] = useState(settings.sweatsOften);
  const [sharesBed, setSharesBed] = useState(settings.sharesBed);
  const [hasAC, setHasAC] = useState(settings.hasAC);

  const handleContinue = () => {
    updateSettings({
      defaultIntervalDays: interval,
      gender,
      hasPets,
      sweatsOften,
      sharesBed,
      hasAC,
    });
    router.push('/(onboarding)/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgress step={2} totalSteps={3} />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft color={Colors.textSecondary} size={24} strokeWidth={2} />
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{"Let\u2019s get to know you better!"}</Text>
        <Text style={styles.subtitle}>
          This helps personalize your freshness score.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About you</Text>
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={[styles.chip, gender === opt.value && styles.chipActive]}
                onPress={() => setGender(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: gender === opt.value }}
                accessibilityLabel={opt.label}
              >
                <Text style={[styles.chipText, gender === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How often do you change your sheets?</Text>
          <View style={styles.chipRow}>
            {INTERVAL_OPTIONS.map((days) => (
              <Pressable
                key={days}
                style={[styles.chip, interval === days && styles.chipActive]}
                onPress={() => setInterval(days)}
                accessibilityRole="radio"
                accessibilityState={{ selected: interval === days }}
                accessibilityLabel={`Every ${days} days`}
              >
                <Text style={[styles.chipText, interval === days && styles.chipTextActive]}>
                  {days}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.togglesCard}>
          <ToggleRow label="I share the bed with a partner" value={sharesBed} onToggle={setSharesBed} />
          <View style={styles.divider} />
          <ToggleRow label="Pets sleep in the bed" value={hasPets} onToggle={setHasPets} />
          <View style={styles.divider} />
          <ToggleRow label="I sweat a lot or work out before bed" value={sweatsOften} onToggle={setSweatsOften} />
          <View style={styles.divider} />
          <ToggleRow label="Bedroom has AC" value={hasAC} onToggle={setHasAC} />
        </View>

        <Text style={styles.hint}>These are optional and can be changed anytime in Settings.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.cta }}
        thumbColor={Colors.white}
        accessibilityRole="switch"
        accessibilityLabel={label}
      />
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
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.lg },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.bodyMD, color: Colors.textSecondary, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  sectionLabel: { ...Typography.labelMD, color: Colors.textSecondary, marginBottom: Spacing.md },
  chipRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  chipActive: { borderColor: Colors.cta, backgroundColor: '#E8F5E9' },
  chipText: { ...Typography.labelLG, color: Colors.textSecondary },
  chipTextActive: { color: Colors.cta },
  togglesCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    minHeight: 44,
  },
  toggleLabel: { ...Typography.bodyMD, color: Colors.textPrimary, flex: 1, marginRight: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.border },
  hint: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  primaryButton: {
    backgroundColor: Colors.cta,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonPressed: { backgroundColor: Colors.ctaPressed },
  primaryButtonText: { ...Typography.labelLG, color: Colors.white, fontSize: 17 },
});
