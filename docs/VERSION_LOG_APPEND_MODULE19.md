## CD2_OPS v2.0.0 — Module 19 (Actor Attribution + Discord Mapping)
- Added cd2.discord_user_links table for Discord→CD2 user mapping
- Added server-side actor resolution helper `resolveActorUserId(req)`
- Added admin API to link/unlink Discord users to CD2 users (audited)
- Provided patches to Module 18 form routes to include actor_user_id on writes + audit entries
- Provided patch snippet to include Discord user id header on Discord modal submit posts

Checklist:
- [ ] Apply migration 015
- [ ] Ensure `/api/admin/discord/link` is added to access maps (Module 13 parity compiler)
- [ ] Apply PATCH files into your repo:
  - update form routes to use `resolveActorUserId`
  - update Discord submit handler to send `x-cd2-discord-user-id`
- [ ] Link a test Discord user to a CD2 user
- [ ] Submit a Discord modal and confirm audit shows actor name
