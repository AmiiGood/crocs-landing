export type ManifestoWord = {
    id: string;
    word: string;
    // Whether this word is "peyorative" (shows the attribution "— they said.")
    isPeyorative: boolean;
    // Whether this word uses the accent color
    isAccent: boolean;
};

export const MANIFESTO_WORDS: ManifestoWord[] = [
    { id: "ugly", word: "UGLY.", isPeyorative: true, isAccent: false },
    { id: "loud", word: "LOUD.", isPeyorative: true, isAccent: false },
    { id: "polarizing", word: "POLARIZING.", isPeyorative: true, isAccent: false },
    { id: "iconic", word: "ICONIC.", isPeyorative: false, isAccent: false },
    { id: "yours", word: "YOURS.", isPeyorative: false, isAccent: true },
];

export const PUNCHLINE = "We made 700 million pairs anyway.";
export const PAIRS_COUNT = 700_000_000;