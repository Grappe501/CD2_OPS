/**
 * Module 29 PATCH: Extend QuickAddHost to support fundraising quickAdd modals.
 *
 * Supported values:
 * - fr_log_call
 * - fr_add_pledge
 * - fr_add_followup
 * - fr_ai_precall
 * - fr_ai_followup
 *
 * You will likely have a central QuickAddHost that switches on `quickAdd` and renders modals.
 * Import these:
 *   import { FrLogCallModal } from "@/modules/fundraising/modals/FrLogCallModal";
 *   import { FrAddPledgeModal } from "@/modules/fundraising/modals/FrAddPledgeModal";
 *   import { FrAddFollowupModal } from "@/modules/fundraising/modals/FrAddFollowupModal";
 *   import { FrAiPreCallBriefModal } from "@/modules/fundraising/modals/FrAiPreCallBriefModal";
 *   import { FrAiFollowupDraftModal } from "@/modules/fundraising/modals/FrAiFollowupDraftModal";
 *
 * Add case blocks similar to existing quickAdd types.
 *
 * IMPORTANT: QuickAddHost needs context for prospect_id/display_name/inputs.
 * This module assumes you store a lightweight in-memory "quickAddContext"
 * in a small client store (e.g., Zustand) or you pass query params:
 *   ?quickAdd=fr_log_call&prospectId=...&name=...
 *
 * For MVP: use query params prospectId + name + lane + ask amounts.
 */
