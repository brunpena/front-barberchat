"use client";

import React, {useState, useEffect} from "react";
import PrimeiraVez from "@/Fluxos/PrimeiraVez";
import { BoxBot, BoxUser } from "@/components/BoxMensege";
import ChatInput from "@/components/WhatsAppChat";
import ChatRunner from "@/components/ChatRunner";

export default function HomePage() {
  const [clientNome, setClientaNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);
  const [blocked, setBlocked] = useState(true);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);

  const handleSend = (text: string) => {
    // aqui você manda para a API, socket ou quem chamou
    setMessages((m) => [...m, { from: "user", text }]);

    // exemplo de resposta fake do bot
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: `Recebi: ${text}` }]);
    }, 600);
  };


  return (
    <main className="flex itemns-center justify-center h-full">
        
          {/* <BoxBot mensage={PrimeiraVez.steps[0].mensage1} />
          <BoxBot mensage={PrimeiraVez.steps[0].mensage2} />
          <BoxUser mensage="João Silva" />
        </div>
        <ChatInput blocked={blocked} onSend={handleSend} /> */}
          <ChatRunner />
    </main>
  );
}