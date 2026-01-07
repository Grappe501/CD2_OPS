# Module 18 — New Form Endpoints

All endpoints are protected by `enforceApiAccess` (Module 12).

- `POST /api/forms/stop-doing`
- `POST /api/forms/cadence`
- `POST /api/forms/narrative/question`
- `POST /api/forms/narrative/confusion`
- `POST /api/forms/narrative/message-discipline`

Notes:
- All write operations create an audit record via `auditLog`.
- Actor attribution: if your auth middleware provides actor_user_id, wire it into these routes (TODO in next module).
