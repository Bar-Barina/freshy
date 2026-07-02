import { View, Text, StyleSheet, SectionList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { Sparkles, MapPin, ClipboardList, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/theme';
import { useBed } from '@/features/bed/useBed';
import { BedEvent } from '@/types';

interface HistorySection {
  title: string;
  data: HistoryItem[];
}

interface HistoryItem {
  id: string;
  type: 'sheet_change' | 'event';
  label: string;
  time: string;
  penalty?: number;
  eventId?: string;
}

export default function HistoryScreen() {
  const { bed, deleteEvent } = useBed();

  const sections = buildSections(bed.lastChangedAt, bed.events);

  const handleDelete = (item: HistoryItem) => {
    if (!item.eventId) return;
    Alert.alert('Remove event?', `"${item.label}" will be removed and your score will update.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteEvent(item.eventId!),
      },
    ]);
  };

  if (sections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.empty}>
          <ClipboardList color={Colors.textMuted} size={48} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptySubtitle}>
            Your sheet changes and events will appear here.
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
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <HistoryRow item={item} onDelete={item.type === 'event' ? handleDelete : undefined} />
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
  return (
    <View style={[styles.row, Shadow.sm]}>
      <View style={styles.rowIcon}>
        {item.type === 'sheet_change'
          ? <Sparkles color={Colors.fresh} size={20} strokeWidth={1.8} />
          : <MapPin color={Colors.accent} size={20} strokeWidth={1.8} />
        }
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowTime}>{item.time}</Text>
      </View>
      {item.penalty !== undefined && (
        <Text style={styles.penalty}>-{item.penalty}</Text>
      )}
      {onDelete && (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.label}`}
        >
          <X color={Colors.textMuted} size={16} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

function buildSections(
  lastChangedAt: string | null,
  events: BedEvent[]
): HistorySection[] {
  const items: HistoryItem[] = [];

  if (lastChangedAt) {
    items.push({
      id: `change-${lastChangedAt}`,
      type: 'sheet_change',
      label: 'Changed the sheets',
      time: format(parseISO(lastChangedAt), 'h:mm a'),
    });
  }

  for (const event of events) {
    items.push({
      id: event.id,
      type: 'event',
      label: event.label,
      time: format(parseISO(event.createdAt), 'h:mm a'),
      penalty: event.penalty,
      eventId: event.id,
    });
  }

  if (items.length === 0) return [];

  // Group by date — simplified: all items in one "Recent" section for MVP
  return [{ title: 'Recent', data: items }];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.lg },
  title: { ...Typography.h2, color: Colors.textPrimary },
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
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
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
