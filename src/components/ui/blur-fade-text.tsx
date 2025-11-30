"use client";

import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { useMemo } from "react";

interface BlurFadeTextProps {
    text: string;
    className?: string;
    textClassName?: string;
    variant?: {
        hidden: { y: number };
        visible: { y: number };
    };
    duration?: number;
    characterDelay?: number;
    delay?: number;
    yOffset?: number;
    animateByCharacter?: boolean;
}

export default function BlurFadeText({
    text,
    className,
    textClassName,
    variant,
    duration = 0.5,
    characterDelay = 0.08,
    delay = 0,
    yOffset = 8,
    animateByCharacter = false,
}: BlurFadeTextProps) {
    const defaultVariants: Variants = {
        hidden: { y: yOffset, opacity: 0, filter: "blur(8px)" },
        visible: { y: 0, opacity: 1, filter: "blur(0px)" },
    };
    const combinedVariants = variant || defaultVariants;
    const characters = useMemo(() => {
        if (animateByCharacter) {
            return text.split("");
        }
        return text.split(" ");
    }, [text, animateByCharacter]);

    return (
        <div className={cn("inline-flex flex-wrap gap-x-2 gap-y-1 justify-center", className)}>
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    initial="hidden"
                    animate="visible"
                    variants={combinedVariants}
                    transition={{
                        delay: delay + i * characterDelay,
                        ease: "easeOut",
                        duration,
                    }}
                    className={cn("inline-block", animateByCharacter ? "" : "whitespace-nowrap", textClassName)}
                >
                    {char}
                </motion.span>
            ))}
        </div>
    );
}
