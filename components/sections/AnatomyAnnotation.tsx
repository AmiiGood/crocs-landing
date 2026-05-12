"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ANATOMY_STEPS } from "@/lib/anatomy-steps";

export default function AnatomyAnnotation({ activeStep }: { activeStep: number }) {
    const step = ANATOMY_STEPS[activeStep];
    if (!step) return null;

    const { annotation } = step;
    const isRight = annotation.side === "right";

    // line + label parameters
    const lineLength = 140; // px
    const labelMaxWidth = 180; // px reserved for the label text

    // Clamp the anchor position so the line + label never overflows the canvas.
    // We reserve space on the side where the label sits.
    const sideReserve = (lineLength + labelMaxWidth + 24) / 1000; // approx % of typical viewport
    const minX = isRight ? 0.05 : sideReserve;
    const maxX = isRight ? 1 - sideReserve : 0.95;
    const clampedX = Math.max(minX, Math.min(maxX, annotation.screenX));
    const clampedY = Math.max(0.1, Math.min(0.9, annotation.screenY));

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
            >
                <div
                    className="absolute"
                    style={{
                        left: `${clampedX * 100}%`,
                        top: `${clampedY * 100}%`,
                    }}
                >
                    {/* dot */}
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                    />

                    {/* line */}
                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-1/2 -translate-y-1/2 h-px bg-accent"
                        style={{
                            width: lineLength,
                            left: isRight ? 0 : -lineLength,
                            transformOrigin: isRight ? "left center" : "right center",
                        }}
                    />

                    {/* label */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.4 }}
                        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
                        style={{
                            left: isRight ? lineLength + 12 : -lineLength - 12,
                            maxWidth: labelMaxWidth,
                            textAlign: isRight ? "left" : "right",
                            transform: isRight
                                ? "translate(0, -50%)"
                                : "translate(-100%, -50%)",
                        }}
                    >
                        <div className="text-mono text-accent mb-1">
                            {step.number} / {step.label}
                        </div>
                        <div className="text-mono text-fg">{step.title}</div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}