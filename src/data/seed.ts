/**
 * Seed script — run with: npm run db:seed
 * Writes the initial drill library to data/drills.json
 */
import { drillsDb } from '../lib/db';

const drills = [
  // ── Warm-Up ──────────────────────────────────────────────────────────────
  { name: 'Shadow Boxing',              style: 'General', focus: 'warm-up',     difficulty: 'beginner',     duration: 3, instructions: '3 rounds of 1 min light shadow boxing. Focus on movement, not power.', equipment: '' },
  { name: 'Jump Rope',                  style: 'General', focus: 'warm-up',     difficulty: 'beginner',     duration: 3, instructions: 'Continuous skipping for 3 minutes. Vary footwork between rounds.',        equipment: 'Jump rope' },
  { name: 'Dynamic Stretching Circuit', style: 'General', focus: 'warm-up',     difficulty: 'beginner',     duration: 5, instructions: 'Leg swings, arm circles, hip rotations, high knees. 30 sec each.',        equipment: '' },
  { name: 'Partner Tag',                style: 'General', focus: 'warm-up',     difficulty: 'beginner',     duration: 3, instructions: "Pairs try to touch each other's shoulders while defending.",               equipment: '' },

  // ── Cool-Down ────────────────────────────────────────────────────────────
  { name: 'Static Stretching',          style: 'General', focus: 'cool-down',   difficulty: 'beginner',     duration: 5, instructions: 'Hold each stretch 20–30 sec. Focus: hamstrings, quads, hips, shoulders.', equipment: '' },
  { name: 'Breathing & Mindset',        style: 'General', focus: 'cool-down',   difficulty: 'beginner',     duration: 3, instructions: 'Seated. Coach asks 1–2 questions about what was learned. Finish with bow-out.', equipment: '' },

  // ── Conditioning ─────────────────────────────────────────────────────────
  { name: 'Burpee Rounds',              style: 'General', focus: 'conditioning', difficulty: 'intermediate', duration: 4, instructions: '3 x 30-sec burpee sets with 20-sec rest. Modify for beginners.',           equipment: '' },
  { name: 'Core Circuit',               style: 'General', focus: 'conditioning', difficulty: 'beginner',     duration: 5, instructions: 'Plank 30s, sit-ups x 20, leg raises x 15. 2 rounds.',                      equipment: '' },
  { name: 'Shuttle Runs',               style: 'General', focus: 'conditioning', difficulty: 'intermediate', duration: 4, instructions: '5m sprint, touch, return x 6. Builds explosive footwork and cardio.',       equipment: '' },

  // ── Footwork ─────────────────────────────────────────────────────────────
  { name: 'Box Step Drill',             style: 'General', focus: 'footwork',    difficulty: 'beginner',     duration: 5, instructions: 'Step forward-right-back-left in a square. Maintain guard and posture.',     equipment: '' },
  { name: 'Cone Weave',                 style: 'General', focus: 'footwork',    difficulty: 'beginner',     duration: 4, instructions: 'Set 5 cones 1m apart. Weave in and out x 4. Add a strike at the end.',      equipment: 'Cones' },
  { name: 'Angle Exit Drill',           style: 'General', focus: 'footwork',    difficulty: 'intermediate', duration: 5, instructions: 'Partner jabs, defender exits at 45° angle alternating. No crossing feet.',   equipment: '' },

  // ── Defense ──────────────────────────────────────────────────────────────
  { name: 'Slip & Roll',                style: 'General', focus: 'defense',     difficulty: 'intermediate', duration: 5, instructions: 'Partner throws slow punches, defender slips inside and outside. 2 min each side.', equipment: '' },
  { name: 'Parry Drills',               style: 'General', focus: 'defense',     difficulty: 'beginner',     duration: 4, instructions: 'One feeds straight punches, other parries with rear hand. Switch after 1 min.', equipment: '' },
  { name: 'Cover & Counter',            style: 'General', focus: 'defense',     difficulty: 'intermediate', duration: 5, instructions: 'Block incoming hook with high cover, immediately return with 2-punch counter.', equipment: 'Gloves, pads' },

  // ── Attack / Combination ─────────────────────────────────────────────────
  { name: 'Jab-Cross-Hook',             style: 'General', focus: 'combination', difficulty: 'beginner',     duration: 4, instructions: 'On pads or bag: Jab → Cross → Hook. 3 x 1-min rounds.',                     equipment: 'Gloves, pads or bag' },
  { name: '4-Punch Combination',        style: 'General', focus: 'combination', difficulty: 'intermediate', duration: 5, instructions: 'Jab → Cross → Lead Hook → Rear Uppercut. Emphasise hip rotation.',           equipment: 'Gloves, pads' },
  { name: 'Feint & Attack',             style: 'General', focus: 'attack',      difficulty: 'intermediate', duration: 5, instructions: 'Fake jab then attack with cross or hook. 2 min rounds on pads.',              equipment: 'Gloves, pads' },

  // ── Boxing ───────────────────────────────────────────────────────────────
  { name: 'Jab Mechanics',              style: 'Boxing',  focus: 'technique',   difficulty: 'beginner',     duration: 5, instructions: 'Break down the jab: extension, shoulder roll, snap back. Mirror or shadowbox.', equipment: '' },
  { name: 'Bob & Weave',                style: 'Boxing',  focus: 'technique',   difficulty: 'intermediate', duration: 5, instructions: "Dip under a string or partner's arm. Practice U-shape movement. 3 x 1-min.",  equipment: 'String or partner' },
  { name: 'Body Shot Setup',            style: 'Boxing',  focus: 'technique',   difficulty: 'intermediate', duration: 5, instructions: 'Jab to head then drop and cross to body. Bend knees, not waist.',              equipment: 'Gloves, pads' },
  { name: 'Southpaw vs Orthodox',       style: 'Boxing',  focus: 'sparring',    difficulty: 'advanced',     duration: 8, instructions: 'Pair southpaw and orthodox. Controlled 2-min rounds, focus stance advantages.', equipment: 'Gloves, mouthguards, headgear' },

  // ── Karate ───────────────────────────────────────────────────────────────
  { name: 'Kihon Blocks & Strikes',     style: 'Karate',  focus: 'technique',   difficulty: 'beginner',     duration: 6, instructions: 'Line drill: gedan barai, age uke, gyaku-zuki. Count and correct in unison.',   equipment: '' },
  { name: 'Kata Breakdown',             style: 'Karate',  focus: 'technique',   difficulty: 'intermediate', duration: 8, instructions: 'Focus on 1 kata sequence (4–6 moves). Break into bunkai with a partner.',      equipment: '' },
  { name: 'Kumite Entry Drill',         style: 'Karate',  focus: 'sparring',    difficulty: 'intermediate', duration: 6, instructions: 'From fighting stance: entry jab or gyaku-zuki + exit. Alternate 1-min rounds.', equipment: 'Gloves, mouthguards' },
  { name: 'Maai (Distance Control)',    style: 'Karate',  focus: 'footwork',    difficulty: 'beginner',     duration: 4, instructions: 'Partners maintain correct fighting distance while moving. One leads, one mirrors.', equipment: '' },
  { name: 'Karate Defence Sequence',    style: 'Karate',  focus: 'defense',     difficulty: 'beginner',     duration: 5, instructions: 'Partner attacks with gyaku-zuki, defender uses age uke then counters. 10 reps each side.', equipment: '' },

  // ── Muay Thai ────────────────────────────────────────────────────────────
  { name: 'Thai Kick Mechanics',        style: 'Muay Thai', focus: 'technique', difficulty: 'beginner',     duration: 6, instructions: 'Slow breakdown: pivot foot, hip rotation, shin contact. Repeat both sides.',   equipment: 'Thai pads or bag' },
  { name: 'Teep (Push Kick)',           style: 'Muay Thai', focus: 'attack',    difficulty: 'beginner',     duration: 4, instructions: 'Chamber, extend, push through. 2 x 1-min each leg.',                          equipment: 'Pad or belly pad' },
  { name: 'Clinch Entry & Knee',        style: 'Muay Thai', focus: 'technique', difficulty: 'intermediate', duration: 6, instructions: 'Jab-cross, close to clinch, deliver 2 controlled knees, exit with push.',      equipment: 'Gloves, shin guards' },
  { name: 'Low Kick Counter',           style: 'Muay Thai', focus: 'defense',   difficulty: 'intermediate', duration: 5, instructions: "Check partner's low kick, immediately counter with your own. 2 min each side.", equipment: 'Shin guards, gloves' },
  { name: 'Muay Thai Sparring',         style: 'Muay Thai', focus: 'sparring',  difficulty: 'advanced',     duration: 8, instructions: 'Light technical rounds — punches, kicks, knees. Controlled intent.',            equipment: 'Full sparring gear' },

  // ── BJJ ──────────────────────────────────────────────────────────────────
  { name: 'Guard Passing Drill',        style: 'BJJ',     focus: 'technique',   difficulty: 'intermediate', duration: 6, instructions: 'Torreando or knee-slice pass. Guard player frames and moves hips. 3 min each.', equipment: 'Gi or no-gi' },
  { name: 'Hip Escape (Shrimping)',     style: 'BJJ',     focus: 'footwork',    difficulty: 'beginner',     duration: 4, instructions: 'Solo shrimping down the mat. Push off one leg and turn hips. 3 lengths.',       equipment: 'Mat' },
  { name: 'Armbar from Guard',          style: 'BJJ',     focus: 'technique',   difficulty: 'intermediate', duration: 7, instructions: 'Control posture, isolate arm, pivot, extend hips. Drill slow x 5 each side.',   equipment: 'Mat, Gi' },
  { name: 'Side Control Positional',    style: 'BJJ',     focus: 'sparring',    difficulty: 'intermediate', duration: 6, instructions: 'Start from side control. Bottom escapes, top maintains. 2-min rounds.',          equipment: 'Mat' },
  { name: 'Sprawl Defense',             style: 'BJJ',     focus: 'defense',     difficulty: 'intermediate', duration: 5, instructions: 'Attacker shoots double leg, defender sprawls and looks to take back.',           equipment: 'Mat' },

  // ── MMA ──────────────────────────────────────────────────────────────────
  { name: 'Dirty Boxing in Clinch',     style: 'MMA',     focus: 'combination', difficulty: 'intermediate', duration: 5, instructions: 'Short punches and knees from clinch. 2-punch combos before resetting.',         equipment: 'Gloves, shin guards' },
  { name: 'Takedown & Ground & Pound',  style: 'MMA',     focus: 'combination', difficulty: 'advanced',     duration: 6, instructions: 'Shoot for takedown, pass to half guard, controlled GnP combo x 4. Switch.',     equipment: 'MMA gloves, mat' },
  { name: 'Range Management',           style: 'MMA',     focus: 'footwork',    difficulty: 'intermediate', duration: 5, instructions: 'Stay outside grappling range while landing punches/kicks. Pivot on takedown.',   equipment: 'Gloves' },
  { name: 'Sprawl Drill',               style: 'MMA',     focus: 'defense',     difficulty: 'beginner',     duration: 4, instructions: 'Partner feigns shoot, defender sprawls hard. 10 reps, switch. Hips down.',       equipment: 'Mat' },
  { name: 'MMA Pad Combo',              style: 'MMA',     focus: 'attack',      difficulty: 'intermediate', duration: 6, instructions: 'Jab-cross-kick on pads. Coach calls: level change, takedown, or stand-up.',      equipment: 'MMA gloves, Thai pads' },
] as const;

const count = drillsDb.count();
if (count > 0) {
  console.log(`Database already has ${count} drills. Skipping seed.`);
} else {
  for (const drill of drills) {
    drillsDb.insert(drill as Parameters<typeof drillsDb.insert>[0]);
  }
  console.log(`Seeded ${drills.length} drills to data/drills.json`);
}
