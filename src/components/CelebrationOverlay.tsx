import { useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography } from '@/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CONFETTI_COUNT = 24;
const CONFETTI_COLORS = [
  Colors.fresh,
  Colors.ok,
  Colors.accent,
  '#FFD700',
  '#7DAF9C',
  '#5B9BD5',
];

interface CelebrationOverlayProps {
  visible: boolean;
  onFinished: () => void;
}

interface ConfettiPiece {
  x: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
}

function generateConfetti(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    pieces.push({
      x: Math.random() * SCREEN_W,
      delay: Math.random() * 400,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
    });
  }
  return pieces;
}

const confettiPieces = generateConfetti();

export function CelebrationOverlay({ visible, onFinished }: CelebrationOverlayProps) {
  const opacity = useSharedValue(0);
  const textScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const dismiss = useCallback(() => {
    onFinished();
  }, [onFinished]);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      textScale.value = withSequence(
        withDelay(100, withSpring(1.15, { damping: 8, stiffness: 200 })),
        withSpring(1, { damping: 12 })
      );
      textOpacity.value = withDelay(100, withTiming(1, { duration: 200 }));

      // Auto-dismiss after 2.2s
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        textOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(dismiss)();
        });
        textScale.value = withTiming(0.8, { duration: 300 });
      }, 2200);

      return () => clearTimeout(timeout);
    } else {
      opacity.value = 0;
      textScale.value = 0;
      textOpacity.value = 0;
    }
  }, [visible, opacity, textScale, textOpacity, dismiss]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value > 0 ? 'auto' as const : 'none' as const,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
    opacity: textOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      {confettiPieces.map((piece, i) => (
        <ConfettiDot key={i} piece={piece} visible={visible} />
      ))}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.celebrationText}>Cleannnn!</Text>
        <Text style={styles.celebrationSubtext}>Fresh sheets, fresh start</Text>
      </Animated.View>
    </Animated.View>
  );
}

function ConfettiDot({ piece, visible }: { piece: ConfettiPiece; visible: boolean }) {
  const translateY = useSharedValue(-60);
  const rotate = useSharedValue(0);
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      dotOpacity.value = withDelay(piece.delay, withTiming(1, { duration: 150 }));
      translateY.value = withDelay(
        piece.delay,
        withTiming(SCREEN_H + 60, { duration: 2000 + Math.random() * 800, easing: Easing.in(Easing.quad) })
      );
      rotate.value = withDelay(
        piece.delay,
        withTiming(piece.rotation + 720, { duration: 2500, easing: Easing.linear })
      );
    } else {
      translateY.value = -60;
      dotOpacity.value = 0;
      rotate.value = 0;
    }
  }, [visible, translateY, rotate, dotOpacity, piece]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: dotOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: piece.x,
          width: piece.size,
          height: piece.size * 0.6,
          backgroundColor: piece.color,
          borderRadius: piece.size * 0.15,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  celebrationText: {
    ...Typography.scoreXL,
    color: Colors.white,
    fontSize: 44,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  celebrationSubtext: {
    ...Typography.bodyLG,
    color: Colors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
  },
});
