/**
 * PATCH: After fetching widget data rows, if rows.length === 0 and widget.emptyState exists,
 * render <EmptyState ...> above/inside the widget card.
 *
 * Requires:
 *   import { EmptyState } from "@/components/empty/EmptyState";
 * And a way to invoke Quick Add:
 *   - call your QuickAddModal/open function
 *   - or navigate to a route that opens the modal via query params
 *
 * Suggested router-driven quick add:
 *   /dashboard/<page>?quickAdd=narrative_question
 *
 * Example mapping:
 * function openQuickAdd(payload) {
 *   router.push(`${pathname}?quickAdd=${payload.type}`, { scroll:false });
 * }
 */
