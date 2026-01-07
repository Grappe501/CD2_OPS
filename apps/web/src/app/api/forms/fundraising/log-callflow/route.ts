import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

/**
 * Atomic call-flow save:
 * - create call_attempt
 * - optionally create pledge
 * - optionally create followup (recommended)
 *
 * This reduces the number of clicks for low-tech users and avoids partial saves.
 */
export async function POST(req: NextRequest) {
  const { actor_user_id } = await requireApiAccess(req, "forms.write.fundraising");
  const body = await req.json();

  const session_id: string | null = body?.session_id ?? null;
  const prospect_id: string | null = body?.prospect_id ?? null;

  const call = body?.call ?? {};
  const pledge = body?.pledge ?? null;
  const followup = body?.followup ?? null;

  if (!prospect_id || !call?.outcome) {
    return NextResponse.json({ ok: false, error: "Missing prospect_id or call.outcome" }, { status: 400 });
  }

  // transaction
  const result = await sql.tx(async (t: any) => {
    const attempt = await t.one(
      `
      INSERT INTO cd2.call_attempts (session_id, prospect_id, outcome, duration_seconds, notes, actor_user_id, source)
      VALUES ($1,$2,$3,$4,$5,$6,'web')
      RETURNING attempt_id, attempted_at, outcome
      `,
      [session_id, prospect_id, call.outcome, call.duration_seconds ?? null, call.notes ?? null, actor_user_id]
    );

    await t.none(
      `UPDATE cd2.fundraising_prospects SET last_contact_at=now(), updated_at=now() WHERE prospect_id=$1`,
      [prospect_id]
    );

    let pledgeRow = null;
    if (pledge?.pledged_amount) {
      pledgeRow = await t.one(
        `
        INSERT INTO cd2.pledges (prospect_id, pledged_amount, due_by, method_expected, notes, actor_user_id)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING pledge_id, pledged_at, pledged_amount, status
        `,
        [prospect_id, pledge.pledged_amount, pledge.due_by ?? null, pledge.method_expected ?? null, pledge.notes ?? null, actor_user_id]
      );
    }

    let followupRow = null;
    if (followup?.title) {
      followupRow = await t.one(
        `
        INSERT INTO cd2.followups (prospect_id, related_attempt_id, related_pledge_id, followup_type, title, details, assigned_to_user_id, due_at, source)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'web')
        RETURNING followup_id, status, due_at
        `,
        [
          prospect_id,
          attempt.attempt_id,
          pledgeRow?.pledge_id ?? null,
          followup.followup_type ?? "send_link",
          followup.title,
          followup.details ?? null,
          followup.assigned_to_user_id ?? actor_user_id ?? null,
          followup.due_at ?? null,
        ]
      );
    }

    return { attempt, pledge: pledgeRow, followup: followupRow };
  });

  return NextResponse.json({ ok: true, ...result });
}
