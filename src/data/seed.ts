/**
 * Seed script — run with: npm run db:seed
 * Populates the drill library with initial drills for all Integr8 styles.
 */
import { getDb } from '../lib/db';

const drills = [
  // ── Warm-Up (General) ────────────────────────────────────────────────────
  { name: 'Shadow Boxing', style: 'General', focus: 'warm-up', difficulty: 'beginner', duration: 3, instructions: '3 rounds of 1 min light shadow boxing. Focus on movement, not power.', equipment: '' },
  { name: 'Jump Rope', style: 'General', focus: 'warm-up', difficulty: 'beginner', duration: 3, instructions: 'Continuous skipping for 3 minutes. Vary footwork between rounds.', equipment: 'Jump rope' },
  { name: 'Dynamic Stretching Circuit', style: 'General', focus: 'warm-up', difficulty: 'beginner', duration: 5, instructions: 'Leg swings, arm circles, hip rotations, high knees. 30 sec each.', equipment: '' },
  { name: 'Partner Tag', style: 'General', focus: 'warm-up', difficulty: 'beginner', duration: 3, instructions: 'Pairs try to touch each other\'s shoulders while defending. Builds reactions and movement.', equipment: '' },

  // ── Cool-Down (General) ──────────────────────────────────────────────────
  { name: 'Static Stretching', style: 'General', focus: 'cool-down', difficulty: 'beginner', duration: 5, instructions: 'Hold each stretch 20–30 sec. Focus: hamstrings, quads, hips, shoulders.', equipment: '' },
  { name: 'Breathing & Mindset Reflection', style: 'General', focus: 'cool-down', difficulty: 'beginner', duration: 3, instructions: 'Seated. Coach asks 1–2 questions about what was learned. Finish with a bow-out.', equipment: '' },

  // ── Conditioning (General) ───────────────────────────────────────────────
  { name: 'Burpee Rounds', style: 'General', focus: 'conditioning', difficulty: 'intermediate', duration: 4, instructions: '3 x 30-sec burpee sets with 20-sec rest. Modify for beginners (no jump).', equipment: '' },
  { name: 'Core Circuit', style: 'General', focus: 'conditioning', difficulty: 'beginner', duration: 5, instructions: 'Plank 30s, sit-ups x 20, leg raises x 15. 2 rounds.', equipment: '' },
  { name: 'Shuttle Runs', style: 'General', focus: 'conditioning', difficulty: 'intermediate', duration: 4, instructions: '5m sprint, touch, return x 6. Builds explosive footwork and cardio.', equipment: '' },

  // ── Footwork (General) ───────────────────────────────────────────────────
  { name: 'Box Step Drill', style: 'General', focus: 'footwork', difficulty: 'beginner', duration: 5, instructions: 'Step forward-right-back-left in a square. Maintain guard and posture throughout.', equipment: '' },
  { name: 'Cone Weave', style: 'General', focus: 'footwork', difficulty: 'beginner', duration: 4, instructions: 'Set 5 cones 1m apart. Weave in and out x 4. Add a strike at the end.', equipment: 'Cones' },
  { name: 'Angle Exit Drill', style: 'General', focus: 'footwork', difficulty: 'intermediate', duration: 5, instructions: 'Partner throws a jab, defender exits at 45° angle each side alternating. Focus on not crossing feet.', equipment: '' },

  // ── Defense (General) ────────────────────────────────────────────────────
  { name: 'Slip & Roll', style: 'General', focus: 'defense', difficulty: 'intermediate', duration: 5, instructions: 'Partner throws slow punches, defender slips outside then inside. 2 min each side.', equipment: '' },
  { name: 'Parry Drills', style: 'General', focus: 'defense', difficulty: 'beginner', duration: 4, instructions: 'Pairs: one feeds straight punches, other parries with rear hand. Switch after 1 min.', equipment: '' },
  { name: 'Cover & Counter', style: 'General', focus: 'defense', difficulty: 'intermediate', duration: 5, instructions: 'Block incoming hook with high cover, immediately return with 2-punch counter.', equipment: 'Gloves, pads' },

  // ── Attack / Combination (General) ──────────────────────────────────────
  { name: 'Jab-Cross-Hook', style: 'General', focus: 'combination', difficulty: 'beginner', duration: 4, instructions: 'On pads or bag: Jab → Cross → Hook. 3 x 1-min rounds. Call the combo.', equipment: 'Gloves, pads or bag' },
  { name: '4-Punch Combination', style: 'General', focus: 'combination', difficulty: 'intermediate', duration: 5, instructions: 'Jab → Cross → Lead Hook → Rear Uppercut. Emphasise hip rotation and head movement.', equipment: 'Gloves, pads' },
  { name: 'Feint & Attack', style: 'General', focus: 'attack', difficulty: 'intermediate', duration: 5, instructions: 'Practice a feint (fake jab) then attack with cross or hook. 2 min rounds on pads.', equipment: 'Gloves, pads' },

  // ── Technique — Boxing ───────────────────────────────────────────────────
  { name: 'Jab Mechanics', style: 'Boxing', focus: 'technique', difficulty: 'beginner', duration: 5, instructions: 'Break down the jab: extension, shoulder roll, snap back. Mirror or shadowbox. Correct stance.', equipment: '' },
  { name: 'Bob & Weave', style: 'Boxing', focus: 'technique', difficulty: 'intermediate', duration: 5, instructions: 'Dip under a string or partner\'s lead arm. Practice moving in U-shape. 3 x 1-min.', equipment: 'String or partner' },
  { name: 'Body Shot Setup', style: 'Boxing', focus: 'technique', difficulty: 'intermediate', duration: 5, instructions: 'Jab to head then drop and cross to body. Coach calls the combo. Work on bending the knees, not waist.', equipment: 'Gloves, pads' },
  { name: 'Southpaw vs Orthodox Drill', style: 'Boxing', focus: 'sparring', difficulty: 'advanced', duration: 8, instructions: 'Pair one southpaw and one orthodox. Controlled 2-min rounds focusing on stance advantages.', equipment: 'Gloves, mouthguards, headgear' },

  // ── Technique — Karate ───────────────────────────────────────────────────
  { name: 'Kihon Blocks & Strikes', style: 'Karate', focus: 'technique', difficulty: 'beginner', duration: 6, instructions: 'Line drill: gedan barai, age uke, gyaku-zuki. Count and correct in unison.', equipment: '' },
  { name: 'Kata Breakdown', style: 'Karate', focus: 'technique', difficulty: 'intermediate', duration: 8, instructions: 'Focus on 1 kata sequence (4–6 moves). Break into bunkai with a partner.', equipment: '' },
  { name: 'Kumite Entry Drill', style: 'Karate', focus: 'sparring', difficulty: 'intermediate', duration: 6, instructions: 'From fighting stance: entry jab or gyaku-zuki + exit. Alternating 1-min rounds.', equipment: 'Gloves, mouthguards' },
  { name: 'Maai (Distance Control)', style: 'Karate', focus: 'footwork', difficulty: 'beginner', duration: 4, instructions: 'Partners maintain correct fighting distance while moving. One leads, one mirrors.', equipment: '' },
  { name: 'Karate Defence Sequence', style: 'Karate', focus: 'defense', difficulty: 'beginner', duration: 5, instructions: 'Partner attacks with gyaku-zuki, defender uses age uke then counter. 10 reps each side.', equipment: '' },

  // ── Technique — Muay Thai ────────────────────────────────────────────────
  { name: 'Thai Kick Mechanics', style: 'Muay Thai', focus: 'technique', difficulty: 'beginner', duration: 6, instructions: 'Slow breakdown: pivot foot, hip rotation, shin contact point. Repeat on both sides.', equipment: 'Thai pads or bag' },
  { name: 'Teep (Push Kick)', style: 'Muay Thai', focus: 'attack', difficulty: 'beginner', duration: 4, instructions: 'Use teep to create distance. Chamber, extend, push through. 2 x 1-min each leg.', equipment: 'Pad or belly pad' },
  { name: 'Clinch Entry & Knee', style: 'Muay Thai', focus: 'technique', difficulty: 'intermediate', duration: 6, instructions: 'Jab-cross, close to clinch, deliver 2 controlled knees, exit with push.', equipment: 'Gloves, shin guards' },
  { name: 'Low Kick Counter', style: 'Muay Thai', focus: 'defense', difficulty: 'intermediate', duration: 5, instructions: 'Check partner\'s low kick, immediately counter with your own. 2 min each side.', equipment: 'Shin guards, gloves' },
  { name: 'Muay Thai Sparring Rounds', style: 'Muay Thai', focus: 'sparring', difficulty: 'advanced', duration: 8, instructions: 'Light technical rounds — punches, kicks, knees only (no elbows). Controlled intent.', equipment: 'Full sparring gear' },

  // ── Technique — BJJ ──────────────────────────────────────────────────────
  { name: 'Guard Passing Drill', style: 'BJJ', focus: 'technique', difficulty: 'intermediate', duration: 6, instructions: 'Passer attempts torreando or knee-slice pass. Guard player frames and moves hips. 3 min each.', equipment: 'Gi or no-gi' },
  { name: 'Hip Escape (Shrimping)', style: 'BJJ', focus: 'footwork', difficulty: 'beginner', duration: 4, instructions: 'Solo shrimping down the mat. Focus on pushing off one leg and turning the hips. 3 lengths.', equipment: 'Mat' },
  { name: 'Armbar from Guard', style: 'BJJ', focus: 'technique', difficulty: 'intermediate', duration: 7, instructions: 'Control partner\'s posture, isolate arm, pivot over, extend hips. Drill slow x 5 each side.', equipment: 'Mat, Gi' },
  { name: 'Positional Sparring — Side Control', style: 'BJJ', focus: 'sparring', difficulty: 'intermediate', duration: 6, instructions: 'Start from side control. Bottom escapes, top maintains or improves position. 2-min rounds.', equipment: 'Mat' },
  { name: 'Takedown to Takedown Defense', style: 'BJJ', focus: 'defense', difficulty: 'intermediate', duration: 5, instructions: 'Attacker shoots double leg, defender sprawls and looks to take back. Alternate roles each round.', equipment: 'Mat' },

  // ── Technique — MMA ──────────────────────────────────────────────────────
  { name: 'Dirty Boxing in Clinch', style: 'MMA', focus: 'combination', difficulty: 'intermediate', duration: 5, instructions: 'From clinch position: short punches, elbows, and knees. Work 2-punch combos before resetting.', equipment: 'Gloves, shin guards' },
  { name: 'Takedown & Ground & Pound', style: 'MMA', focus: 'combination', difficulty: 'advanced', duration: 6, instructions: 'Shoot for takedown, pass to half guard, controlled GnP combo x 4. Partner defends. Switch.', equipment: 'MMA gloves, mat' },
  { name: 'Range Management', style: 'MMA', focus: 'footwork', difficulty: 'intermediate', duration: 5, instructions: 'Stay outside grappling range while landing punches/kicks. When partner shoots, pivot and reset.', equipment: 'Gloves' },
  { name: 'Sprawl Drill', style: 'MMA', focus: 'defense', difficulty: 'beginner', duration: 4, instructions: 'Partner feigns shoot, defender sprawls hard and flat. 10 reps, then switch. Focus: hips down, not knees.', equipment: 'Mat' },
  { name: 'MMA Pad Combo', style: 'MMA', focus: 'attack', difficulty: 'intermediate', duration: 6, instructions: 'Jab-cross-kick combo on pads. Coach calls: level change, takedown, or continue stand-up.', equipment: 'MMA gloves, Thai pads' },
];

async function seed() {
  const db = getDb();

  const count = (db.prepare('SELECT COUNT(*) as c FROM drills').get() as { c: number }).c;
  if (count > 0) {
    console.log(`Database already has ${count} drills. Skipping seed.`);
    return;
  }

  const insert = db.prepare(`
    INSERT INTO drills (name, style, focus, difficulty, duration, instructions, equipment)
    VALUES (@name, @style, @focus, @difficulty, @duration, @instructions, @equipment)
  `);

  const insertMany = db.transaction((rows: typeof drills) => {
    for (const row of rows) insert.run(row);
  });

  insertMany(drills);
  console.log(`Seeded ${drills.length} drills.`);
}

seed().catch(console.error);
