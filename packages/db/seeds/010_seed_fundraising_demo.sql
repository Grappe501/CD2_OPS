-- CD2_OPS — Seed 010: Fundraising demo data (safe for dev)
BEGIN;
SET search_path TO cd2, public;

-- Create a couple donors
INSERT INTO donors (full_name,email,phone,city,state,zip,stage,max_capacity,notes)
VALUES
  ('Pat Example','pat@example.com','501-555-0101','Little Rock','AR','72201','prospect',500,'Demo donor'),
  ('Jordan Sample','jordan@example.com','501-555-0102','Conway','AR','72032','pledged',2500,'Demo pledged donor')
ON CONFLICT DO NOTHING;

-- Create a pledge and a contribution
INSERT INTO pledges (donor_id,amount,expected_close_at,status,notes)
SELECT donor_id, 2500, now() + interval '10 days', 'open', 'Demo pledge'
FROM donors WHERE full_name='Jordan Sample'
ON CONFLICT DO NOTHING;

INSERT INTO contributions (donor_id,amount,method,memo)
SELECT donor_id, 250, 'check', 'Demo contribution'
FROM donors WHERE full_name='Jordan Sample'
ON CONFLICT DO NOTHING;

-- Create follow-ups
INSERT INTO followups (donor_id,contact_name,lane,due_at,status,notes)
SELECT donor_id, full_name, 'followups', now() + interval '2 hours', 'open', 'Demo follow-up due soon'
FROM donors WHERE full_name='Jordan Sample'
ON CONFLICT DO NOTHING;

COMMIT;
