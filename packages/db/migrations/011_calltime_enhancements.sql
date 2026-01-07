-- CD2_OPS — Migration 011: Enhance call_time_logs for KPI computation
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Add live_hours (needed for dollars/hour)
ALTER TABLE call_time_logs
  ADD COLUMN IF NOT EXISTS live_hours numeric(8,2) NOT NULL DEFAULT 0;

-- Ask discipline fields (from memo: specific $ + timeline + scheduled follow-up)
ALTER TABLE call_time_logs
  ADD COLUMN IF NOT EXISTS asked_amount numeric(14,2),
  ADD COLUMN IF NOT EXISTS asked_timeline text,
  ADD COLUMN IF NOT EXISTS followup_scheduled boolean NOT NULL DEFAULT false;

-- Optional: store followup id for linkage
ALTER TABLE call_time_logs
  ADD COLUMN IF NOT EXISTS followup_id uuid;

COMMIT;
