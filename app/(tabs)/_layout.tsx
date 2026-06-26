import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/theme';

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  const icons: Record<string, string> = {
    Home: focused ? '🏠' : '🏡',
    History: focused ? '📋' : '📄',
    Settings: focused ? '⚙️' : '🔧',
  };
  return (
    <View style={styles.tabIcon}>
      <View style={[styles.tabIconInner, focused && styles.tabIconInnerFocused]}>
        <View style={styles.iconEmoji}>
          <View
            accessibilityLabel={`${label} tab${focused ? ', selected' : ''}`}
            accessibilityRole="tab"
          >
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Home" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="History" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Settings" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    height: 84,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconInner: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconInnerFocused: {
    backgroundColor: Colors.accentLight,
  },
  iconEmoji: {
    width: 20,
    height: 20,
  },
});
