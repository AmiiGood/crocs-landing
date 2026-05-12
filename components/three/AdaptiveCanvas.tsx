"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

type AdaptiveCanvasProps = CanvasProps & {
    /**
     * How much of the canvas must be visible before it starts rendering (0-1).
     * Default: 0.05 (5% visible triggers render).
     */
    threshold?: number;
    /**
     * Extra margin around the viewport to pre-warm before user sees it.
     * Default: "200px" — starts rendering when within 200px of viewport.
     */
    rootMargin?: string;
};

export default function AdaptiveCanvas({
    threshold = 0.05,
    rootMargin = "200px",
    children,
    ...canvasProps
}: AdaptiveCanvasProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <div ref={wrapperRef} className="w-full h-full">
            <Canvas
                {...canvasProps}
                frameloop={isInView ? "always" : "never"}
            >
                {children}
            </Canvas>
        </div>
    );
}