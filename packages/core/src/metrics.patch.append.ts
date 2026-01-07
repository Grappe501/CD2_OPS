/**
 * PATCH INSTRUCTIONS (apply to your existing `packages/core/src/metrics.ts`)
 *
 * Add these metric keys to the METRICS dictionary/enum (exact structure may differ):
 *
 * // Scorecard / Outcomes
 * outcome_a_status
 * outcome_b_status
 * outcome_c_status
 * primary_votes_total
 * primary_turnout_total
 * primary_vote_share_pct
 * primary_pulaski_votes
 *
 * // Fundraising / Call time
 * fundraising_weekly_raised
 * fundraising_weekly_floor
 * fundraising_cash_on_hand_weeks
 * fundraising_dollars_per_hour
 * call_time_live_hours_wtd
 * call_time_live_hours_goal
 * followup_sla_48h_pct
 * ask_discipline_compliance_pct
 *
 * // Risks & Decisions
 * risks_heating_count
 * risks_open_count
 * decisions_open_count
 * decision_latency_days
 * cadence_miss_streak
 *
 * // Narrative
 * confusion_index
 * message_discipline_status
 * top_confusion_theme
 */
export {};
