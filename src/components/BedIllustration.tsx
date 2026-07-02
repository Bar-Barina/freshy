import Svg, { Circle, Rect, Path, G, Ellipse } from 'react-native-svg';
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
}

const PALETTES: Record<FreshnessBand, BedPalette> = {
  fresh: {
    sheet: '#FFFFFF',
    sheetShadow: '#E8EDF2',
    pillow: '#FFFFFF',
    pillowShadow: '#E4E9EE',
    duvet: '#FFFFFF',
    duvetShadow: '#E0E6EC',
  },
  ok: {
    sheet: '#F5F5F5',
    sheetShadow: '#E0E4E8',
    pillow: '#F8F8F8',
    pillowShadow: '#DCDFE4',
    duvet: '#F2F2F0',
    duvetShadow: '#D8DDE2',
  },
  soon: {
    sheet: '#EDEBE8',
    sheetShadow: '#D4D0CA',
    pillow: '#EAE7E2',
    pillowShadow: '#CEC9C2',
    duvet: '#E8E4DE',
    duvetShadow: '#CCC6BE',
  },
  warning: {
    sheet: '#DDD8D0',
    sheetShadow: '#C0B8AE',
    pillow: '#D8D2CA',
    pillowShadow: '#B8B0A6',
    duvet: '#D4CEC4',
    duvetShadow: '#B4ACA2',
  },
  biohazard: {
    sheet: '#C8C0B4',
    sheetShadow: '#A8A098',
    pillow: '#C0B8AE',
    pillowShadow: '#9A928A',
    duvet: '#BAB2A6',
    duvetShadow: '#9A9288',
  },
};

const FRAME_DARK = '#6B7280';
const FRAME_MID = '#9CA3AF';
const FRAME_LIGHT = '#D1D5DB';
const MATTRESS = '#F9FAFB';

/**
 * SVG bed illustration with 5 visual states telling a degradation story.
 * Fresh = hotel-perfect, tucked. Biohazard = complete chaos.
 */
export function BedIllustration({ band, size = 160 }: BedIllustrationProps) {
  const palette = PALETTES[band];
  const bg = getBandLightColor(band);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="96" fill={bg} />

      {/* Frame shadow */}
      <Rect x="24" y="78" width="158" height="106" rx="10" fill={FRAME_DARK} opacity="0.12" />

      {/* Side rails */}
      <Rect x="20" y="72" width="14" height="102" rx="5" fill={FRAME_MID} />
      <Rect x="166" y="72" width="14" height="102" rx="5" fill={FRAME_MID} />

      {/* Headboard */}
      <Rect x="20" y="30" width="160" height="52" rx="12" fill={FRAME_DARK} />
      <Rect x="24" y="34" width="152" height="44" rx="9" fill={FRAME_MID} />
      <Rect x="34" y="50" width="132" height="3" rx="1.5" fill={FRAME_LIGHT} opacity="0.5" />

      {/* Footboard */}
      <Rect x="20" y="166" width="160" height="10" rx="5" fill={FRAME_DARK} />
      <Rect x="24" y="167" width="152" height="7" rx="3.5" fill={FRAME_MID} />

      {/* Mattress */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={MATTRESS} />

      {/* Per-state bed contents */}
      {band === 'fresh' && <FreshBed palette={palette} />}
      {band === 'ok' && <OkBed palette={palette} />}
      {band === 'soon' && <SoonBed palette={palette} />}
      {band === 'warning' && <WarningBed palette={palette} />}
      {band === 'biohazard' && <BiohazardBed palette={palette} />}
    </Svg>
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

/**
 * Fresh: Hotel-perfect. Everything tucked, symmetric, sparkling.
 */
function FreshBed({ palette }: { palette: BedPalette }) {
  return (
    <G>
      {/* Sheet — perfectly flat, tucked at foot */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={palette.sheet} />
      {/* Tuck line at foot */}
      <Path d="M 38 162 L 162 162" stroke={palette.sheetShadow} strokeWidth="1.5" strokeLinecap="round" />

      {/* Duvet — neat rectangle, perfectly centered */}
      <Rect x="36" y="104" width="128" height="54" rx="5" fill={palette.duvetShadow} />
      <Rect x="36" y="102" width="128" height="54" rx="5" fill={palette.duvet} />
      {/* Duvet fold line at top */}
      <Path d="M 40 106 L 160 106" stroke={palette.duvetShadow} strokeWidth="1.8" strokeLinecap="round" />
      {/* Subtle duvet texture line */}
      <Path d="M 50 126 Q 100 124 150 126" stroke={palette.duvetShadow} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Pillows — perfectly symmetric and plump */}
      <Rect x="44" y="78" width="48" height="22" rx="11" fill={palette.pillowShadow} />
      <Rect x="42" y="75" width="48" height="22" rx="11" fill={palette.pillow} />
      <Rect x="110" y="78" width="48" height="22" rx="11" fill={palette.pillowShadow} />
      <Rect x="108" y="75" width="48" height="22" rx="11" fill={palette.pillow} />

      {/* Sparkle accents — fresh and clean */}
      <Sparkle cx={50} cy={50} r={7} color="#7DAF9C" />
      <Sparkle cx={152} cy={44} r={5.5} color="#7DAF9C" />
      <Sparkle cx={168} cy={98} r={4.5} color="#7DAF9C" />
      <Circle cx={36} cy={98} r={2} fill="#7DAF9C" opacity="0.4" />
    </G>
  );
}

/**
 * Ok: Blanket shifted slightly right, one pillow tilted. Still clean.
 */
function OkBed({ palette }: { palette: BedPalette }) {
  return (
    <G>
      {/* Sheet — still mostly flat */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={palette.sheet} />

      {/* Duvet — shifted slightly right, soft curve */}
      <Path
        d="M 38 104 L 165 104 Q 168 104 168 107 L 168 154 Q 168 157 165 157 L 38 157 Q 35 157 35 154 L 35 107 Q 35 104 38 104 Z"
        fill={palette.duvetShadow}
      />
      <Path
        d="M 40 102 L 166 102 Q 169 102 169 105 L 169 152 Q 169 155 166 155 L 40 155 Q 37 155 37 152 L 37 105 Q 37 102 40 102 Z"
        fill={palette.duvet}
      />
      {/* Fold line */}
      <Path d="M 42 106 L 164 106" stroke={palette.duvetShadow} strokeWidth="1.6" strokeLinecap="round" />
      {/* Light wrinkle */}
      <Path d="M 60 124 Q 80 120 100 124" stroke={palette.duvetShadow} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Pillows — left normal, right tilted slightly */}
      <Rect x="44" y="78" width="48" height="22" rx="11" fill={palette.pillowShadow} />
      <Rect x="42" y="75" width="48" height="22" rx="11" fill={palette.pillow} />
      {/* Right pillow slightly rotated */}
      <G rotation={3} origin="132, 87">
        <Rect x="110" y="79" width="48" height="22" rx="11" fill={palette.pillowShadow} />
        <Rect x="108" y="76" width="48" height="22" rx="11" fill={palette.pillow} />
      </G>

      {/* Subtle pillow crease */}
      <Path d="M 118 84 Q 128 81 138 84" stroke={palette.pillowShadow} strokeWidth="1" fill="none" strokeLinecap="round" />
    </G>
  );
}

/**
 * Soon: Blanket pulled to one side, untucked from foot. Wrinkles visible.
 * One stain mark. Pillows pushed apart.
 */
function SoonBed({ palette }: { palette: BedPalette }) {
  return (
    <G>
      {/* Sheet — showing some wrinkles */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={palette.sheet} />
      {/* Sheet wrinkles */}
      <Path d="M 50 130 Q 66 126 82 130" stroke={palette.sheetShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M 110 138 Q 130 134 150 138" stroke={palette.sheetShadow} strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Duvet — pulled toward right side, hanging off edge slightly */}
      <Path
        d={`M 44 106 C 60 104 130 100 170 106 L 172 150 C 170 156 140 158 100 156 C 60 154 40 152 38 148 L 44 106 Z`}
        fill={palette.duvetShadow}
      />
      <Path
        d={`M 46 104 C 62 102 132 98 170 104 L 172 148 C 170 154 140 156 100 154 C 60 152 42 150 40 146 L 46 104 Z`}
        fill={palette.duvet}
      />
      {/* Fold line — uneven */}
      <Path d="M 50 108 Q 100 104 166 108" stroke={palette.duvetShadow} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Wrinkle lines on duvet */}
      <Path d="M 60 120 Q 80 116 100 120 Q 120 124 140 120" stroke={palette.duvetShadow} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Path d="M 70 134 Q 95 130 120 134" stroke={palette.duvetShadow} strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* One stain mark */}
      <Ellipse cx={125} cy={140} rx={4} ry={3} fill="#C4B8A8" opacity="0.5" />

      {/* Pillows — pushed apart, left one shifted left, right shifted right + rotated */}
      <Rect x="38" y="79" width="46" height="21" rx="10" fill={palette.pillowShadow} />
      <Rect x="36" y="76" width="46" height="21" rx="10" fill={palette.pillow} />
      <G rotation={-5} origin="140, 86">
        <Rect x="118" y="80" width="46" height="21" rx="10" fill={palette.pillowShadow} />
        <Rect x="116" y="77" width="46" height="21" rx="10" fill={palette.pillow} />
      </G>
      {/* Pillow creases */}
      <Path d="M 46 84 Q 54 81 62 84" stroke={palette.pillowShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M 126 84 Q 134 82 142 84" stroke={palette.pillowShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </G>
  );
}

/**
 * Warning: Blanket bunched up and hanging off right side. Multiple stains.
 * Pillows flat and rotated. Deep creases.
 */
function WarningBed({ palette }: { palette: BedPalette }) {
  return (
    <G>
      {/* Sheet — wrinkled and exposed */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={palette.sheet} />
      {/* Sheet wrinkles */}
      <Path d="M 42 118 Q 58 112 74 118" stroke={palette.sheetShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 50 134 Q 70 128 90 134" stroke={palette.sheetShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M 42 150 Q 60 144 78 150" stroke={palette.sheetShadow} strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* Stain on exposed sheet */}
      <Ellipse cx={65} cy={142} rx={5} ry={3.5} fill="#C4B4A0" opacity="0.45" />

      {/* Duvet — bunched right, hanging over edge, asymmetric blob shape */}
      <Path
        d={`M 56 108 C 80 102 140 96 176 108 C 180 120 178 140 174 152 C 168 160 130 162 105 158 C 80 154 56 148 50 140 C 44 132 48 118 56 108 Z`}
        fill={palette.duvetShadow}
      />
      <Path
        d={`M 58 106 C 82 100 142 94 176 106 C 180 118 178 138 174 150 C 168 158 130 160 105 156 C 80 152 58 146 52 138 C 46 130 50 116 58 106 Z`}
        fill={palette.duvet}
      />
      {/* Heavy wrinkle lines on duvet */}
      <Path d="M 70 114 Q 90 108 110 114 Q 130 120 150 114" stroke={palette.duvetShadow} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 80 128 Q 105 122 130 128 Q 150 134 165 128" stroke={palette.duvetShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 72 140 Q 95 134 118 140" stroke={palette.duvetShadow} strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Stains on duvet */}
      <Ellipse cx={130} cy={120} rx={4.5} ry={3} fill="#B8A894" opacity="0.5" />
      <Ellipse cx={150} cy={138} rx={3.5} ry={2.5} fill="#B8A894" opacity="0.4" />

      {/* Pillows — flattened, rotated, displaced */}
      <G rotation={8} origin="56, 84">
        <Rect x="34" y="79" width="44" height="18" rx="9" fill={palette.pillowShadow} />
        <Rect x="33" y="76" width="44" height="18" rx="9" fill={palette.pillow} />
      </G>
      <G rotation={-12} origin="140, 84">
        <Rect x="120" y="80" width="44" height="18" rx="9" fill={palette.pillowShadow} />
        <Rect x="118" y="77" width="44" height="18" rx="9" fill={palette.pillow} />
      </G>
      {/* Deep pillow creases */}
      <Path d="M 40 82 Q 52 78 64 82" stroke={palette.pillowShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 44 87 Q 52 85 60 87" stroke={palette.pillowShadow} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <Path d="M 126 82 Q 138 78 150 82" stroke={palette.pillowShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </G>
  );
}

/**
 * Biohazard: Complete chaos. Blanket mostly off, twisted. Stains on mattress.
 * Pillows sideways. Stink lines.
 */
function BiohazardBed({ palette }: { palette: BedPalette }) {
  return (
    <G>
      {/* Sheet — heavily wrinkled, stains visible on mattress */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={palette.sheet} />
      {/* Mattress/sheet stains */}
      <Ellipse cx={60} cy={110} rx={5} ry={4} fill="#B0A494" opacity="0.5" />
      <Ellipse cx={100} cy={148} rx={6} ry={4} fill="#B0A494" opacity="0.4" />
      <Ellipse cx={140} cy={125} rx={4} ry={3} fill="#B0A494" opacity="0.35" />
      {/* Heavy sheet wrinkles (chaotic) */}
      <Path d="M 38 110 Q 52 104 66 110 Q 80 116 94 110" stroke={palette.sheetShadow} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 48 130 Q 68 124 88 130" stroke={palette.sheetShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 100 140 Q 120 134 140 140" stroke={palette.sheetShadow} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Path d="M 44 152 Q 64 146 84 152" stroke={palette.sheetShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Duvet — mostly off the bed, twisted, hanging off right side dramatically */}
      <Path
        d={`M 80 110 C 110 100 160 92 184 108 C 188 124 184 148 178 158 C 170 168 140 166 115 162 C 90 158 75 150 70 140 C 65 130 68 118 80 110 Z`}
        fill={palette.duvetShadow}
      />
      <Path
        d={`M 82 108 C 112 98 162 90 184 106 C 188 122 184 146 178 156 C 170 166 140 164 115 160 C 90 156 77 148 72 138 C 67 128 70 116 82 108 Z`}
        fill={palette.duvet}
      />
      {/* Chaotic duvet wrinkles */}
      <Path d="M 90 114 Q 110 106 130 114 Q 150 122 170 114" stroke={palette.duvetShadow} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M 95 130 Q 120 122 145 130 Q 160 138 175 130" stroke={palette.duvetShadow} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 88 144 Q 110 136 132 144" stroke={palette.duvetShadow} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Duvet stain */}
      <Ellipse cx={140} cy={125} rx={5} ry={3.5} fill="#A09484" opacity="0.5" />

      {/* Pillows — one sideways, one displaced off-center, both flat */}
      <G rotation={25} origin="50, 84">
        <Rect x="30" y="78" width="40" height="16" rx="8" fill={palette.pillowShadow} />
        <Rect x="29" y="75" width="40" height="16" rx="8" fill={palette.pillow} />
      </G>
      <G rotation={-18} origin="130, 80">
        <Rect x="110" y="74" width="42" height="16" rx="8" fill={palette.pillowShadow} />
        <Rect x="109" y="71" width="42" height="16" rx="8" fill={palette.pillow} />
      </G>

      {/* Stink / odor wavy lines */}
      <Path d="M 163 72 Q 169 64 163 56" stroke="#9CA080" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 170 76 Q 176 66 170 56" stroke="#9CA080" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 157 69 Q 162 62 157 55" stroke="#9CA080" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Extra chaos: a corner of sheet dangling */}
      <Path d="M 34 155 Q 28 160 30 168" stroke={palette.sheetShadow} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </G>
  );
}
