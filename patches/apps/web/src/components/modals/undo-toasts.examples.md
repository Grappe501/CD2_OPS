# Module 24 — Undo Toast Wiring Examples

## Goal
After POST success, show toast:
- variant: success
- actionLabel: "Undo"
- onAction: calls undo(entity_type, entity_id)

---

## NarrativeQuestionModal.tsx
```ts
import { useToast } from "@/components/toast/useToast";
import { undo } from "@/lib/undo";

const { push } = useToast();

// after save:
push({
  title: "Question captured",
  description: "Thank you — this immediately shapes messaging.",
  variant: "success",
  actionLabel: "Undo",
  onAction: () => undo("narrative_question", row.question_id)
});
```

## NarrativeConfusionModal.tsx
```ts
push({
  title: "Confusion captured",
  description: "We’ll correct this quickly.",
  variant: "success",
  actionLabel: "Undo",
  onAction: () => undo("narrative_confusion_signal", row.signal_id)
});
```

## StopDoingModal.tsx
```ts
push({
  title: "Stop-doing added",
  description: "This protects focus.",
  variant: "success",
  actionLabel: "Undo",
  onAction: () => undo("stop_doing_item", row.item_id)
});
```

## CadenceCommitmentModal.tsx
```ts
push({
  title: "Commitment created",
  description: "Due dates prevent surprises.",
  variant: "success",
  actionLabel: "Undo",
  onAction: () => undo("cadence_commitment", row.commitment_id)
});
```
