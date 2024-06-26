import React from "react";
import { SocialLinks } from "../app/data";
import Link from "next/link";

const Social = () => {
    return SocialLinks.map((link) => (
        <Link
            href={link.link}
            key={link.name}
            target="_blank"
            className="w-6 h-6 mx-1.5 text-2xl hover:scale-110 transform transition-all duration-300 ease-in-out"
        >
            {link.icon}
        </Link>
    ));
};

export default Social;
