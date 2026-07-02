import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import type { FreshnessBand } from '@/types';
import { Colors, getBandColor } from '@/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedScoreRingProps {
  score: number;
  band: FreshnessBand;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

/**
 * Score ring with spring-animated fill. Respects reduced-motion preference.
 */
export function AnimatedScoreRing({
  score,
  band,
  size = 200,
  strokeWidth = 10,
  children,
}: AnimatedScoreRingProps) {
  const reduceMotion = useReducedMotion();
  const clampedScore = Math.max(0, Math.min(100, score));
  const animatedScore = useSharedValue(clampedScore);

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = getBandColor(band);

  useEffect(() => {
    animatedScore.value = reduceMotion
      ? clampedScore
      : withSpring(clampedScore, { damping: 22, stiffness: 120 });
  }, [clampedScore, reduceMotion, animatedScore]);

  const animatedArcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedScore.value / 100),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={`Freshness score ${Math.round(clampedScore)} percent`}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={Colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {clampedScore > 0 && (
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedArcProps}
            strokeLinecap="round"
            rotation={-90}
            origin={`${cx}, ${cy}`}
          />
        )}
      </Svg>

      {children !== undefined && (
        <View style={styles.childContainer} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
}

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
