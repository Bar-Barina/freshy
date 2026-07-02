import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/theme';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Effective: June 2026</Text>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Freshy is a fun reminder tool and does not provide medical or hygiene advice.
            Use it for entertainment purposes only.
          </Text>
        </View>

        <Section title="1. Acceptance">
          <Text style={styles.body}>
            By using Freshy, you agree to these terms. If you do not agree, please do not
            use the app.
          </Text>
        </Section>

        <Section title="2. What Freshy does">
          <Text style={styles.body}>
            Freshy provides an estimated, non-scientific freshness score for entertainment
            purposes. The score is not based on any scientific measurement and should not
            be relied on for hygiene, health, or medical decisions.
          </Text>
        </Section>

        <Section title="3. No warranties">
          <Text style={styles.body}>
            Freshy is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee
            accuracy, availability, or fitness for any particular purpose.
          </Text>
        </Section>

        <Section title="4. Limitation of liability">
          <Text style={styles.body}>
            To the maximum extent permitted by law, Freshy and its developers are not
            liable for any damages arising from your use of the app.
          </Text>
        </Section>

        <Section title="5. Changes">
          <Text style={styles.body}>
            We may update these terms at any time. Continued use of Freshy constitutes
            acceptance of updated terms.
          </Text>
        </Section>

        <Section title="6. Contact">
          <Text style={styles.body}>
            Questions? Contact us at hello@freshy.app
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.xl },
  updated: { ...Typography.caption, color: Colors.textMuted },
  disclaimer: {
    backgroundColor: Colors.soonLight,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  disclaimerText: { ...Typography.bodyMD, color: Colors.textSecondary },
  section: { gap: Spacing.sm },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  body: { ...Typography.bodyMD, color: Colors.textSecondary },
});
