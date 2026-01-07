import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, isOpenAIEnabled, modelPrimary, requireApproval } from "@/lib/ai/openaiClient";
import { AI_PROMPTS } from "@/lib/ai/promptVersions";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function POST(req: NextRequest) {
  const { actor_user_id, request_id } = await requireApiAccess(req, "ai.generate");
  if (!isOpenAIEnabled()) return NextResponse.json({ ok: false, error: "AI disabled" }, { status: 403 });

  const body = await req.json();
  const { prospect_id, inputs } = body || {};
  if (!prospect_id || !inputs) return NextResponse.json({ ok: false, error: "Missing prospect_id or inputs" }, { status: 400 });

  const prompt = AI_PROMPTS.fr_precall_brief;
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: modelPrimary(),
    messages: [
      { role: "system", content: prompt.text },
      { role: "user", content: JSON.stringify(inputs) }
    ],
    temperature: 0.3
  });

  const text = completion.choices?.[0]?.message?.content?.trim() || "";

  const advisoryOnly = true;
  const requires = requireApproval() ? false : false; // precall is advisory; no approval gate needed

  const row = await sql.one(`
    INSERT INTO cd2.ai_suggestions
      (prompt_key, prompt_version, model, input_json, output_text, advisory_only, requires_approval, status, generated_by_user_id,
       linked_entity_type, linked_entity_id, request_id)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,'generated',$8,'prospect',$9,$10)
    RETURNING suggestion_id, status, created_at
  `, ["fr_precall_brief", prompt.version, modelPrimary(), JSON.stringify(inputs), text, advisoryOnly, requires, actor_user_id, prospect_id, request_id]);

  return NextResponse.json({ ok: true, suggestion: row, output_text: text });
}
