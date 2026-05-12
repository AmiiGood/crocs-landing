export type NavSection = {
    id: string;
    number: string;
    label: string;
    // anchor id used to scroll to the section
    anchor: string;
};

export const NAV_SECTIONS: NavSection[] = [
    { id: "hero", number: "01", label: "The Drop", anchor: "hero" },
    { id: "anatomy", number: "02", label: "Anatomy", anchor: "anatomy" },
    { id: "manifesto", number: "03", label: "Manifesto", anchor: "manifesto" },
    { id: "spectrum", number: "04", label: "The Spectrum", anchor: "spectrum" },
    { id: "footer", number: "05", label: "Before You Go", anchor: "footer" },
];