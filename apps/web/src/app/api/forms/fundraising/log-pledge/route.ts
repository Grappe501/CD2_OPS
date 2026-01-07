import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function POST(req: NextRequest) {
  const { actor_user_id } = await requireApiAccess(req, "forms.write.fundraising");
  const body = await req.json();

  const prospect_id: string | null = body?.prospect_id ?? null;
  const pledged_amount: number | null = body?.pledged_amount ?? null;
  const due_by: string | null = body?.due_by ?? null; // YYYY-MM-DD
  const method_expected: string | null = body?.method_expected ?? null;
  const notes: string | null = body?.notes ?? null;

  if (!prospect_id || !pledged_amount) {
    return NextResponse.json({ ok: false, error: "Missing prospect_id/pledged_amount" }, { status: 400 });
  }

  const row = await sql.one(
    `
    INSERT INTO cd2.pledges (prospect_id, pledged_amount, due_by, method_expected, notes, actor_user_id)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING pledge_id, pledged_at, pledged_amount, status
    `,
    [prospect_id, pledged_amount, due_by, method_expected, notes, actor_user_id]
  );

  return NextResponse.json({ ok: true, row });
}
