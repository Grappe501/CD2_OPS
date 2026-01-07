-- CD2_OPS — Migration 018: AI suggestions + approvals (Module 29)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Prompt versions: immutable prompt text to support audits
CREATE TABLE IF NOT EXISTS cd2.ai_prompt_versions (
  prompt_version_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_key text NOT NULL,             -- e.g., "fr_precall_brief"
  version int NOT NULL,
  prompt_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(prompt_key, version)
);

-- AI suggestions: stores model IO and approval metadata
CREATE TABLE IF NOT EXISTS cd2.ai_suggestions (
  suggestion_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_key text NOT NULL,
  prompt_version int NOT NULL,
  model text NOT NULL,
  input_json jsonb NOT NULL,
  output_text text NOT NULL,
  output_json jsonb,
  advisory_only boolean NOT NULL DEFAULT true, -- true for precall; false for followup drafts
  requires_approval boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'generated' CHECK (status IN ('generated','approved','rejected','used')),
  generated_by_user_id uuid REFERENCES cd2.users(user_id),
  approved_by_user_id uuid REFERENCES cd2.users(user_id),
  approved_at timestamptz,
  rejected_by_user_id uuid REFERENCES cd2.users(user_id),
  rejected_at timestamptz,
  used_by_user_id uuid REFERENCES cd2.users(user_id),
  used_at timestamptz,
  linked_entity_type text,      -- e.g., 'prospect','followup','call_attempt'
  linked_entity_id uuid,
  request_id text,              -- correlate server logs
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON cd2.ai_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_prompt ON cd2.ai_suggestions(prompt_key, prompt_version);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_link ON cd2.ai_suggestions(linked_entity_type, linked_entity_id);

COMMIT;
