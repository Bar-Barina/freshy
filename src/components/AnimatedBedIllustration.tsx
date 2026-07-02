import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import type { FreshnessBand } from '@/types';
import { BedIllustration } from '@/components/BedIllustration';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedBedIllustrationProps {
  band: FreshnessBand;
  size?: number;
}

/** Crossfades between freshness band illustrations. */
export function AnimatedBedIllustration({ band, size = 162 }: AnimatedBedIllustrationProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      key={band}
      style={styles.container}
      entering={reduceMotion ? undefined : FadeIn.duration(280)}
      exiting={reduceMotion ? undefined : FadeOut.duration(180)}
    >
      <BedIllustration band={band} size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
