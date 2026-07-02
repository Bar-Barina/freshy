import Svg, {
  Circle,
  Rect,
  Path,
  G,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
import type { FreshnessBand } from '@/types';
import { getBandLightColor } from '@/theme';

interface BedIllustrationProps {
  band: FreshnessBand;
  size?: number;
}

interface BedPalette {
  sheet: string;
  sheetShadow: string;
  pillow: string;
  pillowShadow: string;
  duvet: string;
  duvetShadow: string;
  mattressTop: string;
  mattressSide: string;
}

type SkyMood = 'bright' | 'soft' | 'overcast' | 'storm';

const PALETTES: Record<FreshnessBand, BedPalette> = {
  fresh: {
    sheet: '#FFFFFF',
    sheetShadow: '#E8EDF2',
    pillow: '#FFFFFF',
    pillowShadow: '#E4E9EE',
    duvet: '#FFFFFF',
    duvetShadow: '#E0E6EC',
    mattressTop: '#FAFBFC',
    mattressSide: '#E8ECF0',
  },
  ok: {
    sheet: '#F5F5F5',
    sheetShadow: '#E0E4E8',
    pillow: '#F8F8F8',
    pillowShadow: '#DCDFE4',
    duvet: '#F2F2F0',
    duvetShadow: '#D8DDE2',
    mattressTop: '#F0F2F4',
    mattressSide: '#DDE2E8',
  },
  soon: {
    sheet: '#EDEBE8',
    sheetShadow: '#D4D0CA',
    pillow: '#EAE7E2',
    pillowShadow: '#CEC9C2',
    duvet: '#E8E4DE',
    duvetShadow: '#CCC6BE',
    mattressTop: '#E4E0DA',
    mattressSide: '#C8C2BA',
  },
  warning: {
    sheet: '#DDD8D0',
    sheetShadow: '#C0B8AE',
    pillow: '#D8D2CA',
    pillowShadow: '#B8B0A6',
    duvet: '#D4CEC4',
    duvetShadow: '#B4ACA2',
    mattressTop: '#CEC8BE',
    mattressSide: '#B0A89E',
  },
  biohazard: {
    sheet: '#C8C0B4',
    sheetShadow: '#A8A098',
    pillow: '#C0B8AE',
    pillowShadow: '#9A928A',
    duvet: '#BAB2A6',
    duvetShadow: '#9A9288',
    mattressTop: '#B4ACA2',
    mattressSide: '#908880',
  },
};

const SKY_MOOD: Record<FreshnessBand, SkyMood> = {
  fresh: 'bright',
  ok: 'bright',
  soon: 'soft',
  warning: 'overcast',
  biohazard: 'storm',
};

const SKY_GRADIENTS: Record<
  SkyMood,
  { top: string; mid: string; bottom: string; horizon: string }
> = {
  bright: { top: '#7EC8E8', mid: '#B8E0F0', bottom: '#F5E6C8', horizon: '#E8D4A8' },
  soft: { top: '#9AB8CC', mid: '#C4D4DE', bottom: '#E8E4DC', horizon: '#D0CCC4' },
  overcast: { top: '#7A8A9A', mid: '#A0ACB8', bottom: '#C8CED4', horizon: '#B0B8C0' },
  storm: { top: '#3D4A5C', mid: '#5A6878', bottom: '#788898', horizon: '#606E7E' },
};

const HEADBOARD = '#8A8278';
const HEADBOARD_INNER = '#A09890';
const CLIP_ID = 'bed-circle-clip';

/**
 * Bed-first scene: large centered bed from foot-of-bed view, subtle sky mood behind.
 * All artwork is clipped to the circle.
 */
export function BedIllustration({ band, size = 160 }: BedIllustrationProps) {
  const palette = PALETTES[band];
  const bg = getBandLightColor(band);
  const mood = SKY_MOOD[band];

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id={CLIP_ID}>
          <Circle cx="100" cy="100" r="96" />
        </ClipPath>
        <LinearGradient id={`sky-${band}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SKY_GRADIENTS[mood].top} />
          <Stop offset="0.55" stopColor={SKY_GRADIENTS[mood].mid} />
          <Stop offset="0.85" stopColor={SKY_GRADIENTS[mood].bottom} />
          <Stop offset="1" stopColor={SKY_GRADIENTS[mood].horizon} />
        </LinearGradient>
      </Defs>

      <Circle cx="100" cy="100" r="96" fill={bg} />

      <G clipPath={`url(#${CLIP_ID})`}>
        <RoomBackdrop band={band} skyId={`sky-${band}`} mood={mood} />
        <BedFrame palette={palette} />
        <Bedding band={band} palette={palette} mood={mood} />
      </G>
    </Svg>
  );
}

/** Soft sky wash + tiny window — mood only, not a focal point */
function RoomBackdrop({
  band,
  skyId,
  mood,
}: {
  band: FreshnessBand;
  skyId: string;
  mood: SkyMood;
}) {
  const dim = band === 'warning' || band === 'biohazard' ? 0.7 : 0.45;

  return (
    <G opacity={dim}>
      <Rect x="0" y="12" width="200" height="68" fill={`url(#${skyId})`} />

      <Rect x="34" y="38" width="20" height="24" rx="2" fill="#E8E4DC" />
      <Rect x="37" y="41" width="14" height="18" rx="1" fill={`url(#${skyId})`} />

      {mood === 'bright' && <Circle cx="47" cy="48" r="3.5" fill="#FFE8A0" opacity={0.85} />}
      {mood === 'storm' && (
        <Ellipse cx="45" cy="48" rx="6" ry="3" fill="#4A5568" opacity={0.5} />
      )}
    </G>
  );
}

/** Curved headboard + side rails + mattress — unmistakable bed silhouette */
function BedFrame({ palette }: { palette: BedPalette }) {
  return (
    <G>
      <Ellipse cx="100" cy="178" rx="76" ry="6" fill="#2D1B0E" opacity={0.07} />

      {/* Curved headboard with tufting */}
      <Path
        d="M 28 108 Q 100 68 172 108 L 172 112 Q 100 74 28 112 Z"
        fill={HEADBOARD}
      />
      <Path
        d="M 36 106 Q 100 78 164 106 L 164 110 Q 100 82 36 110 Z"
        fill={HEADBOARD_INNER}
      />
      <Path d="M 68 88 L 68 108" stroke="#7A7268" strokeWidth="1" opacity={0.45} />
      <Path d="M 100 82 L 100 108" stroke="#7A7268" strokeWidth="1" opacity={0.45} />
      <Path d="M 132 88 L 132 108" stroke="#7A7268" strokeWidth="1" opacity={0.45} />

      {/* Side rails */}
      <Path
        d="M 26 112 L 26 166"
        stroke={palette.sheetShadow}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M 174 112 L 174 166"
        stroke={palette.sheetShadow}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Mattress thickness (foot edge) */}
      <Path
        d="M 26 166 L 174 166 L 178 178 L 22 178 Z"
        fill={palette.mattressSide}
      />

      {/* Mattress top */}
      <Path
        d="M 24 112 L 176 112 L 174 166 L 26 166 Z"
        fill={palette.mattressTop}
      />

      {/* Sheet */}
      <Path
        d="M 26 114 L 174 114 L 172 162 L 28 162 Z"
        fill={palette.sheet}
      />
    </G>
  );
}

/** Horizontal quilt stitching — instant "made bed" read */
function QuiltLines({
  rows,
  color,
  wavy = false,
}: {
  rows: { y: number; x1: number; x2: number }[];
  color: string;
  wavy?: boolean;
}) {
  return (
    <G>
      {rows.map((row, i) => (
        <Path
          key={i}
          d={
            wavy
              ? `M ${row.x1} ${row.y} Q ${(row.x1 + row.x2) / 2} ${row.y + 2} ${row.x2} ${row.y}`
              : `M ${row.x1} ${row.y} L ${row.x2} ${row.y}`
          }
          stroke={color}
          strokeWidth="0.7"
          fill="none"
          opacity={0.38}
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

const QUILT_ROWS: Record<FreshnessBand, { y: number; x1: number; x2: number }[]> = {
  fresh: [
    { y: 132, x1: 34, x2: 166 },
    { y: 142, x1: 34, x2: 166 },
    { y: 152, x1: 34, x2: 166 },
    { y: 158, x1: 36, x2: 164 },
  ],
  ok: [
    { y: 132, x1: 36, x2: 164 },
    { y: 142, x1: 35, x2: 165 },
    { y: 152, x1: 36, x2: 164 },
    { y: 158, x1: 38, x2: 162 },
  ],
  soon: [
    { y: 134, x1: 40, x2: 162 },
    { y: 144, x1: 38, x2: 164 },
    { y: 154, x1: 42, x2: 160 },
    { y: 160, x1: 44, x2: 158 },
  ],
  warning: [
    { y: 136, x1: 44, x2: 160 },
    { y: 146, x1: 42, x2: 162 },
    { y: 156, x1: 46, x2: 158 },
    { y: 164, x1: 48, x2: 156 },
  ],
  biohazard: [
    { y: 136, x1: 48, x2: 158 },
    { y: 148, x1: 46, x2: 160 },
    { y: 160, x1: 50, x2: 154 },
    { y: 168, x1: 52, x2: 150 },
  ],
};

function Pillow({
  cx,
  cy,
  rx,
  ry,
  rotation,
  palette,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  palette: BedPalette;
}) {
  return (
    <G rotation={rotation} origin={`${cx}, ${cy}`}>
      <Ellipse cx={cx + 1} cy={cy + 2} rx={rx} ry={ry} fill={palette.pillowShadow} />
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={palette.pillow} />
      <Path
        d={`M ${cx - rx * 0.5} ${cy} Q ${cx} ${cy - ry * 0.35} ${cx + rx * 0.5} ${cy}`}
        stroke={palette.pillowShadow}
        strokeWidth="0.6"
        fill="none"
        opacity={0.4}
      />
    </G>
  );
}

function Sparkle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const s = r * 0.38;
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

interface BeddingConfig {
  pillowA: { cx: number; cy: number; rotation: number };
  pillowB: { cx: number; cy: number; rotation: number };
  duvetShadow: string;
  duvet: string;
  stains?: { cx: number; cy: number; rx: number; ry: number }[];
  sparkles?: boolean;
  stink?: boolean;
}

const BEDDING: Record<FreshnessBand, BeddingConfig> = {
  fresh: {
    pillowA: { cx: 68, cy: 104, rotation: -4 },
    pillowB: { cx: 132, cy: 104, rotation: 4 },
    duvetShadow:
      'M 30 128 L 170 128 Q 174 148 170 160 L 30 160 Q 26 148 30 128 Z',
    duvet: 'M 32 126 L 168 126 Q 172 146 168 158 L 32 158 Q 28 146 32 126 Z',
    sparkles: true,
  },
  ok: {
    pillowA: { cx: 64, cy: 105, rotation: -7 },
    pillowB: { cx: 136, cy: 103, rotation: 6 },
    duvetShadow:
      'M 32 128 L 168 126 Q 172 148 168 160 L 32 160 Q 28 148 32 128 Z',
    duvet: 'M 34 126 L 166 124 Q 170 146 166 158 L 34 158 Q 30 146 34 126 Z',
  },
  soon: {
    pillowA: { cx: 58, cy: 106, rotation: -12 },
    pillowB: { cx: 142, cy: 102, rotation: 10 },
    duvetShadow:
      'M 38 126 L 168 122 Q 172 150 160 162 L 34 160 Q 28 142 38 126 Z',
    duvet: 'M 40 124 L 166 120 Q 170 148 158 160 L 36 158 Q 30 140 40 124 Z',
    stains: [{ cx: 118, cy: 146, rx: 4, ry: 2.5 }],
  },
  warning: {
    pillowA: { cx: 52, cy: 108, rotation: 16 },
    pillowB: { cx: 148, cy: 100, rotation: -14 },
    duvetShadow:
      'M 42 124 L 168 118 Q 174 148 164 166 L 38 164 Q 30 140 42 124 Z',
    duvet: 'M 44 122 L 166 116 Q 172 146 162 164 L 40 162 Q 32 138 44 122 Z',
    stains: [
      { cx: 88, cy: 144, rx: 4.5, ry: 3 },
      { cx: 128, cy: 152, rx: 3.5, ry: 2.5 },
    ],
  },
  biohazard: {
    pillowA: { cx: 48, cy: 110, rotation: 22 },
    pillowB: { cx: 152, cy: 98, rotation: -18 },
    duvetShadow:
      'M 46 122 L 166 112 Q 174 148 162 170 L 42 166 Q 34 138 46 122 Z',
    duvet: 'M 48 120 L 164 110 Q 172 146 160 168 L 44 164 Q 36 136 48 120 Z',
    stains: [
      { cx: 76, cy: 140, rx: 5, ry: 3.5 },
      { cx: 110, cy: 150, rx: 6, ry: 4 },
      { cx: 144, cy: 136, rx: 5, ry: 3.5 },
    ],
    stink: true,
  },
};

function Bedding({
  band,
  palette,
  mood,
}: {
  band: FreshnessBand;
  palette: BedPalette;
  mood: SkyMood;
}) {
  const config = BEDDING[band];

  return (
    <G>
      <Pillow
        cx={config.pillowA.cx}
        cy={config.pillowA.cy}
        rx={30}
        ry={13}
        rotation={config.pillowA.rotation}
        palette={palette}
      />
      <Pillow
        cx={config.pillowB.cx}
        cy={config.pillowB.cy}
        rx={30}
        ry={13}
        rotation={config.pillowB.rotation}
        palette={palette}
      />

      <Path d={config.duvetShadow} fill={palette.duvetShadow} />
      <Path d={config.duvet} fill={palette.duvet} />

      <QuiltLines
        rows={QUILT_ROWS[band]}
        color={palette.duvetShadow}
        wavy={band === 'warning' || band === 'biohazard'}
      />

      {config.stains?.map((stain, i) => (
        <Ellipse
          key={i}
          cx={stain.cx}
          cy={stain.cy}
          rx={stain.rx}
          ry={stain.ry}
          fill="#A09484"
          opacity={0.45}
        />
      ))}

      {config.sparkles && (
        <>
          <Sparkle cx={142} cy={52} r={4} color="#7DAF9C" />
          <Sparkle cx={160} cy={64} r={3} color="#7DAF9C" />
        </>
      )}

      {config.stink && (
        <>
          <Path
            d="M 40 36 Q 44 28 40 22"
            stroke="#8A9078"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity={mood === 'storm' ? 0.7 : 0.4}
          />
          <Path
            d="M 50 38 Q 54 26 50 20"
            stroke="#8A9078"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity={mood === 'storm' ? 0.7 : 0.4}
          />
        </>
      )}
    </G>
  );
}
