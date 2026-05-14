"use client";

import { useFrame, useThree } from "@react-three/fiber";
import AdaptiveCanvas from "./AdaptiveCanvas";
import {
    Environment,
    ContactShadows,
    PerformanceMonitor,
    useGLTF,
} from "@react-three/drei";
import { Suspense, useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import { ANATOMY_STEPS } from "@/lib/anatomy-steps";

type GLTFResult = GLTF & { scene: THREE.Group };

const MODEL_PATH = "/models/croc-final.glb";
const DRACO_PATH = "/draco/";

// ============================================
// Animated Croc — receives target rotation
// ============================================
function AnimatedCroc({ targetRotation }: { targetRotation: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(MODEL_PATH, DRACO_PATH) as unknown as GLTFResult;

    const cloned = useMemo(() => scene.clone(true), [scene]);

    const { centered, fitScale } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        cloned.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2.2 / maxDim : 1;
        return { centered: cloned, fitScale: scale };
    }, [cloned]);

    useEffect(() => {
        centered.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                // ❌ mesh.castShadow = true;      ← removed
                // ❌ mesh.receiveShadow = true;   ← removed
                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat?.isMeshStandardMaterial) mat.envMapIntensity = 1.1;
            }
        });
    }, [centered]);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetRotation[0],
            0.06
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation[1],
            0.06
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            targetRotation[2],
            0.06
        );
    });

    return (
        <group ref={groupRef} scale={fitScale}>
            <primitive object={centered} />
        </group>
    );
}

// ============================================
// Dynamic camera that lerps zoom per step
// ============================================
function DynamicCamera({ targetZ }: { targetZ: number }) {
    const { camera } = useThree();
    const cameraRef = useRef(camera);

    useEffect(() => {
        cameraRef.current = camera;
    }, [camera]);

    useFrame(() => {
        const activeCamera = cameraRef.current;
        activeCamera.position.z = THREE.MathUtils.lerp(activeCamera.position.z, targetZ, 0.05);
    });

    return null;
}

// ============================================
// Main 3D scene
// ============================================
export default function AnatomyScene({ activeStep }: { activeStep: number }) {
    const [dpr, setDpr] = useState<[number, number]>([1, 1.15]);
    const step = ANATOMY_STEPS[activeStep] ?? ANATOMY_STEPS[0];

    return (
        <AdaptiveCanvas
            // ❌ shadows  ← removed
            dpr={dpr}
            mountMargin="240px"
            renderMargin="40px"
            camera={{ position: [0, 0.4, 3.8], fov: 35 }}
            gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
            }}
            style={{ background: "transparent" }}
        >
            <PerformanceMonitor
                onDecline={() => setDpr([1, 1])}
                onIncline={() => setDpr([1, 1.15])}
            />

            <DynamicCamera targetZ={step.cameraZoom} />

            <ambientLight intensity={0.4} />
            {/* All shadow-* props gone */}
            <directionalLight position={[4, 6, 4]} intensity={2.2} />
            <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#FAFAF7" />
            <directionalLight position={[-2, 1, -5]} intensity={1.1} color="#FF4D00" />
            <pointLight position={[0, -2, 2]} intensity={0.6} color="#FF4D00" />
            <pointLight position={[0, 4, 0]} intensity={0.3} color="#FAFAF7" />

            <Suspense fallback={null}>
                <AnimatedCroc targetRotation={step.modelRotation} />
                <Environment preset="studio" />
            </Suspense>

            <ContactShadows
                position={[0, -1.2, 0]}
                opacity={0.7}
                scale={4}
                blur={3.5}
                far={2}
                color="#000000"
                resolution={160}
            />
        </AdaptiveCanvas>
    );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);
