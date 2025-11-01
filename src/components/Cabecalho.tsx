"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Cabecalho(): JSX.Element {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        function onDoc(e: MouseEvent) {
        if (!open) return;
        const target = e.target as Node;
        if (
            panelRef.current &&
            !panelRef.current.contains(target) &&
            buttonRef.current &&
            !buttonRef.current.contains(target)
        ) {
            setOpen(false);
        }
        }
        function onEsc(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onEsc);
        return () => {
        document.removeEventListener("mousedown", onDoc);
        document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    return (
        <header className="bg-red-800 w-full min-h-[64px] flex items-center justify-between px-4 py-3">
            {/* Left: logo + title */}
            <div className="flex items-center gap-4">
                {/* arquivo: public/globe.svg -> acessível em /globe.svg */}
                <img src="/globe.svg" alt="logo" className="h-10 w-10 object-contain" />
                <h1 className="text-2xl font-semibold text-white">CherekBarber</h1>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
                <Link href="#home" className="text-white hover:underline">
                Início
                </Link>
                
                <Link href="#sobre" className="text-white hover:underline">
                Sobre
                </Link>
                
                <Link href="#contato" className="text-white hover:underline">
                Contato
                </Link>
            </nav>

            {/* Right: mobile menu button */}
            <div className="md:hidden">
                <button
                    ref={buttonRef}
                    type="button"
                    aria-controls="mobile-navigation"
                    aria-expanded={open}
                    aria-label={open ? "Fechar menu" : "Abrir menu"}
                    onClick={() => setOpen((v) => !v)}
                    className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
                    >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Slide-over panel para mobile */}
            <div
                id="mobile-navigation"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                className={`fixed top-0 right-0 h-full w-64 bg-red-900/95 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ease-in-out z-50
                ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="p-4 flex items-center justify-between border-b border-red-800">
                    <div className="text-white font-semibold text-lg">Menu</div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
                            aria-label="Fechar menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <ul className="p-4 space-y-3">
                        <li>
                            <Link href="#home" onClick={() => setOpen(false)} className="block text-white text-lg">
                            Início
                            </Link>
                        </li>
                        <li>
                            <Link href="#sobre" onClick={() => setOpen(false)} className="block text-white text-lg">
                            Sobre
                            </Link>
                        </li>
                        <li>
                            <Link href="#contato" onClick={() => setOpen(false)} className="block text-white text-lg">
                            Contato
                            </Link>
                        </li>
                    </ul>
            </div>
        </header>
    );
    }
