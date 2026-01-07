/**
 * Module 28 — WIDGET_VIEW_CONTRACTS append (Fundraising rollups/views)
 */
export const WIDGET_VIEW_CONTRACTS_APPEND_MODULE28 = [
  {
    view: "cd2.vw_fr_owner_summary_today",
    columns: [
      "owner_user_id (uuid)",
      "day (timestamp)",
      "hours (numeric)",
      "dials (int)",
      "connects (int)",
      "pledges_count (int)",
      "pledges_total (numeric)"
    ],
    notes: "Today rollup per owner user."
  },
  {
    view: "cd2.vw_fr_owner_summary_7d",
    columns: [
      "owner_user_id (uuid)",
      "as_of_day (timestamp)",
      "hours (numeric)",
      "dials (int)",
      "connects (int)",
      "pledges_count (int)",
      "pledges_total (numeric)"
    ],
    notes: "Last 7 days rollup per owner user."
  },
  {
    view: "cd2.vw_fr_followups_overdue",
    columns: [
      "followup_id (uuid)",
      "title (text)",
      "followup_type (text)",
      "status (text)",
      "due_at (timestamp)",
      "assigned_to_user_id (uuid)",
      "display_name (text)",
      "phone (text)",
      "email (text)",
      "lane_key (text)",
      "lane_name (text)",
      "prospect_id (uuid)"
    ],
    notes: "Overdue follow-ups with prospect display."
  },
  {
    view: "cd2.vw_fr_followups_open",
    columns: [
      "followup_id (uuid)",
      "title (text)",
      "followup_type (text)",
      "status (text)",
      "due_at (timestamp)",
      "assigned_to_user_id (uuid)",
      "display_name (text)",
      "lane_key (text)",
      "lane_name (text)",
      "prospect_id (uuid)"
    ],
    notes: "Open/in-progress follow-ups list."
  },
  {
    view: "cd2.vw_fr_recent_pledges",
    columns: [
      "pledge_id (uuid)",
      "pledged_at (timestamp)",
      "pledged_amount (numeric)",
      "amount_received (numeric)",
      "outstanding_amount (numeric)",
      "status (text)",
      "display_name (text)",
      "lane_key (text)",
      "lane_name (text)",
      "prospect_id (uuid)"
    ],
    notes: "Recent 14-day pledges list."
  },
  {
    view: "cd2.vw_fr_pipeline_status_lane",
    columns: [
      "lane_key (text)",
      "lane_name (text)",
      "status (text)",
      "prospects (int)"
    ],
    notes: "Pipeline counts by lane and prospect status."
  }
];
