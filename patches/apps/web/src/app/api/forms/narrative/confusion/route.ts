import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/narrative/confusion");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const level = String(body.level || "some");
    const theme = body.theme ? String(body.theme) : null;
    const county = body.county ? String(body.county) : null;
    const notes = body.notes ? String(body.notes) : null;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const ins = await client.query(
        `INSERT INTO cd2.narrative_confusion_signals (county, level, theme, notes, submitted_by_user_id)
         VALUES ($1, $2, $3, $4, $5::uuid)
         RETURNING signal_id, county, level, theme, observed_at`,
        [county, level, theme, notes, actor]
      );
      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: actor,
        action: "create",
        entity_type: "narrative_confusion_signal",
        entity_id: row.signal_id,
        metadata: { county, level, theme }
      });

      await client.query("COMMIT");
      return NextResponse.json({ ok: true, row });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (e: any) {
    return apiError(e);
  }
}
