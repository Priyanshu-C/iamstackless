"use client";
import React, { useState, useMemo } from "react";
import data from "./data";
import { IoIosArrowForward } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const NodeBase = ({ ele }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = ele.children && ele.children.length > 0;

    return (
        <AnimatePresence>
            <ul className="px-4 text-sm">
                <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-1"
                >
                    <span className="flex items-center">
                        {hasChildren ? (
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className="cursor-pointer"
                                aria-expanded={isOpen}
                            >
                                <IoIosArrowForward />
                            </motion.div>
                        ) : (
                            <LuDot />
                        )}
                        <Link className="underline ml-2" href={ele.link}>
                            {ele.label}
                        </Link>
                    </span>
                </motion.li>
                {hasChildren &&
                    isOpen &&
                    ele.children.map((child) => (
                        <NodeBase key={child.id} ele={child} />
                    ))}
            </ul>
        </AnimatePresence>
    );
};

const ConfluenceSideBar = () => {
    const memoizedData = useMemo(() => data, []);

    return (
        <>
            <h1 className="text-2xl mb-8">Confluence SideBar</h1>
            <div className="w-[400px]">
                {memoizedData.map((ele) => (
                    <NodeBase key={ele.id} ele={ele} />
                ))}
            </div>
        </>
    );
};

export default ConfluenceSideBar;
