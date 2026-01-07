import { NextRequest, NextResponse } from "next/server";

/**
 * TEMPORARY DISCORD STUB
 *
 * This endpoint intentionally bypasses Discord integration
 * so the app can deploy cleanly while core systems come online.
 *
 * Discord interactions expect a response with `type: 1`
 * to acknowledge receipt.
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json({ type: 1 });
}
// TODO: Restore Discord integration after v1 deploy
