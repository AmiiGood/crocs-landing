"use client";

import AdaptiveCanvas from "./AdaptiveCanvas";
import {
    Environment,
    ContactShadows,
    PerformanceMonitor,
    useProgress,
    Html,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import CrocModel from "./CrocModel";

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3 select-none">
                <div className="text-mono text-fg/60 tracking-[0.3em]">LOADING</div>
                <div className="w-32 h-px bg-fg/20 relative overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>
                <div className="text-mono text-fg/40">
                    {Math.floor(progress)}%
                </div>
            </div>
        </Html>
    );
}

export default function CrocScene() {
    const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

    return (
        <AdaptiveCanvas
            shadows
            dpr={dpr}
            camera={{ position: [0, 0.2, 3.2], fov: 32 }}
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

            {/* === Premium showroom lighting === */}
            <ambientLight intensity={0.4} />

            <directionalLight
                position={[4, 6, 4]}
                intensity={2.2}
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

            <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#FAFAF7" />
            <directionalLight position={[-2, 1, -5]} intensity={1.1} color="#FF4D00" />
            <pointLight position={[0, -2, 2]} intensity={0.6} color="#FF4D00" />
            <pointLight position={[0, 4, 0]} intensity={0.3} color="#FAFAF7" />

            <Suspense fallback={<Loader />}>
                <CrocModel />
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