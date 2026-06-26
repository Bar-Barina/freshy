import { Platform } from 'react-native';

/**
 * SF Rounded feel on iOS; system rounded font on Android.
 * No custom font loading required for MVP — uses system fonts.
 */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Typography = {
  // Display sizes
  scoreXL: {
    fontFamily,
    fontSize: 72,
    fontWeight: '800' as const,
    letterSpacing: -2,
  },
  scoreLG: {
    fontFamily,
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },

  // Headings
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },

  // Body
  bodyLG: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMD: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySM: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },

  // Labels
  labelLG: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  labelMD: {
    fontFamily,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  labelSM: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },

  // Caption
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;
