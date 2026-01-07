import type { PoolClient } from "pg";

/**
 * Audit write (must be called inside the SAME transaction as the entity write).
 * We intentionally store only a safe subset in metadata_json.
 */
export async function auditLog(client: PoolClient, args: {
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, any>;
}) {
  const sql = `
    INSERT INTO cd2.audit_log (actor_user_id, action, entity_type, entity_id, metadata_json)
    VALUES ($1, $2, $3, $4, $5::jsonb)
  `;
  await client.query(sql, [
    args.actor_user_id ?? null,
    args.action,
    args.entity_type,
    args.entity_id,
    JSON.stringify(args.metadata ?? {}),
  ]);
}
