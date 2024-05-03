import React, { useState } from "react";
import { motion } from "framer-motion";

const PixelatedImageTransition = ({ image1, image2 }) => {
    const [hovered, setHovered] = useState(false);

    const variants = {
        initial: {
            scale: 1,
        },
        hovered: {
            scale: 0.1,
        },
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.img
                src={hovered ? image2 : image1}
                alt="Transitioning Image"
                variants={variants}
                animate={hovered ? "hovered" : "initial"}
                transition={{ duration: 0.5 }}
                style={{
                    width: "100%",
                    height: "auto",
                    imageRendering: "pixelated", // This ensures the image is pixelated when scaled
                }}
            />
        </div>
    );
};

export default PixelatedImageTransition;
