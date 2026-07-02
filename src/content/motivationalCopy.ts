import type { Gender } from '@/types';

interface CopyContext {
  gender: Gender;
  hasPartner: boolean;
}

interface MotivationalLine {
  headline: string;
  subtext: string;
}

const FRESH_LINES: MotivationalLine[] = [
  { headline: 'Looking crisp!', subtext: 'Your bed is a cloud right now.' },
  { headline: 'Fresh as it gets', subtext: 'Nothing beats clean-sheet night.' },
  { headline: 'Hotel vibes', subtext: "You're basically on vacation." },
  { headline: 'Mint condition', subtext: 'Sleep tight tonight.' },
];

const FRESH_PARTNER_LINES: MotivationalLine[] = [
  { headline: 'Fresh for two', subtext: 'Your partner thanks you.' },
  { headline: 'Date night ready', subtext: 'Clean sheets, happy couple.' },
];

const OK_LINES: MotivationalLine[] = [
  { headline: 'Still going strong', subtext: "A few more days won't hurt." },
  { headline: 'Holding up', subtext: 'But the clock is ticking...' },
  { headline: 'Not bad', subtext: "You've got time." },
];

const SOON_LINES: MotivationalLine[] = [
  { headline: 'Getting there...', subtext: 'Maybe this weekend?' },
  { headline: 'The sheets are hinting', subtext: 'They want a wash.' },
  { headline: 'Almost time', subtext: 'Your future self will thank you.' },
];

const SOON_MALE_LINES: MotivationalLine[] = [
  { headline: 'Bro, come on', subtext: "It's not that hard." },
  { headline: 'King behavior would be...', subtext: '...changing those sheets.' },
];

const SOON_FEMALE_LINES: MotivationalLine[] = [
  { headline: "Girl, don't settle", subtext: 'You deserve fresh sheets.' },
  { headline: 'Self-care check', subtext: 'Clean sheets = better sleep.' },
];

const WARNING_LINES: MotivationalLine[] = [
  { headline: "It's been a while", subtext: 'No judgment. But... maybe today?' },
  { headline: 'Your bed misses you', subtext: 'Well, it misses clean you.' },
  { headline: 'Due for a refresh', subtext: "Let's reset the clock." },
];

const BIOHAZARD_LINES: MotivationalLine[] = [
  { headline: 'We need to talk', subtext: 'About those sheets.' },
  { headline: 'Science experiment?', subtext: "Let's end the study." },
  { headline: 'Emergency alert', subtext: 'Sheet change required ASAP.' },
];

type Band = 'fresh' | 'ok' | 'soon' | 'warning' | 'biohazard';

/**
 * Returns a motivational line personalized by gender and partner status.
 * Uses a seeded pick based on the day so users see the same line all day.
 */
export function getMotivationalLine(band: Band, context: CopyContext): MotivationalLine {
  const pool = buildPool(band, context);
  const dayIndex = Math.floor(Date.now() / 86400000) % pool.length;
  return pool[dayIndex];
}

function buildPool(band: Band, { gender, hasPartner }: CopyContext): MotivationalLine[] {
  switch (band) {
    case 'fresh':
      return hasPartner ? [...FRESH_LINES, ...FRESH_PARTNER_LINES] : FRESH_LINES;

    case 'ok':
      return OK_LINES;

    case 'soon': {
      const base = [...SOON_LINES];
      if (gender === 'male') base.push(...SOON_MALE_LINES);
      if (gender === 'female') base.push(...SOON_FEMALE_LINES);
      return base;
    }

    case 'warning':
      return WARNING_LINES;

    case 'biohazard':
      return BIOHAZARD_LINES;
  }
}
