import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/requireApiAccess";
import { sql } from "@/lib/db/sql";

export async function POST(req: NextRequest) {
  const { actor_user_id } = await requireApiAccess(req, "ai.approve");
  const body = await req.json();
  const suggestion_id: string | null = body?.suggestion_id ?? null;

  if (!suggestion_id) return NextResponse.json({ ok: false, error: "Missing suggestion_id" }, { status: 400 });

  const row = await sql.one(
    `
    UPDATE cd2.ai_suggestions
    SET status='rejected', rejected_by_user_id=$2, rejected_at=now()
    WHERE suggestion_id=$1
    RETURNING suggestion_id, status, rejected_at
    `,
    [suggestion_id, actor_user_id]
  );

  return NextResponse.json({ ok: true, row });
}
