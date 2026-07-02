import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import type { BedOopsType } from '@/types';
import { OOPS_PRESETS, getOopsPenalty } from '@/content/oopsPresets';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/theme';

interface OopsSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: BedOopsType, label: string) => void;
  /** Types already logged today — shown as disabled */
  loggedTodayTypes: BedOopsType[];
}

/**
 * Bottom sheet for logging a bed "oops" — viral, zero-judgment copy.
 */
export function OopsSheet({ visible, onClose, onSelect, loggedTodayTypes }: OopsSheetProps) {
  const loggedSet = new Set(loggedTodayTypes);

  const handleSelect = (type: BedOopsType, label: string) => {
    if (loggedSet.has(type)) return;
    onSelect(type, label);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, Shadow.md]}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick oops</Text>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close oops sheet"
          >
            <X color={Colors.textMuted} size={20} strokeWidth={2} />
          </Pressable>
        </View>

        <Text style={styles.subtitle}>
          Everyone&apos;s bed has a story. Tap what happened — no judgment, we promise.
        </Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {OOPS_PRESETS.map((preset) => {
            const penalty = getOopsPenalty(preset.type);
            const alreadyToday = loggedSet.has(preset.type);
            const Icon = preset.icon;

            return (
              <Pressable
                key={preset.type}
                style={[styles.option, alreadyToday && styles.optionDisabled]}
                onPress={() => handleSelect(preset.type, preset.label)}
                disabled={alreadyToday}
                accessibilityRole="button"
                accessibilityState={{ disabled: alreadyToday }}
                accessibilityLabel={
                  alreadyToday
                    ? `${preset.label}, already logged today`
                    : `${preset.label}, minus ${penalty} percent`
                }
              >
                <View style={styles.optionIcon}>
                  <Icon
                    color={alreadyToday ? Colors.textMuted : Colors.accent}
                    size={20}
                    strokeWidth={1.8}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, alreadyToday && styles.optionLabelMuted]}>
                    {preset.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    {alreadyToday ? 'Already logged today' : preset.subtitle}
                  </Text>
                </View>
                {alreadyToday ? (
                  <Check color={Colors.fresh} size={18} strokeWidth={2.2} />
                ) : (
                  <Text style={styles.optionPenalty}>-{penalty}%</Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingBottom: Spacing.xxxl,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.xl,
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    gap: Spacing.md,
  },
  optionDisabled: {
    opacity: 0.65,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...Typography.bodyMD,
    color: Colors.textPrimary,
  },
  optionLabelMuted: {
    color: Colors.textMuted,
  },
  optionSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  optionPenalty: {
    ...Typography.labelMD,
    color: Colors.warning,
  },
});
