import React from "react";
import AppShell from "./AppShell";

type Props = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Lightweight page wrapper used by fundraising routes.
 * This repo already has multiple shell components; PageShell is a
 * compatibility layer so routes compile consistently.
 */
export default function PageShell({ title, subtitle, actions, children }: Props) {
  return (
    <AppShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          {title ? <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1> : null}
          {subtitle ? <p style={{ marginTop: 6, marginBottom: 0, opacity: 0.8 }}>{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>

      <div style={{ marginTop: 16 }}>{children}</div>
    </AppShell>
  );
}
