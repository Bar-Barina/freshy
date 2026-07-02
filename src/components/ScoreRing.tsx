import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { FreshnessBand } from '@/types';
import { Colors, getBandColor } from '@/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreRingProps {
  /** 0–100, clamped internally. */
  score: number;
  band: FreshnessBand;
  /**
   * Outer diameter of the ring in logical pixels.
   * The ring itself draws strokeWidth inward from the edge.
   * Defaults to 200.
   */
  size?: number;
  /** Width of the arc stroke in logical pixels. Defaults to 10. */
  strokeWidth?: number;
  /** Optional content to render centered inside the ring. */
  children?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Static circular progress ring that represents a freshness score (0–100).
 *
 * The ring starts at the top (12 o'clock) and fills clockwise.
 * Animation is added in Phase 4 via an AnimatedScoreRing wrapper.
 *
 * Composition pattern for the home screen:
 *   <ScoreRing score={status.score} band={status.band} size={190}>
 *     <BedIllustration band={status.band} size={160} />
 *   </ScoreRing>
 */
export function ScoreRing({
  score,
  band,
  size = 200,
  strokeWidth = 10,
  children,
}: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  // How much of the circumference to leave "empty" (unfilled).
  // When score = 100, offset = 0 → full ring.
  // When score = 0, offset = circumference → empty ring.
  const strokeDashoffset = circumference * (1 - clampedScore / 100);

  const ringColor = getBandColor(band);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* SVG ring sits as absolute overlay behind children */}
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={`Freshness score ${Math.round(clampedScore)} percent`}
      >
        {/* Track — always-visible background ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={Colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc — only render when there is any score to show */}
        {clampedScore > 0 && (
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            // Rotate -90° around the center so the arc starts at 12 o'clock
            rotation={-90}
            origin={`${cx}, ${cy}`}
          />
        )}
      </Svg>

      {/* Children are centered inside the ring */}
      {children !== undefined && (
        <View style={styles.childContainer} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  childContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
