import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generatePlan } from '@/lib/generator';
import type { ClassPlan, ClassPlanRow, CreatePlanInput } from '@/lib/types';

function rowToPlan(row: ClassPlanRow): ClassPlan {
  return { ...row, phases: JSON.parse(row.phases) };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const status = searchParams.get('status');
  const coachName = searchParams.get('coachName');

  const db = getDb();
  let query = 'SELECT * FROM plans WHERE 1=1';
  const params: string[] = [];

  if (location) { query += ' AND location = ?'; params.push(location); }
  if (status)   { query += ' AND status = ?';   params.push(status); }
  if (coachName) { query += ' AND coachName = ?'; params.push(coachName); }

  query += ' ORDER BY weekStart DESC, createdAt DESC';

  const rows = db.prepare(query).all(...params) as ClassPlanRow[];
  return NextResponse.json(rows.map(rowToPlan));
}

export async function POST(request: Request) {
  const body: CreatePlanInput = await request.json();
  const db = getDb();

  const { phases, theme, title } = generatePlan(
    body.style,
    body.ageGroup,
    body.classDuration,
    body.focusNotes,
    body.weekStart
  );

  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO plans
      (title, coachName, location, ageGroup, style, quarterlyTheme, classDuration,
       focusNotes, phases, status, weekStart, createdAt, updatedAt)
    VALUES
      (@title, @coachName, @location, @ageGroup, @style, @quarterlyTheme, @classDuration,
       @focusNotes, @phases, 'draft', @weekStart, @createdAt, @updatedAt)
  `).run({
    title,
    coachName: body.coachName,
    location: body.location,
    ageGroup: body.ageGroup,
    style: body.style,
    quarterlyTheme: theme,
    classDuration: body.classDuration,
    focusNotes: body.focusNotes,
    phases: JSON.stringify(phases),
    weekStart: body.weekStart,
    createdAt: now,
    updatedAt: now,
  });

  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(result.lastInsertRowid) as ClassPlanRow;
  return NextResponse.json(rowToPlan(row), { status: 201 });
}
