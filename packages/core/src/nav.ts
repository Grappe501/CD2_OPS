export type Role = "candidate" | "cm" | "finance" | "field" | "comms" | "data" | "admin";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  roles: Role[]; // allowed roles
  group: "Dashboards" | "Data Entry" | "Ops" | "Admin";
  description?: string;
};

export const NAV: NavItem[] = [
  { key: "dash_candidate", label: "Candidate", href: "/dashboard/candidate", roles: ["candidate","cm","admin"], group: "Dashboards" },
  { key: "dash_cm", label: "CM", href: "/dashboard/cm", roles: ["cm","admin"], group: "Dashboards" },
  { key: "dash_finance", label: "Finance", href: "/dashboard/finance", roles: ["finance","cm","admin"], group: "Dashboards" },
  { key: "dash_field", label: "Field", href: "/dashboard/field", roles: ["field","cm","admin"], group: "Dashboards" },
  { key: "dash_comms", label: "Comms", href: "/dashboard/comms", roles: ["comms","cm","admin"], group: "Dashboards" },
  { key: "dash_data", label: "Data", href: "/dashboard/data", roles: ["data","cm","admin"], group: "Dashboards" },

  { key: "entry_hub", label: "Data Entry", href: "/dashboard/data-entry", roles: ["candidate","cm","finance","field","comms","data","admin"], group: "Data Entry" },
  { key: "entry_calls", label: "Call Time", href: "/dashboard/data-entry/call-time", roles: ["candidate","cm","finance","admin"], group: "Data Entry" },
  { key: "entry_decisions", label: "Decisions", href: "/dashboard/data-entry/decisions", roles: ["candidate","cm","admin"], group: "Data Entry" },
  { key: "entry_risks", label: "Risks", href: "/dashboard/data-entry/risks", roles: ["cm","admin","finance","field","comms","data"], group: "Data Entry" },

  { key: "ops_audit", label: "Audit Explorer", href: "/dashboard/audit", roles: ["cm","admin"], group: "Ops" },

  { key: "admin_users", label: "Users", href: "/dashboard/admin/users", roles: ["admin"], group: "Admin" },
];
