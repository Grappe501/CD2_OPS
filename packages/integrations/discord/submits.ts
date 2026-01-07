/**
 * On modal submit, we call CD2_OPS form APIs.
 * This keeps DB writing logic centralized in the web app routes (audit logging, RBAC, etc).
 */
async function postJson(path: string, body: any) {
  const baseUrl = process.env.PUBLIC_BASE_URL || process.env.URL; // Netlify provides URL
  if (!baseUrl) throw new Error("Missing PUBLIC_BASE_URL or URL");

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CD2-Discord": "1" },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed");
  return json;
}

function fields(interaction: any): Record<string, string> {
  const comps = interaction?.data?.components ?? [];
  const out: Record<string, string> = {};
  for (const row of comps) {
    for (const c of row.components ?? []) out[c.custom_id] = String(c.value ?? "");
  }
  return out;
}

export async function handleModalSubmit(interaction: any) {
  const id = interaction?.data?.custom_id;
  const f = fields(interaction);

  try {
    if (id === "cd2_stopdoing") {
      await postJson("/api/forms/stop-doing", { title: f.title, reason: f.reason });
      return { type: 4, data: { content: "✅ Stop-Doing added." } };
    }
    if (id === "cd2_cadence") {
      await postJson("/api/forms/cadence", { window: f.window, title: f.title, description: f.notes, due_at: f.due_at });
      return { type: 4, data: { content: "✅ Cadence commitment added." } };
    }
    if (id === "cd2_question") {
      await postJson("/api/forms/narrative/question", { question: f.question, tag: f.tag, county: f.county, source: "discord" });
      return { type: 4, data: { content: "✅ Question captured." } };
    }
    if (id === "cd2_confusion") {
      await postJson("/api/forms/narrative/confusion", { level: f.level, theme: f.theme, county: f.county, notes: f.notes });
      return { type: 4, data: { content: "✅ Confusion signal logged." } };
    }
    if (id === "cd2_message") {
      await postJson("/api/forms/narrative/message-discipline", { status: f.status, notes: f.notes });
      return { type: 4, data: { content: "✅ Message discipline updated." } };
    }

    return { type: 4, data: { content: "Unsupported modal." } };
  } catch (e: any) {
    return { type: 4, data: { content: `❌ ${e?.message ?? "Error"}` } };
  }
}
