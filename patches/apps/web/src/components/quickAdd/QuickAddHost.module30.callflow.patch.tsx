/**
 * Module 30 PATCH: QuickAddHost — add `fr_call_flow`
 *
 * Add imports:
 *   import { FrCallFlowModal } from "@/modules/fundraising/modals/FrCallFlowModal";
 *
 * Add case:
 *   case "fr_call_flow":
 *     return <FrCallFlowModal open ... prospectId={ctx.prospectId} displayName={ctx.name} phone={ctx.phone} aiInputs={ctx.aiInputs} />
 *
 * For MVP context, accept query params:
 *   prospectId, name, phone
 * and build aiInputs from row fields if available.
 */
