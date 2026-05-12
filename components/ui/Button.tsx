"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "ghost";
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", className, children, ...props }, ref) => {
        const handleTap = () => {
            if (typeof window !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(8);
            }
        };

        if (variant === "ghost") {
            return (
                <motion.button
                    ref={ref}
                    whileTap={{ scale: 0.96 }}
                    onTapStart={handleTap}
                    className={cn(
                        "text-mono text-fg/70 hover:text-fg transition-colors",
                        "inline-flex items-center gap-2 py-3",
                        "border-b border-fg/20 hover:border-fg",
                        className
                    )}
                    {...props}
                >
                    {children}
                </motion.button>
            );
        }

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.97 }}
                onTapStart={handleTap}
                className={cn(
                    "relative group overflow-hidden isolate",
                    "w-full sm:w-auto",
                    "px-8 py-5 sm:px-10 sm:py-6",
                    "bg-[#FAFAF7] text-[#0A0A0A]",
                    "text-mono font-bold",
                    "transition-transform",
                    className
                )}
                {...props}
            >
                {/* fill animation */}
                <span
                    className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                    aria-hidden
                />
                <span className="relative z-10 flex items-center justify-center gap-3 text-[#0A0A0A] group-hover:text-[#FAFAF7] transition-colors duration-500">
                    {children}
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="group-hover:translate-x-1 transition-transform"
                    >
                        <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";
export default Button;