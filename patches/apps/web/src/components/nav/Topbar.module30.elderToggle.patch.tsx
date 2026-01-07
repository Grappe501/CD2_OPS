/**
 * Module 30 PATCH: Topbar — add Elder Mode toggle next to session chip.
 *
 * Import:
 *   import { useUiPrefs } from "@/modules/uiPrefs/useUiPrefs";
 *
 * Add a toggle button:
 *   const { prefs, toggleElderMode } = useUiPrefs();
 *   <Button variant="secondary" className="btn-elder" onClick={toggleElderMode}>
 *     {prefs.elderMode ? "Elder Mode: ON" : "Elder Mode: OFF"}
 *   </Button>
 *
 * Keep it visible to support low-tech users immediately.
 */
