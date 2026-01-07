/**
 * PATCH: Extend WidgetDef to support emptyState config.
 * Add to your WidgetDef interface/type:
 *
 * emptyState?: {
 *   title: string;
 *   body: string;
 *   primaryAction?: { label: string; action: "openQuickAdd"; payload?: any };
 *   secondaryAction?: { label: string; route: string };
 *   minRowsForHealthy?: number; // optional threshold for coaching
 * };
 */
