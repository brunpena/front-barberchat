import Barbearia from "@/Barbearia/MinhaBarbearia";

interface FlowOption {
    text: string;
    value: string;
}

interface FlowStep {
    id: string;
    mensage1: string;
    mensage2: string;
    component?: string;
    next?: string;
    options?: FlowOption[];
    end?: boolean;
}

interface Flow {
    flow_name: string;
    steps: FlowStep[];
}

const PrimeiraVez: Flow = {
    flow_name: "primeira vez",
    steps: [
        {
            id: "1",
            mensage1: `Olá, tudo bem? Seja bem-vindo(a)! Sou o assistente virtual do(a) ${Barbearia.nome} e cuido dos agendamentos dele(a), ok?`,
            mensage2: `Pra começar, qual é o seu nome e sobrenome?`,
            next: "2",
        },
        {
            id: "2",
            mensage1: "Tudo bem {{nome}}? Muito prazer!",
            mensage2:
                "Qual é o seu número de telefone? Assim consigo entrar em contato se precisar falar com você sobre o agendamento.",
            next: "3",
        },
        {
            id: "3",
            mensage1:
                "Beleza! Agora me conta, qual serviço você quer agendar hoje?",
            mensage2: "pass",
            options: [
                {
                text: `${Barbearia.servicos[0].nome} - R$${Barbearia.servicos[0].preco.toFixed(2)}`,
                value: `${Barbearia.servicos[0].nome}`,
                },
                {
                text: `${Barbearia.servicos[1].nome} - R$${Barbearia.servicos[1].preco.toFixed(2)}`,
                value: `${Barbearia.servicos[1].nome}`,
                },
                {
                text: `${Barbearia.servicos[2].nome} - R$${Barbearia.servicos[2].preco.toFixed(2)}`,
                value: `${Barbearia.servicos[2].nome}`,
                }
            ],
            next: "4",
        },
        {
            id: "4",
            mensage1: "Boa escolha! 🔥 Que dia e horário você quer marcar?",
            mensage2: "pass",
            component: "DayTime",
            next: "5",
        },
        {
          id: "5",
          mensage1: "Agora escolha um dos nossos profissionais para te atender!",
          mensage2:"pass",
          component: "BarberPicker",
          next: "6",
        },
        {
            id: "6",
            mensage1:
                "Quer que eu ative as notificações pra te lembrar do horário e te avisar se tiver alguma mudança?",
            mensage2: "pass",
            options: [
                {
                text: "🔔 Sim, quero receber lembretes",
                value: "sim",
                },
                {
                text: "🚫 Não, pode deixar sem",
                value: "nao",
                },
            ],
            next: "7",
        },
        {
            id: "7",
            mensage1: "Perfeito, {{nome}}! Tudo certinho com o seu agendamento 💪",
            mensage2:
                "Pode conferir ele quando quiser lá no menu, na opção “Meus agendamentos”. Valeu por agendar com a gente! Até logo!",
            end: true,
        },
    ],
};

export default PrimeiraVez;
