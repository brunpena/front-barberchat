import React, { useState, useRef, useEffect } from "react";

export interface ChatInputProps {
  blocked: boolean; // true = bloqueada (read-only), false = ativa
    placeholder?: string;
    onSend: (text: string) => void; // callback para quem usa o componente
    initialValue?: string;
    className?: string;
}

export default function ChatInput({
    blocked,
    placeholder = "Mensagem",
    onSend,
    initialValue = "",
    className = "",
}: ChatInputProps) {
    const [value, setValue] = useState(initialValue);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        // Se bloquear, tira o foco
        if (blocked) {
            textareaRef.current?.blur();
        }
    }, [blocked]);

    useEffect(() => {
        // auto-resize textarea
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "0px";
        el.style.height = `${Math.min(el.scrollHeight, 240)}px`; // limite de altura
    }, [value]);

    const handleSend = () => {
        const text = (value || "").trim();
        if (!text) return;
        onSend(text);
        setValue("");
    };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!blocked) handleSend();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex items-end gap-3 p-3 rounded-b-2xl
          ${blocked ? "bg-gray-800/40" : "bg-gray-800/60"}`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={blocked ? "Enviando indisponível no momento..." : placeholder}
          readOnly={blocked}
          disabled={blocked}
          rows={1}
          className={`flex-1 resize-none outline-none leading-5
            rounded-md px-3 py-2 text-sm
            ${blocked ? "bg-gray-700 text-gray-300 placeholder-gray-400" : "bg-gray-900 text-white placeholder-gray-400"}
            `}
          aria-label="Campo de mensagem"
        />

        {/* Botão de enviar */}
        <button
          type="button"
          onClick={() => !blocked && handleSend()}
          disabled={blocked || value.trim() === ""}
          aria-disabled={blocked || value.trim() === ""}
          className={`
            flex items-center justify-center min-w-[44px] h-10 rounded-md
            ${blocked || value.trim() === "" ? "bg-gray-600/60 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
            transition
          `}
        >
          {/* ícone de envio (svg) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
