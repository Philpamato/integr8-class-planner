import { drillsDb } from './db';
import type { Drill, Style, AgeGroup, QuarterlyTheme, PlanPhase, DrillFocus } from './types';

// ─── Quarter helpers ──────────────────────────────────────────────────────────

const THEMES: QuarterlyTheme[] = [
  'Footwork & Movement',    // Q1: Jan–Mar
  'Defense & Guard',        // Q2: Apr–Jun
  'Attack & Combinations',  // Q3: Jul–Sep
  'Sparring & Application', // Q4: Oct–Dec
];

export function getCurrentQuarterlyTheme(): QuarterlyTheme {
  return THEMES[Math.floor(new Date().getMonth() / 3)];
}

export function getQuarterlyThemeForDate(date: Date): QuarterlyTheme {
  return THEMES[Math.floor(date.getMonth() / 3)];
}

// ─── Phase config ─────────────────────────────────────────────────────────────

interface PhaseConfig {
  name: string;
  focus: DrillFocus[];
  durationRatio: number;
  maxDrills: number;
  notes: string;
}

function getPhaseConfigs(theme: QuarterlyTheme): PhaseConfig[] {
  return [
    {
      name: 'Warm-Up',
      focus: ['warm-up', 'footwork'],
      durationRatio: 0.15,
      maxDrills: 2,
      notes: 'Get the body moving, raise heart rate, loosen joints.',
    },
    {
      name: 'Drilling',
      focus: themeToDrillFocus(theme),
      durationRatio: 0.25,
      maxDrills: 3,
      notes: `Quarterly focus: ${theme}. Repetition-based practice.`,
    },
    {
      name: 'Technique',
      focus: ['technique', 'attack', 'defense', 'combination'],
      durationRatio: 0.25,
      maxDrills: 2,
      notes: 'Introduce or refine a core technique for the class.',
    },
    {
      name: 'Conditioning',
      focus: ['conditioning'],
      durationRatio: 0.15,
      maxDrills: 2,
      notes: 'Build functional strength, endurance, and resilience.',
    },
    {
      name: 'Sparring / Application',
      focus: ['sparring', 'combination'],
      durationRatio: 0.12,
      maxDrills: 1,
      notes: 'Apply techniques in a controlled live setting.',
    },
    {
      name: 'Cool-Down',
      focus: ['cool-down'],
      durationRatio: 0.08,
      maxDrills: 1,
      notes: 'Reduce heart rate, stretch, and reflect on the class.',
    },
  ];
}

function themeToDrillFocus(theme: QuarterlyTheme): DrillFocus[] {
  switch (theme) {
    case 'Footwork & Movement':    return ['footwork'];
    case 'Defense & Guard':        return ['defense'];
    case 'Attack & Combinations':  return ['attack', 'combination'];
    case 'Sparring & Application': return ['sparring', 'combination'];
  }
}

// ─── Drill selection ──────────────────────────────────────────────────────────

function selectDrills(style: Style, focuses: DrillFocus[], max: number): Drill[] {
  const candidates = drillsDb.filter(
    d => focuses.includes(d.focus as DrillFocus) && (d.style === style || d.style === 'General')
  );
  // Shuffle and take up to max
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, max);
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generatePlan(
  style: Style,
  ageGroup: AgeGroup,
  classDuration: number,
  focusNotes: string,
  weekStart: string
): { phases: PlanPhase[]; theme: QuarterlyTheme; title: string } {
  const theme = getQuarterlyThemeForDate(new Date(weekStart));
  const phaseConfigs = getPhaseConfigs(theme);

  const phases: PlanPhase[] = phaseConfigs.map(config => ({
    name: config.name,
    duration: Math.round(classDuration * config.durationRatio),
    drills: selectDrills(style, config.focus, config.maxDrills),
    notes: config.notes,
  }));

  const weekLabel = new Date(weekStart).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const title = `${style} ${ageGroup} — ${theme} (w/c ${weekLabel})`;

  return { phases, theme, title };
}
