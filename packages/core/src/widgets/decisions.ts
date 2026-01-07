import type { WidgetDef } from "../types";

export const decisionsWidgets: WidgetDef[] = [
  {
  'id': 'decisions.queue',
  'pageKey': 'decisions',
  'title': 'Decisions Queue',
  'description': 'All open decisions with owner, class, SLA, and status.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_decisions_queue'
  },
  'filtersSupported': [
    'as_of',
    'status',
    'class'
  ],
  'drilldownRoute': '/dashboard/data-entry/decisions',
  'metricsUsed': [
    'decisions_open_count'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'decisions.by_class',
  'pageKey': 'decisions',
  'title': 'Decisions by Class',
  'description': 'Counts and aging by decision class (I/II/III).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_decisions_by_class'
  },
  'filtersSupported': [
    'as_of',
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
  'id': 'decisions.latency_sla',
  'pageKey': 'decisions',
  'title': 'Decision Latency SLA',
  'description': 'How quickly decisions are resolved vs SLA targets.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_decision_latency_sla'
  },
  'filtersSupported': [
    'as_of',
    'week'
  ],
  'drilldownRoute': '/dashboard/decisions',
  'metricsUsed': [
    'decision_latency_days'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
