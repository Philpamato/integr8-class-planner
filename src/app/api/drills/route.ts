import { NextResponse } from 'next/server';
import { drillsDb } from '@/lib/db';
import type { Drill, Style, DrillFocus } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') as Style | null;
  const focus = searchParams.get('focus') as DrillFocus | null;
  const difficulty = searchParams.get('difficulty');

  let drills = drillsDb.all();
  if (style)      drills = drills.filter(d => d.style === style || d.style === 'General');
  if (focus)      drills = drills.filter(d => d.focus === focus);
  if (difficulty) drills = drills.filter(d => d.difficulty === difficulty);

  drills.sort((a, b) => `${a.style}${a.focus}${a.name}`.localeCompare(`${b.style}${b.focus}${b.name}`));
  return NextResponse.json(drills);
}

export async function POST(request: Request) {
  const body = await request.json();

  const drill = drillsDb.insert({
    name: body.name,
    style: body.style ?? 'General',
    focus: body.focus,
    difficulty: body.difficulty ?? 'beginner',
    duration: body.duration ?? 5,
    instructions: body.instructions ?? '',
    equipment: body.equipment ?? '',
  });

  return NextResponse.json(drill, { status: 201 });
}
