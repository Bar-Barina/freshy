import Svg, { Circle, Rect, Path, G } from 'react-native-svg';
import type { FreshnessBand } from '@/types';
import { getBandLightColor } from '@/theme';

interface BedIllustrationProps {
  band: FreshnessBand;
  size?: number;
}

interface BedPalette {
  sheet: string;
  sheetFold: string;
  pillow: string;
  pillowShadow: string;
}

const PALETTES: Record<FreshnessBand, BedPalette> = {
  fresh: {
    sheet: '#F0F4F8',
    sheetFold: '#DCE4EC',
    pillow: '#FFFFFF',
    pillowShadow: '#E8EDF2',
  },
  ok: {
    sheet: '#E8ECF0',
    sheetFold: '#D0D8E0',
    pillow: '#F8F8FA',
    pillowShadow: '#DDE2E8',
  },
  soon: {
    sheet: '#DFE0D8',
    sheetFold: '#C8CAC0',
    pillow: '#EBE8E2',
    pillowShadow: '#D4D0C8',
  },
  warning: {
    sheet: '#D0CCC4',
    sheetFold: '#B8B4AA',
    pillow: '#DDD8D0',
    pillowShadow: '#C4BEB4',
  },
  biohazard: {
    sheet: '#C0BAB0',
    sheetFold: '#A8A298',
    pillow: '#CAC4BC',
    pillowShadow: '#B0A89E',
  },
};

const FRAME_DARK = '#6B7280';
const FRAME_MID = '#9CA3AF';
const FRAME_LIGHT = '#D1D5DB';
const MATTRESS = '#F9FAFB';

/**
 * SVG bed illustration — modern hotel-style with grey frame.
 * 5 freshness states: crisp white sheets degrade to wrinkled/dingy.
 */
export function BedIllustration({ band, size = 160 }: BedIllustrationProps) {
  const palette = PALETTES[band];
  const bg = getBandLightColor(band);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="96" fill={bg} />

      {/* Frame shadow */}
      <Rect x="24" y="78" width="158" height="106" rx="10" fill={FRAME_DARK} opacity="0.15" />

      {/* Side rails */}
      <Rect x="20" y="72" width="14" height="102" rx="5" fill={FRAME_MID} />
      <Rect x="166" y="72" width="14" height="102" rx="5" fill={FRAME_MID} />

      {/* Headboard — rounded modern style */}
      <Rect x="20" y="30" width="160" height="52" rx="12" fill={FRAME_DARK} />
      <Rect x="24" y="34" width="152" height="44" rx="9" fill={FRAME_MID} />
      {/* Headboard accent stripe */}
      <Rect x="34" y="50" width="132" height="3" rx="1.5" fill={FRAME_LIGHT} opacity="0.5" />

      {/* Footboard */}
      <Rect x="20" y="166" width="160" height="10" rx="5" fill={FRAME_DARK} />
      <Rect x="24" y="167" width="152" height="7" rx="3.5" fill={FRAME_MID} />

      {/* Mattress */}
      <Rect x="34" y="72" width="132" height="96" rx="6" fill={MATTRESS} />

      {/* Duvet / sheet */}
      <Rect x="34" y="110" width="132" height="60" rx="6" fill={palette.sheet} />

      {/* Sheet fold */}
      <Rect x="34" y="110" width="132" height="14" rx="5" fill={palette.sheetFold} />
      <Rect x="42" y="112" width="56" height="3" rx="1.5" fill={palette.sheet} opacity="0.7" />

      {/* Left pillow */}
      <Rect x="44" y="80" width="48" height="24" rx="10" fill={palette.pillowShadow} />
      <Rect x="42" y="76" width="48" height="24" rx="10" fill={palette.pillow} />

      {/* Right pillow */}
      <Rect x="110" y="80" width="48" height="24" rx="10" fill={palette.pillowShadow} />
      <Rect x="108" y="76" width="48" height="24" rx="10" fill={palette.pillow} />

      {/* State overlays */}
      {band === 'fresh' && <FreshOverlay />}
      {band === 'ok' && <OkOverlay />}
      {band === 'soon' && <SoonOverlay />}
      {band === 'warning' && <WarningOverlay />}
      {band === 'biohazard' && <BiohazardOverlay />}
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

function FreshOverlay() {
  return (
    <G>
      <Sparkle cx={52} cy={52} r={8} color="#7DAF9C" />
      <Sparkle cx={150} cy={44} r={6} color="#7DAF9C" />
      <Sparkle cx={164} cy={100} r={5} color="#7DAF9C" />
      <Circle cx={38} cy={100} r={2} fill="#7DAF9C" opacity="0.45" />
      <Circle cx={164} cy={150} r={1.8} fill="#7DAF9C" opacity="0.4" />
      {/* Clean pillow creases */}
      <Path d="M 54 85 Q 62 82 70 85" stroke="#D8E4F0" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Path d="M 120 85 Q 128 82 136 85" stroke="#D8E4F0" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </G>
  );
}

function OkOverlay() {
  return (
    <G>
      {/* Light wrinkles on sheet */}
      <Path d="M 46 122 Q 62 117 78 122" stroke="#B8C0C8" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Path d="M 104 130 Q 122 125 140 130" stroke="#B8C0C8" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* Pillow creases */}
      <Path d="M 52 84 Q 62 81 72 84" stroke="#C8D0D8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M 118 84 Q 128 81 138 84" stroke="#C8D0D8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </G>
  );
}

function SoonOverlay() {
  return (
    <G>
      {/* Noticeable wrinkles */}
      <Path d="M 42 118 Q 58 112 74 118" stroke="#A0A898" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 86 128 Q 106 122 126 128" stroke="#A0A898" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 48 140 Q 68 134 88 140" stroke="#A0A898" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 118 144 Q 136 138 154 144" stroke="#A0A898" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Pillow creases */}
      <Path d="M 50 82 Q 58 79 66 82" stroke="#B0A8A0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Path d="M 56 88 Q 63 86 70 88" stroke="#B0A8A0" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <Path d="M 116 82 Q 124 79 132 82" stroke="#B0A8A0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </G>
  );
}

function WarningOverlay() {
  return (
    <G>
      {/* Heavy wavy wrinkles */}
      <Path d="M 40 116 Q 52 108 64 116 Q 76 124 88 116" stroke="#8A8078" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 86 128 Q 100 118 114 128 Q 128 138 142 128" stroke="#8A8078" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 42 140 Q 60 132 78 140 Q 96 148 114 140" stroke="#8A8078" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 106 152 Q 124 146 142 152" stroke="#8A8078" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 54 156 Q 76 150 98 156" stroke="#8A8078" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Dust spots */}
      <Circle cx={155} cy={92} r={3} fill="#9CA3AF" opacity="0.5" />
      <Circle cx={162} cy={86} r={2} fill="#9CA3AF" opacity="0.4" />
      {/* Deep pillow marks */}
      <Path d="M 48 82 Q 60 78 72 82" stroke="#948A80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M 54 88 Q 62 86 70 88" stroke="#948A80" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Path d="M 114 82 Q 126 78 138 82" stroke="#948A80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M 120 88 Q 128 86 136 88" stroke="#948A80" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </G>
  );
}

function BiohazardOverlay() {
  return (
    <G>
      {/* Chaotic heavy wrinkles */}
      <Path d="M 38 114 Q 52 104 66 114 Q 80 124 94 114" stroke="#7A726A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Path d="M 92 128 Q 108 116 124 128 Q 138 140 153 128" stroke="#7A726A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Path d="M 38 142 Q 58 132 78 142 Q 98 152 118 142" stroke="#7A726A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 106 156 Q 124 148 142 156" stroke="#7A726A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 50 160 Q 74 152 98 160" stroke="#7A726A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Stink/odor wavy lines */}
      <Path d="M 163 78 Q 169 70 163 62" stroke="#9CA080" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 170 82 Q 177 72 170 62" stroke="#9CA080" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M 157 75 Q 162 68 157 61" stroke="#9CA080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* SVG biohazard trefoil (simplified) */}
      <G opacity="0.7">
        <Circle cx={150} cy={114} r={4} fill="none" stroke="#8A8070" strokeWidth="1.8" />
        <Path d="M 150 110 Q 155 104 152 98" stroke="#8A8070" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Path d="M 146 116 Q 140 114 136 108" stroke="#8A8070" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Path d="M 154 116 Q 158 120 156 126" stroke="#8A8070" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </G>
      {/* Grungy pillow marks */}
      <Path d="M 46 82 Q 60 77 74 82" stroke="#8A8278" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d="M 52 88 Q 62 85 72 88" stroke="#8A8278" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Path d="M 112 82 Q 126 77 140 82" stroke="#8A8278" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Circle cx={54} cy={93} r={1.8} fill="#9A9088" opacity="0.4" />
      <Circle cx={126} cy={91} r={1.8} fill="#9A9088" opacity="0.4" />
    </G>
  );
}
