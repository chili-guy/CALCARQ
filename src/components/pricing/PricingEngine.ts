export interface Factor {
  id: string;
  name: string;
  description: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
  weight: number;
}

export const DEFAULT_FACTORS: Factor[] = [
  {
    id: "area",
    name: "Área Construída",
    description: "Tamanho total do projeto em m²",
    weight: 1.0,
    options: [
      { value: 1, label: "Até 100 m²", description: "Projeto pequeno" },
      { value: 2, label: "101 - 300 m²", description: "Projeto médio" },
      { value: 3, label: "301 - 600 m²", description: "Projeto grande" },
      { value: 4, label: "601 - 1000 m²", description: "Projeto muito grande" },
      { value: 5, label: "Acima de 1000 m²", description: "Projeto extenso" },
    ],
  },
  {
    id: "stage",
    name: "Etapa do Projeto",
    description: "Fase atual do desenvolvimento",
    weight: 1.2,
    options: [
      { value: 1, label: "Estudo Preliminar", description: "Conceito inicial" },
      { value: 2, label: "Anteprojeto", description: "Desenvolvimento básico" },
      { value: 3, label: "Projeto Legal", description: "Aprovação municipal" },
      { value: 4, label: "Projeto Executivo", description: "Detalhamento completo" },
      { value: 5, label: "Acompanhamento", description: "Supervisão de obra" },
    ],
  },
  {
    id: "detail",
    name: "Nível de Detalhamento",
    description: "Grau de especificação técnica",
    weight: 1.1,
    options: [
      { value: 1, label: "Básico", description: "Desenho simplificado" },
      { value: 2, label: "Intermediário", description: "Detalhes padrão" },
      { value: 3, label: "Avançado", description: "Alto nível de detalhe" },
      { value: 4, label: "Muito Avançado", description: "Especificações completas" },
      { value: 5, label: "Executivo", description: "Pronto para execução" },
    ],
  },
  {
    id: "technical",
    name: "Exigência Técnica",
    description: "Complexidade técnica do projeto",
    weight: 1.3,
    options: [
      { value: 1, label: "Simples", description: "Soluções convencionais" },
      { value: 2, label: "Moderada", description: "Algumas complexidades" },
      { value: 3, label: "Alta", description: "Tecnologias avançadas" },
      { value: 4, label: "Muito Alta", description: "Inovações técnicas" },
      { value: 5, label: "Extrema", description: "Projeto de referência" },
    ],
  },
  {
    id: "bureaucratic",
    name: "Exigência Burocrática",
    description: "Complexidade de aprovações e licenças",
    weight: 0.9,
    options: [
      { value: 1, label: "Baixa", description: "Aprovações simples" },
      { value: 2, label: "Média", description: "Processo padrão" },
      { value: 3, label: "Alta", description: "Múltiplas aprovações" },
      { value: 4, label: "Muito Alta", description: "Processo complexo" },
      { value: 5, label: "Extrema", description: "Aprovações especiais" },
    ],
  },
  {
    id: "monitoring",
    name: "Acompanhamento",
    description: "Nível de supervisão necessário",
    weight: 0.8,
    options: [
      { value: 1, label: "Mínimo", description: "Visitas esporádicas" },
      { value: 2, label: "Regular", description: "Acompanhamento padrão" },
      { value: 3, label: "Intensivo", description: "Supervisão frequente" },
      { value: 4, label: "Muito Intensivo", description: "Presença constante" },
      { value: 5, label: "Dedicação Total", description: "Tempo integral" },
    ],
  },
];

export function calculateGlobalComplexity(
  factors: Factor[],
  selections: Record<string, number>
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  factors.forEach((factor) => {
    const selection = selections[factor.id];
    if (selection !== undefined) {
      weightedSum += selection * factor.weight;
      totalWeight += factor.weight;
    }
  });

  if (totalWeight === 0) return 0;
  return weightedSum / totalWeight;
}

export function calculateProjectValue(
  hourlyRate: number,
  estimatedHours: number,
  globalComplexity: number
): {
  globalComplexity: number;
  adjustedHourlyRate: number;
  totalValue: number;
  baseValue: number;
  complexityMultiplier: number;
} {
  const baseValue = hourlyRate * estimatedHours;
  const complexityMultiplier = globalComplexity;
  const adjustedHourlyRate = hourlyRate * complexityMultiplier;
  const totalValue = adjustedHourlyRate * estimatedHours;

  return {
    globalComplexity: Number(globalComplexity.toFixed(2)),
    adjustedHourlyRate: Number(adjustedHourlyRate.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    baseValue: Number(baseValue.toFixed(2)),
    complexityMultiplier: Number(complexityMultiplier.toFixed(2)),
  };
}

export function validateInputs(
  hourlyRate: number,
  estimatedHours: number
): string[] {
  const errors: string[] = [];

  if (hourlyRate <= 0) {
    errors.push("A taxa horária deve ser maior que zero");
  }

  if (estimatedHours <= 0) {
    errors.push("As horas estimadas devem ser maiores que zero");
  }

  if (hourlyRate > 10000) {
    errors.push("A taxa horária parece muito alta");
  }

  if (estimatedHours > 10000) {
    errors.push("As horas estimadas parecem muito altas");
  }

  return errors;
}
