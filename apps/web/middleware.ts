import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { Role } from "@cd2/core";

const COOKIE_NAME = "cd2_session";

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

type Session = { sub: string; role: Role };

async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const key = secretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    const role = payload.role as Role | undefined;
    const sub = payload.sub as string | undefined;
    if (!role || !sub) return null;
    return { role, sub };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/system") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // AUTH-ONLY gate for dashboard + forms APIs
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/forms") || pathname.startsWith("/api/admin")) {
    const session = await getSession(req);

    if (!session) {
      if (pathname.startsWith("/api/forms") || pathname.startsWith("/api/admin")) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Admin hard gate at edge (still safe and fast)
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/admin")) {
      if (session.role !== "admin") {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
        }
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard/unauthorized";
        url.searchParams.set("from", pathname);
        url.searchParams.set("hint", "admin_only");
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/forms/:path*", "/api/admin/:path*"],
};
