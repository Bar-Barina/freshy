import Svg, { Circle, Rect, Path, G, Text as SvgText } from 'react-native-svg';
import type { FreshnessBand } from '@/types';
import { getBandLightColor } from '@/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BedIllustrationProps {
  band: FreshnessBand;
  /** Rendered size in logical pixels. Defaults to 160. */
  size?: number;
}

// ─── Per-state color palettes ─────────────────────────────────────────────────

interface BedPalette {
  sheet: string;
  sheetFold: string;
  pillow: string;
  pillowShadow: string;
}

const PALETTES: Record<FreshnessBand, BedPalette> = {
  fresh: {
    sheet: '#BFE3F5',
    sheetFold: '#9ACFEC',
    pillow: '#FFFFFF',
    pillowShadow: '#E0F0FA',
  },
  ok: {
    sheet: '#EEE4C0',
    sheetFold: '#DDD0A0',
    pillow: '#FAF6EE',
    pillowShadow: '#E8DEC8',
  },
  soon: {
    sheet: '#F0D09A',
    sheetFold: '#E0BC78',
    pillow: '#EDE4D4',
    pillowShadow: '#D8C8A8',
  },
  warning: {
    sheet: '#D4B490',
    sheetFold: '#C0A070',
    pillow: '#D4CCBC',
    pillowShadow: '#BEB0A0',
  },
  biohazard: {
    sheet: '#C4B080',
    sheetFold: '#A89860',
    pillow: '#B8B0A4',
    pillowShadow: '#A09890',
  },
};

// ─── Wood colors (shared across all states) ───────────────────────────────────

const WOOD_DARK = '#9E6B42';
const WOOD_MID = '#C4956A';
const WOOD_LIGHT = '#D4A880';
const MATTRESS = '#F5E6D3';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SVG bed illustration with 5 distinct visual states tied to freshness bands.
 * Uses a front-view perspective with headboard, pillows, and duvet.
 * Built with react-native-svg primitives — no images, no web SVG files.
 */
export function BedIllustration({ band, size = 160 }: BedIllustrationProps) {
  const palette = PALETTES[band];
  const bg = getBandLightColor(band);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* ── Background circle ─────────────────────────────────────── */}
      <Circle cx="100" cy="100" r="96" fill={bg} />

      {/* ── Bed frame shadow (depth) ──────────────────────────────── */}
      <Rect x="24" y="78" width="158" height="106" rx="12" fill={WOOD_DARK} opacity="0.25" />

      {/* ── Side rails ────────────────────────────────────────────── */}
      <Rect x="20" y="72" width="18" height="102" rx="6" fill={WOOD_MID} />
      <Rect x="162" y="72" width="18" height="102" rx="6" fill={WOOD_MID} />

      {/* ── Headboard ─────────────────────────────────────────────── */}
      <Rect x="20" y="28" width="160" height="56" rx="14" fill={WOOD_DARK} />
      <Rect x="24" y="32" width="152" height="52" rx="11" fill={WOOD_MID} />
      {/* Headboard sheen */}
      <Rect x="36" y="40" width="44" height="9" rx="4" fill={WOOD_LIGHT} opacity="0.55" />

      {/* ── Footboard ─────────────────────────────────────────────── */}
      <Rect x="20" y="164" width="160" height="14" rx="7" fill={WOOD_DARK} />
      <Rect x="24" y="165" width="152" height="11" rx="5" fill={WOOD_MID} />

      {/* ── Mattress ──────────────────────────────────────────────── */}
      <Rect x="38" y="72" width="124" height="96" rx="6" fill={MATTRESS} />

      {/* ── Duvet/sheet (lower half) ──────────────────────────────── */}
      <Rect x="38" y="108" width="124" height="62" rx="6" fill={palette.sheet} />

      {/* ── Sheet fold edge ───────────────────────────────────────── */}
      <Rect x="38" y="108" width="124" height="16" rx="5" fill={palette.sheetFold} />
      {/* Fold highlight */}
      <Rect x="46" y="110" width="60" height="4" rx="2" fill={palette.sheet} opacity="0.6" />

      {/* ── Pillows ───────────────────────────────────────────────── */}
      {/* Left pillow shadow */}
      <Rect x="44" y="80" width="50" height="26" rx="10" fill={palette.pillowShadow} />
      {/* Left pillow body */}
      <Rect x="42" y="76" width="50" height="26" rx="10" fill={palette.pillow} />
      {/* Right pillow shadow */}
      <Rect x="108" y="80" width="50" height="26" rx="10" fill={palette.pillowShadow} />
      {/* Right pillow body */}
      <Rect x="106" y="76" width="50" height="26" rx="10" fill={palette.pillow} />

      {/* ── State-specific overlays ───────────────────────────────── */}
      {band === 'fresh' && <FreshOverlay />}
      {band === 'ok' && <OkOverlay />}
      {band === 'soon' && <SoonOverlay />}
      {band === 'warning' && <WarningOverlay />}
      {band === 'biohazard' && <BiohazardOverlay />}
    </Svg>
  );
}

// ─── State overlay components ─────────────────────────────────────────────────

/**
 * 4-pointed sparkle star centered at (cx, cy) with outer radius r.
 */
function Sparkle({
  cx,
  cy,
  r,
  color,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
}) {
  const s = r * 0.38;
  // Quadratic bezier-based 4-point star
  const d = [
    `M ${cx} ${cy - r}`,
    `Q ${cx + s} ${cy - s} ${cx + r} ${cy}`,
    `Q ${cx + s} ${cy + s} ${cx} ${cy + r}`,
    `Q ${cx - s} ${cy + s} ${cx - r} ${cy}`,
    `Q ${cx - s} ${cy - s} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');
  return <Path d={d} fill={color} />;
}

/** Fresh state — crisp pillows, sparkle stars, no wrinkles. */
function FreshOverlay() {
  return (
    <G>
      <Sparkle cx={55} cy={54} r={9} color="#FFD700" />
      <Sparkle cx={148} cy={46} r={7} color="#FFD700" />
      <Sparkle cx={160} cy={102} r={6} color="#FFD700" />
      {/* Tiny accent dots */}
      <Circle cx={40} cy={102} r={2.5} fill="#7DAF9C" opacity="0.5" />
      <Circle cx={162} cy={148} r={2} fill="#7DAF9C" opacity="0.45" />
      {/* Pillow crease (clean single line) */}
      <Path
        d="M 54 85 Q 62 82 70 85"
        stroke="#D0EEFA"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 118 85 Q 126 82 134 85"
        stroke="#D0EEFA"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Ok state — slight wrinkles beginning to appear; still clean-looking. */
function OkOverlay() {
  return (
    <G>
      {/* Subtle sheet wrinkles */}
      <Path
        d="M 48 122 Q 64 117 80 122"
        stroke="#C8B880"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 102 130 Q 122 125 142 130"
        stroke="#C8B880"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Light pillow creases */}
      <Path
        d="M 52 84 Q 62 81 72 84"
        stroke="#D8CEAC"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 116 84 Q 126 81 136 84"
        stroke="#D8CEAC"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Soon state — noticeable wrinkles; pillows look slept-on. */
function SoonOverlay() {
  return (
    <G>
      {/* Multiple sheet wrinkle lines */}
      <Path
        d="M 44 118 Q 60 112 76 118"
        stroke="#C0A060"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 88 128 Q 110 122 132 128"
        stroke="#C0A060"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 50 140 Q 72 134 94 140"
        stroke="#C0A060"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 118 144 Q 138 138 155 144"
        stroke="#C0A060"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Pillow creases */}
      <Path
        d="M 50 82 Q 58 79 66 82"
        stroke="#B8A888"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 58 88 Q 65 86 72 88"
        stroke="#B8A888"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 114 82 Q 122 79 130 82"
        stroke="#B8A888"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Warning state — heavy wrinkles, dusty look, dingy pillows. */
function WarningOverlay() {
  return (
    <G>
      {/* Heavy wavy wrinkles */}
      <Path
        d="M 42 116 Q 54 108 66 116 Q 78 124 90 116"
        stroke="#9C7448"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 88 128 Q 102 118 116 128 Q 130 138 144 128"
        stroke="#9C7448"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 44 140 Q 62 132 80 140 Q 98 148 116 140"
        stroke="#9C7448"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 108 153 Q 126 146 144 153"
        stroke="#9C7448"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 56 156 Q 78 150 100 156"
        stroke="#9C7448"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Dust particle cluster top-right */}
      <Circle cx={153} cy={93} r={3.5} fill="#C0A080" opacity="0.65" />
      <Circle cx={160} cy={88} r={2.5} fill="#C0A080" opacity="0.5" />
      <Circle cx={148} cy={90} r={2} fill="#C0A080" opacity="0.55" />
      {/* Dingy pillow marks */}
      <Path
        d="M 48 82 Q 60 78 72 82"
        stroke="#A09078"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 54 88 Q 62 86 70 88"
        stroke="#A09078"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 112 82 Q 124 78 136 82"
        stroke="#A09078"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 118 88 Q 126 86 134 88"
        stroke="#A09078"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

/** Biohazard state — dramatic wrinkles, stink lines, biohazard symbol. Cute but ominous. */
function BiohazardOverlay() {
  return (
    <G>
      {/* Very heavy chaotic wrinkles */}
      <Path
        d="M 40 114 Q 54 104 68 114 Q 82 124 96 114"
        stroke="#8C6840"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 94 128 Q 110 116 126 128 Q 140 140 155 128"
        stroke="#8C6840"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 40 142 Q 60 132 80 142 Q 100 152 120 142"
        stroke="#8C6840"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 108 156 Q 126 148 144 156"
        stroke="#8C6840"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 52 160 Q 76 152 100 160"
        stroke="#8C6840"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stink/odor lines wavy (top-right corner) */}
      <Path
        d="M 163 78 Q 169 70 163 62"
        stroke="#9C9868"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 170 82 Q 177 72 170 62"
        stroke="#9C9868"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 157 75 Q 162 68 157 61"
        stroke="#9C9868"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Biohazard emoji — universally understood, cute at small size */}
      <SvgText
        x="150"
        y="120"
        fontSize="18"
        textAnchor="middle"
        fill="#9C9060"
        opacity="0.85"
      >
        ☣
      </SvgText>
      {/* Grungy pillow marks */}
      <Path
        d="M 46 82 Q 60 77 74 82"
        stroke="#9A9082"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 52 88 Q 62 85 72 88"
        stroke="#9A9082"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 110 82 Q 124 77 138 82"
        stroke="#9A9082"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={54} cy={93} r={2} fill="#A09080" opacity="0.45" />
      <Circle cx={124} cy={91} r={2} fill="#A09080" opacity="0.45" />
    </G>
  );
}
