import type { WidgetDef } from "../types";

export const dataEntryWidgets: WidgetDef[] = [
  {
  'id': 'forms.call_time.log',
  'pageKey': 'data_entry',
  'title': 'Call Time Log (Form)',
  'description': 'Data entry form for call time logs (write).',
  'dataSource': {
    'kind': 'api',
    'path': '/api/forms/call-time'
  },
  'accessRoute': '/dashboard/data-entry/call-time',
  'filtersSupported': [],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'finance',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'forms.decisions.log',
  'pageKey': 'data_entry',
  'title': 'Decisions (Form)',
  'description': 'Data entry and edit/close workflow for decisions.',
  'dataSource': {
    'kind': 'api',
    'path': '/api/forms/decisions'
  },
  'accessRoute': '/dashboard/data-entry/decisions',
  'filtersSupported': [],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'forms.risks.log',
  'pageKey': 'data_entry',
  'title': 'Risks (Form)',
  'description': 'Data entry and edit/close workflow for risks.',
  'dataSource': {
    'kind': 'api',
    'path': '/api/forms/risks'
  },
  'accessRoute': '/dashboard/data-entry/risks',
  'filtersSupported': [],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'forms.audit.viewer',
  'pageKey': 'data_entry',
  'title': 'Audit Explorer',
  'description': 'Search/filter audit events with actor attribution.',
  'dataSource': {
    'kind': 'api',
    'path': '/api/forms/audit'
  },
  'accessRoute': '/dashboard/audit',
  'filtersSupported': [],
  'drilldownRoute': '/dashboard/audit',
  'metricsUsed': [],
  'ownerRole': 'cm',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
