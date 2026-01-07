/**
 * Module 27 — WIDGET_VIEW_CONTRACTS append (Fundraising)
 * Paste these rows into your contract registry.
 */
export const WIDGET_VIEW_CONTRACTS_APPEND_MODULE27 = [
  {
    view: "cd2.vw_fr_call_time_daily",
    columns: [
      "day (timestamp)",
      "owner_user_id (uuid)",
      "sessions_count (int)",
      "hours_scheduled_or_actual (numeric)",
      "dials (int)",
      "connects (int)",
      "avg_talk_seconds (int)"
    ],
    notes: "Sessions productivity by day. Excludes deleted sessions/attempts."
  },
  {
    view: "cd2.vw_fr_lane_performance",
    columns: [
      "lane_id (uuid)",
      "lane_key (text)",
      "lane_name (text)",
      "prospects (int)",
      "dials (int)",
      "connects (int)",
      "connect_rate_pct (numeric)",
      "pledges_count (int)",
      "pledges_total (numeric)",
      "received_total (numeric)"
    ],
    notes: "Lane conversion/pledge totals. Excludes deleted rows."
  },
  {
    view: "cd2.vw_fr_pledge_aging",
    columns: [
      "age_bucket (text)",
      "pledges (int)",
      "pledged_total (numeric)",
      "received_total (numeric)",
      "outstanding_total (numeric)"
    ],
    notes: "Outstanding pledge aging for follow-up focus."
  },
  {
    view: "cd2.vw_fr_followup_sla",
    columns: [
      "open_total (int)",
      "no_due_date (int)",
      "overdue (int)",
      "due_48h (int)",
      "due_later (int)"
    ],
    notes: "Follow-up SLA counts for dashboards."
  },
  {
    view: "cd2.vw_fr_next_calls",
    columns: [
      "prospect_id (uuid)",
      "donor_id (uuid)",
      "display_name (text)",
      "phone (text)",
      "email (text)",
      "lane_key (text)",
      "lane_name (text)",
      "status (text)",
      "capacity_estimate (numeric)",
      "ask_amount_suggested (numeric)",
      "last_contact_at (timestamp)",
      "next_action_at (timestamp)",
      "next_action_note (text)"
    ],
    notes: "Candidate-facing queue: next 25 calls, sorted by next_action_at."
  },
  {
    view: "cd2.vw_fr_events_rollup",
    columns: [
      "event_id (uuid)",
      "name (text)",
      "event_type (text)",
      "start_at (timestamp)",
      "status (text)",
      "goal_amount (numeric)",
      "invites (int)",
      "confirmed (int)",
      "attended (int)",
      "received_total (numeric)"
    ],
    notes: "Fundraising events rollup for ROI tracking."
  }
];
