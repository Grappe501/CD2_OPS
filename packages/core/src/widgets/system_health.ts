import type { WidgetDef } from "../types";

export const systemHealthWidgets: WidgetDef[] = [
  {
  'id': 'system.health.status',
  'pageKey': 'system_health',
  'title': 'System Health',
  'description': 'DB connectivity, migrations, view freshness, parity checks.',
  'dataSource': {
    'kind': 'api',
    'path': '/api/system/health'
  },
  'accessRoute': '/dashboard/system-health',
  'filtersSupported': [],
  'drilldownRoute': null,
  'metricsUsed': [],
  'ownerRole': 'data',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
