import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/narrative/question");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const question = String(body.question || "").trim();
    if (!question) return NextResponse.json({ ok: false, error: "Question is required" }, { status: 400 });

    const tag = body.tag ? String(body.tag) : null;
    const county = body.county ? String(body.county) : null;
    const source = body.source ? String(body.source) : "other";

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const ins = await client.query(
        `INSERT INTO cd2.narrative_questions (question, tag, county, source, submitted_by_user_id)
         VALUES ($1, $2, $3, $4, $5::uuid)
         RETURNING question_id, question, tag, county, source, observed_at`,
        [question, tag, county, source, actor]
      );
      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: actor,
        action: "create",
        entity_type: "narrative_question",
        entity_id: row.question_id,
        metadata: { tag, county, source }
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
