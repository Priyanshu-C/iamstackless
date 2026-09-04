import type { Metadata } from "next";
import { unlock } from "./actions";

export const metadata: Metadata = {
    title: "Locked",
    robots: { index: false, follow: false },
};

export default function Unlock({
    searchParams,
}: {
    searchParams: { from?: string; e?: string };
}) {
    const failed = searchParams.e === "1";

    return (
        <main className="case-lock">
            <form className="case-lock-form" action={unlock}>
                <p className="case-label" id="case-lock-label">
                    {failed ? "Not this one." : "The case is locked."}
                </p>
                <input type="hidden" name="from" value={searchParams.from ?? ""} />
                <input
                    className="case-lock-input"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    aria-labelledby="case-lock-label"
                    aria-invalid={failed || undefined}
                    autoFocus
                    required
                />
                <button className="case-lock-go" type="submit">
                    Open
                </button>
            </form>
        </main>
    );
}
