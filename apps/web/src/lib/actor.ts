import { headers } from "next/headers";
import { getPool } from "@/lib/db";

/**
 * Resolve actor_user_id for audit attribution.
 *
 * Priority:
 * 1) Explicit header from middleware/session: x-cd2-actor-user-id
 * 2) Discord header: x-cd2-discord-user-id -> map via cd2.discord_user_links
 * 3) (future) session cookie parsing / NextAuth
 *
 * Returns null if unknown.
 */
export async function resolveActorUserId(req: Request): Promise<string | null> {
  const h = req.headers;

  const direct = h.get("x-cd2-actor-user-id");
  if (direct) return direct;

  const discordUserId = h.get("x-cd2-discord-user-id");
  if (discordUserId) {
    const pool = getPool();
    const res = await pool.query(
      `SELECT user_id::text AS user_id
       FROM cd2.discord_user_links
       WHERE discord_user_id = $1 AND is_active = true
       LIMIT 1`,
      [discordUserId]
    );
    return res.rows?.[0]?.user_id ?? null;
  }

  return null;
}

/**
 * Convenience: read current request headers in server components (if needed).
 * Not used in API routes; they receive req.
 */
export function readActorHeaderFromContext(): string | null {
  const h = headers();
  return h.get("x-cd2-actor-user-id");
}
