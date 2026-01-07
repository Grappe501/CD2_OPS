import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";
import { routeInteraction } from "@/../packages/integrations/discord/router";

/**
 * Discord interactions endpoint.
 * Configure this URL in Discord Developer Portal:
 *  https://<your-netlify-domain>/.netlify/functions/next_api/discord/interactions
 * or the equivalent path for your Next.js + Netlify deployment.
 *
 * NOTE: Netlify path may differ based on adapter; adjust as needed.
 */
export async function POST(req: Request) {
  if (process.env.ENABLE_DISCORD !== "true") {
    return NextResponse.json({ ok: false, error: "Discord disabled" }, { status: 404 });
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) return NextResponse.json({ ok: false, error: "Missing DISCORD_PUBLIC_KEY" }, { status: 500 });

  const signature = req.headers.get("x-signature-ed25519") ?? "";
  const timestamp = req.headers.get("x-signature-timestamp") ?? "";
  const rawBody = await req.text();

  const isValid = verifyKey(rawBody, signature, timestamp, publicKey);
  if (!isValid) return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 401 });

  const interaction = JSON.parse(rawBody);
  const resBody = await routeInteraction(interaction);
  return NextResponse.json(resBody);
}
