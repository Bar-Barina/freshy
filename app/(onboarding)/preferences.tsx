import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';

const INTERVAL_OPTIONS = [5, 7, 10, 14] as const;

export default function PreferencesScreen() {
  const { settings, updateSettings } = useSettings();
  const [interval, setInterval] = useState(settings.defaultIntervalDays);
  const [hasPets, setHasPets] = useState(settings.hasPets);
  const [sweatsOften, setSweatsOften] = useState(settings.sweatsOften);
  const [sharesBed, setSharesBed] = useState(settings.sharesBed);

  const handleContinue = () => {
    updateSettings({ defaultIntervalDays: interval, hasPets, sweatsOften, sharesBed });
    router.push('/(onboarding)/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>A few quick questions</Text>
        <Text style={styles.subtitle}>{"We'll use these to personalize your freshness score."}</Text>

        {/* Interval picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How often do you change your sheets?</Text>
          <View style={styles.intervalRow}>
            {INTERVAL_OPTIONS.map((days) => (
              <Pressable
                key={days}
                style={[styles.intervalChip, interval === days && styles.intervalChipActive]}
                onPress={() => setInterval(days)}
                accessibilityRole="radio"
                accessibilityState={{ selected: interval === days }}
                accessibilityLabel={`Every ${days} days`}
              >
                <Text
                  style={[
                    styles.intervalChipText,
                    interval === days && styles.intervalChipTextActive,
                  ]}
                >
                  {days}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.togglesCard}>
          <ToggleRow
            label="Pets sleep in the bed"
            value={hasPets}
            onToggle={setHasPets}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Often sweaty or work out before bed"
            value={sweatsOften}
            onToggle={setSweatsOften}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Share the bed with someone"
            value={sharesBed}
            onToggle={setSharesBed}
          />
        </View>

        <Text style={styles.hint}>These are optional and can be changed anytime.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
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
        trackColor={{ false: Colors.border, true: Colors.accent }}
        thumbColor={Colors.white}
        accessibilityRole="switch"
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.bodyMD, color: Colors.textSecondary, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  sectionLabel: { ...Typography.labelMD, color: Colors.textSecondary, marginBottom: Spacing.md },
  intervalRow: { flexDirection: 'row', gap: Spacing.sm },
  intervalChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  intervalChipActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  intervalChipText: { ...Typography.labelLG, color: Colors.textSecondary },
  intervalChipTextActive: { color: Colors.accent },
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
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: { ...Typography.labelLG, color: Colors.white, fontSize: 17 },
});
