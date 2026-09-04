/* ============================================================
   THE CASE — the key.
   A signed, expiring token in an httpOnly cookie. Deliberately
   small: one shared password, no accounts, no sessions to manage.

   Uses the Web Crypto API rather than node:crypto because
   middleware.ts runs on the Edge runtime, where node:crypto is
   unavailable.
   ============================================================ */

export const COOKIE_NAME = "case_key";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
    let binary = "";
    const view = new Uint8Array(bytes);
    for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function hmac(message: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

/** Length-independent equality. Compares every byte regardless of mismatch. */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

/** `<expiresAt>.<signature>` — the expiry is signed, so it cannot be extended. */
export async function signSession(
    expiresAt: number,
    secret: string
): Promise<string> {
    const stamp = String(Math.floor(expiresAt));
    return `${stamp}.${await hmac(stamp, secret)}`;
}

/** Never throws. A malformed, forged, or expired token is simply false. */
export async function verifySession(
    token: string | undefined | null,
    secret: string,
    now: number = Date.now()
): Promise<boolean> {
    if (!token || !secret) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [stamp, signature] = parts;
    if (!/^\d+$/.test(stamp) || !signature) return false;

    try {
        const expected = await hmac(stamp, secret);
        if (!timingSafeEqual(signature, expected)) return false;
        return Number(stamp) > now;
    } catch {
        return false;
    }
}
