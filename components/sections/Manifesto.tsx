"use client";

import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MANIFESTO_WORDS, PUNCHLINE, PAIRS_COUNT } from "@/lib/manifesto-words";
import { cn } from "@/lib/utils";

export default function Manifesto() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // map scroll progress → active word index
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const total = MANIFESTO_WORDS.length;
        const idx = Math.min(total - 1, Math.floor(latest * total));
        setActiveIndex((current) => (current === idx ? current : idx));
    });

    // parallax for the giant quote marks (move opposite to scroll)
    const quoteY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

    // background grain intensity grows toward middle
    const bgIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.4]);

    const isLastWord = activeIndex === MANIFESTO_WORDS.length - 1;
    const activeWord = MANIFESTO_WORDS[activeIndex];

    return (
        <section
            ref={sectionRef}
            id="manifesto"
            style={{ height: `${MANIFESTO_WORDS.length * 90}vh` }}
            className="relative w-full"
            aria-label="Manifesto"
        >
            {/* Editorial paper-tone background (subtle shift from showroom) */}
            <motion.div
                style={{ opacity: bgIntensity }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,77,0,0.04) 0%, transparent 70%)",
                    }}
                />
            </motion.div>

            {/* === STICKY VIEWPORT === */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
                <div className="relative flex-1 max-w-[1600px] mx-auto w-full px-5 lg:px-10 py-20 lg:py-24 flex flex-col">

                    {/* Section number */}
                    <div className="text-mono text-fg/40">
                        03 — Manifesto
                    </div>

                    {/* Progress dots (right side, desktop only) */}
                    <div className="hidden lg:flex absolute top-1/2 right-10 -translate-y-1/2 flex-col gap-3 z-10">
                        {MANIFESTO_WORDS.map((w, i) => (
                            <span
                                key={w.id}
                                className={cn(
                                    "rounded-full transition-all duration-500",
                                    i === activeIndex
                                        ? "w-1.5 h-8 bg-accent"
                                        : i < activeIndex
                                            ? "w-1.5 h-1.5 bg-fg/40"
                                            : "w-1.5 h-1.5 bg-fg/15"
                                )}
                            />
                        ))}
                    </div>

                    {/* === Central staging area === */}
                    <div className="flex-1 flex flex-col items-center justify-center relative">

                        {/* Giant opening quote */}
                        <motion.span
                            style={{ y: quoteY }}
                            className="absolute top-0 left-0 lg:left-10 select-none pointer-events-none
                         font-display text-[12rem] sm:text-[16rem] lg:text-[22rem]
                         leading-none text-fg/[0.06]"
                            aria-hidden
                        >
                            &ldquo;
                        </motion.span>

                        {/* Giant closing quote */}
                        <motion.span
                            style={{ y: quoteY }}
                            className="absolute bottom-10 right-0 lg:right-10 select-none pointer-events-none
                         font-display text-[12rem] sm:text-[16rem] lg:text-[22rem]
                         leading-[0.5] text-fg/[0.06]"
                            aria-hidden
                        >
                            &rdquo;
                        </motion.span>

                        {/* The morphing word */}
                        <div className="relative w-full flex items-center justify-center min-h-[40vh]">
                            <AnimatePresence mode="wait">
                                <MorphWord
                                    key={activeWord.id}
                                    word={activeWord.word}
                                    isAccent={activeWord.isAccent}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Attribution: only on peyoratives */}
                        <div className="h-8 mt-6 lg:mt-10 relative">
                            <motion.div
                                animate={{
                                    opacity: activeWord.isPeyorative ? 0.6 : 0,
                                    y: activeWord.isPeyorative ? 0 : -8,
                                }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="text-mono text-fg italic"
                            >
                                — they said.
                            </motion.div>
                        </div>
                    </div>

                    {/* === Bottom: progress line + punchline === */}
                    <div className="relative">
                        {/* progress line (mobile) */}
                        <div className="lg:hidden flex items-center gap-2 mb-6">
                            {MANIFESTO_WORDS.map((_, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "h-px flex-1 transition-all duration-500",
                                        i <= activeIndex ? "bg-accent" : "bg-fg/15"
                                    )}
                                />
                            ))}
                        </div>

                        <motion.div
                            animate={{
                                opacity: isLastWord ? 1 : 0,
                                y: isLastWord ? 0 : 12,
                            }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: isLastWord ? 0.2 : 0 }}
                            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10"
                        >
                            <p className="text-fg text-xl sm:text-2xl lg:text-3xl font-display uppercase tracking-tight leading-none max-w-xl">
                                {PUNCHLINE}
                            </p>

                            <AnimatedCounter target={PAIRS_COUNT} trigger={isLastWord} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Morphing word (cross-fade + scale)
// ============================================
function MorphWord({
    word,
    isAccent,
}: {
    word: string;
    isAccent: boolean;
}) {
    const textRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(64);

    useEffect(() => {
        const fit = () => {
            const text = textRef.current;
            if (!text) return;

            // Determine available width based on viewport, accounting for side padding
            const vw = window.innerWidth;
            let padding: number;
            if (vw >= 1024) padding = 192;      // lg: px-24 × 2 + dots column reserve
            else if (vw >= 640) padding = 64;   // sm: px-8 × 2
            else padding = 32;                  // mobile: px-4 × 2

            const availableWidth = vw - padding;

            // Measure text at a baseline size
            text.style.fontSize = "100px";
            const naturalWidth = text.getBoundingClientRect().width;
            if (naturalWidth === 0) return;

            const ratio = availableWidth / naturalWidth;
            const finalSize = 100 * ratio;
            // Reasonable caps
            const clamped = Math.min(Math.max(finalSize, 40), 200);
            setFontSize(clamped);
        };

        fit();

        window.addEventListener("resize", fit);
        if (document.fonts?.ready) document.fonts.ready.then(fit);

        return () => {
            window.removeEventListener("resize", fit);
        };
    }, [word]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 flex items-center justify-center px-4 sm:px-8 lg:px-24"
        >
            <span
                ref={textRef}
                className={cn(
                    "font-display uppercase leading-none whitespace-nowrap inline-block",
                    isAccent ? "text-accent" : "text-fg"
                )}
                style={{
                    fontSize: `${fontSize}px`,
                    letterSpacing: 0,
                }}
            >
                {word}
            </span>
        </motion.div>
    );
}

// ============================================
// Animated counter — ticks up to target when triggered
// ============================================
function AnimatedCounter({ target, trigger }: { target: number; trigger: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: false, margin: "0px" });
    const [display, setDisplay] = useState(0);

    // smooth spring up to the target value
    const spring = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });

    useEffect(() => {
        if (trigger && inView) {
            spring.set(target);
        } else if (!trigger) {
            spring.set(0);
        }
    }, [trigger, inView, target, spring]);

    useEffect(() => {
        return spring.on("change", (v) => setDisplay(Math.floor(v)));
    }, [spring]);

    return (
        <div ref={ref} className="flex flex-col items-start lg:items-end">
            <span className="text-mono text-fg/40 mb-1">PAIRS SOLD</span>
            <span className="font-display text-3xl lg:text-5xl tracking-tight tabular-nums leading-none">
                {formatNumber(display)}
                <span className="text-accent">+</span>
            </span>
        </div>
    );
}

function formatNumber(n: number): string {
    return n.toLocaleString("en-US");
}
