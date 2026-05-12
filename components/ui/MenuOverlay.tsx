"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "@/lib/nav-sections";
import { useLenis } from "./SmoothScroll";
import { cn } from "@/lib/utils";

export default function MenuOverlay({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const { lenis } = useLenis();

    // Stop Lenis (the smooth scroll system) when the menu is open
    // Stop Lenis AND lock native scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            // 1) Stop Lenis if available
            if (lenis) lenis.stop();
            // 2) Lock native scroll as fallback / extra safety
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";

            return () => {
                // Restore on close
                const savedY = document.body.style.top;
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.width = "";
                if (savedY) {
                    window.scrollTo(0, parseInt(savedY.replace("-", "").replace("px", "")) || 0);
                }
                if (lenis) lenis.start();
            };
        }
    }, [isOpen, lenis]);

    // Esc key closes
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleNavigate = (anchor: string) => {
        onClose();
        setTimeout(() => {
            const el = document.getElementById(anchor);
            if (el && lenis) {
                lenis.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
            } else if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 280);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col h-[100dvh]"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site navigation"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-bg/95 backdrop-blur-2xl" />

                    {/* Subtle accent glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(255,77,0,0.10) 0%, transparent 70%)",
                        }}
                    />

                    {/* === HEADER BAR (fixed within overlay) === */}
                    <div className="relative z-10 shrink-0 flex items-center justify-between px-5 lg:px-10 py-4 border-b border-line">
                        <motion.span
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-display !text-xl !leading-none tracking-tight"
                        >
                            CROCS
                        </motion.span>

                        <motion.button
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            onClick={onClose}
                            aria-label="Close menu"
                            className="text-mono flex items-center gap-3 py-2 px-3 -mr-3 group"
                        >
                            <span className="hidden sm:inline group-hover:text-accent transition-colors duration-300">
                                CLOSE
                            </span>
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                <span className="absolute block w-5 h-px bg-fg rotate-45 group-hover:bg-accent transition-colors duration-300" />
                                <span className="absolute block w-5 h-px bg-fg -rotate-45 group-hover:bg-accent transition-colors duration-300" />
                            </div>
                        </motion.button>
                    </div>

                    {/* === SCROLLABLE BODY === */}
                    <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                        <div className="px-5 lg:px-10 py-10 lg:py-16 flex flex-col min-h-full">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="text-mono text-fg/40 mb-8 lg:mb-12"
                            >
                                Navigate the drop
                            </motion.div>

                            <nav className="flex-1 flex flex-col justify-center">
                                <ul className="space-y-2 lg:space-y-1">
                                    {NAV_SECTIONS.map((section, i) => (
                                        <li key={section.id}>
                                            <MenuItem
                                                section={section}
                                                index={i}
                                                isHovered={hoverIndex === i}
                                                anyHovered={hoverIndex !== null}
                                                onHoverStart={() => setHoverIndex(i)}
                                                onHoverEnd={() => setHoverIndex(null)}
                                                onClick={() => handleNavigate(section.anchor)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="mt-10 lg:mt-16 pt-8 border-t border-line flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-end sm:justify-between"
                            >
                                <div>
                                    <div className="text-mono text-fg/40 mb-2">Contact</div>
                                    <a
                                        href="mailto:hello@crocs.com"
                                        className="text-fg hover:text-accent transition-colors text-lg"
                                    >
                                        hello@crocs.com
                                    </a>
                                </div>

                                <div>
                                    <div className="text-mono text-fg/40 mb-2">Follow</div>
                                    <div className="flex items-center gap-5">
                                        <a href="#" aria-label="Instagram" className="text-fg/70 hover:text-accent transition-colors text-sm">
                                            Instagram
                                        </a>
                                        <a href="#" aria-label="TikTok" className="text-fg/70 hover:text-accent transition-colors text-sm">
                                            TikTok
                                        </a>
                                        <a href="#" aria-label="YouTube" className="text-fg/70 hover:text-accent transition-colors text-sm">
                                            YouTube
                                        </a>
                                    </div>
                                </div>

                                <div className="text-mono text-fg/30 italic">
                                    &ldquo;Iconic. Uncomfortable. Yours.&rdquo;
                                </div>
                            </motion.div>
                        </div>
                    </div >
                </motion.div >
            )
            }
        </AnimatePresence >
    );
}

// ============================================
// Menu item
// ============================================
function MenuItem({
    section,
    index,
    isHovered,
    anyHovered,
    onHoverStart,
    onHoverEnd,
    onClick,
}: {
    section: typeof NAV_SECTIONS[number];
    index: number;
    isHovered: boolean;
    anyHovered: boolean;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    onClick: () => void;
}) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.2 + index * 0.06,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
            }}
            onClick={onClick}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="block w-full text-left group"
        >
            <motion.div
                animate={{
                    opacity: anyHovered && !isHovered ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-baseline gap-4 lg:gap-8 py-2 lg:py-3 border-b border-line"
            >
                <span className="text-mono text-fg/40 group-hover:text-accent transition-colors duration-300 shrink-0">
                    {section.number}
                </span>
                <span
                    className={cn(
                        "font-display uppercase leading-none tracking-tight transition-colors duration-300",
                        "text-[clamp(2.5rem,9vw,7rem)]",
                        isHovered ? "text-accent" : "text-fg"
                    )}
                    style={{ letterSpacing: "-0.04em" }}
                >
                    {section.label}
                </span>
                <motion.span
                    aria-hidden
                    animate={{
                        x: isHovered ? 0 : -8,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="ml-auto text-accent shrink-0"
                >
                    <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </motion.span>
            </motion.div>
        </motion.button>
    );
}