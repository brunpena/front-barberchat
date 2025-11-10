export interface Barber {
  id: string;
  name: string;
  photo?: string;
  bio: string;
}

export const barbers: Barber[] = [
  {
    id: "1",
    name: "Rafael",
    photo: "/globe.png",
    bio: "Especialista em cortes clássicos e barba."
  },
  {
    id: "2",
    name: "Lucas",
    photo: "",
    bio: "Cortes modernos e fade."
  },
  {
    id: "3",
    name: "Marcos",
    photo: "",
    bio: "Cliente fiel há 8 anos — ótimo em cortes rápidos."
  },
  {
    id: "4",
    name: "João",
    photo: "",
    bio: "Atendimento tranquilo e corte feminino."
  }
];
