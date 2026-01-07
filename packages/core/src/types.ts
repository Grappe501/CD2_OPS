export type Role = "cm"|"candidate"|"finance"|"field"|"comms"|"data"|"admin";
export type DataSource = {kind:"view";name:string}|{kind:"api";path:string};
export type GlobalFilterKey = "date_range"|"county"|"precinct"|"district"|"owner"|"lane"|"status";
export type PageKey =
  | "candidate_cockpit" | "cm_operating_board" | "finance_command" | "field_command"
  | "narrative_trust" | "decisions" | "risks" | "cadence" | "data_entry" | "admin_console" | "system_health";
export type WidgetDef = {
  id: string; pageKey: PageKey; title: string; description?: string;
  dataSource: DataSource; filtersSupported: GlobalFilterKey[]; drilldownRoute: string | null;
  metricsUsed: string[]; ownerRole: Role;
  purpose: string; decisionEnabled: string; definitionNotes?: string;
};
export type RouteDef = { key: string; path: string; title: string; pageKey: PageKey; rolesAllowed: Role[]; };
