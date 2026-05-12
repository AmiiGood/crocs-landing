"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay";

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 px-5 lg:px-10 py-4 flex items-center justify-between
                   backdrop-blur-md bg-bg/40 border-b border-line"
            >
                <a
                    href="#hero"
                    className="text-display !text-xl !leading-none tracking-tight focus:outline-none"
                    aria-label="CROCS — go to top"
                >
                    CROCS
                </a>

                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={isOpen}
                    className="text-mono flex items-center gap-3 py-2 px-3 -mr-3 group"
                >
                    <span className="hidden sm:inline group-hover:text-accent transition-colors duration-300">
                        MENU
                    </span>
                    <div className="flex flex-col gap-1.5">
                        <span className="block w-5 h-px bg-fg group-hover:bg-accent transition-colors duration-300" />
                        <span className="block w-5 h-px bg-fg group-hover:bg-accent transition-colors duration-300" />
                    </div>
                </button>
            </motion.nav >

            <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}