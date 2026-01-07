import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function POST(req: NextRequest) {
  const { actor_user_id } = await requireApiAccess(req, "forms.write.fundraising");
  const body = await req.json();

  const prospect_id: string | null = body?.prospect_id ?? null;
  const related_attempt_id: string | null = body?.related_attempt_id ?? null;
  const related_pledge_id: string | null = body?.related_pledge_id ?? null;

  const followup_type: string = body?.followup_type ?? "send_link";
  const title: string | null = body?.title ?? null;
  const details: string | null = body?.details ?? null;
  const assigned_to_user_id: string | null = body?.assigned_to_user_id ?? actor_user_id ?? null;
  const due_at: string | null = body?.due_at ?? null;

  if (!prospect_id || !title) {
    return NextResponse.json({ ok: false, error: "Missing prospect_id/title" }, { status: 400 });
  }

  const row = await sql.one(
    `
    INSERT INTO cd2.followups
      (prospect_id, related_attempt_id, related_pledge_id, followup_type, title, details, assigned_to_user_id, due_at, source)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,'web')
    RETURNING followup_id, status, due_at
    `,
    [prospect_id, related_attempt_id, related_pledge_id, followup_type, title, details, assigned_to_user_id, due_at]
  );

  // OPTIONAL: create an audit row via your existing audit system (handled elsewhere)
  return NextResponse.json({ ok: true, row });
}
