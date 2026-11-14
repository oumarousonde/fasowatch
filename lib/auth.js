import { createHash, timingSafeEqual } from 'node:crypto';

const h = (s) => createHash('sha256').update(String(s ?? '')).digest();

export function safeEqual(a, b) {
  return timingSafeEqual(h(a), h(b));
}

export function isCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return safeEqual(req.headers.authorization || '', `Bearer ${secret}`);
}

export function isAdmin(req) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(req.headers['x-admin-password'] || '', pw);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
