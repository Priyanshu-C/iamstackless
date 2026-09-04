import { describe, expect, it } from "vitest";
import { SESSION_TTL_MS, signSession, verifySession } from "./auth";

const SECRET = "a-test-secret";
const OTHER = "a-different-secret";
const future = () => Date.now() + SESSION_TTL_MS;

describe("signSession / verifySession", () => {
    it("round-trips a token it signed", async () => {
        const token = await signSession(future(), SECRET);
        expect(await verifySession(token, SECRET)).toBe(true);
    });

    it("rejects a token signed with a different secret", async () => {
        const token = await signSession(future(), OTHER);
        expect(await verifySession(token, SECRET)).toBe(false);
    });

    it("rejects a tampered signature", async () => {
        const token = await signSession(future(), SECRET);
        const [exp, sig] = token.split(".");
        const flipped = sig[0] === "A" ? `B${sig.slice(1)}` : `A${sig.slice(1)}`;
        expect(await verifySession(`${exp}.${flipped}`, SECRET)).toBe(false);
    });

    it("rejects a tampered expiry, even though it was signed", async () => {
        const token = await signSession(Date.now() - 1000, SECRET);
        const [, sig] = token.split(".");
        expect(await verifySession(`${future()}.${sig}`, SECRET)).toBe(false);
    });

    it("rejects an expired token", async () => {
        const token = await signSession(Date.now() - 1, SECRET);
        expect(await verifySession(token, SECRET)).toBe(false);
    });

    it("accepts a token that has not yet expired", async () => {
        const token = await signSession(Date.now() + 5000, SECRET);
        expect(await verifySession(token, SECRET)).toBe(true);
    });

    it.each(["", "garbage", "1.2.3", ".", "abc.", ".abc", "12345"])(
        "returns false rather than throwing on %o",
        async (bad) => {
            await expect(verifySession(bad, SECRET)).resolves.toBe(false);
        }
    );

    it("fails closed when the secret is empty", async () => {
        const token = await signSession(future(), SECRET);
        expect(await verifySession(token, "")).toBe(false);
    });
});
