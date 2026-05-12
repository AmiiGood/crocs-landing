"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [focused, setFocused] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2400);
            return;
        }

        setStatus("submitting");

        if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(8);
        }

        // Simulated submit. Replace with real API call when ready.
        await new Promise((r) => setTimeout(r, 800));
        setStatus("success");
        setEmail("");
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="text-mono text-fg/50 mb-3">GET THE DROP</div>

            <form onSubmit={handleSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-stretch">
                    {/* Input */}
                    <div className="relative flex-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="your@email.com"
                            disabled={status === "submitting" || status === "success"}
                            className={cn(
                                "w-full bg-transparent text-fg text-lg sm:text-xl",
                                "py-4 sm:py-5 px-0 sm:px-1",
                                "border-b border-fg/20",
                                "focus:outline-none transition-colors duration-300",
                                "placeholder:text-fg/30",
                                "disabled:opacity-60"
                            )}
                            aria-label="Email address"
                        />
                        {/* animated underline on focus */}
                        <span
                            className={cn(
                                "absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                focused ? "w-full" : "w-0"
                            )}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === "submitting" || status === "success"}
                        className={cn(
                            "relative group overflow-hidden",
                            "px-8 py-4 sm:py-5 sm:ml-4",
                            "bg-fg text-bg",
                            "text-mono font-bold",
                            "transition-transform active:scale-95",
                            "disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                    >
                        <span
                            className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                            aria-hidden
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2 text-[#0A0A0A] group-hover:text-[#FAFAF7] transition-colors duration-500">
                            {status === "submitting" ? "..." : "JOIN"}
                            {status !== "submitting" && (
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>

                {/* status / helper text */}
                <div className="mt-3 h-5 text-mono">
                    <AnimatePresence mode="wait">
                        {status === "idle" && (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-fg/40"
                            >
                                First to know. No spam, just heat.
                            </motion.span>
                        )}
                        {status === "success" && (
                            <motion.span
                                key="success"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-accent"
                            >
                                ✓ You&apos;re on the list. Welcome to the cult.
                            </motion.span>
                        )}
                        {status === "error" && (
                            <motion.span
                                key="error"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-accent"
                            >
                                That doesn&apos;t look like an email.
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
}