import type { WidgetDef } from "../types";

export const cadenceWidgets: WidgetDef[] = [
  {
  'id': 'cadence.commitments',
  'pageKey': 'cadence',
  'title': 'Cadence Commitments',
  'description': '90-day/6-week/2-week commitments tracked vs done.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_cadence_commitments'
  },
  'filtersSupported': [
    'as_of',
    'cadence_window',
    'owner_role'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'cadence.miss_streaks',
  'pageKey': 'cadence',
  'title': 'Cadence Miss Streaks',
  'description': 'Miss streaks and late commitments flagged.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_cadence_miss_streaks'
  },
  'filtersSupported': [
    'as_of',
    'owner_role'
  ],
  'drilldownRoute': '/dashboard/cm',
  'metricsUsed': [
    'cadence_miss_streak'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
