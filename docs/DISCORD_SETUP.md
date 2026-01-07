# CD2_OPS — Discord Setup (Module 18)

## Goal
Allow a volunteer to type `/question` in Discord and log a voter question in < 15 seconds.

## 1) Create Discord App
- Discord Developer Portal → Applications → New Application
- Copy:
  - Application ID  → `DISCORD_APPLICATION_ID`
  - Public Key      → `DISCORD_PUBLIC_KEY`
- Create Bot:
  - Reset token → `DISCORD_BOT_TOKEN`

## 2) Set Interaction Endpoint URL
In Developer Portal:
- Interactions Endpoint URL:
  - `<YOUR_DEPLOY_URL>/api/discord/interactions`

⚠️ Netlify note:
Depending on your adapter, your external URL may differ. The safest approach:
- deploy
- confirm the endpoint responds
- use the exact public URL in Discord Portal

## 3) Enable Privileged Intents
Not required for pure modal intake. Keep it minimal.

## 4) Register Commands
Local dev (guild):
- set env vars:
  - DISCORD_APPLICATION_ID
  - DISCORD_BOT_TOKEN
  - DISCORD_GUILD_ID
- run:
  - `node scripts/discord/register-commands.mjs --guild`

Prod (global):
- `node scripts/discord/register-commands.mjs --global`

## 5) Feature flag
Set:
- `ENABLE_DISCORD=true`

## 6) Test flow
1. Type `/question` in Discord
2. Modal appears
3. Submit modal
4. Discord replies ✅
5. In CD2_OPS Narrative dashboard:
   - Top Questions widget updates (after refresh)

## Security
- Requests are signature-verified using `DISCORD_PUBLIC_KEY`
- No bot token is required at runtime for interaction handling
