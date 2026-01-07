/**
 * Register Discord slash commands for a guild (dev) or globally (prod).
 *
 * Usage:
 *   node scripts/discord/register-commands.mjs --guild
 *   node scripts/discord/register-commands.mjs --global
 *
 * Env:
 *   DISCORD_APPLICATION_ID
 *   DISCORD_BOT_TOKEN
 *   DISCORD_GUILD_ID (required for --guild)
 */
import { commands } from "../../packages/integrations/discord/commands.js";

const appId = process.env.DISCORD_APPLICATION_ID;
const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

if (!appId || !token) {
  console.error("Missing DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN");
  process.exit(1);
}

const args = process.argv.slice(2);
const mode = args.includes("--global") ? "global" : "guild";

const url =
  mode === "global"
    ? `https://discord.com/api/v10/applications/${appId}/commands`
    : `https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`;

if (mode === "guild" && !guildId) {
  console.error("Missing DISCORD_GUILD_ID for --guild");
  process.exit(1);
}

const res = await fetch(url, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`
  },
  body: JSON.stringify(commands)
});

const json = await res.json();
if (!res.ok) {
  console.error("Failed:", res.status, json);
  process.exit(1);
}
console.log("Registered:", json.map((c) => c.name).join(", "));
