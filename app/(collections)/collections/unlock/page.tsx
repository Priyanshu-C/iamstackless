import type { Metadata } from "next";
import Link from "next/link";
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
            <div className="case-lock-plate">
                <p className="case-lock-eyebrow">Priyanshu Chauhan</p>
                <h1 className="case-lock-title">The Case</h1>
                <p className="case-lock-blurb">
                    A private catalogue — watches, shoes, perfumes. Not much to
                    see from out here.
                </p>

                <form className="case-lock-form" action={unlock}>
                    <label className="case-lock-label" htmlFor="case-lock-key">
                        Key
                    </label>
                    <input
                        id="case-lock-key"
                        className="case-lock-input"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        aria-describedby={failed ? "case-lock-error" : undefined}
                        aria-invalid={failed || undefined}
                        autoFocus
                        required
                    />
                    <input
                        type="hidden"
                        name="from"
                        value={searchParams.from ?? ""}
                    />
                    <button className="case-lock-go" type="submit">
                        Open
                    </button>
                </form>

                {/* The error sits under the field it belongs to, and says only
                    that it was wrong — no hint, no attempt counter. */}
                <p
                    className="case-lock-error"
                    id="case-lock-error"
                    role="status"
                    data-failed={failed || undefined}
                >
                    {failed ? "Not this one." : null}
                </p>

                <Link className="case-lock-back" href="/">
                    <span aria-hidden="true">←</span> Back to the foundry
                </Link>
            </div>
        </main>
    );
}
