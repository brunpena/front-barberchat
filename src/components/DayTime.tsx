import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

interface DayTimeProps {
  initialDate?: Date;
  /**
   * Callback padrão chamado quando o usuário confirma.
   * Agora recebe (date, time, message) onde `message` é o texto pronto para enviar no chat.
   */
  onConfirm?: (date: Date, time: string, message?: string) => void;
  /**
   * Opcional: função para gerar a mensagem de chat a partir da data e horário.
   * Se não fornecida, um texto padrão será criado: "Agendamento para dd/MM/yyyy às HH:mm".
   */
  onGenerateMessage?: (date: Date, time: string) => string;
  /**
   * Se você tiver um serviço real de agendamentos, substitua esta função
   * por uma que busque horários já ocupados no backend.
   */
  fetchBookedTimes?: (date: Date) => Promise<string[]>;
}

export default function DayTimePicker({ initialDate, onConfirm, onGenerateMessage, fetchBookedTimes }: DayTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ?? null);
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Gera uma lista de horários (ex.: 09:00 a 17:00 de 30 em 30 minutos)
  const generateAllTimes = () => {
    const times: string[] = [];
    for (let h = 9; h <= 17; h++) {
      const minutes = [0, 30];
      for (const m of minutes) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  };

  // Função padrão que simula consulta ao backend (substitua pela sua real)
  const defaultFetchBookedTimes = async (date: Date) => {
    // simula horários já reservados com base no dia (só para demo)
    await new Promise((r) => setTimeout(r, 350));
    const daySeed = date.getDate() % 4;
    const exampleBooked: Record<number, string[]> = {
      0: ["09:00", "11:30"],
      1: ["10:00", "10:30", "15:00"],
      2: ["12:00", "13:30"],
      3: ["09:30", "14:00"],
    };
    return exampleBooked[daySeed] ?? [];
  };

  useEffect(() => {
    const load = async () => {
      if (!selectedDate) return setAvailableTimes([]);
      setLoading(true);
      const fetcher = fetchBookedTimes ?? defaultFetchBookedTimes;
      try {
        const booked = await fetcher(selectedDate);
        setBookedTimes(booked);
        const all = generateAllTimes();
        const available = all.filter((t) => !booked.includes(t));
        setAvailableTimes(available);
        setSelectedTime(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate, fetchBookedTimes]);

  const buildDefaultMessage = (date: Date, time: string) => {
    return `${format(date, "dd/MM/yy")} - ${time}`; // mantém HH:mm
  };

  const confirm = () => {
    if (!selectedDate || !selectedTime) return;
    const [hh, mm] = selectedTime.split(":");
    const confirmed = new Date(selectedDate);
    confirmed.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);

    const message = onGenerateMessage ? onGenerateMessage(confirmed, selectedTime) : buildDefaultMessage(confirmed, selectedTime);

    // Chama o callback com a mensagem pronta para enviar no chat
    onConfirm?.(confirmed, selectedTime, message);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 rounded-2xl p-4 shadow-lg">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Escolha a data</label>
          <DatePicker
            selected={selectedDate}
            onChange={(d: Date | null) => setSelectedDate(d)}
            inline
            minDate={new Date()}
            className="w-full"
          />
        </div>
        <div className="w-60">
          <div className="mb-3 text-sm font-medium text-gray-300">Horários disponíveis</div>

          <div className="h-56 overflow-auto grid grid-cols-2 gap-2">
            {loading && (
              <div className="col-span-2 text-sm text-gray-400">Carregando horários...</div>
            )}

            {!loading && availableTimes.length === 0 && (
              <div className="col-span-2 text-sm text-gray-400">Escolha uma data para ver horários</div>
            )}

            {!loading && availableTimes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`text-sm px-3 py-2 rounded-xl border-2 min-w-[92px] text-left transition-shadow
                  ${selectedTime === t ? 'border-blue-400 shadow-lg bg-white/5' : 'border-transparent hover:border-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div className="text-xs text-gray-400">Selecionado</div>
            <div className="text-sm font-medium text-gray-200">
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "-"} {selectedTime ? ` - ${selectedTime}` : ""}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={confirm}
                disabled={!selectedDate || !selectedTime}
                className="px-3 py-2 rounded-xl bg-blue-500 disabled:opacity-40"
              >
                Confirmar
              </button>
              <button
                onClick={() => { setSelectedDate(null); setSelectedTime(null); }}
                className="px-3 py-2 rounded-xl border"
              >
                Limpar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
