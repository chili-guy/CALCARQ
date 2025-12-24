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
  isArea?: boolean; // Para identificar o fator de área que usa régua de intervalos
}

export interface AreaInterval {
  min: number;
  max: number | null; // null significa "acima de"
  level: number;
}

export const DEFAULT_AREA_INTERVALS: AreaInterval[] = [
  { min: 0, max: 50, level: 1 },
  { min: 51, max: 100, level: 2 },
  { min: 151, max: 500, level: 3 },
  { min: 501, max: 1000, level: 4 },
  { min: 1001, max: null, level: 5 },
];

export const DEFAULT_FACTORS: Factor[] = [
  {
    id: "area",
    name: "Área de Projeto",
    description: "Tamanho total do projeto em m²",
    weight: 1.0,
    isArea: true,
    options: [
      { value: 1, label: "Até 50m²", description: "Nível 1" },
      { value: 2, label: "de 51 a 100m²", description: "Nível 2" },
      { value: 3, label: "de 151 a 500m²", description: "Nível 3" },
      { value: 4, label: "de 501 a 1.000m²", description: "Nível 4" },
      { value: 5, label: "Acima de 1.000m²", description: "Nível 5" },
    ],
  },
  {
    id: "stage",
    name: "Etapa de Projeto",
    description: "Fase atual do desenvolvimento",
    weight: 1.0,
    options: [
      { value: 1, label: "Consultoria", description: "Nível 1" },
      { value: 2, label: "Estudo Preliminar", description: "Nível 2" },
      { value: 3, label: "Anteprojeto", description: "Nível 3" },
      { value: 4, label: "Projeto Executivo", description: "Nível 4" },
      { value: 5, label: "Coordenação de Complementares", description: "Nível 5" },
    ],
  },
  {
    id: "detail",
    name: "Nível de Detalhamento",
    description: "Grau de especificação técnica",
    weight: 1.0,
    options: [
      { value: 1, label: "Mínimo", description: "Nível 1" },
      { value: 2, label: "Básico", description: "Nível 2" },
      { value: 3, label: "Médio", description: "Nível 3" },
      { value: 4, label: "Alto", description: "Nível 4" },
      { value: 5, label: "Máximo", description: "Nível 5" },
    ],
  },
  {
    id: "technical",
    name: "Exigência Técnica",
    description: "Complexidade técnica do projeto",
    weight: 1.0,
    options: [
      { value: 1, label: "Mínima", description: "Nível 1" },
      { value: 2, label: "Baixa", description: "Nível 2" },
      { value: 3, label: "Média", description: "Nível 3" },
      { value: 4, label: "Alta", description: "Nível 4" },
      { value: 5, label: "Máxima", description: "Nível 5" },
    ],
  },
  {
    id: "bureaucratic",
    name: "Exigência Burocrática",
    description: "Complexidade de aprovações e licenças",
    weight: 1.0,
    options: [
      { value: 1, label: "Mínima", description: "Nível 1" },
      { value: 2, label: "Baixa", description: "Nível 2" },
      { value: 3, label: "Média", description: "Nível 3" },
      { value: 4, label: "Alta", description: "Nível 4" },
      { value: 5, label: "Máxima", description: "Nível 5" },
    ],
  },
  {
    id: "monitoring",
    name: "Dedicação à Obra",
    description: "Nível de supervisão necessário",
    weight: 1.0,
    options: [
      { value: 1, label: "Levantamento", description: "Nível 1" },
      { value: 2, label: "Pontual", description: "Nível 2" },
      { value: 3, label: "Por Etapas", description: "Nível 3" },
      { value: 4, label: "Acompanhamento", description: "Nível 4" },
      { value: 5, label: "Gestão", description: "Nível 5" },
    ],
  },
];

export function calculateAreaLevel(
  area: number,
  intervals: AreaInterval[]
): number {
  for (const interval of intervals) {
    if (interval.max === null) {
      if (area >= interval.min) return interval.level;
    } else {
      if (area >= interval.min && area <= interval.max) {
        return interval.level;
      }
    }
  }
  return 1; // Default
}

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
  minHourlyRate: number,
  estimatedHours: number,
  globalComplexity: number,
  variableExpenses: number = 0
): {
  globalComplexity: number;
  adjustedHourlyRate: number;
  projectPrice: number;
  finalSalePrice: number;
  complexityMultiplier: number;
} {
  const complexityMultiplier = globalComplexity;
  const adjustedHourlyRate = minHourlyRate * complexityMultiplier;
  const projectPrice = adjustedHourlyRate * estimatedHours;
  const finalSalePrice = projectPrice + variableExpenses;

  return {
    globalComplexity: Number(globalComplexity.toFixed(2)),
    adjustedHourlyRate: Number(adjustedHourlyRate.toFixed(2)),
    projectPrice: Number(projectPrice.toFixed(2)),
    finalSalePrice: Number(finalSalePrice.toFixed(2)),
    complexityMultiplier: Number(complexityMultiplier.toFixed(2)),
  };
}

export function validateInputs(
  minHourlyRate: number,
  estimatedHours: number
): string[] {
  const errors: string[] = [];

  if (minHourlyRate <= 0) {
    errors.push("A hora técnica mínima deve ser maior que zero");
  }

  if (estimatedHours <= 0) {
    errors.push("As horas estimadas devem ser maiores que zero");
  }

  return errors;
}
