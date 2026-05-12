"use client";

import { useEffect, createContext, useContext, useState } from "react";
import Lenis from "@studio-freight/lenis";

type LenisContextValue = {
    lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
    return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    // Lazy initial state — runs once during the first render only.
    // Returns null on the server (no window) and a Lenis instance on the client.
    const [lenis] = useState<Lenis | null>(() => {
        if (typeof window === "undefined") return null;
        return new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });
    });

    // The effect only handles the RAF loop and cleanup — no setState.
    useEffect(() => {
        if (!lenis) return;

        let rafId: number;
        function raf(time: number) {
            lenis!.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [lenis]);

    return (
        <LenisContext.Provider value={{ lenis }}>
            {children}
        </LenisContext.Provider>
    );
}