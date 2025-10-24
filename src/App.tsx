// WhatsAppChat.tsx
// Componente React + TypeScript estilizado com Tailwind CSS
// Instruções: cole este arquivo em um projeto React + TypeScript (Vite/CRA) com Tailwind configurado.

import { useEffect, useRef, useState } from 'react';

type Sender = 'me' | 'other';

type Message = {
  id: number;
  from: Sender;
  text: string;
  time: string;
};

export default function WhatsAppChat(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'other', text: 'Olá! Tudo bem? Pode agendar para amanhã às 10h?', time: '09:24' },
    { id: 2, from: 'me', text: 'Tudo certo! Tenho horário às 10:30. Serve?', time: '09:25' },
    { id: 3, from: 'other', text: 'Perfeito, confirmo então.', time: '09:26' }
  ]);

  const [text, setText] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: Date.now(),
      from: 'me',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(m => [...m, newMsg]);
    setText('');

    // resposta simulada (opcional)
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        from: 'other',
        text: 'Ótimo! Te espero.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(m => [...m, reply]);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#071427] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-br from-[#0b1b2a] to-[#071427] shadow-2xl border border-[#122233] p-6">

          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1f6ffb] to-[#2ab0ff] flex items-center justify-center text-white font-bold">MP</div>
              <div>
                <h2 className="text-white text-xl font-semibold">Sua Barbearia</h2>
                <p className="text-sm text-[#9fb0c6]">Aberto agora • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden md:inline-flex items-center gap-2 bg-[#0d2434] hover:bg-[#122b3d] text-[#cfe6ff] py-2 px-3 rounded-lg border border-[#163445]">Contato</button>
              <button className="bg-[#12c24f] hover:brightness-95 text-white py-2 px-4 rounded-lg font-semibold">WhatsApp</button>
            </div>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <aside className="hidden md:flex flex-col gap-4 col-span-1">
              <div className="rounded-xl bg-[#081726] p-4 border border-[#133142]">
                <h3 className="text-[#bfe1ff] font-semibold mb-3">Conversas</h3>
                <div className="flex flex-col gap-3">
                  <Contact name="João" last="Perfeito!" time="08:12" />
                  <Contact name="Marcos" last="Boa tarde" time="07:45" />
                  <Contact name="Cliente" last="Confirmado" time="09:26" active />
                </div>
              </div>
            </aside>

            <section className="col-span-2 md:col-span-2 flex flex-col h-[60vh] md:h-[58vh] rounded-lg overflow-hidden border border-[#122233]">

              <div className="flex items-center justify-between bg-[#081726] p-4 border-b border-[#0f1f2b]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1f6ffb] flex items-center justify-center text-white font-semibold">CL</div>
                  <div>
                    <div className="text-white font-medium">Cliente</div>
                    <div className="text-xs text-[#9fb0c6]">Online</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-md hover:bg-[#0f2a3a] hidden sm:inline">📎</button>
                  <button className="p-2 rounded-md bg-[#102634] hover:bg-[#123141]">🔔</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={"flex " + (msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                      <article className={"max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-snug border " + (msg.from === 'me' ? 'bg-gradient-to-r from-[#1f6ffb] to-[#2ab0ff] text-white rounded-br-none border-transparent' : 'bg-[#071a2a] text-[#d0e9ff] border-[#102033] rounded-bl-none')}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={"text-[10px] mt-1 " + (msg.from === 'me' ? 'text-white/80 text-right' : 'text-[#9fb0c6] text-right')}>{msg.time}</div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="p-4 bg-[#071726] border-t border-[#0f1f2b]">
                <div className="flex gap-3 items-center">
                  <button className="p-2 rounded-lg bg-[#0d2a3a] hover:bg-[#123141]">📎</button>
                  <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Digite uma mensagem"
                    className="flex-1 bg-[#071826] text-[#dff3ff] placeholder-[#6f94ad] px-4 py-3 rounded-full border border-[#143042] focus:outline-none"
                  />
                  <button onClick={sendMessage} className="bg-gradient-to-br from-[#1f6ffb] to-[#2ab0ff] text-white px-4 py-2 rounded-full font-semibold hover:opacity-95">Enviar</button>
                </div>
              </footer>

            </section>
          </main>

        </div>
      </div>
    </div>
  );
}

// Contact component
function Contact({ name, last, time, active = false }: { name: string; last: string; time: string; active?: boolean; }): JSX.Element {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#061827] ${active ? 'bg-[#071f2b] border border-[#143142]' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-[#1f6ffb] flex items-center justify-center font-semibold text-white">{name.charAt(0)}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-[#9fb0c6]">{time}</div>
        </div>
        <div className="text-xs text-[#9fb0c6]">{last}</div>
      </div>
    </div>
  );
}
