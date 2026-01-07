-- CD2_OPS — Migration 015: Discord user linking
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Link Discord user IDs to CD2 users for attribution
CREATE TABLE IF NOT EXISTS discord_user_links (
  discord_user_id text PRIMARY KEY, -- snowflake as string
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  display_name text, -- optional cached discord display name
  linked_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS discord_user_links_user_idx ON discord_user_links(user_id);
CREATE INDEX IF NOT EXISTS discord_user_links_active_idx ON discord_user_links(is_active);

COMMIT;
