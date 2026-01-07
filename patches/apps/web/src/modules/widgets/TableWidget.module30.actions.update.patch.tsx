/**
 * Module 30 PATCH: Next Calls row actions should open the unified Call Flow modal
 *
 * Replace:
 *   quickAdd=fr_log_call / fr_ai_precall / fr_ai_followup
 * With:
 *   quickAdd=fr_call_flow
 *
 * Query params suggested:
 *   ?quickAdd=fr_call_flow&prospectId=...&name=...&phone=...
 *
 * The Call Flow modal includes AI brief generation inside step 1.
 */
