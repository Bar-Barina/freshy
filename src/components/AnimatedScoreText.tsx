import { useEffect } from 'react';
import { StyleSheet, TextInput, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedScoreTextProps {
  value: number | null;
  color: string;
  style: TextStyle;
}

/**
 * Counts up/down to the target score. Shows "—" when value is null.
 */
export function AnimatedScoreText({ value, color, style }: AnimatedScoreTextProps) {
  const reduceMotion = useReducedMotion();
  const animatedValue = useSharedValue(value ?? 0);

  useEffect(() => {
    if (value === null) return;
    animatedValue.value = reduceMotion
      ? value
      : withTiming(value, { duration: 650 });
  }, [value, reduceMotion, animatedValue]);

  const animatedProps = useAnimatedProps(() => ({
    text: value === null ? '—' : `${Math.round(animatedValue.value)}`,
    defaultValue: value === null ? '—' : `${Math.round(animatedValue.value)}`,
  }));

  return (
    <AnimatedTextInput
      editable={false}
      underlineColorAndroid="transparent"
      style={[style, styles.input, { color }]}
      animatedProps={animatedProps}
      accessibilityLabel={
        value === null ? 'Score not available' : `${Math.round(value)} percent freshness`
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
});
