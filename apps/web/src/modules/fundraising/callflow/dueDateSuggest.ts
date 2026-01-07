export function suggestFollowupDueAt(outcome: string): string | null {
  // Returns an ISO string suitable for <input type="datetime-local"> value
  const now = new Date();
  const addHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000);

  // Rule-based defaults (non-AI, deterministic)
  switch (outcome) {
    case "talked": return toLocalInput(addHours(24));
    case "scheduled_callback": return toLocalInput(addHours(2));
    case "left_vm": return toLocalInput(addHours(48));
    case "no_answer": return toLocalInput(addHours(72));
    default: return null;
  }
}

function toLocalInput(d: Date): string {
  // YYYY-MM-DDTHH:MM
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
