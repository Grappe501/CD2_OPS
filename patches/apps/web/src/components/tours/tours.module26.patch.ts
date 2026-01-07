/**
 * PATCH: Extend TourStep type to include optional action.
 *
 * type TourStep = {
 *   id; title; body; selector?;
 *   action?: TourAction;
 * }
 *
 * Example:
 * { id:'t2', title:'Add a question', body:'...', action:{ type:'openQuickAdd', quickAdd:'narrative_question', label:'Add a question now' } }
 */
