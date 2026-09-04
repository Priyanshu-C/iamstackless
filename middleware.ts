import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/collections/auth";

export const config = {
    matcher: ["/collections/:path*", "/collections"],
};

const UNLOCK = "/collections/unlock";

export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // The unlock screen must never be gated, or it redirects to itself.
    if (pathname === UNLOCK) return NextResponse.next();

    const ok = await verifySession(
        request.cookies.get(COOKIE_NAME)?.value,
        process.env.COLLECTIONS_SECRET ?? ""
    );
    if (ok) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = UNLOCK;
    url.search = "";
    url.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(url);
}
