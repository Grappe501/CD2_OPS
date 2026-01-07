import { WIDGETS } from "@cd2/core";

export function getAllowedViewNames(): string[] {
  const set = new Set<string>();
  for (const w of WIDGETS) {
    if (w.dataSource.kind === "view") set.add(w.dataSource.name);
  }
  return Array.from(set).sort();
}
