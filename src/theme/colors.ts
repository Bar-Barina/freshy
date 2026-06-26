export const Colors = {
  // Base
  background: '#FFF8F0',
  surface: '#FFFFFF',
  border: '#F0E6D8',

  // Text
  textPrimary: '#2D1B0E',
  textSecondary: '#7A6552',
  textMuted: '#B0A090',

  // Brand
  accent: '#FF6B6B',
  accentLight: '#FFE8E8',

  // Freshness states
  fresh: '#7DAF9C',
  freshLight: '#E8F5F0',
  ok: '#5B9BD5',
  okLight: '#E3F0FB',
  soon: '#F4A137',
  soonLight: '#FEF0DC',
  warning: '#E85D4A',
  warningLight: '#FDECEA',
  biohazard: '#C77DFF',
  biohazardLight: '#F5E8FF',

  // UI
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(45, 27, 14, 0.12)',

  // Score ring track
  ringTrack: '#F0E6D8',
} as const;

export type ColorKey = keyof typeof Colors;

/**
 * Returns the primary color for a freshness band.
 */
export function getBandColor(band: 'fresh' | 'ok' | 'soon' | 'warning' | 'biohazard'): string {
  const map: Record<typeof band, string> = {
    fresh: Colors.fresh,
    ok: Colors.ok,
    soon: Colors.soon,
    warning: Colors.warning,
    biohazard: Colors.biohazard,
  };
  return map[band];
}

/**
 * Returns the light background color for a freshness band.
 */
export function getBandLightColor(
  band: 'fresh' | 'ok' | 'soon' | 'warning' | 'biohazard'
): string {
  const map: Record<typeof band, string> = {
    fresh: Colors.freshLight,
    ok: Colors.okLight,
    soon: Colors.soonLight,
    warning: Colors.warningLight,
    biohazard: Colors.biohazardLight,
  };
  return map[band];
}
