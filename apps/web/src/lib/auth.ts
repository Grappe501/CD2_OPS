import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionRole = "candidate" | "cm" | "finance" | "field" | "comms" | "data" | "admin";

export type SessionClaims = {
  sub: string; // user_id or stable identifier
  role: SessionRole;
  name?: string;
};

const COOKIE_NAME = "cd2_session";

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function setSessionCookie(claims: SessionClaims) {
  const token = await new SignJWT({ role: claims.role, name: claims.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NEXT_PUBLIC_ENV === "prod",
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", expires: new Date(0), path: "/" });
}

export async function getSessionFromRequest(req: Request): Promise<SessionClaims | null> {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const token = match[1];
    const { payload } = await jwtVerify(token, secretKey());
    const sub = payload.sub;
    const role = payload.role as SessionRole | undefined;
    if (!sub || !role) return null;
    return { sub, role, name: (payload.name as string | undefined) };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionClaims | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = payload.sub;
    const role = payload.role as SessionRole | undefined;
    if (!sub || !role) return null;
    return { sub, role, name: (payload.name as string | undefined) };
  } catch {
    return null;
  }
}
