import type { WidgetDef } from "../types";

export const financeCommandWidgets: WidgetDef[] = [
  {
  'id': 'finance.hero.runway_floors',
  'pageKey': 'finance_command',
  'title': 'Runway + Weekly Floors',
  'description': 'Cash runway weeks + weekly floor hit/miss streak.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_finance_runway'
  },
  'filtersSupported': [
    'as_of',
    'week'
  ],
  'drilldownRoute': '/dashboard/finance',
  'metricsUsed': [
    'fundraising_cash_on_hand_weeks',
    'fundraising_weekly_raised',
    'fundraising_weekly_floor'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'finance.calltime.discipline',
  'pageKey': 'finance_command',
  'title': 'Call Time Discipline',
  'description': 'Live hours WTD, dollars/hour, follow-up SLA, ask discipline compliance.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_call_time_discipline'
  },
  'filtersSupported': [
    'as_of',
    'week',
    'lane'
  ],
  'drilldownRoute': '/dashboard/call-time',
  'metricsUsed': [
    'call_time_live_hours_wtd',
    'call_time_live_hours_goal',
    'fundraising_dollars_per_hour',
    'followup_sla_48h_pct',
    'ask_discipline_compliance_pct'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'finance.pipeline.stages',
  'pageKey': 'finance_command',
  'title': 'Donor Pipeline Stages',
  'description': 'Pipeline volume by stage (prospect\u2192asked\u2192pledged\u2192closed).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_donor_pipeline_stages'
  },
  'filtersSupported': [
    'as_of',
    'stage'
  ],
  'drilldownRoute': '/dashboard/finance',
  'metricsUsed': [],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'finance.followups.sla_queue',
  'pageKey': 'finance_command',
  'title': 'Follow-ups SLA Queue',
  'description': 'Overdue/soon-due follow-ups with countdown timers.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_followups_sla_queue'
  },
  'filtersSupported': [
    'as_of',
    'overdue_only'
  ],
  'drilldownRoute': '/dashboard/call-time',
  'metricsUsed': [
    'followup_sla_48h_pct'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'finance.tripwires.panel',
  'pageKey': 'finance_command',
  'title': 'Tripwires Panel',
  'description': 'Triggered tripwires + recommended responses (tighten targeting, reduce volume, etc.).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_finance_tripwires'
  },
  'filtersSupported': [
    'as_of',
    'week'
  ],
  'drilldownRoute': '/dashboard/finance',
  'metricsUsed': [],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
