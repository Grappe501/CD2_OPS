import type { MetricFormat } from "@/lib/format";

export type MetricKey =
  | "finance_runway_days"
  | "finance_cash_on_hand"
  | "finance_accounts_payable"
  | "finance_weekly_floor"
  | "finance_raised_week"
  | "finance_pacing_status"
  | "ops_decisions_open"
  | "ops_risks_triggered"
  | "field_precinct_coverage"
  | "field_county_pace"
  | "narrative_confusion_index";

export type MetricDef = {
  key: MetricKey;
  label: string;
  format: MetricFormat;
  description: string;
};

export const METRICS: Record<MetricKey, MetricDef> = {
  finance_runway_days: {
    key: "finance_runway_days",
    label: "Runway",
    format: "days",
    description: "Projected days of runway at current burn rate."
  },
  finance_cash_on_hand: {
    key: "finance_cash_on_hand",
    label: "Cash on hand",
    format: "currency",
    description: "Latest available cash on hand."
  },
  finance_accounts_payable: {
    key: "finance_accounts_payable",
    label: "A/P",
    format: "currency",
    description: "Outstanding accounts payable."
  },
  finance_weekly_floor: {
    key: "finance_weekly_floor",
    label: "Weekly floor",
    format: "currency",
    description: "Minimum weekly fundraising target."
  },
  finance_raised_week: {
    key: "finance_raised_week",
    label: "Raised (WTD)",
    format: "currency",
    description: "Week-to-date fundraising total."
  },
  finance_pacing_status: {
    key: "finance_pacing_status",
    label: "Pacing",
    format: "text",
    description: "Derived pacing status (on_track/behind/unknown)."
  },
  ops_decisions_open: {
    key: "ops_decisions_open",
    label: "Open decisions",
    format: "integer",
    description: "Decisions in open/blocked status."
  },
  ops_risks_triggered: {
    key: "ops_risks_triggered",
    label: "Triggered risks",
    format: "integer",
    description: "Risks in triggered status."
  },
  field_precinct_coverage: {
    key: "field_precinct_coverage",
    label: "Precinct coverage",
    format: "percent",
    description: "Percent precinct lead coverage."
  },
  field_county_pace: {
    key: "field_county_pace",
    label: "County pace",
    format: "percent",
    description: "Percent pace toward county targets."
  },
  narrative_confusion_index: {
    key: "narrative_confusion_index",
    label: "Confusion index",
    format: "number",
    description: "Composite message confusion measure."
  }
};
