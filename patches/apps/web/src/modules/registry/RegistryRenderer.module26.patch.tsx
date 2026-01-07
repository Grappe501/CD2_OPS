/**
 * PATCH: In RegistryRenderer, when widget.emptyState exists and rows.length===0:
 *
 * import { EmptyState } from "@/components/empty/EmptyState";
 * import { RegistryEmptyStateCTA } from "./RegistryEmptyStateCTA";
 *
 * return (
 *   <div className="rounded-xl border ...">
 *     <EmptyState
 *       title={widget.emptyState.title}
 *       body={widget.emptyState.body}
 *     />
 *     <RegistryEmptyStateCTA
 *       primary={widget.emptyState.primaryAction ? { label: widget.emptyState.primaryAction.label, action:'openQuickAdd', payload: widget.emptyState.primaryAction.payload } : undefined}
 *       secondary={widget.emptyState.secondaryAction ? { label: widget.emptyState.secondaryAction.label, route: widget.emptyState.secondaryAction.route } : undefined}
 *     />
 *   </div>
 * )
 *
 * NOTE: Your emptyState schema in widgets.ts should match Module 24.
 */
