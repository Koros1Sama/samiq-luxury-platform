/**
 * SAMIQ Enterprise Security Guard
 * 
 * Provides:
 * 1. Deep input sanitization (XSS & HTML tag stripping, script neutralization).
 * 2. Prototype pollution prevention (__proto__, constructor, prototype).
 * 3. In-memory sliding-window rate limiting per client IP.
 * 4. Tenant secret masking (Gemini API keys, Telegram tokens, passcodes).
 * 5. Admin authentication & session verification (HttpOnly cookies & headers).
 * 6. Numeric and price bounds validation (prevents negative values, NaN, overflows).
 */

import { NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'samiq_admin_session';
export const ADMIN_SESSION_TOKEN = 'authenticated_miftah_2026';
export const VALID_ADMIN_PASSCODES = new Set(['miftah2026', 'admin2026', 'samiq2026', 'owner2026', '1234']);

// -----------------------------------------------------------------------------
// 1. TEXT & INPUT SANITIZATION
// -----------------------------------------------------------------------------

/**
 * Strips HTML tags, script vectors, javascript: protocols, event handlers (onerror=, onload=),
 * removes hazardous control characters, trims and clamps text length.
 */
export function sanitizeText(input: unknown, maxLen = 500): string {
  if (input === null || input === undefined) {
    return '';
  }

  let text = typeof input === 'string' ? input : String(input);

  // Remove null bytes and hazardous non-printable control characters (keep standard whitespace: space, newline, tab)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip script blocks and their contents
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Strip style blocks and their contents
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Strip iframe, object, embed tags
  text = text.replace(/<(iframe|object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');

  // Neutralize javascript: and vbscript: URIs
  text = text.replace(/(?:javascript|vbscript|data):/gi, '');

  // Neutralize inline event handlers like onerror=, onload=, onclick=
  text = text.replace(/on\w+\s*=\s*["']?[^"'>\s]+/gi, '');

  // Strip any remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Decode basic suspicious hex/unicode entities that could bypass filters
  text = text.replace(/&#x?[0-9a-f]+;/gi, '');

  // Trim and clamp to maxLen
  text = text.trim();
  if (text.length > maxLen) {
    text = text.substring(0, maxLen);
  }

  return text;
}

/**
 * Deeply and recursively sanitizes an object, array, or scalar.
 * Blocks Prototype Pollution attacks (__proto__, constructor, prototype)
 * and strips XSS vectors from all nested string properties.
 */
export function sanitizeObjectDeep<T>(input: T, maxStringLen = 1000): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return sanitizeText(input, maxStringLen) as unknown as T;
  }

  if (typeof input === 'number') {
    return (Number.isFinite(input) ? input : 0) as unknown as T;
  }

  if (typeof input === 'boolean') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObjectDeep(item, maxStringLen)) as unknown as T;
  }

  if (typeof input === 'object') {
    const cleanObj: Record<string, any> = {};

    for (const key of Object.keys(input)) {
      // Prototype Pollution Prevention: ignore hazardous keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      // Sanitize key name itself to avoid weird property injection
      const cleanKey = sanitizeText(key, 100);
      if (!cleanKey) continue;

      const rawVal = (input as Record<string, any>)[key];
      cleanObj[cleanKey] = sanitizeObjectDeep(rawVal, maxStringLen);
    }

    return cleanObj as T;
  }

  return input;
}

// -----------------------------------------------------------------------------
// 2. NUMERIC & FINANCIAL VALIDATION
// -----------------------------------------------------------------------------

/**
 * Sanitizes numeric inputs ensuring they are valid finite numbers within [min, max].
 * Prevents NaN, -Infinity, +Infinity, and extreme buffer overflow prices.
 */
export function sanitizeNumber(
  val: unknown,
  fallback = 0,
  min = 0,
  max = 1_000_000_000
): number {
  if (val === null || val === undefined || val === '') {
    return fallback;
  }
  const parsed = Number(val);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
}

// -----------------------------------------------------------------------------
// 3. IN-MEMORY SLIDING-WINDOW RATE LIMITER
// -----------------------------------------------------------------------------

interface RateLimitBucket {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitBucket>();

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitStore.entries()) {
      // Remove timestamps older than 10 minutes
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 600_000);
      if (bucket.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
}

/**
 * Checks if a given request key (e.g. IP + endpoint) has exceeded maxRequests in windowMs.
 * Returns true if request is ALLOWED, false if RATE LIMITED.
 */
export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);

  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitStore.set(key, bucket);
  }

  // Filter timestamps within current window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  bucket.timestamps.push(now);
  return true; // Request allowed
}

/**
 * Extracts a dependable client IP from request headers.
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    return ips[0].trim();
  }
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}

// -----------------------------------------------------------------------------
// 4. SECRET MASKING & DATA LEAKAGE PREVENTION
// -----------------------------------------------------------------------------

/**
 * Masks all but last 4 characters of a sensitive token or key.
 */
export function maskSecret(secret?: string): string {
  if (!secret) return '';
  if (secret.length <= 4) return '••••';
  const visible = secret.slice(-4);
  return `••••••••••••${visible}`;
}

/**
 * Deeply sanitizes tenant data before returning to public clients:
 * - Masks Gemini API key and Telegram Bot token.
 * - Completely removes any passcodes or internal credentials.
 */
export function maskSensitiveTenantSecrets<T extends Record<string, any>>(tenant: T, isAdmin = false): T {
  if (!tenant || typeof tenant !== 'object') return tenant;

  const clone: Record<string, any> = { ...tenant };

  // Never leak passcodes regardless of role
  delete clone.passcode;
  delete clone.adminPasscode;

  if (clone.notificationConfig && typeof clone.notificationConfig === 'object') {
    const nc = { ...clone.notificationConfig };
    if (!isAdmin) {
      if (nc.geminiApiKey) nc.geminiApiKey = maskSecret(nc.geminiApiKey);
      if (nc.telegramBotToken) nc.telegramBotToken = maskSecret(nc.telegramBotToken);
    }
    clone.notificationConfig = nc;
  }

  return clone as T;
}

/**
 * Sanitizes project records in fleet queries, stripping plain admin passcodes for public view.
 */
export function maskSensitiveProjectSecrets<T extends Record<string, any>>(projects: T[], isAdmin = false): T[] {
  if (!Array.isArray(projects)) return [];
  return projects.map((p) => {
    const copy = { ...p };
    if (!isAdmin) {
      delete copy.adminPasscode;
    }
    return copy;
  });
}

/**
 * Sanitizes customer records so passwordHash is NEVER exposed in API responses.
 */
export function sanitizeCustomerResponse<T extends Record<string, any>>(customer: T): T {
  if (!customer || typeof customer !== 'object') return customer;
  const safe = { ...customer };
  delete safe.passwordHash;
  return safe;
}

// -----------------------------------------------------------------------------
// 5. ADMIN AUTHENTICATION & SESSION VERIFICATION
// -----------------------------------------------------------------------------

/**
 * Verifies if incoming request carries valid admin authorization:
 * - Cookie `samiq_admin_session=authenticated_miftah_2026`
 * - Header `x-samiq-admin-token` matching valid passcodes
 * - Header `authorization: Bearer <token>` matching valid passcodes
 * - Reject cross-site state mutating attacks (CSRF prevention)
 */
export function verifyAdminAuth(req: Request): { authorized: boolean; reason?: string } {
  // 1. Check HttpOnly cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const sessionCookie = cookies[ADMIN_COOKIE_NAME];

  if (sessionCookie === ADMIN_SESSION_TOKEN) {
    return { authorized: true };
  }

  // 2. Check x-samiq-admin-token header
  const customHeader = req.headers.get('x-samiq-admin-token');
  if (customHeader && VALID_ADMIN_PASSCODES.has(customHeader.trim())) {
    return { authorized: true };
  }

  // 3. Check Authorization: Bearer <token>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SESSION_TOKEN || VALID_ADMIN_PASSCODES.has(token)) {
      return { authorized: true };
    }
  }

  // 4. Same-origin browser request from admin UI with referer check
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');
  const secFetchSite = req.headers.get('sec-fetch-site');

  // If explicit cross-site request, reject immediately
  if (secFetchSite === 'cross-site') {
    return { authorized: false, reason: 'Cross-site mutation blocked' };
  }

  // If request originates from our own /admin or /platform page and has session flag
  if (
    host &&
    ((origin && origin.includes(host)) || (referer && referer.includes(host))) &&
    cookies['samiq_admin_active'] === '1'
  ) {
    return { authorized: true };
  }

  return { authorized: false, reason: 'Unauthorized admin access' };
}

/**
 * Sets the HttpOnly admin session cookie in the response.
 */
export function setAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: ADMIN_SESSION_TOKEN,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });

  // Client-readable indicator cookie for UI state sync
  response.cookies.set({
    name: 'samiq_admin_active',
    value: '1',
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400 * 7,
  });
}

/**
 * Clears the admin session cookie from the response.
 */
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: 'samiq_admin_active',
    value: '',
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Simple cookie string parser.
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });

  return list;
}
