import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function POST(req: NextRequest) {
  const { actor_user_id } = await requireApiAccess(req, "forms.write.fundraising");
  const body = await req.json();

  const session_id: string | null = body?.session_id ?? null;
  const prospect_id: string | null = body?.prospect_id ?? null;
  const outcome: string | null = body?.outcome ?? null;
  const duration_seconds: number | null = body?.duration_seconds ?? null;
  const notes: string | null = body?.notes ?? null;

  if (!prospect_id || !outcome) {
    return NextResponse.json({ ok: false, error: "Missing prospect_id/outcome" }, { status: 400 });
  }

  const row = await sql.one(
    `
    INSERT INTO cd2.call_attempts (session_id, prospect_id, outcome, duration_seconds, notes, actor_user_id, source)
    VALUES ($1,$2,$3,$4,$5,$6,'web')
    RETURNING attempt_id, attempted_at, outcome
    `,
    [session_id, prospect_id, outcome, duration_seconds, notes, actor_user_id]
  );

  await sql.none(
    `UPDATE cd2.fundraising_prospects SET last_contact_at = now(), updated_at=now() WHERE prospect_id=$1`,
    [prospect_id]
  );

  return NextResponse.json({ ok: true, row });
}
