export type AnatomyStep = {
    id: string;
    number: string;
    label: string;
    title: string;
    description: string;
    // Target rotation of the model for this step
    modelRotation: [number, number, number];
    // How far the camera is — smaller = closer
    cameraZoom: number;
    // Annotation: where on screen the leader line points to (in canvas-relative %)
    // and where the label sits relative to it
    annotation: {
        // anchor position in normalized screen space (0,0 = top-left, 1,1 = bottom-right of canvas)
        screenX: number; // 0 to 1
        screenY: number; // 0 to 1
        // which side the label goes
        side: "left" | "right";
    };
};

export const ANATOMY_STEPS: AnatomyStep[] = [
    {
        id: "croslite",
        number: "01",
        label: "Material",
        title: "Croslite™ Foam",
        description:
            "A patented closed-cell resin. Lightweight, odor-resistant, anti-microbial. Engineered to mold to the foot over time.",
        modelRotation: [0, 0.4, 0],
        cameraZoom: 3.8,
        annotation: {
            screenX: 0.62,
            screenY: 0.55,
            side: "right",
        },
    },
    {
        id: "vents",
        number: "02",
        label: "Ventilation",
        title: "13 Vent Ports",
        description:
            "Signature perforation system. Not decoration — functional airflow that drains water and breathes in heat.",
        modelRotation: [0.15, 0.55, 0],
        cameraZoom: 3.4,
        annotation: {
            screenX: 0.76,
            screenY: 0.55,
            side: "right",
        },
    },
    {
        id: "strap",
        number: "03",
        label: "Mobility",
        title: "Heel Strap",
        description:
            "Articulating pivot strap with 4-position movement. Sport mode forward, relaxed mode back. Yours to choose.",
        modelRotation: [0, Math.PI - 0.5, 0],
        cameraZoom: 3.6,
        annotation: {
            screenX: 0.52,
            screenY: 0.35,
            side: "left",
        },
    },
    {
        id: "sole",
        number: "04",
        label: "Foundation",
        title: "Dual-Density Sole",
        description:
            "Beveled outsole with proprietary tread pattern. Grip, slip-resistance, all-day cushion compression rating.",
        modelRotation: [-1.1, 0.2, 0],
        cameraZoom: 3.4,
        annotation: {
            screenX: 0.55,
            screenY: 0.55,
            side: "right",
        },
    },
];