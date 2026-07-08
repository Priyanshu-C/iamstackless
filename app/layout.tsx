import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    style: ["normal", "italic"],
    axes: ["opsz"],
    variable: "--font-fraunces",
});

const grotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-grotesk",
});

export const metadata: Metadata = {
    title: "PRIYANSHU CHAUHAN — frontend engineer, cast in particles",
    description:
        "Stackless: the living specimen of Priyanshu Chauhan, frontend & platform engineer at Coinbase, previously Razorpay. Forty thousand grains of ink that assemble into a letter, scatter under your cursor, and heal.",
    icons: {
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23151310'/%3E%3Cg fill='%23e3402a'%3E%3Ccircle cx='9' cy='11' r='1.6'/%3E%3Ccircle cx='15' cy='8' r='1.6'/%3E%3Ccircle cx='21' cy='12' r='1.6'/%3E%3Ccircle cx='12' cy='16' r='1.6'/%3E%3Ccircle cx='18' cy='17' r='1.6'/%3E%3Ccircle cx='10' cy='22' r='1.6'/%3E%3Ccircle cx='22' cy='21' r='1.6'/%3E%3Ccircle cx='16' cy='24' r='1.6'/%3E%3C/g%3E%3C/svg%3E",
    },
    openGraph: {
        title: "PRIYANSHU CHAUHAN — type as matter",
        description:
            "A portfolio rendered as 40,000 particles in 3D. Morph the specimen, carve it with your cursor, watch it heal.",
    },
};

export const viewport: Viewport = {
    themeColor: "#f2ece1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${fraunces.variable} ${grotesk.variable}`}>
            <body>{children}</body>
        </html>
    );
}
