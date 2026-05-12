"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    scene: THREE.Group;
};

const MODEL_PATH = "/models/croc-compressed.glb";
const DRACO_PATH = "/draco/";

export default function CrocModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(MODEL_PATH, DRACO_PATH) as unknown as GLTFResult;

    const cloned = useMemo(() => scene.clone(true), [scene]);

    const { centeredScene, fitScale } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        cloned.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const target = 2.2;
        const scale = maxDim > 0 ? target / maxDim : 1;

        return { centeredScene: cloned, fitScale: scale };
    }, [cloned]);

    useEffect(() => {
        centeredScene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const mat = mesh.material as THREE.Material;
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                    const std = mat as THREE.MeshStandardMaterial;
                    std.envMapIntensity = 1.1;
                }
            }
        });
    }, [centeredScene]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        groupRef.current.rotation.y += delta * 0.35;

        const targetX = state.pointer.y * -0.08;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetX,
            0.04
        );
    });

    return (
        <group ref={groupRef} scale={fitScale}>
            <primitive object={centeredScene} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);