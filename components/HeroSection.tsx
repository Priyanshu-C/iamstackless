"use client";

import React, { useEffect } from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import Link from "next/link";

export function BackgroundGradientAnimationDemo() {
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            console.log(window.scrollY);
            if (window.scrollY > 100) {
                ref.current?.classList.add("opacity-80", "bg-white");
            } else {
                ref.current?.classList.remove("opacity-80", "bg-white");
            }
        });
    }, []);

    return (
        <div
            ref={ref}
            className="relative h-screen bg-gradient-to-br from-blue-500 to-blue-700"
        >
            <BackgroundGradientAnimation>
                <div className="absolute z-50 inset-0 flex items-center font-normal text-white px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl justify-center">
                    <div className="flex flex-col items-start justify-start ">
                        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-3xl ">
                            Hey, my name is{" "}
                        </p>
                        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white font-bold text-3xl ">
                            Priyanshu Chauhan
                        </p>
                        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-3xl">
                            I am a Senior Frontend Engineer
                        </p>
                        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b  text-white text-3xl">
                            at{" "}
                            <span className="font-bold">
                                Platform, Razorpay{" "}
                            </span>
                        </p>
                    </div>
                    <div className="w-20 h-20 md:w-40 md:h-40 lg:w-60 lg:h-60 ml-6">
                        <img
                            src="./images/hero-image.webp"
                            alt="Hero Image"
                            className="w-40 md:w-60 lg:w-96 bg-clip-border bg-gradient-to-b from-white/80 to-white/70 border-4 border-transparent rounded-lg drop-shadow-2xl"
                        />
                    </div>
                </div>
            </BackgroundGradientAnimation>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
                <Link href="/about">
                    <div className="bg-clip-text mr-3 text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl hover:font-medium">
                        Projects
                    </div>
                </Link>
                <Link href="/about">
                    <div className="bg-clip-text mr-3 text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl hover:font-medium">
                        Blog
                    </div>
                </Link>
                <Link href="/about">
                    <div className="bg-clip-text mr-3 text-transparent drop-shadow-2xl bg-gradient-to-b text-white text-2xl hover:font-medium">
                        About
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default BackgroundGradientAnimationDemo;
