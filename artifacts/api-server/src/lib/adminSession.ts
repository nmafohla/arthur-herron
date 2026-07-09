import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env["ADMIN_PASSWORD"];
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is required but was not provided.");
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getSessionTokenFromRequest(req: Request): string | undefined {
  return req.cookies?.[COOKIE_NAME];
}

export function verifyPassword(password: string): boolean {
  const secret = getSecret();
  const passwordBuf = Buffer.from(password);
  const secretBuf = Buffer.from(secret);
  if (passwordBuf.length !== secretBuf.length) return false;
  return crypto.timingSafeEqual(passwordBuf, secretBuf);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = getSessionTokenFromRequest(req);
  if (!isValidSessionToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
