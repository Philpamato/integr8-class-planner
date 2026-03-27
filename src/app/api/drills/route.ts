import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Drill } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style');
  const focus = searchParams.get('focus');
  const difficulty = searchParams.get('difficulty');

  const db = getDb();
  let query = 'SELECT * FROM drills WHERE 1=1';
  const params: string[] = [];

  if (style) { query += ' AND (style = ? OR style = \'General\')'; params.push(style); }
  if (focus) { query += ' AND focus = ?'; params.push(focus); }
  if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }

  query += ' ORDER BY style, focus, name';

  const drills = db.prepare(query).all(...params) as Drill[];
  return NextResponse.json(drills);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();

  const result = db.prepare(`
    INSERT INTO drills (name, style, focus, difficulty, duration, instructions, equipment)
    VALUES (@name, @style, @focus, @difficulty, @duration, @instructions, @equipment)
  `).run({
    name: body.name,
    style: body.style ?? 'General',
    focus: body.focus,
    difficulty: body.difficulty ?? 'beginner',
    duration: body.duration ?? 5,
    instructions: body.instructions ?? '',
    equipment: body.equipment ?? '',
  });

  const drill = db.prepare('SELECT * FROM drills WHERE id = ?').get(result.lastInsertRowid) as Drill;
  return NextResponse.json(drill, { status: 201 });
}
