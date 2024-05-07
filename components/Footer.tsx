import React from "react";
import Social from "./Social";

const Footer = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full mt-8">
            <div className="flex items-center justify-center">
                <Social />
            </div>
            <div className="text-center text-gray-500 text-md mt-2">
                Priyanshu Chauhan © 2024
            </div>
        </div>
    );
};

export default Footer;
