import { NextResponse } from 'next/server';
import { plansDb } from '@/lib/db';
import type { ClassPlan, ClassPlanRow, PlanStatus } from '@/lib/types';

function rowToPlan(row: ClassPlanRow): ClassPlan {
  return { ...row, phases: typeof row.phases === 'string' ? JSON.parse(row.phases) : row.phases };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const row = plansDb.find(Number(params.id));
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rowToPlan(row));
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const row = plansDb.find(Number(params.id));
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const now = new Date().toISOString();
  const newStatus: PlanStatus = body.status ?? row.status;

  const updated = plansDb.update(Number(params.id), {
    status: newStatus,
    focusNotes: body.focusNotes ?? row.focusNotes,
    submittedAt: newStatus === 'submitted' && !row.submittedAt ? now : row.submittedAt,
    approvedAt:  newStatus === 'approved'  && !row.approvedAt  ? now : row.approvedAt,
    updatedAt: now,
  });

  return NextResponse.json(rowToPlan(updated!));
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  plansDb.delete(Number(params.id));
  return NextResponse.json({ success: true });
}
