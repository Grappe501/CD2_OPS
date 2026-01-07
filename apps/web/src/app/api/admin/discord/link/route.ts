import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";
import { linkDiscordUser, unlinkDiscordUser } from "@/lib/discordLink";

/**
 * POST: link a Discord user to a CD2 user
 * body: { discord_user_id: string, user_id: string, display_name?: string }
 *
 * DELETE: unlink a Discord user
 * body: { discord_user_id: string }
 *
 * Access control: requires endpoint access via your entitlements map.
 */
export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/admin/discord/link");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const discord_user_id = String(body.discord_user_id || "").trim();
    const user_id = String(body.user_id || "").trim();
    const display_name = body.display_name ? String(body.display_name) : null;

    if (!discord_user_id || !user_id) {
      return NextResponse.json({ ok: false, error: "discord_user_id and user_id are required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const row = await linkDiscordUser(discord_user_id, user_id, display_name);

      await auditLog(client, {
        actor_user_id: actor,
        action: "upsert",
        entity_type: "discord_user_link",
        entity_id: discord_user_id,
        metadata: { user_id, display_name }
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

export async function DELETE(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/admin/discord/link");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const discord_user_id = String(body.discord_user_id || "").trim();
    if (!discord_user_id) return NextResponse.json({ ok: false, error: "discord_user_id required" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const row = await unlinkDiscordUser(discord_user_id);

      await auditLog(client, {
        actor_user_id: actor,
        action: "deactivate",
        entity_type: "discord_user_link",
        entity_id: discord_user_id,
        metadata: {}
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
