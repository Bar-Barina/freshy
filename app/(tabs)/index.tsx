import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadow, getBandColor } from '@/theme';
import { useBed } from '@/features/bed/useBed';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { bed, status, markSheetsChanged } = useBed();

  const handleChanged = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markSheetsChanged();
  };

  const bandColor = getBandColor(status.band);
  const dayLabel =
    status.daysSinceChange < 0
      ? 'Never tracked'
      : status.daysSinceChange === 0
      ? 'Changed today'
      : `Day ${status.daysSinceChange}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Bed Status</Text>
          <Text style={styles.bedName}>{bed.name}</Text>
        </View>

        {/* Main card */}
        <View style={[styles.scoreCard, Shadow.md]}>
          {/* Bed illustration placeholder — replaced in Phase 3 with SVG */}
          <View style={[styles.illustrationContainer, { backgroundColor: `${bandColor}20` }]}>
            <Text style={styles.illustrationEmoji}>
              {status.band === 'fresh' && '✨🛏️✨'}
              {status.band === 'ok' && '🛏️'}
              {status.band === 'soon' && '😐🛏️'}
              {status.band === 'warning' && '😬🛏️'}
              {status.band === 'biohazard' && '☣️🛏️☣️'}
            </Text>
          </View>

          {/* Score */}
          <View style={styles.scoreBlock}>
            <Text style={[styles.scoreNumber, { color: bandColor }]}>
              {status.lastChangedAt === null ? '—' : Math.round(status.score)}
              {status.lastChangedAt !== null && (
                <Text style={styles.scorePercent}>%</Text>
              )}
            </Text>
            <Text style={styles.statusLabel}>{status.label}</Text>
            <Text style={styles.dayLabel}>{dayLabel}</Text>
          </View>
        </View>

        {/* Primary CTA */}
        <Pressable
          style={styles.ctaButton}
          onPress={handleChanged}
          accessibilityRole="button"
          accessibilityLabel="I changed the sheets — tap to reset freshness"
        >
          <Text style={styles.ctaButtonText}>I changed the sheets</Text>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <QuickActionButton label="Add event" emoji="➕" onPress={() => { /* Phase 6 */ }} />
          <QuickActionButton label="Share" emoji="📤" onPress={() => { /* Phase 9 */ }} />
          <QuickActionButton label="Partner" emoji="👫" onPress={() => { /* Phase 7 */ }} />
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Freshy is a fun reminder tool and does not provide medical or hygiene advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionButton({
  label,
  emoji,
  onPress,
}: {
  label: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.quickActionEmoji}>{emoji}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  header: { paddingTop: Spacing.xl, gap: Spacing.xs },
  appTitle: { ...Typography.labelSM, color: Colors.textMuted },
  bedName: { ...Typography.h2, color: Colors.textPrimary },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: { fontSize: 64 },
  scoreBlock: { alignItems: 'center', gap: Spacing.sm },
  scoreNumber: { ...Typography.scoreXL },
  scorePercent: { ...Typography.scoreLG },
  statusLabel: { ...Typography.h3, color: Colors.textPrimary },
  dayLabel: { ...Typography.bodyMD, color: Colors.textMuted },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg + 2,
    alignItems: 'center',
    ...Shadow.sm,
  },
  ctaButtonText: { ...Typography.labelLG, color: Colors.white, fontSize: 17 },
  quickActions: { flexDirection: 'row', gap: Spacing.md },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadow.sm,
    minHeight: 44,
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: { ...Typography.labelSM, color: Colors.textSecondary },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
