import type { LucideIcon } from 'lucide-react-native';
import {
  PawPrint,
  Droplets,
  Thermometer,
  UtensilsCrossed,
  Users,
  Sparkles,
  HelpCircle,
} from 'lucide-react-native';
import type { BedOopsType } from '@/types';
import { DEFAULT_OOPS_PENALTIES } from '@/utils/freshnessCalculator';

export interface OopsPreset {
  type: BedOopsType;
  label: string;
  subtitle: string;
  icon: LucideIcon;
}

export const OOPS_PRESETS: OopsPreset[] = [
  {
    type: 'pet',
    label: 'Furry friend visited',
    subtitle: 'Paws were on the duvet',
    icon: PawPrint,
  },
  {
    type: 'sweaty',
    label: 'Hot sleeper hours',
    subtitle: 'It got warm in here',
    icon: Droplets,
  },
  {
    type: 'sick',
    label: 'Under-the-weather day',
    subtitle: 'Netflix and tissues energy',
    icon: Thermometer,
  },
  {
    type: 'ate_in_bed',
    label: 'Snacks happened',
    subtitle: 'Crumbs may have occurred',
    icon: UtensilsCrossed,
  },
  {
    type: 'guest',
    label: 'Someone crashed here',
    subtitle: 'Extra body, extra stories',
    icon: Users,
  },
  {
    type: 'skipped_shower',
    label: 'Straight-to-bed vibes',
    subtitle: 'No judgment, we promise',
    icon: Sparkles,
  },
  {
    type: 'custom',
    label: 'Something else',
    subtitle: 'Your bed, your plot twist',
    icon: HelpCircle,
  },
];

export function getOopsPenalty(type: BedOopsType): number {
  return DEFAULT_OOPS_PENALTIES[type] ?? 5;
}
