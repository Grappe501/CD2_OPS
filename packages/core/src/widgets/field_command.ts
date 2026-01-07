import type { WidgetDef } from "../types";

export const fieldCommandWidgets: WidgetDef[] = [
  {
  'id': 'field.coverage.precinct_leads',
  'pageKey': 'field_command',
  'title': 'Precinct Lead Coverage',
  'description': 'Coverage % and missing precinct leaders list.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_field_precinct_lead_coverage'
  },
  'filtersSupported': [
    'as_of',
    'county'
  ],
  'drilldownRoute': '/dashboard/field',
  'metricsUsed': [],
  'ownerRole': 'field',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'field.pace.county_floor',
  'pageKey': 'field_command',
  'title': 'County Pace vs Floor',
  'description': 'County-level pace vs turnout/vote floors.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_field_county_pace'
  },
  'filtersSupported': [
    'as_of',
    'county'
  ],
  'drilldownRoute': '/dashboard/field',
  'metricsUsed': [
    'primary_turnout_total',
    'primary_votes_total'
  ],
  'ownerRole': 'field',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'field.funnel.contact_to_ballot',
  'pageKey': 'field_command',
  'title': 'Contact\u2192Ballot Funnel',
  'description': 'Conversion funnel from contact to ballot (where available).',
  'dataSource': {
    'kind': 'view',
    'name': 'v_field_contact_to_ballot_funnel'
  },
  'filtersSupported': [
    'as_of',
    'county'
  ],
  'drilldownRoute': '/dashboard/field',
  'metricsUsed': [],
  'ownerRole': 'field',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'field.events.activity',
  'pageKey': 'field_command',
  'title': 'Events + Activity',
  'description': 'Events, canvass shifts, and volunteer activity trend.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_field_events_activity'
  },
  'filtersSupported': [
    'as_of',
    'week',
    'county'
  ],
  'drilldownRoute': '/dashboard/field',
  'metricsUsed': [],
  'ownerRole': 'field',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
