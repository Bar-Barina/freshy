import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/theme';
import { useSettings } from '@/features/settings/useSettings';
import { useBed } from '@/features/bed/useBed';

const INTERVAL_OPTIONS = [5, 7, 10, 14] as const;

export default function SettingsScreen() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { bed } = useBed();

  const handleResetOnboarding = () => {
    Alert.alert('Reset onboarding?', 'This will restart the setup flow.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetSettings();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Bed interval */}
        <SettingsSection label="Freshness schedule">
          <View style={styles.intervalRow}>
            {INTERVAL_OPTIONS.map((days) => (
              <Pressable
                key={days}
                style={[
                  styles.intervalChip,
                  settings.defaultIntervalDays === days && styles.intervalChipActive,
                ]}
                onPress={() => updateSettings({ defaultIntervalDays: days })}
                accessibilityRole="radio"
                accessibilityState={{ selected: settings.defaultIntervalDays === days }}
                accessibilityLabel={`Change sheets every ${days} days`}
              >
                <Text
                  style={[
                    styles.chipText,
                    settings.defaultIntervalDays === days && styles.chipTextActive,
                  ]}
                >
                  {days}d
                </Text>
              </Pressable>
            ))}
          </View>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection label="Notifications">
          <SettingsToggle
            label="Enable reminders"
            value={settings.notificationsEnabled}
            onToggle={(v) => updateSettings({ notificationsEnabled: v })}
          />
          <View style={styles.divider} />
          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Freshness alert below</Text>
            <Text style={styles.settingsRowValue}>{settings.freshnessThreshold}%</Text>
          </View>
        </SettingsSection>

        {/* Partner */}
        <SettingsSection label="Partner sync">
          <View style={styles.settingsRow}>
            <Text style={styles.settingsRowLabel}>Shared bed</Text>
            <Text style={styles.settingsRowValue}>
              {bed.remoteBedId ? 'Connected' : 'Not connected'}
            </Text>
          </View>
          <View style={styles.divider} />
          <Pressable
            style={styles.actionRow}
            onPress={() => { /* Phase 7 */ }}
            accessibilityRole="button"
            accessibilityLabel="Set up partner sync"
          >
            <Text style={styles.actionRowText}>Set up partner sync →</Text>
          </Pressable>
        </SettingsSection>

        {/* Legal */}
        <SettingsSection label="Legal">
          <Pressable
            style={styles.actionRow}
            onPress={() => router.push('/privacy')}
            accessibilityRole="link"
            accessibilityLabel="Privacy policy"
          >
            <Text style={styles.actionRowText}>Privacy Policy →</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.actionRow}
            onPress={() => router.push('/terms')}
            accessibilityRole="link"
            accessibilityLabel="Terms of service"
          >
            <Text style={styles.actionRowText}>Terms of Service →</Text>
          </Pressable>
        </SettingsSection>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Freshy is a fun reminder tool and does not provide medical or hygiene advice.
        </Text>

        {/* Dev reset — always visible in MVP for testing */}
        <Pressable
          style={styles.resetButton}
          onPress={handleResetOnboarding}
          accessibilityRole="button"
          accessibilityLabel="Reset onboarding"
        >
          <Text style={styles.resetButtonText}>Reset onboarding</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={[styles.sectionCard, Shadow.sm]}>{children}</View>
    </View>
  );
}

function SettingsToggle({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsRowLabel}>{label}</Text>
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
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary, paddingTop: Spacing.xl },
  section: { gap: Spacing.sm },
  sectionLabel: { ...Typography.labelSM, color: Colors.textMuted },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  intervalRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  intervalChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  intervalChipActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  chipText: { ...Typography.labelMD, color: Colors.textSecondary },
  chipTextActive: { color: Colors.accent },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    minHeight: 44,
  },
  settingsRowLabel: { ...Typography.bodyMD, color: Colors.textPrimary, flex: 1 },
  settingsRowValue: { ...Typography.bodyMD, color: Colors.textMuted },
  actionRow: {
    paddingVertical: Spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  actionRowText: { ...Typography.bodyMD, color: Colors.accent },
  divider: { height: 1, backgroundColor: Colors.border },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  resetButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  resetButtonText: { ...Typography.labelMD, color: Colors.textMuted },
});
