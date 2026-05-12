"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ANATOMY_STEPS } from "@/lib/anatomy-steps";
import { cn } from "@/lib/utils";
import AnatomyAnnotation from "./AnatomyAnnotation";

const AnatomyScene = dynamic(() => import("@/components/three/AnatomyScene"), {
    ssr: false,
    loading: () => null,
});

export default function Anatomy() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // map scroll progress → active step index
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const total = ANATOMY_STEPS.length;
        const index = Math.min(total - 1, Math.floor(latest * total));
        if (index !== activeStep) setActiveStep(index);
    });

    // subtle background shift across the section
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.4, 0]);

    return (
        <section
            ref={sectionRef}
            id="anatomy"
            style={{ height: `${ANATOMY_STEPS.length * 100}vh` }}
            className="relative w-full"
            aria-label="Anatomy of the Crocs Classic Clog"
        >
            {/* Background tone shift */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 pointer-events-none"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(255,77,0,0.08) 0%, transparent 60%)",
                    }}
                />
            </motion.div>

            {/* === STICKY VIEWPORT === */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <div className="relative h-full w-full max-w-[1600px] mx-auto px-5 lg:px-10 py-20 lg:py-24">

                    {/* Section number */}
                    <div className="text-mono text-fg/40 mb-6 lg:mb-10">
                        02 — Anatomy
                    </div>

                    {/* === DESKTOP LAYOUT: 2 cols sticky === */}
                    <div className="hidden lg:grid grid-cols-12 gap-8 items-center h-[calc(100%-4rem)]">

                        {/* LEFT: Headline + active step text */}
                        <div className="col-span-5 flex flex-col justify-center h-full">
                            <h2 className="text-display mb-12">
                                ANATOMY<br />OF AN<br />ICON.
                            </h2>

                            {/* Step list */}
                            <ol className="space-y-6 max-w-md">
                                {ANATOMY_STEPS.map((step, i) => (
                                    <li key={step.id}>
                                        <StepRow
                                            step={step}
                                            isActive={i === activeStep}
                                            isPast={i < activeStep}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* RIGHT: 3D canvas (sticky within the sticky) */}
                        <div className="col-span-7 relative h-full">
                            {/* Soft glow behind */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,77,0,0.22) 0%, rgba(255,77,0,0.05) 40%, transparent 70%)",
                                }}
                            />
                            <div className="relative w-full h-full">
                                <AnatomyScene activeStep={activeStep} />
                                {/* Annotation overlay — outside the canvas */}
                                <AnatomyAnnotation activeStep={activeStep} />
                            </div>
                        </div>
                    </div>

                    {/* === MOBILE LAYOUT: simple stacked === */}
                    <div className="lg:hidden flex flex-col h-[calc(100%-3rem)]">
                        <h2 className="text-display mb-6">
                            ANATOMY<br />OF AN<br />ICON.
                        </h2>

                        {/* Compact 3D viewport */}
                        <div className="relative w-full h-[40vh] mb-6">
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,77,0,0.22) 0%, transparent 65%)",
                                }}
                            />
                            <AnatomyScene activeStep={activeStep} />
                        </div>

                        {/* Active step info — mobile shows only the current one */}
                        <div className="flex-1">
                            <MobileStepCard step={ANATOMY_STEPS[activeStep]} />
                        </div>

                        {/* Step dots */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {ANATOMY_STEPS.map((_, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-500",
                                        i === activeStep ? "w-8 bg-accent" : "w-4 bg-fg/20"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Step row (desktop)
// ============================================
function StepRow({
    step,
    isActive,
    isPast,
}: {
    step: typeof ANATOMY_STEPS[number];
    isActive: boolean;
    isPast: boolean;
}) {
    return (
        <motion.div
            animate={{
                opacity: isActive ? 1 : isPast ? 0.3 : 0.25,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative pl-6"
        >
            {/* Active indicator line */}
            <motion.span
                animate={{
                    scaleY: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-1 bottom-1 w-px bg-accent origin-top"
            />

            <div className="flex items-baseline gap-3 mb-1.5">
                <span className="text-mono text-accent">{step.number}</span>
                <span className="text-mono text-fg/50">{step.label}</span>
            </div>
            <h3 className="text-2xl xl:text-3xl font-display tracking-tight mb-2 uppercase">
                {step.title}
            </h3>
            <motion.p
                animate={{
                    height: isActive ? "auto" : 0,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-fg/70 text-sm overflow-hidden"
            >
                <span className="block pt-2">{step.description}</span>
            </motion.p>
        </motion.div>
    );
}

// ============================================
// Step card (mobile — only active one shown)
// ============================================
function MobileStepCard({ step }: { step: typeof ANATOMY_STEPS[number] }) {
    return (
        <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="flex items-baseline gap-3 mb-2">
                <span className="text-mono text-accent">{step.number}</span>
                <span className="text-mono text-fg/50">{step.label}</span>
            </div>
            <h3 className="text-3xl font-display tracking-tight mb-3 uppercase">
                {step.title}
            </h3>
            <p className="text-fg/70 text-base leading-snug">
                {step.description}
            </p>
        </motion.div>
    );
}