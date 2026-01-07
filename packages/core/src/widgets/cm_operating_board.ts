import type { WidgetDef } from "../types";

export const cmOperatingBoardWidgets: WidgetDef[] = [
  {
  'id': 'cm.scorecard.weekly_one_page',
  'pageKey': 'cm_operating_board',
  'title': 'Weekly Scorecard One-Page',
  'description': 'Single-page weekly scorecard per operating memo.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_weekly_scorecard'
  },
  'filtersSupported': [
    'week',
    'as_of'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [
    'outcome_a_status',
    'outcome_b_status',
    'outcome_c_status'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'cm.outcomes.floor_tracker',
  'pageKey': 'cm_operating_board',
  'title': 'Outcome Floors Tracker',
  'description': 'Progress vs floors: votes, turnout, share, Pulaski votes.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_outcome_floors_progress'
  },
  'filtersSupported': [
    'as_of',
    'county'
  ],
  'drilldownRoute': '/dashboard/field',
  'metricsUsed': [
    'primary_votes_total',
    'primary_turnout_total',
    'primary_vote_share_pct',
    'primary_pulaski_votes'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'cm.decisions.queue_classed',
  'pageKey': 'cm_operating_board',
  'title': 'Decisions Queue (Classed)',
  'description': 'Open decisions prioritized by Class II/III and SLA flags.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_decisions_queue_classed'
  },
  'filtersSupported': [
    'as_of',
    'status',
    'class'
  ],
  'drilldownRoute': '/dashboard/decisions',
  'metricsUsed': [
    'decisions_open_count',
    'decision_latency_days'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'cm.risks.heatmap',
  'pageKey': 'cm_operating_board',
  'title': 'Risk Heatmap',
  'description': 'Risks grouped by category with heating/stable status and owners.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_risk_heatmap'
  },
  'filtersSupported': [
    'as_of',
    'category',
    'status'
  ],
  'drilldownRoute': '/dashboard/risks',
  'metricsUsed': [
    'risks_heating_count',
    'risks_open_count'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'cm.stop_doing.active',
  'pageKey': 'cm_operating_board',
  'title': 'Stop-Doing List (Active)',
  'description': 'Active 'stop doing' commitments and exceptions.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_stop_doing_active'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
