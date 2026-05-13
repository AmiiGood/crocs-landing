"use client";

import { useEffect, useState } from "react";

export function useResponsiveScale() {
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            // Mobile: shrink the model so it fits in the narrower canvas
            if (w < 640) setScaleFactor(0.65);      // sm
            else if (w < 1024) setScaleFactor(0.8); // md
            else setScaleFactor(1);                  // lg+
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return scaleFactor;
}