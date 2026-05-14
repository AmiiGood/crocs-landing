"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";

type LenisContextValue = {
    lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
    return useContext(LenisContext);
}

function createLenis() {
    if (typeof window === "undefined") return null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || coarsePointer) return null;

    return new Lenis({
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1,
    });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis] = useState<Lenis | null>(createLenis);

    useEffect(() => {
        if (!lenis) return;

        const instance = lenis;
        let rafId: number;
        let isActive = document.visibilityState === "visible";

        function raf(time: number) {
            if (isActive) instance.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        const handleVisibility = () => {
            isActive = document.visibilityState === "visible";
        };

        document.addEventListener("visibilitychange", handleVisibility);
        rafId = requestAnimationFrame(raf);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            cancelAnimationFrame(rafId);
            instance.destroy();
        };
    }, [lenis]);

    return (
        <LenisContext.Provider value={{ lenis }}>
            {children}
        </LenisContext.Provider>
    );
}
