export type Colorway = {
    id: string;
    name: string;
    tagline: string;
    hex: string;
    glow: string;
    roughness: number;
    metalness: number;
    emissiveIntensity: number; // 0 = no glow, 0.3 = strong color boost
};

export const COLORWAYS: Colorway[] = [
    {
        id: "molten",
        name: "MOLTEN",
        tagline: "The original heat.",
        hex: "#FF8533",            // even brighter base — emissive will push it to true orange
        glow: "rgba(255, 133, 51, 0.45)",
        roughness: 0.4,
        metalness: 0.0,
        emissiveIntensity: 0.25,
    },
    {
        id: "void",
        name: "VOID",
        tagline: "Disappear in style.",
        hex: "#2A2A2A",
        glow: "rgba(255, 255, 255, 0.15)",
        roughness: 0.35,
        metalness: 0.1,
        emissiveIntensity: 0.0,
    },
    {
        id: "ghost",
        name: "GHOST",
        tagline: "Invisible. Unforgettable.",
        hex: "#F5F5F0",            // soft off-white (Crocs cream classic) — not pure FFFFFF
        glow: "rgba(250, 250, 247, 0.4)",
        roughness: 0.65,           // more matte → reads as real foam material, not plastic
        metalness: 0.0,
        emissiveIntensity: 0.15,   // gentle boost — just enough to fight PBR darkening
    },
    {
        id: "cobalt",
        name: "COBALT RIOT",
        tagline: "Loud silence.",
        hex: "#3A5BFF",
        glow: "rgba(58, 91, 255, 0.5)",
        roughness: 0.4,
        metalness: 0.0,
        emissiveIntensity: 0.1,
    },
    {
        id: "toxic",
        name: "TOXIC",
        tagline: "Glow in the dark of taste.",
        hex: "#E8FF1A",
        glow: "rgba(232, 255, 26, 0.5)",
        roughness: 0.4,
        metalness: 0.0,
        emissiveIntensity: 0.1,
    },
    {
        id: "heartbreak",
        name: "HEARTBREAK",
        tagline: "The pink that hurts.",
        hex: "#FF1A8C",
        glow: "rgba(255, 26, 140, 0.5)",
        roughness: 0.4,
        metalness: 0.0,
        emissiveIntensity: 0.1,
    },
];