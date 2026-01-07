/**
 * Module 28 — Widget registry append (Fundraising dashboards)
 * Add to packages/core/src/widgets.ts
 *
 * NOTE: "filtersSupported" is illustrative — align with your existing filter schema.
 */
export const WIDGETS_APPEND_MODULE28 = [
  // Candidate cockpit
  {
    id: "fr.candidate.today_summary",
    pageKey: "fundraising.candidate",
    title: "Today",
    description: "Today’s call time output (hours, dials, connects, pledges).",
    ownerRole: "candidate",
    dataSource: { kind: "view", view: "cd2.vw_fr_owner_summary_today" },
    filtersSupported: ["owner_user_id"],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.hours", "fr.dials", "fr.connects", "fr.pledges_total"],
    purpose: "Give the candidate a single glance to know if today was a win.",
    decisionEnabled: "Stay on pace or add an extra call block.",
    definitionNotes: "Pledges_total sums pledges logged today; receipts are tracked separately in future modules."
  },
  {
    id: "fr.candidate.week_summary",
    pageKey: "fundraising.candidate",
    title: "Last 7 days",
    description: "7-day output trend for the candidate.",
    ownerRole: "candidate",
    dataSource: { kind: "view", view: "cd2.vw_fr_owner_summary_7d" },
    filtersSupported: ["owner_user_id"],
    drilldownRoute: "/fundraising/finance",
    metricsUsed: ["fr.hours_7d", "fr.dials_7d", "fr.connects_7d", "fr.pledges_total_7d"],
    purpose: "Shows if the candidate is building momentum or slipping.",
    decisionEnabled: "Adjust call time blocks and list strategy.",
    definitionNotes: "7-day rollup excludes deleted rows."
  },
  {
    id: "fr.candidate.next_calls",
    pageKey: "fundraising.candidate",
    title: "Next 25 calls",
    description: "Auto-sorted queue of who to call next.",
    ownerRole: "candidate",
    dataSource: { kind: "view", view: "cd2.vw_fr_next_calls" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/finance",
    metricsUsed: ["fr.next_calls"],
    purpose: "Removes friction: candidate opens the page and starts dialing.",
    decisionEnabled: "Call the next person now.",
    definitionNotes: "Sorted by next_action_at, then last_contact_at, then ask amount."
  },

  // Finance dashboard
  {
    id: "fr.finance.followup_sla",
    pageKey: "fundraising.finance",
    title: "Follow-up SLA",
    description: "Open follow-ups by urgency.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_followup_sla" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.followup_open", "fr.followup_overdue", "fr.followup_due_48h"],
    purpose: "Follow-up discipline is where money is won or lost.",
    decisionEnabled: "Reassign tasks and clear overdue items.",
    definitionNotes: "Counts only open/in_progress; excludes deleted."
  },
  {
    id: "fr.finance.pledge_aging",
    pageKey: "fundraising.finance",
    title: "Pledge aging",
    description: "Outstanding pledge dollars by age bucket.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_pledge_aging" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.pledge_outstanding"],
    purpose: "Prevents silent leakage of pledged dollars.",
    decisionEnabled: "Prioritize follow-ups by age bucket.",
    definitionNotes: "Includes pledged/partial only."
  },
  {
    id: "fr.finance.lane_performance",
    pageKey: "fundraising.finance",
    title: "Lane performance",
    description: "Connect rate and pledge totals by lane.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_lane_performance" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/finance",
    metricsUsed: ["fr.connect_rate", "fr.pledges_total", "fr.received_total"],
    purpose: "Shows where lists are working and where they are failing.",
    decisionEnabled: "Shift time and list quality efforts to the best lanes.",
    definitionNotes: "connect_rate_pct computed from dials/connects."
  },
  {
    id: "fr.finance.recent_pledges",
    pageKey: "fundraising.finance",
    title: "Recent pledges (14d)",
    description: "Pledges logged in the last 14 days.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_recent_pledges" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.pledges_recent"],
    purpose: "Keeps the finance team locked on the freshest dollars.",
    decisionEnabled: "Trigger thank-you/reminder workflows.",
    definitionNotes: "Outstanding_amount is pledged - received."
  },
  {
    id: "fr.finance.pipeline",
    pageKey: "fundraising.finance",
    title: "Pipeline (status × lane)",
    description: "How many prospects are in each pipeline stage per lane.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_pipeline_status_lane" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/finance",
    metricsUsed: ["fr.pipeline_counts"],
    purpose: "Ensures we keep enough prospects in motion to hit goals.",
    decisionEnabled: "Move prospects from new → queued → active with weekly discipline.",
    definitionNotes: "Counts exclude deleted prospects."
  },

  // Follow-ups page
  {
    id: "fr.followups.overdue_list",
    pageKey: "fundraising.followups",
    title: "Overdue follow-ups",
    description: "Most urgent follow-ups (past due).",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_followups_overdue" },
    filtersSupported: ["assigned_to_user_id"],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.followups_overdue_list"],
    purpose: "The money is in the follow-up. This is the hit list.",
    decisionEnabled: "Clear overdue items today.",
    definitionNotes: "Overdue = due_at < now, status open/in_progress."
  },
  {
    id: "fr.followups.open_list",
    pageKey: "fundraising.followups",
    title: "Open follow-ups",
    description: "All open follow-ups.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_followups_open" },
    filtersSupported: ["assigned_to_user_id"],
    drilldownRoute: "/fundraising/followups",
    metricsUsed: ["fr.followups_open_list"],
    purpose: "Full view of follow-up workload.",
    decisionEnabled: "Rebalance assignments and due dates.",
    definitionNotes: "Sorted by due date."
  },

  // Events page
  {
    id: "fr.events.rollup",
    pageKey: "fundraising.events",
    title: "Events rollup",
    description: "Invites, confirmations, attendance, received totals per event.",
    ownerRole: "finance",
    dataSource: { kind: "view", view: "cd2.vw_fr_events_rollup" },
    filtersSupported: [],
    drilldownRoute: "/fundraising/events",
    metricsUsed: ["fr.events_received_total"],
    purpose: "Quick ROI check for events.",
    decisionEnabled: "Double down on events that convert; fix the ones that don’t.",
    definitionNotes: "Received_total sums invite-level received amounts."
  }
];
