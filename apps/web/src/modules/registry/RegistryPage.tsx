import React from "react";
import RegistryEmptyStateCTA from "./RegistryEmptyStateCTA";

type Props = {
  title?: string;
  description?: string;
};

/**
 * Compatibility wrapper for routes that expect a RegistryPage module.
 * The Registry system renders widgets via the core registry; when empty,
 * we show the existing EmptyState CTA.
 */
export default function RegistryPage({ title, description }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {title ? <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2> : null}
      {description ? <p style={{ margin: 0, opacity: 0.85 }}>{description}</p> : null}
      <RegistryEmptyStateCTA />
    </div>
  );
}
