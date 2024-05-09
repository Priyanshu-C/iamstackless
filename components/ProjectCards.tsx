"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
    ProjectsType,
    TECH_STACK_ENUM,
    techIcons,
} from "../app/(all-routes)/projects/data";

export const ProjectCards = ({
    items,
    className,
}: {
    items: ProjectsType[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="relative group  block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{item.title}</CardTitle>
                        <CardImage src={item.image} />
                        <CardDescription>{item.description}</CardDescription>
                        <CardTechStack techStack={item.techStack} />
                        <div className="flex justify-around mt-4 flex-1 items-end">
                            <Link
                                href={item.github}
                                className="h-10 w-24 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-100 dark:text-black dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                target="_blank"
                            >
                                Github
                            </Link>
                            <Link
                                href={item.link}
                                className="h-10 w-24 text-center text-white bg-gray-800 border border-slate-100 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                target="_blank"
                            >
                                Live
                            </Link>
                        </div>
                        {/* <Meteors number={10} /> */}
                    </Card>
                </div>
            ))}
        </div>
    );
};

const CardImage = ({ src }: { src?: string }) => {
    return (
        <div className="relative w-full mt-4 h-32 border border-slate-400 dark:border-white/[0.2] rounded-md overflow-hidden">
            <img src={src} className="object-cover w-full h-full rounded-md" />
        </div>
    );
};

const CardTechStack = ({
    techStack,
}: {
    techStack?: ProjectsType["techStack"];
}) => {
    return (
        <div className="flex flex-wrap mt-4">
            {techStack?.map(
                (
                    tech: keyof typeof TECH_STACK_ENUM,
                    idx: number
                ): JSX.Element => (
                    <span key={idx} className="mx-1 h-8 w-8">
                        {techIcons[tech]}
                    </span>
                )
            )}
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl h-full w-full p-4 overflow-hidden border-slate-400 bg-slate-100 dark:bg-black border dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
                className
            )}
        >
            <div className="h-full flex flex-col p-4">{children}</div>
        </div>
    );
};
export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4
            className={cn(
                "text-black dark:text-white font-bold tracking-wide mt-4",
                className
            )}
        >
            {children}
        </h4>
    );
};
export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-8 dark:text-zinc-400 text-zinc:100 tracking-wide leading-relaxed text-sm",
                className
            )}
        >
            {children}
        </p>
    );
};

export default ProjectCards;
