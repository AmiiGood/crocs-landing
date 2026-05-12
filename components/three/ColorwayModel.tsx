"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { Colorway } from "@/lib/colorways";

type GLTFResult = GLTF & { scene: THREE.Group };

const MODEL_PATH = "/models/croc-final.glb";
const DRACO_PATH = "/draco/";

const TINTABLE_MATERIAL_NAMES = ["eva_shdr"];

export default function ColorwayModel({ colorway }: { colorway: Colorway }) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(MODEL_PATH, DRACO_PATH) as unknown as GLTFResult;

    const { cloned, tintableMaterials, fitScale } = useMemo(() => {
        const clone = scene.clone(true);

        const box = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        clone.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2.2 / maxDim : 1;

        const mats: THREE.MeshStandardMaterial[] = [];
        clone.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const mat = mesh.material as THREE.Material;
                if (!(mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) return;

                const clonedMat = (mat as THREE.MeshStandardMaterial).clone();
                clonedMat.envMapIntensity = 0.6;
                mesh.material = clonedMat;

                const matName = clonedMat.name || "";
                if (TINTABLE_MATERIAL_NAMES.includes(matName)) {
                    mats.push(clonedMat);
                }
            }
        });

        return { cloned: clone, tintableMaterials: mats, fitScale: scale };
    }, [scene]);

    // Animation refs
    const targetColorRef = useRef(new THREE.Color());
    const startColorRef = useRef(new THREE.Color());
    const targetEmissiveRef = useRef(new THREE.Color());
    const startEmissiveRef = useRef(new THREE.Color());
    const targetRoughnessRef = useRef(0.5);
    const startRoughnessRef = useRef(0.5);
    const targetMetalnessRef = useRef(0.05);
    const startMetalnessRef = useRef(0.05);
    const targetEmissiveIntensityRef = useRef(0);
    const startEmissiveIntensityRef = useRef(0);
    const transitionStartRef = useRef(0);
    const transitionDurationRef = useRef(0.6);
    const isTransitioningRef = useRef(false);
    const hasInitializedRef = useRef(false);

    // Initialize on mount
    useEffect(() => {
        if (!colorway || tintableMaterials.length === 0) return;
        if (hasInitializedRef.current) return;

        tintableMaterials.forEach((mat) => {
            mat.color.set(colorway.hex);
            mat.emissive.set(colorway.hex); // emissive same hue as color
            mat.emissiveIntensity = colorway.emissiveIntensity;
            mat.roughness = colorway.roughness;
            mat.metalness = colorway.metalness;
        });

        targetColorRef.current.set(colorway.hex);
        startColorRef.current.set(colorway.hex);
        targetEmissiveRef.current.set(colorway.hex);
        startEmissiveRef.current.set(colorway.hex);
        targetRoughnessRef.current = colorway.roughness;
        startRoughnessRef.current = colorway.roughness;
        targetMetalnessRef.current = colorway.metalness;
        startMetalnessRef.current = colorway.metalness;
        targetEmissiveIntensityRef.current = colorway.emissiveIntensity;
        startEmissiveIntensityRef.current = colorway.emissiveIntensity;

        hasInitializedRef.current = true;
    }, [colorway, tintableMaterials]);

    // Trigger transition on colorway change
    useEffect(() => {
        if (!colorway || tintableMaterials.length === 0) return;
        if (!hasInitializedRef.current) return;

        const firstMat = tintableMaterials[0];
        startColorRef.current.copy(firstMat.color);
        startEmissiveRef.current.copy(firstMat.emissive);
        startRoughnessRef.current = firstMat.roughness;
        startMetalnessRef.current = firstMat.metalness;
        startEmissiveIntensityRef.current = firstMat.emissiveIntensity;

        targetColorRef.current.set(colorway.hex);
        targetEmissiveRef.current.set(colorway.hex);
        targetRoughnessRef.current = colorway.roughness;
        targetMetalnessRef.current = colorway.metalness;
        targetEmissiveIntensityRef.current = colorway.emissiveIntensity;

        transitionStartRef.current = performance.now() / 1000;
        isTransitioningRef.current = true;
    }, [colorway, tintableMaterials]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
            const targetX = state.pointer.y * -0.08;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetX,
                0.04
            );
        }

        if (isTransitioningRef.current && tintableMaterials.length > 0) {
            const now = performance.now() / 1000;
            const elapsed = now - transitionStartRef.current;
            const t = Math.min(elapsed / transitionDurationRef.current, 1);
            const eased = 1 - Math.pow(1 - t, 3);

            tintableMaterials.forEach((mat) => {
                mat.color.copy(startColorRef.current).lerp(targetColorRef.current, eased);
                mat.emissive.copy(startEmissiveRef.current).lerp(targetEmissiveRef.current, eased);
                mat.roughness = THREE.MathUtils.lerp(
                    startRoughnessRef.current,
                    targetRoughnessRef.current,
                    eased
                );
                mat.metalness = THREE.MathUtils.lerp(
                    startMetalnessRef.current,
                    targetMetalnessRef.current,
                    eased
                );
                mat.emissiveIntensity = THREE.MathUtils.lerp(
                    startEmissiveIntensityRef.current,
                    targetEmissiveIntensityRef.current,
                    eased
                );
            });

            if (t >= 1) {
                isTransitioningRef.current = false;
                tintableMaterials.forEach((mat) => {
                    mat.color.copy(targetColorRef.current);
                    mat.emissive.copy(targetEmissiveRef.current);
                    mat.roughness = targetRoughnessRef.current;
                    mat.metalness = targetMetalnessRef.current;
                    mat.emissiveIntensity = targetEmissiveIntensityRef.current;
                });
            }
        }
    });

    useEffect(() => {
        return () => {
            tintableMaterials.forEach((mat) => mat.dispose());
        };
    }, [tintableMaterials]);

    return (
        <group ref={groupRef} scale={fitScale}>
            <primitive object={cloned} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);