# CD2_OPS — Discord ↔ User Linking (Module 19)

## Goal
When someone submits a Discord modal, the audit log should show the *real CD2 user name*.

## How it works
- API routes resolve `actor_user_id` using:
  1) `x-cd2-actor-user-id` (from your auth middleware/session)
  2) `x-cd2-discord-user-id` → lookup in `cd2.discord_user_links`

## Admin linking endpoint
`POST /api/admin/discord/link`
Body:
- `discord_user_id` (string snowflake)
- `user_id` (uuid string from cd2.users)
- `display_name` (optional)

`DELETE /api/admin/discord/link`
Body:
- `discord_user_id`

These are audited as `discord_user_link` events.

## Quick way to get a Discord user_id
In Discord:
- Enable Developer Mode (User Settings → Advanced)
- Right click the user → Copy User ID

## Recommended flow (team onboarding)
1) Create the CD2 user in Admin → Users
2) Link Discord user to CD2 user using `/api/admin/discord/link`
3) Test by submitting `/question` in Discord
4) Verify audit explorer shows actor name

## Security
- Keep admin endpoint restricted via entitlements (admin only).
