import { getPool } from "@/lib/db";

export async function linkDiscordUser(discordUserId: string, userId: string, displayName?: string | null) {
  const pool = getPool();
  const res = await pool.query(
    `INSERT INTO cd2.discord_user_links (discord_user_id, user_id, display_name, is_active)
     VALUES ($1, $2::uuid, $3, true)
     ON CONFLICT (discord_user_id)
     DO UPDATE SET user_id = EXCLUDED.user_id, display_name = EXCLUDED.display_name, is_active = true, updated_at = now()
     RETURNING discord_user_id, user_id::text AS user_id, display_name, is_active, updated_at`,
    [discordUserId, userId, displayName ?? null]
  );
  return res.rows[0];
}

export async function unlinkDiscordUser(discordUserId: string) {
  const pool = getPool();
  const res = await pool.query(
    `UPDATE cd2.discord_user_links
     SET is_active = false, updated_at = now()
     WHERE discord_user_id = $1
     RETURNING discord_user_id, user_id::text AS user_id, display_name, is_active, updated_at`,
    [discordUserId]
  );
  return res.rows[0] ?? null;
}
