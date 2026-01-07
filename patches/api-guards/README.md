# Apply API Parity Guards (copy/paste)

For each handler in `apps/web/src/app/api/forms/<x>/route.ts`:

```ts
import { enforceApiAccess, apiError } from "@/lib/apiGuards";

export async function GET(req: Request) {
  try {
    await enforceApiAccess(req, "/dashboard/<route>");
    ...
  } catch (e) { return apiError(e); }
}
```

Canonical route mapping should match `lib/formApiAccessMap.ts`.
