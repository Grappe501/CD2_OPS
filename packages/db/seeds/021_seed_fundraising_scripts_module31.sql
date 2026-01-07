-- CD2_OPS — Seed 021 (Module 31): example scripts/ladder/objections
BEGIN;
SET search_path TO cd2, public;

-- Find first lane if exists
WITH first_lane AS (
  SELECT lane_id, lane_key FROM cd2.fundraising_lanes WHERE is_active=true ORDER BY created_at ASC LIMIT 1
)
INSERT INTO cd2.fundraising_script_sets (lane_id, lane_key, title, opening, why_this_race, credibility_bullets, ask_line, close_line)
SELECT
  fl.lane_id,
  fl.lane_key,
  'Default Lane Script',
  'Hi {NAME} — it’s Chris. Do you have 60 seconds?',
  'I’m running to bring honest, practical leadership to Arkansas’s 2nd District — focused on jobs, schools, and protecting working families.',
  '• Arkansas roots • Problem-solver • Not owned by corporate PACs',
  'Would you be able to chip in {ASK} today to help us build the team to win?',
  'Thank you — I’m grateful. I’ll send you the link right now.'
FROM first_lane fl
ON CONFLICT DO NOTHING;

-- Ask ladder
WITH first_lane AS (
  SELECT lane_id, lane_key FROM cd2.fundraising_lanes WHERE is_active=true ORDER BY created_at ASC LIMIT 1
)
INSERT INTO cd2.fundraising_ask_ladder (lane_id, lane_key, amount, label, sort_order)
SELECT fl.lane_id, fl.lane_key, x.amount, x.label, x.sort_order
FROM first_lane fl
CROSS JOIN (VALUES
  (1000::numeric, 'Stretch', 10),
  (500::numeric, 'Primary ask', 20),
  (250::numeric, 'Downshift', 30),
  (100::numeric, 'Floor', 40)
) AS x(amount,label,sort_order)
ON CONFLICT DO NOTHING;

-- Objections
INSERT INTO cd2.fundraising_objections (lane_key, objection_key, label, response_text, note_insert)
VALUES
  ('GLOBAL','need_to_think','“I need to think about it”',
   'Totally fair — what would help you decide: a quick link now, or a short call back tomorrow after you’ve had a moment?',
   'Needs time — offered link or callback.'),
  ('GLOBAL','too_busy','“I’m busy”',
   'I hear you. Two quick options: I can text you the link and you can do it whenever, or we can schedule a 2‑minute callback.',
   'Busy — offered text link or 2-min callback.'),
  ('GLOBAL','already_gave','“I already gave”',
   'Thank you — that matters. Would you be open to a small additional boost today, or helping by inviting one friend to an event?',
   'Already gave — asked for small boost or friend invite.')
ON CONFLICT DO NOTHING;

COMMIT;
