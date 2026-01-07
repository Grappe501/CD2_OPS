import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";

/**
 * POST /api/forms/undo
 * body: { entity_type: 'narrative_question'|'narrative_confusion_signal'|'stop_doing_item'|'cadence_commitment',
 *         entity_id: string }
 *
 * Rules:
 * - soft delete only
 * - only within UNDO_WINDOW_MIN (default 10)
 */
const UNDO_WINDOW_MIN = Number(process.env.UNDO_WINDOW_MIN ?? "10");

function tableFor(type: string) {
  switch (type) {
    case "narrative_question": return { table: "cd2.narrative_questions", pk: "question_id", ts: "observed_at" };
    case "narrative_confusion_signal": return { table: "cd2.narrative_confusion_signals", pk: "signal_id", ts: "observed_at" };
    case "stop_doing_item": return { table: "cd2.stop_doing_items", pk: "item_id", ts: "created_at" };
    case "cadence_commitment": return { table: "cd2.cadence_commitments", pk: "commitment_id", ts: "created_at" };
    default: return null;
  }
}

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/undo");
    const actor = await resolveActorUserId(req);
    const body = await req.json();
    const entity_type = String(body.entity_type || "");
    const entity_id = String(body.entity_id || "");

    const meta = tableFor(entity_type);
    if (!meta) return NextResponse.json({ ok: false, error: "Unsupported entity_type" }, { status: 400 });
    if (!entity_id) return NextResponse.json({ ok: false, error: "entity_id required" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // check timestamp window + not already deleted
      const chk = await client.query(
        `SELECT ${meta.pk}::text AS id, ${meta.ts} AS ts, deleted_at
         FROM ${meta.table}
         WHERE ${meta.pk} = $1
         LIMIT 1`,
        [entity_id]
      );
      if (chk.rows.length === 0) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      const row = chk.rows[0];
      if (row.deleted_at) return NextResponse.json({ ok: false, error: "Already deleted" }, { status: 400 });

      const ts = new Date(row.ts).getTime();
      const ageMin = (Date.now() - ts) / 60000;
      if (ageMin > UNDO_WINDOW_MIN) {
        return NextResponse.json({ ok: false, error: `Undo window expired (${UNDO_WINDOW_MIN}m)` }, { status: 400 });
      }

      const upd = await client.query(
        `UPDATE ${meta.table}
         SET deleted_at = now(), deleted_by_user_id = $2::uuid
         WHERE ${meta.pk} = $1
         RETURNING ${meta.pk}::text AS id, deleted_at`,
        [entity_id, actor]
      );

      await auditLog(client, {
        actor_user_id: actor,
        action: "soft_delete",
        entity_type,
        entity_id,
        metadata: { undo_window_min: UNDO_WINDOW_MIN }
      });

      await client.query("COMMIT");
      return NextResponse.json({ ok: true, row: upd.rows[0] });
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
