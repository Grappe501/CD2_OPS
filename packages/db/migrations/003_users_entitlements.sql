-- CD2_OPS v1.0.0 — Module 9
-- Users + credentials + entitlements

CREATE SCHEMA IF NOT EXISTS cd2;

-- Ensure users exists (from Module 6). If not, create minimal.
CREATE TABLE IF NOT EXISTS cd2.users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('candidate','cm','finance','field','comms','data','admin')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Credentials table (bcrypt)
CREATE TABLE IF NOT EXISTS cd2.user_credentials (
  user_id uuid PRIMARY KEY REFERENCES cd2.users(user_id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Entitlements (fine-grained overrides)
CREATE TABLE IF NOT EXISTS cd2.user_entitlements (
  entitlement_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES cd2.users(user_id) ON DELETE CASCADE,
  permission_key text NOT NULL,
  is_granted boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_cd2_entitlements_user ON cd2.user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_cd2_entitlements_key ON cd2.user_entitlements(permission_key);

-- Seed admin user if missing
INSERT INTO cd2.users (email, display_name, role)
SELECT 'admin@cd2_ops.local', 'Admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM cd2.users WHERE email='admin@cd2_ops.local');

-- NOTE: set password via admin console or by inserting into cd2.user_credentials.
