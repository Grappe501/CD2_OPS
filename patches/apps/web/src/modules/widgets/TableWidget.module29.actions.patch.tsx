/**
 * Module 29 PATCH: Add row actions to the "Next 25 calls" table widget.
 *
 * For rows that include:
 *   - prospect_id
 *   - phone
 *   - display_name
 *
 * Add a right-side action column with:
 *   1) Call button (tel: link if phone exists)
 *   2) Log Call button -> pushes ?quickAdd=fr_log_call&prospectId=...&name=...
 *   3) AI Brief -> pushes ?quickAdd=fr_ai_precall&prospectId=...&name=...
 *   4) AI Follow-up -> pushes ?quickAdd=fr_ai_followup&prospectId=...&name=...
 *
 * Keep buttons large and friendly for low-tech users.
 */
