import Link from "next/link";
import Footer from "../../../../components/Footer";
import NavBar from "../../../../components/NavBar";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <NextUIProvider>
                <div className="flex bg-gradient-to-br from-slate-50 to-gray-200 dark:bg-gradient-to-br dark:from-black dark:to-slate-900 min-h-screen flex-col items-center justify-between p-4">
                    <div className="relative lg:px-8 flex min-h-screen flex-col items-start justify-start p-4">
                        {children}
                    </div>
                    <Footer />
                </div>
            </NextUIProvider>
        </ThemeProvider>
    );
}
