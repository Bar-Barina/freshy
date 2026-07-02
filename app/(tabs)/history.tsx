import { View, Text, StyleSheet, SectionList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { Sparkles, Trash2, ClipboardList } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/theme';
import { useBed } from '@/features/bed/useBed';
import { getActiveOops } from '@/utils/oopsUtils';
import { OOPS_PRESETS } from '@/content/oopsPresets';
import type { BedOops, BedOopsType } from '@/types';

interface HistorySection {
  title: string;
  data: HistoryItem[];
}

interface HistoryItem {
  id: string;
  type: 'sheet_change' | 'oops';
  label: string;
  time: string;
  sortKey: string;
  penalty?: number;
  oopsId?: string;
  oopsType?: BedOopsType;
}

const OOPS_ICON_MAP = Object.fromEntries(
  OOPS_PRESETS.map((p) => [p.type, p.icon])
) as Record<BedOopsType, (typeof OOPS_PRESETS)[0]['icon']>;

export default function HistoryScreen() {
  const { bed, deleteOops } = useBed();
  const activeOops = getActiveOops(bed);
  const sections = buildSections(bed.lastChangedAt, activeOops);

  const handleDelete = (item: HistoryItem) => {
    if (!item.oopsId) return;
    Alert.alert(
      'Remove this oops?',
      `"${item.label}" will be removed and your score goes back up.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteOops(item.oopsId!),
        },
      ]
    );
  };

  if (sections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.empty}>
          <ClipboardList color={Colors.textMuted} size={48} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>All quiet here</Text>
          <Text style={styles.emptySubtitle}>
            Sheet changes and oops moments show up once you start tracking.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
            <Text style={styles.headerHint}>Only this sheet cycle — old oops were washed away.</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <HistoryRow item={item} onDelete={item.type === 'oops' ? handleDelete : undefined} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

function HistoryRow({
  item,
  onDelete,
}: {
  item: HistoryItem;
  onDelete?: (item: HistoryItem) => void;
}) {
  const OopsIcon =
    item.oopsType !== undefined ? OOPS_ICON_MAP[item.oopsType] : undefined;

  const row = (
    <View style={[styles.row, Shadow.sm]}>
      <View style={styles.rowIcon}>
        {item.type === 'sheet_change' ? (
          <Sparkles color={Colors.fresh} size={20} strokeWidth={1.8} />
        ) : OopsIcon !== undefined ? (
          <OopsIcon color={Colors.accent} size={20} strokeWidth={1.8} />
        ) : null}
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowTime}>{item.time}</Text>
      </View>
      {item.penalty !== undefined && (
        <Text style={styles.penalty}>-{item.penalty}%</Text>
      )}
    </View>
  );

  if (!onDelete) {
    return row;
  }

  const renderRightActions = () => (
    <Pressable
      style={styles.swipeDelete}
      onPress={() => onDelete(item)}
      accessibilityRole="button"
      accessibilityLabel={`Remove ${item.label}`}
    >
      <Trash2 color={Colors.white} size={20} strokeWidth={2} />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      {row}
    </Swipeable>
  );
}

function formatSectionTitle(isoDate: string): string {
  const date = parseISO(isoDate);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d');
}

function buildSections(
  lastChangedAt: string | null,
  activeOops: BedOops[]
): HistorySection[] {
  const items: HistoryItem[] = [];

  if (lastChangedAt) {
    items.push({
      id: `change-${lastChangedAt}`,
      type: 'sheet_change',
      label: 'Sheets changed!',
      time: format(parseISO(lastChangedAt), 'h:mm a'),
      sortKey: lastChangedAt,
    });
  }

  for (const oops of activeOops) {
    items.push({
      id: oops.id,
      type: 'oops',
      label: oops.label,
      time: format(parseISO(oops.createdAt), 'h:mm a'),
      sortKey: oops.createdAt,
      penalty: oops.penalty,
      oopsId: oops.id,
      oopsType: oops.type,
    });
  }

  if (items.length === 0) return [];

  items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const grouped = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const sectionTitle = formatSectionTitle(item.sortKey);
    const existing = grouped.get(sectionTitle) ?? [];
    existing.push(item);
    grouped.set(sectionTitle, existing);
  }

  return Array.from(grouped.entries()).map(([title, data]) => ({ title, data }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  title: { ...Typography.h2, color: Colors.textPrimary },
  headerHint: { ...Typography.caption, color: Colors.textMuted },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
  sectionHeader: {
    ...Typography.labelSM,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: { ...Typography.bodyMD, color: Colors.textPrimary },
  rowTime: { ...Typography.caption, color: Colors.textMuted },
  penalty: { ...Typography.labelMD, color: Colors.warning },
  swipeDelete: {
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySubtitle: { ...Typography.bodyMD, color: Colors.textMuted, textAlign: 'center' },
});
