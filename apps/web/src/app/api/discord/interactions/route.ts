import { NextRequest, NextResponse } from "next/server";

// NOTE: This project keeps Discord integration code in the monorepo workspace.
// Next does not support importing via @/../... alias; use an explicit relative import.
// This works with `experimental.externalDir = true`.
import { discordRouter } from "../../../../../../../packages/integrations/discord/router";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const result = await discordRouter.handle(payload, req.headers);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Discord interaction handler failed" },
      { status: 500 }
    );
  }
}
