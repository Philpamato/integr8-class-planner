import { NextResponse } from 'next/server';
import { plansDb } from '@/lib/db';
import { generatePlan } from '@/lib/generator';
import type { ClassPlan, ClassPlanRow, CreatePlanInput } from '@/lib/types';

function rowToPlan(row: ClassPlanRow): ClassPlan {
  return { ...row, phases: typeof row.phases === 'string' ? JSON.parse(row.phases) : row.phases };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location  = searchParams.get('location');
  const status    = searchParams.get('status');
  const coachName = searchParams.get('coachName');

  let rows = plansDb.all();
  if (location)  rows = rows.filter(p => p.location === location);
  if (status)    rows = rows.filter(p => p.status === status);
  if (coachName) rows = rows.filter(p => p.coachName === coachName);

  rows.sort((a, b) => b.weekStart.localeCompare(a.weekStart) || b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(rows.map(rowToPlan));
}

export async function POST(request: Request) {
  const body: CreatePlanInput = await request.json();
  const { phases, theme, title } = generatePlan(
    body.style, body.ageGroup, body.classDuration, body.focusNotes, body.weekStart
  );

  const now = new Date().toISOString();
  const row = plansDb.insert({
    title,
    coachName: body.coachName,
    location: body.location,
    ageGroup: body.ageGroup,
    style: body.style,
    quarterlyTheme: theme,
    classDuration: body.classDuration,
    focusNotes: body.focusNotes,
    phases: JSON.stringify(phases),
    status: 'draft',
    weekStart: body.weekStart,
    submittedAt: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(rowToPlan(row), { status: 201 });
}
