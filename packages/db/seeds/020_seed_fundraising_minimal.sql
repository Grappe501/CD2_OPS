-- CD2_OPS — Seed 020: minimal fundraising demo data (Module 27)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

INSERT INTO cd2.fundraising_lanes (lane_key, name, description, owner_role, sort_order)
VALUES
  ('A_HIGH_DOLLAR','A: High Dollar','$1k–$6.6k+ donors, fast asks, tight follow-up','finance',10),
  ('B_LABOR','B: Labor','Union + labor-aligned donors','finance',20),
  ('C_LOCAL_LEADERS','C: Local Leaders','Community leaders + validators','finance',30)
ON CONFLICT (lane_key) DO NOTHING;

INSERT INTO cd2.donors (donor_type, first_name, last_name, email, phone, city, state, employer, occupation, tags)
VALUES
  ('person','Pat','Smith','pat@example.com','501-555-0101','Little Rock','AR','Acme Co','Engineer', ARRAY['warm']),
  ('person','Riley','Johnson','riley@example.com','501-555-0102','Jacksonville','AR','School District','Teacher', ARRAY['education']),
  ('org',NULL,NULL,'treasury@localpac.org','501-555-0103','Little Rock','AR',NULL,NULL, ARRAY['org','pac'])
ON CONFLICT DO NOTHING;

WITH lane AS (
  SELECT lane_id, lane_key FROM cd2.fundraising_lanes WHERE lane_key IN ('A_HIGH_DOLLAR','C_LOCAL_LEADERS')
),
d AS (
  SELECT donor_id, email FROM cd2.donors WHERE email IN ('pat@example.com','riley@example.com')
)
INSERT INTO cd2.fundraising_prospects (donor_id, lane_id, status, capacity_estimate, ask_amount_suggested, source, next_action_at, next_action_note)
SELECT
  d.donor_id,
  (SELECT lane_id FROM lane WHERE lane_key = CASE WHEN d.email='pat@example.com' THEN 'A_HIGH_DOLLAR' ELSE 'C_LOCAL_LEADERS' END),
  'queued',
  CASE WHEN d.email='pat@example.com' THEN 5000 ELSE 250 END,
  CASE WHEN d.email='pat@example.com' THEN 3300 ELSE 100 END,
  'seed_list',
  now() + interval '1 day',
  'Intro call + ask'
FROM d
ON CONFLICT (donor_id) DO NOTHING;

COMMIT;
