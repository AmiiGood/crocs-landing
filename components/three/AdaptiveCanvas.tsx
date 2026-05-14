"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

type AdaptiveCanvasProps = CanvasProps & {
    /**
     * Distance from viewport to mount the canvas (pre-warm).
     * Default: "600px" — mounts well before user sees it.
     */
    mountMargin?: string;
    /**
     * Distance from viewport to start rendering frames.
     * Default: "200px" — renders just before visible.
     */
    renderMargin?: string;
    /**
     * Delay (ms) before unmounting after leaving viewport.
     * Prevents thrash on quick scroll-back. Default: 1500ms.
     */
    unmountDelay?: number;
    /**
     * Temporarily switch animated canvases to demand rendering while the page
     * is actively scrolling. This trades tiny 3D pauses for smoother scroll.
     */
    pauseDuringScroll?: boolean;
};

export default function AdaptiveCanvas({
    mountMargin = "600px",
    renderMargin = "200px",
    unmountDelay = 1500,
    pauseDuringScroll = true,
    children,
    ...canvasProps
}: AdaptiveCanvasProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Observer for MOUNT/UNMOUNT (wider margin)
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Cancel any pending unmount
                    if (unmountTimer.current) {
                        clearTimeout(unmountTimer.current);
                        unmountTimer.current = null;
                    }
                    setIsMounted(true);
                } else {
                    // Delay unmount to avoid thrash on quick scroll-back
                    unmountTimer.current = setTimeout(() => {
                        setIsMounted(false);
                    }, unmountDelay);
                }
            },
            { threshold: 0, rootMargin: mountMargin }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            if (unmountTimer.current) clearTimeout(unmountTimer.current);
        };
    }, [mountMargin, unmountDelay]);

    // Observer for RENDER on/off (tighter margin)
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsRendering(entry.isIntersecting),
            { threshold: 0, rootMargin: renderMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [renderMargin]);

    useEffect(() => {
        if (!pauseDuringScroll) return;

        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
            scrollTimer.current = setTimeout(() => setIsScrolling(false), 140);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
        };
    }, [pauseDuringScroll]);

    const frameloop = !isRendering
        ? "never"
        : pauseDuringScroll && isScrolling
            ? "demand"
            : "always";

    return (
        <div ref={wrapperRef} className="w-full h-full">
            {isMounted && (
                <Canvas
                    {...canvasProps}
                    frameloop={frameloop}
                >
                    {children}
                </Canvas>
            )}
        </div>
    );
}
