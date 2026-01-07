/**
 * PATCH: Update these widget definitions to use the Module 23 views + add emptyState.
 * Replace existing widget defs or merge.
 */

export const WIDGET_PATCHES_MODULE24 = [
  // Narrative
  {
    id: "narrative.top_questions",
    dataSource: { kind: "view", view: "cd2.vw_narrative_top_questions" },
    emptyState: {
      title: "No voter questions yet",
      body: "Add the first question you’re hearing. One sentence is enough. This powers messaging and field responses.",
      primaryAction: { label: "Add a question", action: "openQuickAdd", payload: { type: "narrative_question" } },
      secondaryAction: { label: "Open onboarding", route: "/onboarding" },
      minRowsForHealthy: 5
    }
  },
  {
    id: "narrative.confusion_index",
    dataSource: { kind: "view", view: "cd2.vw_narrative_confusion_index" },
    emptyState: {
      title: "No confusion signals logged",
      body: "If voters seem confused, we want to know immediately. Log what you’re hearing so we can correct fast.",
      primaryAction: { label: "Add confusion signal", action: "openQuickAdd", payload: { type: "narrative_confusion" } },
      secondaryAction: { label: "Open onboarding", route: "/onboarding" },
      minRowsForHealthy: 3
    }
  },

  // CM / Cadence
  {
    id: "cm.stop_doing",
    dataSource: { kind: "view", view: "cd2.vw_cm_stop_doing_active" },
    emptyState: {
      title: "No stop-doing items",
      body: "Stop-Doing is how we protect focus. Add anything that is stealing time or drifting from the plan.",
      primaryAction: { label: "Add stop-doing", action: "openQuickAdd", payload: { type: "stop_doing" } },
      minRowsForHealthy: 1
    }
  },
  {
    id: "cadence.commitments_open",
    dataSource: { kind: "view", view: "cd2.vw_cadence_commitments_open" },
    emptyState: {
      title: "No open commitments",
      body: "Commitments create clarity and prevent surprises. Add the next thing we must deliver and its due date.",
      primaryAction: { label: "Add commitment", action: "openQuickAdd", payload: { type: "cadence" } },
      minRowsForHealthy: 1
    }
  }
];
