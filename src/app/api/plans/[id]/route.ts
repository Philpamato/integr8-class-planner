import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { ClassPlan, ClassPlanRow, PlanStatus } from '@/lib/types';

function rowToPlan(row: ClassPlanRow): ClassPlan {
  return { ...row, phases: JSON.parse(row.phases) };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(params.id) as ClassPlanRow | undefined;
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rowToPlan(row));
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const db = getDb();
  const now = new Date().toISOString();

  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(params.id) as ClassPlanRow | undefined;
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const newStatus: PlanStatus = body.status ?? row.status;
  const submittedAt = newStatus === 'submitted' && !row.submittedAt ? now : row.submittedAt;
  const approvedAt  = newStatus === 'approved'  && !row.approvedAt  ? now : row.approvedAt;

  db.prepare(`
    UPDATE plans SET
      status = @status,
      focusNotes = @focusNotes,
      submittedAt = @submittedAt,
      approvedAt = @approvedAt,
      updatedAt = @updatedAt
    WHERE id = @id
  `).run({
    id: params.id,
    status: newStatus,
    focusNotes: body.focusNotes ?? row.focusNotes,
    submittedAt,
    approvedAt,
    updatedAt: now,
  });

  const updated = db.prepare('SELECT * FROM plans WHERE id = ?').get(params.id) as ClassPlanRow;
  return NextResponse.json(rowToPlan(updated));
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const db = getDb();
  db.prepare('DELETE FROM plans WHERE id = ?').run(params.id);
  return NextResponse.json({ success: true });
}
