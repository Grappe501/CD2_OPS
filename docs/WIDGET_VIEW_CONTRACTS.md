# CD2_OPS — Widget ↔ View Contracts (LOCKED)

## Purpose
Prevent UI drift and "mystery math" by explicitly defining the expected schema for every widget's data source.

## Conventions
- All views live in schema `cd2` (e.g., `cd2.v_weekly_scorecard`)
- Views include `as_of timestamptz` (or an equivalent timestamp column)
- Any widget that uses `/api/forms/*` must have `accessRoute` declared (Module 13)

## Status enums (recommended)
- `*_status`: `on_track | at_risk | off_track`
- `confusion_index`: `none | some | widespread`
- `heat`: `stable | heating`

---

## Candidate Cockpit (candidate_cockpit)

### candidate.hero.outcomes_abc
- **View:** `cd2.v_outcomes_abc_status`
- **Columns:** `as_of`, `outcome_a_status`, `outcome_b_status`, `outcome_c_status`, `risks_heating_count`

### candidate.hero.runway_calltime
- **View:** `cd2.v_finance_runway_calltime`
- **Columns:** `as_of`, `fundraising_cash_on_hand_weeks`, `call_time_live_hours_wtd`, `call_time_live_hours_goal`

### candidate.actions.next_7_days
- **View:** `cd2.v_next_actions_candidate`
- **Columns:** `as_of`, `action_id`, `title`, `owner_role`, `due_at`, `status`

### candidate.risks.top3
- **View:** `cd2.v_risks_top3`
- **Columns:** `as_of`, `risk_id`, `title`, `category`, `status`, `heat`, `owner_role`, `owner_user_id`, `created_at`, `updated_at`

---

## CM Operating Board (cm_operating_board)

### cm.scorecard.weekly_one_page
- **View:** `cd2.v_weekly_scorecard`
- **Columns:** `week_start`, `as_of`, `outcome_a_status`, `outcome_b_status`, `outcome_c_status`,
  floors + actuals (`floor_*`, `primary_*`), finance (`fundraising_*`), narrative (`confusion_index`, `message_discipline_status`)

### cm.outcomes.floor_tracker
- **View:** `cd2.v_outcome_floors_progress`
- **Columns:** `as_of`, `county`, `floor_*`, `primary_*`

### cm.decisions.queue_classed
- **View:** `cd2.v_decisions_queue_classed`
- **Columns:** `as_of`, `decision_id`, `title`, `decision_class`, `status`, `owner_role`, `owner_user_id`, `created_at`, `updated_at`, `age_days`

### cm.risks.heatmap
- **View:** `cd2.v_risk_heatmap`
- **Columns:** `as_of`, `category`, `risks_open_count`, `risks_heating_count`

### cm.stop_doing.active
- **View:** `cd2.v_stop_doing_active`
- **Columns:** `as_of`, `item_id`, `title`, `reason`, `created_at`
- **Note:** placeholder until stop_doing table exists

---

## Finance Command (finance_command)

### finance.hero.runway_floors
- **View:** `cd2.v_finance_runway`
- **Columns:** `as_of`, `fundraising_cash_on_hand_weeks`, `fundraising_weekly_raised`, `fundraising_weekly_floor`, `burn_rate_weekly`, `runway_weeks_at_current_burn`

### finance.calltime.discipline
- **View:** `cd2.v_call_time_discipline`
- **Columns:** `as_of`, `week_start`, `lane`, `call_time_live_hours_wtd`, `call_time_live_hours_goal`, `fundraising_dollars_per_hour`, `followup_sla_48h_pct`, `ask_discipline_compliance_pct`

### finance.pipeline.stages
- **View:** `cd2.v_donor_pipeline_stages`
- **Columns:** `as_of`, `stage`, `count_contacts`, `amount_expected` (placeholder)

### finance.followups.sla_queue
- **View:** `cd2.v_followups_sla_queue`
- **Columns:** `as_of`, `followup_id`, `contact_name`, `lane`, `due_at`, `minutes_overdue`, `owner_user_id` (placeholder)

### finance.tripwires.panel
- **View:** `cd2.v_finance_tripwires`
- **Columns:** `as_of`, `week_start`, `tripwire_*`, `recommended_response` (placeholder)

---

## Call Time (call_time)

### calltime.calendar.blocks
- **View:** `cd2.v_call_blocks_calendar`
- **Columns:** `as_of`, `day`, `blocks_planned`, `blocks_completed`, `hours_planned`, `hours_completed` (placeholder)

### calltime.today.lane
- **View:** `cd2.v_call_time_lane_of_day`
- **Columns:** `as_of`, `day_of_week`, `lane`, `script_key` (placeholder)

### calltime.queue.followups
- **View:** `cd2.v_followups_queue`
- **Columns:** same as `v_followups_sla_queue` (placeholder)

### calltime.performance.dph_trend
- **View:** `cd2.v_call_time_dollars_per_hour_trend`
- **Columns:** `week_start`, `as_of`, `fundraising_dollars_per_hour` (placeholder)

### calltime.scripts.by_lane
- **View:** `cd2.v_call_time_scripts_by_lane`
- **Columns:** `as_of`, `lane`, `script_key`, `script_text` (placeholder)

---

## Field Command (field_command)
- **Views:** `cd2.v_field_precinct_lead_coverage`, `cd2.v_field_county_pace`, `cd2.v_field_contact_to_ballot_funnel`, `cd2.v_field_events_activity`
- **Columns:** see SQL definitions in `021_views_ops_layers.sql` (placeholders)

---

## Narrative & Trust (narrative_trust)
- **Views:** `cd2.v_narrative_confusion`, `cd2.v_narrative_top_questions`, `cd2.v_message_discipline_status`
- **Columns:** see SQL definitions in `021_views_ops_layers.sql` (placeholders)

---

## Admin Console (admin_console)
- **Views:** `cd2.v_admin_users_summary`, `cd2.v_admin_permission_changes_7d`, `cd2.v_admin_audit_volume`
- **Columns:** see SQL definitions in `022_views_admin_and_system.sql`

