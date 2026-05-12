"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { cn } from "@/lib/utils";

const LINK_COLUMNS = [
    {
        title: "Shop",
        links: ["Men", "Women", "Kids", "Sale", "New Arrivals", "Drop 01"],
    },
    {
        title: "About",
        links: ["Story", "Drops", "Press", "Careers", "Sustainability"],
    },
    {
        title: "Support",
        links: ["Contact", "Returns", "Sizing", "Shipping", "FAQ"],
    },
];

const SOCIALS = [
    { label: "Instagram", href: "#", Icon: InstagramIcon },
    { label: "TikTok", href: "#", Icon: TikTokIcon },
    { label: "YouTube", href: "#", Icon: YouTubeIcon },
    { label: "X (Twitter)", href: "#", Icon: XIcon },
];

export default function Footer() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"],
    });
    const bigLogoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <footer
            ref={ref}
            id="footer"
            className="relative w-full bg-bg overflow-hidden"
            aria-label="Footer"
        >
            {/* === TOP: CLOSING CTA === */}
            <section className="relative pt-24 lg:pt-40 pb-20 lg:pb-32 px-5 lg:px-10">
                <div className="max-w-[1600px] mx-auto">
                    <div className="text-mono text-fg/40 mb-8 lg:mb-12">
                        05 — Before You Go
                    </div>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-display mb-10 lg:mb-14 max-w-[14ch]"
                    >
                        READY TO BE<br />POLARIZING?
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Button>SHOP THE DROP</Button>
                    </motion.div>
                </div>
            </section>

            {/* === DIVIDER === */}
            <div className="px-5 lg:px-10">
                <div className="max-w-[1600px] mx-auto">
                    <div className="h-px bg-fg/10" />
                </div>
            </div>

            {/* === NEWSLETTER === */}
            <section className="px-5 lg:px-10 py-16 lg:py-24">
                <div className="max-w-[1600px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <NewsletterForm />
                    </motion.div>
                </div>
            </section>

            {/* === DIVIDER === */}
            <div className="px-5 lg:px-10">
                <div className="max-w-[1600px] mx-auto">
                    <div className="h-px bg-fg/10" />
                </div>
            </div>

            {/* === LINKS + BIG LOGO === */}
            <section className="relative px-5 lg:px-10 py-16 lg:py-24 overflow-hidden">
                {/* Decorative big logo */}
                <motion.div
                    style={{ y: bigLogoY }}
                    aria-hidden
                    className="absolute inset-x-0 -bottom-4 lg:-bottom-12 pointer-events-none select-none flex justify-center"
                >
                    <span
                        className="font-display uppercase leading-none text-fg/[0.04]"
                        style={{
                            fontSize: "clamp(8rem, 28vw, 26rem)",
                            letterSpacing: "-0.06em",
                        }}
                    >
                        CROCS
                    </span>
                </motion.div>

                <div className="relative max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-12">
                        {/* Logo column (desktop only) */}
                        <div className="hidden lg:block">
                            <span className="text-display text-2xl tracking-tight">CROCS</span>
                            <p className="text-fg/50 text-sm mt-4 max-w-[18ch] italic">
                                &ldquo;Iconic. Uncomfortable. Yours.&rdquo;
                            </p>
                        </div>

                        {LINK_COLUMNS.map((col) => (
                            <FooterColumn key={col.title} title={col.title} links={col.links} />
                        ))}
                    </div>
                </div>
            </section>

            {/* === BOTTOM BAR === */}
            <section className="relative px-5 lg:px-10 py-8 lg:py-10 border-t border-fg/10">
                <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-mono text-fg/40">
                        <span>© 2026 CROCS™</span>
                        <span className="hidden sm:inline text-fg/20">/</span>
                        <span>Drop 01</span>
                        <span className="hidden sm:inline text-fg/20">/</span>
                        <span>All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-5">
                        {SOCIALS.map((social) => {
                            const IconComponent = social.Icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="text-fg/50 hover:text-fg transition-colors duration-300"
                                >
                                    <IconComponent />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile-only tagline */}
                <div className="lg:hidden mt-8 text-mono text-fg/30 italic">
                    &ldquo;Iconic. Uncomfortable. Yours.&rdquo;
                </div>
            </section>
        </footer >
    );
}

// ============================================
// Footer link column
// ============================================
function FooterColumn({ title, links }: { title: string; links: string[] }) {
    return (
        <div>
            <h3 className="text-mono text-fg/50 mb-4">{title.toUpperCase()}</h3>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link}>
                        <a
                            href="#"
                            className={cn(
                                "group inline-flex items-center text-fg/80 hover:text-fg",
                                "text-sm transition-colors duration-300"
                            )}
                        >
                            <span className="relative">
                                {link}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div >
    );
}

// ============================================
// Inline SVG icons — outline style
// ============================================
function InstagramIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
    );
}

function TikTokIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 4v8.5a4.5 4.5 0 1 1-4.5-4.5" />
            <path d="M16 4c0 2.2 1.8 4 4 4" />
        </svg>
    );
}

function YouTubeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2.5" y="6" width="19" height="12" rx="3" />
            <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" stroke="none" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4l16 16M20 4L4 20" />
        </svg>
    );
}