// ChatRunner.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PrimeiraVez from "@/Fluxos/PrimeiraVez";
import Barbearia from "@/Barbearia/MinhaBarbearia";
import { BoxBot, BoxUser } from "@/components/BoxMensege";
import ChatInput from "@/components/WhatsAppChat";

type Mensage = { from: "bot" | "user"; text: string };

export default function ChatRunner() {
  const steps = PrimeiraVez.steps;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mensages, setMensages] = useState<Mensage[]>([]);
  const [waitingUser, setWaitingUser] = useState(false);
  const [vars, setVars] = useState<{ [k: string]: string | boolean }>({
    nome: "",
    telefone: "",
    servico: "",
    horario: "",
    notificacoes: "",
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensages]);

  // bloqueia scroll do body enquanto o componente estiver montado (mobile full-screen também)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, []);

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

  // lança mensagens do bot quando muda de step
  useEffect(() => {
    const step = steps[currentIndex];
    if (!step) return;
    const m1 = renderText(step.mensage1);
    setMensages((m) => [...m, { from: "bot", text: m1 }]);
    if (step.mensage2 && step.mensage2 !== "pass") {
      const m2 = renderText(step.mensage2);
      setMensages((m) => [...m, { from: "bot", text: m2 }]);
    }
    setWaitingUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  function handleUserSend(text: string) {
    const step = steps[currentIndex];
    if (!step) return;
    setMensages((m) => [...m, { from: "user", text }]);
    const key = keyForStepId(step.id);
    if (key) setVars((prev) => ({ ...prev, [key]: text }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 250);
  }

  function handleOptionSelect(value: string, text: string) {
    const step = steps[currentIndex];
    if (!step) return;
    setMensages((m) => [...m, { from: "user", text }]);
    const key = keyForStepId(step.id);
    if (key) setVars((prev) => ({ ...prev, [key]: value }));
    setWaitingUser(false);
    setTimeout(() => goToNextStepFrom(currentIndex), 200);
  }

  // MOBILE: portal full-screen (sempre ocupa toda a viewport em telas menores).
  const mobilePortal =
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] md:hidden flex flex-col bg-black text-white"
            role="dialog"
            aria-modal="true"
            style={{
              width: "100vw",
              height: "100vh",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* header simples (sem botão de fechar, pois é fixo) */}
            <div className="flex items-center px-4 py-3 border-b border-gray-800">
              <h3 className="text-sm font-medium">Chat — {Barbearia?.nome ?? "Barbearia"}</h3>
            </div>

            {/* mensages area (ocupa todo o restante) */}
            <div ref={containerRef} className="flex-1 overflow-auto p-6 w-full h-full">
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
              </div>
            </div>

            {/* input fixado */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              {waitingUser ? (
                <>
                  {steps[currentIndex] && steps[currentIndex].options && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {steps[currentIndex].options!.map((o) => (
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

                  {!steps[currentIndex].options && (
                    <ChatInput blocked={false} placeholder="Escreva sua resposta..." onSend={(t) => handleUserSend(t)} />
                  )}
                </>
              ) : (
                <div className="flex justify-end">
                  <button onClick={() => goToNextStepFrom(currentIndex)} className="px-4 py-2 rounded bg-green-600 text-white">
                    Avançar
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {/* mobile full-screen overlay (sempre renderizado em telas pequenas) */}
      {mobilePortal}

      {/* DESKTOP layout (aparece em md+) - caixa centralizada */}
      <div className="hidden md:flex w-[80vw] h-[80vh] rounded-2xl overflow-hidden border border-gray-600 flex-col mx-auto">
        <div className="flex-1 overflow-auto p-6 bg-gray-900">
          <div className="space-y-3 max-w-3xl mx-auto">
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
          </div>
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700">
          {waitingUser ? (
            <>
              {steps[currentIndex] && steps[currentIndex].options && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {steps[currentIndex].options!.map((o) => (
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
              {!steps[currentIndex].options && (
                <ChatInput blocked={false} placeholder="Escreva sua resposta..." onSend={(t) => handleUserSend(t)} />
              )}
            </>
          ) : (
            <div className="flex justify-end">
              <button onClick={() => goToNextStepFrom(currentIndex)} className="px-4 py-2 rounded bg-green-600 text-white">
                Avançar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
