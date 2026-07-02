import { Pressable, Text, type ViewStyle, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCtaButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

/**
 * Primary CTA with spring scale feedback on press.
 */
export function AnimatedCtaButton({
  label,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
}: AnimatedCtaButtonProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animateTo = (target: number) => {
    // Reanimated shared values are intentionally mutated on the UI thread.
    // eslint-disable-next-line react-hooks/immutability -- standard Reanimated pattern
    scale.value = withSpring(target, { damping: 15, stiffness: 280 });
  };

  const handlePressIn = () => {
    if (!reduceMotion) animateTo(0.96);
  };

  const handlePressOut = () => {
    animateTo(1);
  };

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={textStyle}>{label}</Text>
    </AnimatedPressable>
  );
}
