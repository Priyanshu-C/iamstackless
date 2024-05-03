"use client";

import React, { useEffect } from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import Link from "next/link";
import Github from "../icons/github.svg";
import { useMediaQuery } from "../utils/hooks";

const SocialLinks = [
    {
        name: "Linkedin",
        link: "https://linkedin.com/in/priyanshu--chauhan",
        icon: "./icons/linkedin-social.svg",
    },
    {
        name: "Github",
        link: "https://github.com/Priyanshu-C",
        icon: "./icons/github-social.svg",
    },
    {
        name: "Twitter",
        link: "https://twitter.com/iamstackless",
        icon: "./icons/twitter-social.svg",
    },
    {
        name: "Medium",
        link: "https://iamstackless.medium.com/",
        icon: "./icons/medium-social.svg",
    },
];

const HomePageNavLinks = [
    {
        name: "Projects",
        link: "/projects",
    },
    {
        name: "Blog",
        link: "/blog",
    },
    {
        name: "About",
        link: "/about",
    },
];

export function BackgroundGradientAnimationDemo() {
    const ref = React.useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <div ref={ref} className="relative h-screen">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex z-10">
                {SocialLinks.map((link) => (
                    <Link href={link.link} key={link.name} target="_blank">
                        <img
                            src={link.icon}
                            alt={link.name}
                            className="w-8 h-8 mx-2 hover:scale-110 transform transition-all duration-300 ease-in-out"
                        />
                    </Link>
                ))}
            </div>

            <BackgroundGradientAnimation>
                <div className="absolute z-50 inset-0 flex flex-col items-center font-normal text-white px-4 pointer-events-none text-center md:text-4xl lg:text-7xl justify-center sm:flex-col md:flex-col lg:flex-row">
                    {!isMobile ? (
                        <div className="flex flex-col items-start justify-start sm:items-center sm:justify-center md:items-start md:justify-start lg:items-start lg:justify-start">
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
                                Hey, my name is{" "}
                            </p>
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white font-bold text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
                                Priyanshu Chauhan
                            </p>
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
                                I am a Senior Frontend Engineer
                            </p>
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b  text-white text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
                                at{" "}
                                <span className="font-bold">
                                    Platform, Razorpay{" "}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl">
                                Hey, my name is{" "}
                                <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white font-bold text-2xl">
                                    Priyanshu Chauhan
                                </p>
                            </p>{" "}
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl">
                                I am a
                            </p>
                            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl">
                                Senior Frontend Engineer <br /> at{" "}
                                <span className="font-bold">
                                    Platform, Razorpay{" "}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="w-40 h-40 md:w-40 md:h-40 lg:w-60 lg:h-60 ml-6 mt-4 md:ml-0 md:mt-4 lg:ml-4 lg:mt-0">
                        <img
                            src="./images/hero-image.webp"
                            alt="Hero Image"
                            className="w-40 md:w-60 lg:w-96 bg-clip-border bg-gradient-to-b from-white/80 to-white/70 border-4 border-transparent rounded-lg drop-shadow-2xl"
                        />
                    </div>
                </div>
            </BackgroundGradientAnimation>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
                {HomePageNavLinks.map((link) => (
                    <Link href={link.link} key={link.name} target="_blank">
                        <div className="bg-clip-text mr-3 text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl hover:font-medium">
                            {link.name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BackgroundGradientAnimationDemo;
