import * as React from "react";

export function DashboardShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="text-2xl font-semibold">{title}</div>
        {subtitle ? <div className="text-white/70">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}
