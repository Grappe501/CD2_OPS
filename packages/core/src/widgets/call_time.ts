import type { WidgetDef } from "../types";

export const callTimeWidgets: WidgetDef[] = [
  {
  'id': 'calltime.calendar.blocks',
  'pageKey': 'call_time',
  'title': 'Call Blocks Calendar',
  'description': 'Protected vs completed call blocks and remaining capacity.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_call_blocks_calendar'
  },
  'filtersSupported': [
    'as_of',
    'week'
  ],
  'drilldownRoute': '/dashboard/call-time',
  'metricsUsed': [
    'call_time_live_hours_wtd'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'calltime.today.lane',
  'pageKey': 'call_time',
  'title': "Today's Lane + Script",
  'description': 'Lane-of-day assignment and primary script for the lane.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_call_time_lane_of_day'
  },
  'filtersSupported': [
    'as_of',
    'day_of_week'
  ],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'calltime.queue.followups',
  'pageKey': 'call_time',
  'title': 'Follow-up Queue',
  'description': 'Follow-up tasks prioritized by SLA countdown.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_followups_queue'
  },
  'filtersSupported': [
    'as_of',
    'overdue_only'
  ],
  'drilldownRoute': '/dashboard/data-entry/call-time',
  'metricsUsed': [
    'followup_sla_48h_pct'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'calltime.performance.dph_trend',
  'pageKey': 'call_time',
  'title': 'Dollars/Hour Trend',
  'description': 'Trend of dollars closed per live hour (weekly).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_call_time_dollars_per_hour_trend'
  },
  'filtersSupported': [
    'week'
  ],
  'drilldownRoute': '/dashboard/finance',
  'metricsUsed': [
    'fundraising_dollars_per_hour'
  ],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'calltime.scripts.by_lane',
  'pageKey': 'call_time',
  'title': 'Scripts by Lane',
  'description': 'Quick launch scripts by lane (read-only).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_call_time_scripts_by_lane'
  },
  'filtersSupported': [
    'lane'
  ],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
