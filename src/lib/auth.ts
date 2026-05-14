import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const DEV_JWT_SECRET = "lens-photography-dev-secret";
export const AUTH_COOKIE_NAME = "auth-token";

export interface AuthPayload {
  userId: string;
  role: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

let cachedSecret: Uint8Array | null = null;

function getJwtSecret() {
  if (cachedSecret) return cachedSecret;

  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production");
  }

  cachedSecret = new TextEncoder().encode(secret || DEV_JWT_SECRET);
  return cachedSecret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function getSafeUser(user: SafeUser & { password?: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function signToken(payload: AuthPayload) {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export async function getAuthUser(request: Request) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const payload = await verifyToken(header.slice(7));
    if (payload) return payload;
  }

  const token = readCookie(request.headers.get("cookie"), AUTH_COOKIE_NAME);
  return token ? verifyToken(token) : null;
}

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const [key, ...valueParts] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }

  return null;
}

export function getJwtSecretForTests() {
  return getJwtSecret();
}

export function clearJwtSecretCacheForTests() {
  cachedSecret = null;
}
