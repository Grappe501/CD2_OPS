"use client";

import type { WidgetDef } from "@cd2/core";
import { WidgetEmpty } from "@/components/widgets/WidgetStates";
import { KpiTiles } from "@/components/widgets/KpiTiles";
import { DataTable } from "@/components/widgets/DataTable";
import { toneFromPacingStatus } from "@/lib/format";

/**
 * Adapters: translate `view rows` into real UI components.
 * Keep this file as the ONLY place that knows how to interpret view shapes.
 */

export function renderWidget(widget: WidgetDef, rows: any[]): React.ReactNode | null {
  const view = widget.dataSource.kind === "view" ? widget.dataSource.name : null;

  if (!view) return null;
  if (!rows || rows.length === 0) return <WidgetEmpty />;

  switch (view) {
    case "v_candidate_outcome_tiles": {
      const r = rows[0] ?? {};
      return (
        <KpiTiles
          items={[
            { label: "Runway", value: r.runway_days, format: "days" },
            { label: "Triggered risks", value: r.risks_triggered, format: "integer", tone: r.risks_triggered > 0 ? "bad" : "good" },
            { label: "Open decisions", value: r.decisions_open, format: "integer", tone: r.decisions_open > 7 ? "warn" : "neutral" },
            { label: "Freshness", value: "Live", format: "text", tone: "good", sublabel: "from Postgres view" },
          ]}
        />
      );
    }

    case "v_weekly_scorecard": {
      const r = rows[0] ?? {};
      const onTrack = Number(r.raised_week) >= Number(r.weekly_floor) && Number(r.weekly_floor) > 0;
      return (
        <KpiTiles
          items={[
            { label: "Raised (WTD)", value: r.raised_week, format: "currency", tone: onTrack ? "good" : "warn" },
            { label: "Weekly floor", value: r.weekly_floor, format: "currency" },
            { label: "Risks open", value: r.risks_open, format: "integer", tone: Number(r.risks_open) > 0 ? "warn" : "good" },
            { label: "Decisions open", value: r.decisions_open, format: "integer" },
          ]}
        />
      );
    }

    case "v_finance_runway": {
      const r = rows[0] ?? {};
      const tone = toneFromPacingStatus(r.pacing_status);
      return (
        <KpiTiles
          items={[
            { label: "Cash on hand", value: r.cash_on_hand, format: "currency" },
            { label: "Accounts payable", value: r.accounts_payable, format: "currency", tone: Number(r.accounts_payable) > 0 ? "warn" : "good" },
            { label: "Runway", value: r.runway_days, format: "days", tone: Number(r.runway_days) < 30 ? "warn" : "neutral" },
            { label: "Pacing", value: r.pacing_status, format: "text", tone },
          ]}
        />
      );
    }

    case "v_next_actions_queue": {
      return (
        <DataTable
          rows={rows}
          columns={[
            { key: "action_type", header: "Type" },
            { key: "action_title", header: "Title", className: "min-w-[320px]" },
            { key: "status", header: "Status" },
            { key: "owner_role", header: "Owner" },
            { key: "due_at", header: "Due", render: (r) => (r.due_at ? new Date(r.due_at).toLocaleDateString() : "—") },
          ]}
          rowKey={(r, i) => r.action_id ?? String(i)}
        />
      );
    }

    case "v_field_coverage_pace": {
      return (
        <DataTable
          rows={rows.slice(0, 200)}
          columns={[
            { key: "county", header: "County" },
            { key: "precinct", header: "Precinct" },
            { key: "precinct_lead_coverage_pct", header: "Precinct coverage (%)" },
            { key: "county_pace_pct", header: "County pace (%)" },
            { key: "pace_status", header: "Status" },
          ]}
          rowKey={(r, i) => `${r.county}-${r.precinct}-${i}`}
        />
      );
    }

    case "v_narrative_confusion": {
      return (
        <DataTable
          rows={rows}
          columns={[
            { key: "county", header: "County" },
            { key: "responses_count", header: "Responses" },
            { key: "confusion_index", header: "Confusion index" },
          ]}
          rowKey={(r, i) => `${r.county}-${i}`}
        />
      );
    }

    case "v_decisions_queue": {
      return (
        <DataTable
          rows={rows.slice(0, 200)}
          columns={[
            { key: "title", header: "Decision", className: "min-w-[320px]" },
            { key: "status", header: "Status" },
            { key: "owner_role", header: "Owner" },
            { key: "latency_days", header: "Latency (days)" },
            { key: "due_at", header: "Due", render: (r) => (r.due_at ? new Date(r.due_at).toLocaleDateString() : "—") },
          ]}
          rowKey={(r, i) => r.decision_id ?? String(i)}
        />
      );
    }

    case "v_risk_register": {
      return (
        <DataTable
          rows={rows.slice(0, 200)}
          columns={[
            { key: "title", header: "Risk", className: "min-w-[320px]" },
            { key: "status", header: "Status" },
            { key: "owner_role", header: "Owner" },
            { key: "severity", header: "Severity" },
            { key: "last_signal_at", header: "Last signal", render: (r) => (r.last_signal_at ? new Date(r.last_signal_at).toLocaleDateString() : "—") },
          ]}
          rowKey={(r, i) => r.risk_id ?? String(i)}
        />
      );
    }

    case "v_cadence_commitments": {
      return (
        <DataTable
          rows={rows}
          columns={[
            { key: "name", header: "Commitment", className: "min-w-[320px]" },
            { key: "owner_role", header: "Owner" },
            { key: "frequency", header: "Frequency" },
            { key: "status", header: "Status" },
            { key: "miss_streak", header: "Miss streak" },
            { key: "last_completed_at", header: "Last completed", render: (r) => (r.last_completed_at ? new Date(r.last_completed_at).toLocaleDateString() : "—") },
          ]}
          rowKey={(r, i) => r.cadence_id ?? String(i)}
        />
      );
    }

    default:
      return null;
  }
}
