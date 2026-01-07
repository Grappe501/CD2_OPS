import type { WidgetDef } from "../types";

export const candidateCockpitWidgets: WidgetDef[] = [
  {
  'id': 'candidate.hero.outcomes_abc',
  'pageKey': 'candidate_cockpit',
  'title': 'Outcomes A/B/C Status',
  'description': 'Weekly scorecard status for Outcomes A, B, C + heating risk count.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_outcomes_abc_status'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [
    'outcome_a_status',
    'outcome_b_status',
    'outcome_c_status',
    'risks_heating_count'
  ],
  'ownerRole': 'candidate',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'candidate.hero.runway_calltime',
  'pageKey': 'candidate_cockpit',
  'title': 'Runway + Call Time Protection',
  'description': 'Cash runway weeks + live call hours WTD vs goal.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_finance_runway_calltime'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/finance',
  'metricsUsed': [
    'fundraising_cash_on_hand_weeks',
    'call_time_live_hours_wtd',
    'call_time_live_hours_goal'
  ],
  'ownerRole': 'candidate',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'candidate.actions.next_7_days',
  'pageKey': 'candidate_cockpit',
  'title': 'Next Actions (7 days)',
  'description': 'Top 5\u201310 actions for the candidate with due dates and owners.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_next_actions_candidate'
  },
  'filtersSupported': [
    'as_of',
    'owner_role'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [],
  'ownerRole': 'candidate',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'candidate.risks.top3',
  'pageKey': 'candidate_cockpit',
  'title': 'Top 3 Risks',
  'description': 'Highest heat risks with owner + next response.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_risks_top3'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/risks',
  'metricsUsed': [
    'risks_heating_count'
  ],
  'ownerRole': 'candidate',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
