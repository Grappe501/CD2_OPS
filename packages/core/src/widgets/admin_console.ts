import type { WidgetDef } from "../types";

export const adminConsoleWidgets: WidgetDef[] = [
  {
  'id': 'admin.users.directory',
  'pageKey': 'admin_console',
  'title': 'User Directory',
  'description': 'Admin user directory and management.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_admin_users_summary'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/admin/users',
  'metricsUsed': [],
  'ownerRole': 'admin',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'admin.permissions.changes_7d',
  'pageKey': 'admin_console',
  'title': 'Permission Changes (7d)',
  'description': 'Audit of permission changes last 7 days.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_admin_permission_changes_7d'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/audit',
  'metricsUsed': [],
  'ownerRole': 'admin',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'admin.audit.volume',
  'pageKey': 'admin_console',
  'title': 'Audit Volume',
  'description': 'Audit events volume by day and entity type.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_admin_audit_volume'
  },
  'filtersSupported': [
    'as_of',
    'entity_type'
  ],
  'drilldownRoute': '/dashboard/audit',
  'metricsUsed': [],
  'ownerRole': 'admin',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
