import type { WidgetDef } from "../types";

export const risksWidgets: WidgetDef[] = [
  {
  'id': 'risks.register',
  'pageKey': 'risks',
  'title': 'Risk Register',
  'description': 'Full risk register with heat, owners, and next steps.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_risk_register'
  },
  'filtersSupported': [
    'as_of',
    'status',
    'category'
  ],
  'drilldownRoute': '/dashboard/data-entry/risks',
  'metricsUsed': [
    'risks_open_count',
    'risks_heating_count'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'risks.heating_now',
  'pageKey': 'risks',
  'title': 'Heating Now',
  'description': 'Risks currently heating with triggered signals.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_risks_heating_now'
  },
  'filtersSupported': [
    'as_of',
    'category'
  ],
  'drilldownRoute': '/dashboard/risks',
  'metricsUsed': [
    'risks_heating_count'
  ],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'risks.early_warning_signals',
  'pageKey': 'risks',
  'title': 'Early Warning Signals (Recent)',
  'description': 'Recent signals logged against risks.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_risk_signals_recent'
  },
  'filtersSupported': [
    'as_of',
    'risk_id',
    'category'
  ],
  'drilldownRoute': '/dashboard/risks',
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
