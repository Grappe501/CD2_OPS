-- CD2_OPS v0.7.0 — Module 6
-- Adds a minimal users table for stable actor attribution.
-- Safe to apply even if you later replace auth with a provider.

CREATE SCHEMA IF NOT EXISTS cd2;

CREATE TABLE IF NOT EXISTS cd2.users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('candidate','cm','finance','field','comms','data','admin')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cd2_users_role ON cd2.users(role);

-- Seed an admin+cm if empty (idempotent)
INSERT INTO cd2.users (email, display_name, role)
SELECT 'admin@cd2_ops.local', 'Admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM cd2.users WHERE email='admin@cd2_ops.local');

INSERT INTO cd2.users (email, display_name, role)
SELECT 'cm@cd2_ops.local', 'Campaign Manager', 'cm'
WHERE NOT EXISTS (SELECT 1 FROM cd2.users WHERE email='cm@cd2_ops.local');
