interface SpecialResultType {
  isGood: boolean;
  title: string;
  description: string;
  emoji: string;
}

const goodResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Sortudo!", description: "A sorte está com você hoje!", emoji: "+" },
  { title: "Pessoa Sortuda!", description: "O destino sorriu para você!", emoji: "+" },
  { title: "Dia de Sorte!", description: "Você está em um dia de muita sorte!", emoji: "+" },
  { title: "Vencedor Sortudo!", description: "Venceu e ainda por cima é sortudo!", emoji: "+" },
  { title: "Estrela da Sorte!", description: "As estrelas estão alinhadas para você!", emoji: "+" }
];

const badResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Azarado!", description: "Não foi dessa vez... você deu azar!", emoji: "-" },
  { title: "Pessoa Azarada!", description: "O azar decidiu te visitar hoje!", emoji: "-" },
  { title: "Que Azar!", description: "Venceu mas o azar estava presente!", emoji: "-" },
  { title: "Sem Sorte!", description: "Desta vez a sorte não estava do seu lado!", emoji: "-" },
  { title: "Vencedor Azarado!", description: "Ganhou o sorteio mas perdeu na sorte!", emoji: "-" }
];

export function generateSpecialResult(): SpecialResultType {
  const isGood = Math.random() > 0.5;
  const results = isGood ? goodResults : badResults;
  const selected = results[Math.floor(Math.random() * results.length)];
  
  return {
    ...selected,
    isGood
  };
}

export type { SpecialResultType };