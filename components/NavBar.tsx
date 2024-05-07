"use client";

import Link from "next/link";
import { HomePageNavLinks } from "../app/data";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();

    return (
        <>
            <nav className="flex items-center justify-between w-full h-16 px-4">
                <BackToHome />
                <div className="flex items-center justify-center w-full">
                    {HomePageNavLinks.map((link) => (
                        <Link href={link.link} key={link.name}>
                            <div
                                className={`bg-clip-text mr-3 text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl hover:font-medium ${
                                    pathname === link.link
                                        ? "text-white"
                                        : "text-gray-400"
                                }`}
                            >
                                {link.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
};

const BackToHome = () => {
    return (
        <Link href="/" className="flex items-center justify-center">
            <img
                src="./images/hero-image.webp"
                alt="Hero Image"
                className="w-12 h-12 absolute right-0 top-4 bg-clip-border bg-gradient-to-b from-white/80 to-white/70 border-2 border-transparent rounded-lg drop-shadow-2xl"
            />
        </Link>
    );
};

export default NavBar;
