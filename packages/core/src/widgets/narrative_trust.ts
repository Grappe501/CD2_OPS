import type { WidgetDef } from "../types";

export const narrativeTrustWidgets: WidgetDef[] = [
  {
  'id': 'narrative.confusion.index',
  'pageKey': 'narrative_trust',
  'title': 'Confusion Index',
  'description': 'None/Some/Widespread confusion indicator + trend.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_narrative_confusion'
  },
  'filtersSupported': [
    'as_of',
    'week',
    'county'
  ],
  'drilldownRoute': '/dashboard/comms',
  'metricsUsed': [
    'confusion_index'
  ],
  'ownerRole': 'comms',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'narrative.top_questions.week',
  'pageKey': 'narrative_trust',
  'title': 'Top Voter Questions',
  'description': 'Top voter questions by geography and frequency.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_narrative_top_questions'
  },
  'filtersSupported': [
    'as_of',
    'week',
    'county',
    'tag'
  ],
  'drilldownRoute': '/dashboard/comms',
  'metricsUsed': [],
  'ownerRole': 'comms',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
  {
  'id': 'narrative.message_discipline',
  'pageKey': 'narrative_trust',
  'title': 'Message Discipline Status',
  'description': 'Whether message discipline is holding, with notes.',
  'dataSource': {
    'kind': 'view',
    'name': 'v_message_discipline_status'
  },
  'filtersSupported': [
    'as_of'
  ],
  'drilldownRoute': '/dashboard/comms',
  'metricsUsed': [
    'message_discipline_status'
  ],
  'ownerRole': 'comms',
  'purpose': 'TODO: define purpose',
  'decisionEnabled': 'TODO: define decision this changes',
  'definitionNotes': 'TODO: add thresholds/caveats'
},
];
