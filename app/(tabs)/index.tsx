import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Plus, Users, Flame } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow, getBandColor } from '@/theme';
import { useBed } from '@/features/bed/useBed';
import { useSettings } from '@/features/settings/useSettings';
import { AnimatedBedIllustration } from '@/components/AnimatedBedIllustration';
import { AnimatedScoreRing } from '@/components/AnimatedScoreRing';
import { AnimatedScoreText } from '@/components/AnimatedScoreText';
import { AnimatedCtaButton } from '@/components/AnimatedCtaButton';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { OopsSheet } from '@/components/OopsSheet';
import { getMotivationalLine } from '@/content/motivationalCopy';
import { getOopsTypesLoggedToday } from '@/utils/oopsUtils';
import type { BedOopsType, FreshnessBand } from '@/types';

const DEV_BANDS: FreshnessBand[] = ['fresh', 'ok', 'soon', 'warning', 'biohazard'];

export default function HomeScreen() {
  const { bed, status, markSheetsChanged, addOops } = useBed();
  const { settings } = useSettings();
  const [celebrating, setCelebrating] = useState(false);
  const [previewBand, setPreviewBand] = useState<FreshnessBand | null>(null);
  const [oopsSheetVisible, setOopsSheetVisible] = useState(false);

  const displayBand = __DEV__ && previewBand !== null ? previewBand : status.band;
  const loggedTodayTypes = getOopsTypesLoggedToday(bed);

  const cyclePreviewBand = () => {
    if (!__DEV__) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewBand((current) => {
      const idx = current === null ? DEV_BANDS.indexOf(status.band) : DEV_BANDS.indexOf(current);
      return DEV_BANDS[(idx + 1) % DEV_BANDS.length];
    });
  };

  const handleChanged = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markSheetsChanged();
    setCelebrating(true);
  };

  const handleAddOops = async (type: BedOopsType, label: string) => {
    const result = addOops(type, label);
    if (result === 'already_today') {
      Alert.alert('Already logged', 'You already logged that one today.');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const bandColor = getBandColor(displayBand);
  const motivational = getMotivationalLine(displayBand, {
    gender: settings.gender,
    hasPartner: settings.sharesBed,
  });
  const dayLabel =
    status.daysSinceChange < 0
      ? 'Never tracked'
      : status.daysSinceChange === 0
      ? 'Changed today'
      : `Day ${status.daysSinceChange}`;

  const scoreValue = bed.lastChangedAt === null ? null : Math.round(status.score);
  const showPercent = bed.lastChangedAt !== null;

  return (
    <SafeAreaView style={styles.container}>
      <CelebrationOverlay visible={celebrating} onFinished={() => setCelebrating(false)} />
      <OopsSheet
        visible={oopsSheetVisible}
        onClose={() => setOopsSheetVisible(false)}
        onSelect={handleAddOops}
        loggedTodayTypes={loggedTodayTypes}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={[styles.scoreCard, Shadow.md]}>
          <AnimatedScoreRing score={status.score} band={displayBand} size={196} strokeWidth={10}>
            <Pressable
              onLongPress={cyclePreviewBand}
              delayLongPress={400}
              style={styles.bedPreviewHitArea}
              accessibilityRole="button"
              accessibilityLabel={`Bed freshness illustration, ${displayBand} state. Long press to preview states in development.`}
            >
              <AnimatedBedIllustration band={displayBand} size={162} />
            </Pressable>
          </AnimatedScoreRing>

          <View style={styles.scoreBlock}>
            <View style={styles.scoreRow}>
              <AnimatedScoreText
                value={scoreValue}
                color={bandColor}
                style={styles.scoreNumber}
              />
              {showPercent && (
                <Text style={[styles.scorePercent, { color: bandColor }]}>%</Text>
              )}
            </View>
            <Text style={styles.statusLabel}>{status.label}</Text>
            <Text style={styles.dayLabel}>{dayLabel}</Text>
          </View>
        </View>

        <AnimatedCtaButton
          label="Sheets changed!"
          onPress={handleChanged}
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
          accessibilityLabel="Sheets changed — tap to reset freshness"
        />

        <View style={styles.quickActions}>
          <QuickActionButton
            label="Quick oops"
            icon={Plus}
            onPress={() => setOopsSheetVisible(true)}
          />
          <QuickActionButton label="Partner" icon={Users} onPress={() => { /* Phase 7 */ }} />
        </View>

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
  bedPreviewHitArea: {
    width: 162,
    height: 162,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.cta,
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
