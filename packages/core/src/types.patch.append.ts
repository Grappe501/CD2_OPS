/**
 * PATCH INSTRUCTIONS (apply to your existing `packages/core/src/types.ts`)
 *
 * 1) Add `accessRoute?: string` to WidgetDef.
 * 2) OPTIONAL (recommended later): convert WidgetDef into a discriminated union
 *    so api widgets require accessRoute.
 *
 * Example minimal change:
 *
 * export type WidgetDef = {
 *   ...
 *   dataSource: DataSource;
 *   accessRoute?: string; // NEW (required for dataSource.kind==="api" by policy)
 *   ...
 * }
 */
export {};
