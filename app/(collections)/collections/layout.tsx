import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { default: "The Case", template: "%s · The Case" },
    robots: { index: false, follow: false },
};

export default function CaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="case">{children}</div>;
}
