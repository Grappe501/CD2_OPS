import { NextResponse } from "next/server";
import { getAllowedViewNames } from "@/lib/views";
import { queryView } from "@/lib/queryView";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? "";
  const limit = Number(searchParams.get("limit") ?? "200");

  const allowed = getAllowedViewNames();
  if (!allowed.includes(name)) {
    return NextResponse.json(
      { ok: false, as_of: new Date().toISOString(), error: "View not allowed", allowed_views: allowed },
      { status: 400 }
    );
  }

  try {
    const { rows } = await queryView({ viewName: name, limit: Number.isFinite(limit) ? limit : 200 });
    const asOf = rows?.[0]?.as_of ?? new Date().toISOString();
    return NextResponse.json({ ok: true, as_of: asOf, rows, meta: { view: name, limit } });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, as_of: new Date().toISOString(), error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
