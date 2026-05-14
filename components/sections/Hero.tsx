"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";

const CrocScene = dynamic(() => import("@/components/three/CrocScene"), {
    ssr: false,
    loading: () => <CrocFallback />,
});

function CrocFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        </div>
    );
}

const headlineLines = ["ICONIC.", "UNCOMFORTABLE.", "YOURS."];

const lineVariants = {
    hidden: { y: "110%" },
    visible: (i: number) => ({
        y: "0%",
        transition: {
            delay: 0.5 + i * 0.12,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

export default function Hero() {
    const ref = useRef<HTMLElement>(null);

    const [supportsWebGL] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        try {
            const canvas = document.createElement("canvas");
            const gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
            return !!gl;
        } catch {
            return false;
        }
    });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const headlineY = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const canvasY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const bgY = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={ref}
            id="hero"
            className="relative min-h-[100dvh] w-full overflow-hidden grain"
            aria-label="Hero — Crocs Drop 01"
        >
            {/* === BACKGROUND === */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0 glow-breath"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,77,0,0.22) 0%, rgba(255,77,0,0.06) 35%, transparent 70%)",
                    }}
                />
                <div className="absolute inset-0 editorial-grid opacity-40" />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
                    }}
                />
            </motion.div>

            {/* === CONTENT WRAPPER === */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 min-h-[100dvh] px-5 lg:px-10 pt-24 pb-10"
            >
                {/* TOP META */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center gap-3 text-mono text-fg/50"
                >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>Drop 01</span>
                </motion.div>

                {/* === MAIN GRID: mobile stacked, desktop 2-cols === */}
                <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[75vh]">
                    {/* LEFT: Headline + Copy + CTA */}
                    <div className="lg:col-span-6 order-1 flex flex-col">
                        <motion.h1
                            style={{ y: headlineY }}
                            className="text-display"
                        >
                            {headlineLines.map((line, i) => (
                                <span key={i} className="line-mask">
                                    <motion.span
                                        variants={lineVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                        className="inline-block"
                                    >
                                        {line}
                                    </motion.span>
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                            className="text-fg/80 max-w-md text-base sm:text-lg leading-snug mt-8"
                        >
                            The clog, reimagined. A limited drop of the most divisive
                            silhouette in footwear — now in 3D you can feel.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row gap-4 sm:items-center mt-8"
                        >
                            <Button>SHOP DROP 01</Button>
                            <Button variant="ghost">Explore the story</Button>
                        </motion.div>
                    </div>

                    {/* RIGHT: 3D Canvas */}
                    <motion.div
                        style={{ y: canvasY }}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 order-2 relative w-full
             h-[55vh] lg:h-[80vh] min-h-[320px]"
                    >
                        {/* === Soft ambient glow — no hard edges === */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 1.8, ease: "easeOut" }}
                            className="absolute inset-0 pointer-events-none glow-breath"
                            style={{
                                background:
                                    "radial-gradient(ellipse 60% 55% at 50% 55%, rgba(255,77,0,0.32) 0%, rgba(255,77,0,0.12) 30%, rgba(255,77,0,0.04) 55%, transparent 80%)",
                            }}
                        />

                        {/* === The 3D === */}
                        <div className="relative w-full h-full">
                            {supportsWebGL ? <CrocScene /> : <CrocFallback />}
                            {supportsWebGL && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="pointer-events-none absolute right-2 bottom-3 sm:right-6 sm:bottom-6 flex items-center gap-2 text-mono text-fg/55"
                                    aria-hidden
                                >
                                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 bg-bg/35">
                                        <span className="absolute inset-1 rounded-full border border-accent/40 border-l-transparent" />
                                        <span className="font-display text-[0.62rem] leading-none text-fg/80">360</span>
                                    </span>
                                    <span className="hidden sm:block h-px w-10 bg-fg/20" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* SCROLL HINT */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                    className="mt-10 flex items-center justify-center"
                    aria-hidden
                >
                    <motion.span
                        animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                        className="block w-px h-12 bg-fg"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
