import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function GET(req: NextRequest) {
  await requireApiAccess(req, "fundraising.read");
  const rows = await sql.any(
    `
    SELECT
      prospect_id,
      display_name,
      phone,
      lane_name,
      ask_amount_suggested,
      next_action_at,
      next_action_note
    FROM cd2.vw_fr_prospect_display
    ORDER BY (next_action_at IS NULL) ASC, next_action_at ASC NULLS LAST, last_contact_at ASC NULLS LAST
    LIMIT 200
    `
  );
  return NextResponse.json({ ok: true, rows });
}
