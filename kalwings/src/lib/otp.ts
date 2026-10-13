import "server-only";
import { createHash, randomInt, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function normaliseIdentifier(raw: string): { kind: "email" | "phone"; value: string } | null {
  const v = raw.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254) return { kind: "email", value: v.toLowerCase() };
  const digits = v.replace(/[\s()-]/g, "");
  if (/^\+?\d{10,14}$/.test(digits)) return { kind: "phone", value: digits.startsWith("+") ? digits : digits.length === 10 ? `+91${digits}` : `+${digits}` };
  return null;
}

const hash = (id: string, code: string) => createHash("sha256").update(`${process.env.AUTH_SECRET}:${id}:${code}`).digest("hex");

/** Creates an OTP. Returns the code ONLY outside production (no SMS/email provider is wired yet). */
export async function issueOtp(identifier: string, ip: string): Promise<{ ok: boolean; devCode?: string; error?: string }> {
  if (!rateLimit(`otp-ip:${ip}`, 20, 60 * 60 * 1000)) return { ok: false, error: "Too many requests. Try again later." };
  const recent = await db.otpCode.count({ where: { identifier, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } } });
  if (recent >= 5) return { ok: false, error: "Too many codes requested. Try again in an hour." };
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.otpCode.create({ data: { identifier, codeHash: hash(identifier, code), expiresAt: new Date(Date.now() + TTL_MS) } });
  // TODO(email/SMS): deliver `code` via EMAIL_API_KEY / OTP_PROVIDER_API_KEY here.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] OTP for ${identifier}: ${code}`);
    return { ok: true, devCode: code };
  }
  return { ok: true };
}

export async function verifyOtp(identifier: string, code: string): Promise<boolean> {
  const rec = await db.otpCode.findFirst({ where: { identifier, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } });
  if (!rec || rec.attempts >= MAX_ATTEMPTS) return false;
  await db.otpCode.update({ where: { id: rec.id }, data: { attempts: { increment: 1 } } });
  const a = Buffer.from(rec.codeHash), b = Buffer.from(hash(identifier, code));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  await db.otpCode.deleteMany({ where: { identifier } });
  return true;
}
