"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import dynamic from "next/dynamic";
import { COLORWAYS } from "@/lib/colorways";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ColorwayScene = dynamic(() => import("@/components/three/ColorwayScene"), {
    ssr: false,
    loading: () => null,
});

export default function Colorways() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const active = COLORWAYS[activeIndex];

    const handleSelect = (i: number) => {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(8);
        }
        setActiveIndex(i);
    };

    return (
        <section
            id="spectrum"
            className="relative w-full min-h-[100dvh] py-20 lg:py-24"
            aria-label="Colorways — Pick yours"
        >
            <div className="relative max-w-[1600px] mx-auto px-5 lg:px-10">
                {/* Section number */}
                <div className="text-mono text-fg/40 mb-8 lg:mb-12">
                    04 — The Spectrum
                </div>

                {/* === DESKTOP LAYOUT === */}
                <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
                    {/* LEFT: copy + cta */}
                    <div className="col-span-5 flex flex-col">
                        <h2 className="text-display mb-10">
                            SIX FLAVORS.<br />ONE ICON.
                        </h2>

                        {/* Active colorway info */}
                        <div className="relative h-32 mb-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -14 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-0"
                                >
                                    <div className="text-mono text-accent mb-2">
                                        {String(activeIndex + 1).padStart(2, "0")} / {String(COLORWAYS.length).padStart(2, "0")}
                                    </div>
                                    <h3 className="font-display text-4xl xl:text-5xl uppercase tracking-tight mb-3 leading-none">
                                        {active.name}
                                    </h3>
                                    <p className="text-fg/70 text-base xl:text-lg italic">
                                        &ldquo;{active.tagline}&rdquo;
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mb-10">
                            <Button>SHOP {active.name}</Button>
                        </div>

                        {/* Desktop swatches */}
                        <div className="flex items-center gap-4">
                            {COLORWAYS.map((c, i) => (
                                <Swatch
                                    key={c.id}
                                    color={c}
                                    isActive={i === activeIndex}
                                    onSelect={() => handleSelect(i)}
                                    onHoverStart={() => setHoverIndex(i)}
                                    onHoverEnd={() => setHoverIndex(null)}
                                    size="lg"
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: 3D */}
                    <div className="col-span-7 relative h-[75vh] min-h-[500px]">
                        {/* Subtle ambient backdrop — color-neutral, just adds depth */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse 60% 55% at 50% 55%, rgba(255,255,255,0.04) 0%, transparent 70%)",
                            }}
                        />
                        <ColorwayScene colorway={hoverIndex !== null && COLORWAYS[hoverIndex] ? COLORWAYS[hoverIndex] : active} />
                    </div>
                </div>

                {/* === MOBILE LAYOUT === */}
                <div className="lg:hidden flex flex-col">
                    <h2 className="text-display mb-8">
                        SIX<br />FLAVORS.<br />ONE ICON.
                    </h2>

                    {/* 3D viewport */}
                    <div className="relative w-full h-[48vh] mb-6">
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse 60% 55% at 50% 55%, rgba(255,255,255,0.04) 0%, transparent 70%)",
                            }}
                        />
                        <ColorwayScene colorway={hoverIndex !== null && COLORWAYS[hoverIndex] ? COLORWAYS[hoverIndex] : active} />
                    </div>

                    {/* Mobile swatches (horizontal scroll) */}
                    <div className="overflow-x-auto -mx-5 px-5 mb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex items-center gap-3 w-max pb-2">
                            {COLORWAYS.map((c, i) => (
                                <Swatch
                                    key={c.id}
                                    color={c}
                                    isActive={i === activeIndex}
                                    onSelect={() => handleSelect(i)}
                                    size="md"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Active colorway info */}
                    <div className="relative h-28 mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0"
                            >
                                <div className="text-mono text-accent mb-2">
                                    {String(activeIndex + 1).padStart(2, "0")} / {String(COLORWAYS.length).padStart(2, "0")}
                                </div>
                                <h3 className="font-display text-3xl uppercase tracking-tight mb-2 leading-none">
                                    {active.name}
                                </h3>
                                <p className="text-fg/70 text-base italic">
                                    &ldquo;{active.tagline}&rdquo;
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <Button>SHOP {active.name}</Button>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Swatch — ring that fills when active
// ============================================
function Swatch({
    color,
    isActive,
    onSelect,
    onHoverStart,
    onHoverEnd,
    size = "md",
}: {
    color: typeof COLORWAYS[number];
    isActive: boolean;
    onSelect: () => void;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    size?: "md" | "lg";
}) {
    const dims = size === "lg" ? "w-14 h-14" : "w-12 h-12";
    const innerDims = size === "lg" ? "w-10 h-10" : "w-8 h-8";

    return (
        <motion.button
            onClick={onSelect}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            whileTap={{ scale: 0.92 }}
            aria-label={`Select ${color.name} colorway`}
            aria-pressed={isActive}
            className={cn(
                "relative rounded-full flex items-center justify-center transition-all duration-300",
                dims,
                "border",
                isActive
                    ? "border-accent"
                    : "border-fg/15 hover:border-fg/40"
            )}
        >
            <span
                className={cn(
                    "block rounded-full transition-transform duration-300",
                    innerDims,
                    isActive ? "scale-100" : "scale-90"
                )}
                style={{
                    backgroundColor: color.hex,
                    boxShadow: isActive
                        ? `0 0 16px ${color.glow}, inset 0 0 0 1px rgba(255,255,255,0.05)`
                        : "inset 0 0 0 1px rgba(255,255,255,0.05)",
                }}
            />
        </motion.button>
    );
}
