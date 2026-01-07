/**
 * PATCH: include Discord user ID for attribution via cd2.discord_user_links
 */
async function postJson(path: string, body: any, discordUserId?: string) {
  const baseUrl = process.env.PUBLIC_BASE_URL || process.env.URL;
  if (!baseUrl) throw new Error("Missing PUBLIC_BASE_URL or URL");

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CD2-Discord": "1",
      ...(discordUserId ? { "x-cd2-discord-user-id": discordUserId } : {})
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed");
  return json;
}
