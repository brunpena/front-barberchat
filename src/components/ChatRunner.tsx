// ChatRunner.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PrimeiraVez from "@/Fluxos/PrimeiraVez";
import Barbearia from "@/Barbearia/MinhaBarbearia";
import { BoxBot, BoxUser } from "@/components/BoxMensege";
import ChatInput from "@/components/WhatsAppChat";
import DayTime from "@/components/DayTime";
import BarberPicker from "@/components/BarberSelect";

type Mensage = { from: "bot" | "user"; text: string };

export default function ChatRunner() {
  const steps: any[] = PrimeiraVez.steps || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mensages, setMensages] = useState<Mensage[]>([]);
  const [waitingUser, setWaitingUser] = useState(false);
  const [vars, setVars] = useState<{ [k: string]: string | boolean }>({
    nome: "",
    telefone: "",
    servico: "",
    horario: "",
    notificacoes: "",
    barbeiro: "",
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const emittedStepsRef = useRef<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const findHeader = () =>
      document.querySelector<HTMLElement>("header") ||
      document.getElementById("cabecalho") ||
      document.querySelector<HTMLElement>("[data-layout-header]");

    const update = () => {
      const headerEl = findHeader();
      const h = headerEl ? headerEl.getBoundingClientRect().height : 0;
      setHeaderHeight(h);
    };

    update();
    window.addEventListener("resize", update);
    let ro: ResizeObserver | null = null;
    const hdr =
      document.querySelector<HTMLElement>("header") ||
      document.getElementById("cabecalho") ||
      document.querySelector<HTMLElement>("[data-layout-header]");
    if (hdr && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => update());
      ro.observe(hdr);
    }
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, [mounted]);

  // auto-scroll quando mensagens mudam
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [mensages]);

  // bloquear scroll do body apenas quando montado
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [mounted]);

  function getStepField(step: any, fieldBase: "message1" | "message2") {
    const candidates =
      fieldBase === "message1"
        ? ["message1", "mensage1", "messag1", "mensagem1", "message"]
        : ["message2", "mensage2", "messag2", "mensagem2"];
    for (const c of candidates) {
      if (step && typeof step[c] === "string" && step[c].length > 0) return step[c] as string;
    }
    return undefined;
  }

  function renderText(raw?: string) {
    if (!raw) return "";
    let text = raw;
    text = text.replace(/\{\{nome\}\}/g, String(vars.nome || ""));
    text = text.replace(/\$\{Barbearia\.nome\}/g, Barbearia?.nome ?? "");
    return text;
  }

  function keyForStepId(stepId: string) {
    switch (stepId) {
      case "1":
        return "nome";
      case "2":
        return "telefone";
      case "3":
        return "servico";
      case "4":
        return "horario";
      case "5":
        return "notificacoes";
      default:
        return undefined;
    }
  }

  // dispara mensagens do step atual (proteção contra re-emissão)
  useEffect(() => {
    const step = steps[currentIndex];
    if (!step) return;

    if (emittedStepsRef.current.has(currentIndex)) {
      setWaitingUser(true);
      return;
    }

    const raw1 = getStepField(step, "message1");
    const raw2 = getStepField(step, "message2");

    if (raw1) {
      const m1 = renderText(raw1);
      setMensages((prev) => [...prev, { from: "bot", text: m1 }]);
    }

    if (raw2 && raw2 !== "pass") {
      const m2 = renderText(raw2);
      setMensages((prev) => [...prev, { from: "bot", text: m2 }]);
    }

    emittedStepsRef.current.add(currentIndex);
    setWaitingUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, steps]);

  function goToNextStepFrom(index: number) {
    const current = steps[index];
    if (!current) return;
    if (current.end) {
      setWaitingUser(false);
      return;
    }
    const nextId = current.next;
    if (!nextId) {
      const nextIndex = index + 1;
      if (nextIndex < steps.length) setCurrentIndex(nextIndex);
      return;
    }
    const nextIndex = steps.findIndex((s) => s.id === String(nextId));
    if (nextIndex !== -1) setCurrentIndex(nextIndex);
  }

  function handleUserSend(text: string) {
    const step = steps[currentIndex];
    if (!step) return;
    setMensages((m) => [...m, { from: "user", text }]);
    const key = keyForStepId(step.id);
    if (key) setVars((prev) => ({ ...prev, [key]: text }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 200);
  }

  function handleOptionSelect(value: string, text: string) {
    const step = steps[currentIndex];
    if (!step) return;
    setMensages((m) => [...m, { from: "user", text }]);
    const key = keyForStepId(step.id);
    if (key) setVars((prev) => ({ ...prev, [key]: value }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 150);
  }

  // handler para quando o DayTime confirmar
  function handleDayTimeConfirm(date: Date, time: string, message?: string) {
    const text = message ?? `${date.toLocaleDateString("pt-BR").slice(0, 8)} - ${time}`;
    setMensages((m) => [...m, { from: "user", text }]);
    setVars((prev) => ({ ...prev, horario: text }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 200);
  }

  // handler para quando o BarberPicker confirmar
  function handleBarberConfirm(barber: { id: string; name: string }, message?: string) {
    const text = message ?? `Barbeiro escolhido: ${barber.name}`;
    setMensages((m) => [...m, { from: "user", text }]);
    setVars((prev) => ({ ...prev, barbeiro: barber.name }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 200);
  }

  // MOBILE portal: posicionado abaixo do header do layout
  const mobilePortal =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed left-0 right-0 z-[40] md:hidden flex flex-col bg-black text-white"
            role="dialog"
            aria-modal="true"
            style={{
              top: headerHeight,
              height: `calc(100vh - ${headerHeight}px)`,
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* messages area */}
            <div ref={containerRef} className="flex-1 overflow-auto p-6 w-full h-full chat-scroll">
              <div className="space-y-3 w-full max-w-none">
                {mensages.map((m, i) =>
                  m.from === "bot" ? (
                    <div key={i} className="flex justify-start">
                      <BoxBot mensage={m.text} />
                    </div>
                  ) : (
                    <div key={i} className="flex justify-end">
                      <BoxUser mensage={m.text} />
                    </div>
                  )
                )}

                {/* --- Aqui: DayTime renderizado DENTRO da área de mensagens --- */}
                {steps[currentIndex] && steps[currentIndex].component === "DayTime" && (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <DayTime onConfirm={handleDayTimeConfirm} />
                    </div>
                  </div>
                )}

                {/* --- Aqui: BarberPicker renderizado DENTRO da área de mensagens (mobile) --- */}
                {steps[currentIndex] && steps[currentIndex].component === "BarberPicker" && typeof BarberPicker === "function" && (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <BarberPicker onConfirm={handleBarberConfirm} />
                    </div>
                  </div>
                )}
                {/* ------------------------------------------------------------------ */}
              </div>
            </div>

            {/* input fixado */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <>
                {steps[currentIndex] && steps[currentIndex].options && (
                  <div className="flex justify-center items-center gap-2 mb-3">
                    {steps[currentIndex].options!.map((o: any) => (
                      <button
                        key={o.value}
                        onClick={() => handleOptionSelect(o.value, o.text)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        {o.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* não mostrar ChatInput quando o DayTime ou BarberPicker estiver visível */}
                {!steps[currentIndex].options &&
                  steps[currentIndex].component !== "DayTime" &&
                  steps[currentIndex].component !== "BarberPicker" && (
                    <ChatInput blocked={false} placeholder="Escreva sua resposta..." onSend={(t) => handleUserSend(t)} />
                  )}
              </>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {mobilePortal}

      {/* DESKTOP layout */}
      <div className="hidden md:flex w-[80vw] h-[80vh] rounded-2xl overflow-hidden border border-gray-600 flex-col mx-auto">
        <div className="flex-1 overflow-auto p-6 bg-gray-900 chat-scroll">
          <div className="space-y-3 w-full mx-auto">
            {mensages.map((m, i) =>
              m.from === "bot" ? (
                <div key={i} className="flex justify-start">
                  <BoxBot mensage={m.text} />
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <BoxUser mensage={m.text} />
                </div>
              )
            )}

            {/* --- Aqui: DayTime renderizado DENTRO da área de mensagens (desktop) --- */}
            {steps[currentIndex] && steps[currentIndex].component === "DayTime" && (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <DayTime onConfirm={handleDayTimeConfirm} />
                </div>
              </div>
            )}

            {/* --- Aqui: BarberPicker renderizado DENTRO da área de mensagens (desktop) --- */}
            {steps[currentIndex] && steps[currentIndex].component === "BarberPicker" && (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <BarberPicker onConfirm={handleBarberConfirm} />
                </div>
              </div>
            )}
            {/* ------------------------------------------------------------------------------ */}
          </div>
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <>
            {steps[currentIndex] && steps[currentIndex].options && (
              <div className="flex justify-center items-center gap-2 mb-3">
                {steps[currentIndex].options!.map((o: any) => (
                  <button
                    key={o.value}
                    onClick={() => handleOptionSelect(o.value, o.text)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            )}

            {!steps[currentIndex].options &&
              steps[currentIndex].component !== "DayTime" &&
              steps[currentIndex].component !== "BarberPicker" && (
                <ChatInput blocked={false} placeholder="Escreva sua resposta..." onSend={(t) => handleUserSend(t)} />
              )}
          </>
        </div>
      </div>
    </>
  );
}
