"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    COOKIE_NAME,
    SESSION_TTL_MS,
    signSession,
} from "@/lib/collections/auth";

/** Only ever redirect back inside the case — never let `from` become an
    open redirect to another origin or another part of the site. */
function safeDestination(from: FormDataEntryValue | null): string {
    const value = typeof from === "string" ? from : "";
    if (!value.startsWith("/collections")) return "/collections";
    if (value.startsWith("//")) return "/collections";
    if (value.startsWith("/collections/unlock")) return "/collections";
    return value;
}

export async function unlock(formData: FormData): Promise<void> {
    const password = process.env.COLLECTIONS_PASSWORD;
    const secret = process.env.COLLECTIONS_SECRET;
    const destination = safeDestination(formData.get("from"));

    const deny = () => {
        const params = new URLSearchParams({ e: "1" });
        if (destination !== "/collections") params.set("from", destination);
        redirect(`/collections/unlock?${params.toString()}`);
    };

    // Fail closed. An unconfigured deploy locks everyone out; it must never
    // let everyone in.
    if (!password || !secret) deny();

    const submitted = formData.get("password");
    if (typeof submitted !== "string" || submitted !== password) deny();

    const expiresAt = Date.now() + SESSION_TTL_MS;
    cookies().set({
        name: COOKIE_NAME,
        value: await signSession(expiresAt, secret!),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/collections",
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });

    redirect(destination);
}
