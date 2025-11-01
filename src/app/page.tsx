"use client";

import React, {useState, useEffect} from "react";
import PrimeiraVez from "@/Fluxos/PrimeiraVez";
import { BoxBot, BoxUser } from "@/components/BoxMensege";

export default function HomePage() {
  const [clientNome, setClientaNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);
  const [textOn, setTextOn] = useState(false);

  return (
    <main className="flex itemns-center justify-center h-full">
      <div className=" h-[80vh] bg-blue-900 border border-gray-400 rounded-2xl flex">
          <div className="flex flex-col gap-4 mt-8 mx-4">
            <BoxBot mensage={PrimeiraVez.steps[0].mensage1} />
            <BoxBot mensage={PrimeiraVez.steps[0].mensage2} />
            <BoxUser mensage="João Silva" />
          </div>
          
      </div>
    </main>
  );
}