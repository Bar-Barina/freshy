import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Plus, Share2, Users, Flame } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow, getBandColor } from '@/theme';
import { useBed } from '@/features/bed/useBed';
import { useSettings } from '@/features/settings/useSettings';
import { BedIllustration } from '@/components/BedIllustration';
import { ScoreRing } from '@/components/ScoreRing';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { getMotivationalLine } from '@/content/motivationalCopy';

export default function HomeScreen() {
  const { bed, status, markSheetsChanged } = useBed();
  const { settings } = useSettings();
  const [celebrating, setCelebrating] = useState(false);

  const handleChanged = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markSheetsChanged();
    setCelebrating(true);
  };

  const bandColor = getBandColor(status.band);
  const motivational = getMotivationalLine(status.band, {
    gender: settings.gender,
    hasPartner: settings.sharesBed,
  });
  const dayLabel =
    status.daysSinceChange < 0
      ? 'Never tracked'
      : status.daysSinceChange === 0
      ? 'Changed today'
      : `Day ${status.daysSinceChange}`;

  const scoreText =
    bed.lastChangedAt === null ? '—' : String(Math.round(status.score));
  const showPercent = bed.lastChangedAt !== null;

  return (
    <SafeAreaView style={styles.container}>
      <CelebrationOverlay visible={celebrating} onFinished={() => setCelebrating(false)} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.appTitle}>{bed.name}</Text>
            {bed.streak > 1 && (
              <View style={styles.streakBadge}>
                <Flame color={Colors.accent} size={14} strokeWidth={2.2} />
                <Text style={styles.streakText}>{bed.streak}</Text>
              </View>
            )}
          </View>
          <Text style={styles.motivationalHeadline}>{motivational.headline}</Text>
          <Text style={styles.motivationalSubtext}>{motivational.subtext}</Text>
        </View>

        {/* ── Main card ───────────────────────────────────────────── */}
        <View style={[styles.scoreCard, Shadow.md]}>
          {/* Score ring wraps the bed illustration */}
          <ScoreRing score={status.score} band={status.band} size={196} strokeWidth={10}>
            <BedIllustration band={status.band} size={162} />
          </ScoreRing>

          {/* Score block */}
          <View style={styles.scoreBlock}>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color: bandColor }]}>{scoreText}</Text>
              {showPercent && (
                <Text style={[styles.scorePercent, { color: bandColor }]}>%</Text>
              )}
            </View>
            <Text style={styles.statusLabel}>{status.label}</Text>
            <Text style={styles.dayLabel}>{dayLabel}</Text>
          </View>
        </View>

        {/* ── Primary CTA ─────────────────────────────────────────── */}
        <Pressable
          style={styles.ctaButton}
          onPress={handleChanged}
          accessibilityRole="button"
          accessibilityLabel="I changed the sheets — tap to reset freshness"
        >
          <Text style={styles.ctaButtonText}>I changed the sheets</Text>
        </Pressable>

        {/* ── Quick actions ────────────────────────────────────────── */}
        <View style={styles.quickActions}>
          <QuickActionButton label="Add event" icon={Plus} onPress={() => { /* Phase 6 */ }} />
          <QuickActionButton label="Share" icon={Share2} onPress={() => { /* Phase 9 */ }} />
          <QuickActionButton label="Partner" icon={Users} onPress={() => { /* Phase 7 */ }} />
        </View>

        {/* ── Disclaimer ───────────────────────────────────────────── */}
        <Text style={styles.disclaimer}>
          Freshy is a fun reminder tool and does not provide medical or hygiene advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionButton({
  label,
  icon: Icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentType<{ color: string; size: number; strokeWidth?: number }>;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon color={Colors.textSecondary} size={22} strokeWidth={1.8} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.xl,
    gap: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    ...Typography.labelSM,
    color: Colors.textMuted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  streakText: {
    ...Typography.labelMD,
    color: Colors.accent,
  },
  motivationalHeadline: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  motivationalSubtext: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreNumber: {
    ...Typography.scoreXL,
  },
  scorePercent: {
    ...Typography.scoreLG,
    // Align % sign at the bottom of the large number
    paddingBottom: 6,
    marginLeft: 2,
  },
  statusLabel: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  dayLabel: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg + 2,
    alignItems: 'center',
    ...Shadow.sm,
  },
  ctaButtonText: {
    ...Typography.labelLG,
    color: Colors.white,
    fontSize: 17,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
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
  quickActionLabel: {
    ...Typography.labelSM,
    color: Colors.textSecondary,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
