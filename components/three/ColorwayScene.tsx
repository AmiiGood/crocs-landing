"use client";

import AdaptiveCanvas from "./AdaptiveCanvas";
import {
    Environment,
    ContactShadows,
    PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import ColorwayModel from "./ColorwayModel";
import type { Colorway } from "@/lib/colorways";

export default function ColorwayScene({ colorway }: { colorway: Colorway }) {
    const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

    return (
        <AdaptiveCanvas
            dpr={dpr}
            camera={{ position: [0, 0.4, 3.8], fov: 35 }}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
            }}
            style={{ background: "transparent" }}
        >
            <PerformanceMonitor
                onDecline={() => setDpr([1, 1])}
                onIncline={() => setDpr([1, 1.5])}
            />

            <ambientLight intensity={0.5} />

            <directionalLight
                position={[4, 6, 4]}
                intensity={2.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-3}
                shadow-camera-right={3}
                shadow-camera-top={3}
                shadow-camera-bottom={-3}
            />
            <directionalLight position={[-3, 2, 2]} intensity={0.9} color="#FAFAF7" />
            <directionalLight position={[0, 1, 5]} intensity={0.5} color="#FAFAF7" />
            <directionalLight position={[-1, 3, -5]} intensity={1.5} color="#FAFAF7" />
            <pointLight position={[0, -2, 2]} intensity={0.6} color="#FAFAF7" />
            <pointLight position={[0, 4, 0]} intensity={0.4} color="#FAFAF7" />

            <Suspense fallback={null}>
                <ColorwayModel colorway={colorway} />
                <Environment preset="studio" />
            </Suspense>

            <ContactShadows
                position={[0, -1.2, 0]}
                opacity={0.7}
                scale={4}
                blur={3.5}
                far={2}
                color="#000000"
                resolution={512}
            />
        </AdaptiveCanvas>
    );
}