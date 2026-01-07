/**
 * PATCH: extend HelpTopic to include optional actions.
 *
 * export type HelpTopic = { key; title; body; actions?: HelpAction[] };
 *
 * Example actions:
 *   actions: [{ type:'openQuickAdd', quickAdd:'narrative_question', label:'Add a voter question' }]
 *
 * Update HelpDrawer to render actions under the list:
 *   import { HelpActionButton } from "@/components/help/HelpActionButton";
 */
