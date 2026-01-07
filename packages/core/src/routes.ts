import type { RouteDef } from "./types";
export const ROUTES: RouteDef[] = [
  { key:"candidate", path:"/dashboard/candidate", title:"Candidate Cockpit", pageKey:"candidate_cockpit", rolesAllowed:["candidate","cm","admin"] },
  { key:"cm", path:"/dashboard/cm", title:"CM Operating Board", pageKey:"cm_operating_board", rolesAllowed:["cm","admin"] },
  { key:"finance", path:"/dashboard/finance", title:"Finance Command", pageKey:"finance_command", rolesAllowed:["finance","cm","admin"] },
  { key:"field", path:"/dashboard/field", title:"Field Command", pageKey:"field_command", rolesAllowed:["field","cm","admin"] },
  { key:"narrative", path:"/dashboard/narrative", title:"Narrative & Trust", pageKey:"narrative_trust", rolesAllowed:["comms","cm","admin"] },
  { key:"decisions", path:"/dashboard/decisions", title:"Decisions", pageKey:"decisions", rolesAllowed:["cm","admin"] },
  { key:"risks", path:"/dashboard/risks", title:"Risk Register", pageKey:"risks", rolesAllowed:["cm","admin"] },
  { key:"cadence", path:"/dashboard/cadence", title:"Cadence Control", pageKey:"cadence", rolesAllowed:["cm","admin"] },
  { key:"data_entry", path:"/dashboard/data-entry", title:"Data Entry", pageKey:"data_entry", rolesAllowed:["finance","field","comms","data","admin","cm"] },
  { key:"admin", path:"/dashboard/admin", title:"Admin Console", pageKey:"admin_console", rolesAllowed:["admin","cm"] },
  { key:"health", path:"/dashboard/system-health", title:"System Health", pageKey:"system_health", rolesAllowed:["admin","cm"] }
];
