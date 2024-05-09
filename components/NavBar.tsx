"use client";

import Link from "next/link";
import { HomePageNavLinks } from "../app/data";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const DarkModeMotionSpan = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.span
            className="bg-clip-text bg-gradient-to-b text-primary dark:text-primary-dark absolute"
            initial={{ opacity: 0, y: -50 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { type: "easeInOut", duration: 0.3 },
            }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
        >
            {children}
        </motion.span>
    );
};

const NavBar = () => {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <>
            <nav className="flex items-center justify-end w-full h-16 mb-8">
                <BackToHome />
                <div className="flex items-center justify-center">
                    {HomePageNavLinks.map((link) => (
                        <Link href={link.link} key={link.name}>
                            <div
                                className={`bg-clip-text mr-3 drop-shadow-2xl bg-gradient-to-b text-primary dark:text-primary-dark text-md sm:text-2xl ${
                                    pathname === link.link ? "font-bold" : ""
                                }`}
                            >
                                {link.name}
                            </div>
                        </Link>
                    ))}
                </div>
                <div
                    className="flex border rounded-md w-12 h-12 border-gray-400 dark:border-gray-100 items-center text-2xl justify-center cursor-pointer bg-white dark:bg-black p-2"
                    onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                >
                    <AnimatePresence>
                        <DarkModeMotionSpan key={resolvedTheme}>
                            {resolvedTheme === "dark" ? <FaSun /> : <FaMoon />}
                        </DarkModeMotionSpan>
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
};

const BackToHome = () => {
    return (
        <Link
            href="/"
            className="flex items-center absolute left-4 sm:left-8 justify-center"
        >
            <img
                src="./images/hero-image.webp"
                alt="Hero Image"
                className="w-12 h-12  bg-clip-border bg-gray-400 border border-transparent rounded-lg drop-shadow-2xl dark:from-black/80 dark:to-black/70 dark:border-gray-800"
            />
        </Link>
    );
};

export default NavBar;
