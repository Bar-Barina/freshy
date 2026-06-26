import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/theme';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated: June 2026</Text>

        <Section title="What Freshy is">
          <Text style={styles.body}>
            Freshy is a fun reminder tool that helps you track when you last changed your bed
            sheets. It does not provide medical, hygiene, or health advice of any kind.
          </Text>
        </Section>

        <Section title="What we collect">
          <Text style={styles.body}>
            When you use Freshy without the partner sync feature, all data stays entirely on
            your device. We do not collect, transmit, or store any personal information.
          </Text>
          <Text style={styles.body}>
            If you enable partner sync, we store:
          </Text>
          <BulletItem text="An anonymous user ID (randomly generated — not linked to your name, email, or Apple ID)" />
          <BulletItem text="Your chosen display name (optional, only used to show who changed the sheets)" />
          <BulletItem text="Bed sheet change dates and freshness events you log" />
        </Section>

        <Section title="What we do NOT collect">
          <BulletItem text="Your email address or phone number" />
          <BulletItem text="Your real name" />
          <BulletItem text="Location data" />
          <BulletItem text="Health or medical information" />
          <BulletItem text="Any data from other apps" />
          <BulletItem text="Advertising identifiers" />
        </Section>

        <Section title="Third-party services">
          <Text style={styles.body}>
            Partner sync uses Supabase (supabase.com) for secure cloud storage. Your data
            is stored in their EU servers and protected by their security practices.
          </Text>
          <Text style={styles.body}>
            No analytics, advertising, or tracking SDKs are included in Freshy.
          </Text>
        </Section>

        <Section title="Deleting your data">
          <Text style={styles.body}>
            To delete all your data: go to Settings and use the reset option, or uninstall
            the app. For partner sync data, contact us and we will delete your account
            within 30 days.
          </Text>
        </Section>

        <Section title="Contact">
          <Text style={styles.body}>
            Questions? Contact us at privacy@freshy.app
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.xl },
  updated: { ...Typography.caption, color: Colors.textMuted },
  section: { gap: Spacing.sm },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  body: { ...Typography.bodyMD, color: Colors.textSecondary, flex: 1 },
  bullet: { flexDirection: 'row', gap: Spacing.sm },
  bulletDot: { ...Typography.bodyMD, color: Colors.accent },
});
