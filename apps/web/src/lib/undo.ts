export async function undo(entity_type: string, entity_id: string) {
  const res = await fetch("/api/forms/undo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_type, entity_id })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Undo failed");
  return json.row;
}
