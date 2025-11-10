"use client";

import React, { useEffect, useMemo, useState } from "react";
import {barbers} from "@/Barbearia/BarberPicker";

export interface Barber {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
}

interface BarberPickerProps {
  initialId?: string | null;
  onConfirm?: (barber: Barber, message?: string) => void;
  onGenerateMessage?: (barber: Barber) => string;
  // opcional: permitir filtrar barbers ativos
  filter?: (b: Barber) => boolean;
}

export default function BarberPicker({
  initialId = null,
  onConfirm,
  onGenerateMessage,
  filter,
}: BarberPickerProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const list: Barber[] = (barbers as Barber[]).filter(Boolean);

  const filtered = useMemo(() => {
    const base = typeof filter === "function" ? list.filter(filter) : list;
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((b) => b.name.toLowerCase().includes(q) || (b.bio || "").toLowerCase().includes(q));
  }, [list, query, filter]);

  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  const selected = useMemo(() => list.find((b) => b.id === selectedId) ?? null, [list, selectedId]);

  function buildDefaultMessage(barber: Barber) {
    return `Barbeiro escolhido: ${barber.name}`;
  }

  function handleConfirm() {
    if (!selected) return;
    const message = onGenerateMessage ? onGenerateMessage(selected) : buildDefaultMessage(selected);
    onConfirm?.(selected, message);
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white/5 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-300 font-medium">Escolha seu barbeiro</div>
          <div className="text-xs text-gray-400">Selecione quem vai cuidar do seu corte</div>
        </div>
        <div className="w-40">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nome..."
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-100 outline-none border border-transparent focus:border-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {filtered.length === 0 && <div className="col-span-2 text-sm text-gray-400">Nenhum barbeiro encontrado</div>}

        {filtered.map((b) => {
          const isSelected = selectedId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-shadow border-2 ${
                isSelected ? "border-blue-400 shadow-lg bg-white/5" : "border-transparent hover:border-gray-600"
              }`}
            >
              <div className="shrink-0">
                {b.photo ? (
                  <img src={b.photo} alt={b.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                    {b.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100">{b.name}</div>
                {b.bio && <div className="text-xs text-gray-400 mt-1 line-clamp-2">{b.bio}</div>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {selected ? `Selecionado: ${selected.name}` : "Nenhum selecionado"}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedId(null);
              setQuery("");
            }}
            className="px-3 py-2 rounded-xl border text-sm"
          >
            Limpar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-3 py-2 rounded-xl bg-blue-500 disabled:opacity-50 text-white text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
