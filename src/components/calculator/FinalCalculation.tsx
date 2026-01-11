import { Calculator, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import ExpenseCard, { Expense } from "./ExpenseCard";
import SaveBudgetButton from "./SaveBudgetButton";

interface FinalCalculationProps {
  minHourlyRate: number;
  globalComplexity: number;
  adjustedHourlyRate: number;
  estimatedHours: number;
  onEstimatedHoursChange: (hours: number) => void;
  commercialDiscount: number;
  onCommercialDiscountChange: (discount: number) => void;
  variableExpenses: Expense[];
  onVariableExpensesChange: (expenses: Expense[]) => void;
  projectPrice: number;
  finalSalePrice: number;
  factorLevels: Record<string, number>;
  factors: Array<{ id: string; name: string; weight: number }>;
  areaIntervals: Array<{ min: number; max: number | null; level: number }>;
  fixedExpenses?: Expense[];
  productiveHours?: number;
}

export default function FinalCalculation({
  minHourlyRate,
  globalComplexity,
  adjustedHourlyRate,
  estimatedHours,
  onEstimatedHoursChange,
  commercialDiscount,
  onCommercialDiscountChange,
  variableExpenses,
  onVariableExpensesChange,
  projectPrice,
  finalSalePrice,
  factorLevels,
  factors,
  areaIntervals,
  fixedExpenses = [],
  productiveHours = 0,
}: FinalCalculationProps) {
  const handleAddExpense = (expense: Expense) => {
    onVariableExpensesChange([...variableExpenses, expense]);
  };

  const handleRemoveExpense = (id: string) => {
    onVariableExpensesChange(variableExpenses.filter((exp) => exp.id !== id));
  };

  const handleUpdateExpense = (id: string, updates: Partial<Expense>) => {
    onVariableExpensesChange(
      variableExpenses.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  // Garantir que sempre haja pelo menos um card de despesa variável
  useEffect(() => {
    if (variableExpenses.length === 0) {
      handleAddExpense({ id: Date.now().toString(), name: "", value: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular valores com desconto
  const projectPriceWithDiscount = projectPrice * (1 - commercialDiscount / 100);
  const discountAmount = projectPrice * (commercialDiscount / 100);
  const totalVariableExpenses = variableExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const finalSalePriceWithDiscount = projectPriceWithDiscount + totalVariableExpenses;

  // Calcular lucro (só se não usar hora manual)
  const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const fixedCostPerHour = productiveHours > 0 ? totalFixedExpenses / productiveHours : 0;
  const profit = productiveHours > 0 
    ? projectPriceWithDiscount - (fixedCostPerHour * estimatedHours)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
      {/* Parte Superior: Composição Final do Preço */}
      <div className="border-2 border-calcularq-blue/20 rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-calcularq-blue/5 to-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-calcularq-blue/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-calcularq-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-calcularq-blue">
              Composição Final do Preço
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure os parâmetros finais do projeto
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Estimativa de Horas de Projeto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estimativa de Horas de Projeto
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={estimatedHours || ""}
              onChange={(e) => onEstimatedHoursChange(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue text-lg font-semibold text-calcularq-blue"
              placeholder="0"
            />
          </div>


          {/* Despesas Variáveis */}
          <ExpenseCard
            expenses={variableExpenses}
            onAdd={handleAddExpense}
            onRemove={handleRemoveExpense}
            onUpdate={handleUpdateExpense}
            placeholder="Ex: RRT, Transporte..."
            label="Despesas Variáveis do Projeto (R$)"
          />

          {/* Desconto Comercial */}
          <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Desconto Comercial: {commercialDiscount}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={commercialDiscount}
                onChange={(e) => onCommercialDiscountChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-calcularq-orange"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            {commercialDiscount > 0 && (
              <p className="mt-3 text-sm text-slate-700">
                Ao aplicar este desconto, você reduz sua remuneração em R$ {discountAmount.toLocaleString("pt-BR", { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}.
              </p>
            )}
          </div>

        </div>

        {/* Parte Inferior: Resultados do Cálculo (dentro da caixa superior) */}
        <div className="mt-6 pt-6 border-t-2 border-calcularq-blue/30 bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold text-calcularq-blue mb-6">Resultados do Cálculo</h3>
          
          <div className="space-y-4">
            {/* Resumo dos Cálculos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Hora Técnica Mínima</span>
                </div>
                <p className="text-xl font-bold text-calcularq-blue">
                  R$ {minHourlyRate.toLocaleString("pt-BR", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Índice de Complexidade Global</span>
                </div>
                <p className="text-xl font-bold text-calcularq-blue">{globalComplexity}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Hora Técnica Ajustada</span>
                </div>
                <p className="text-xl font-bold text-calcularq-blue">
                  R$ {adjustedHourlyRate.toLocaleString("pt-BR", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Estimativa de Horas de Projeto</span>
                </div>
                <p className="text-xl font-bold text-calcularq-blue">{estimatedHours}h</p>
              </div>
            </div>

            {/* Preço de Projeto */}
            <div className="p-6 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-calcularq-blue">Preço do Projeto:</span>
                <span className="text-2xl font-bold text-calcularq-blue">
                  R$ {projectPrice.toLocaleString("pt-BR", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              </div>
            </div>

            {/* Total de Despesas Variáveis */}
            {totalVariableExpenses > 0 && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Total de Despesas Variáveis:</span>
                  <span className="text-lg font-bold text-calcularq-blue">
                    R$ {totalVariableExpenses.toLocaleString("pt-BR", { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Valor do Desconto */}
            {discountAmount > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-amber-800">Valor do Desconto:</span>
                  <span className="text-lg font-bold text-amber-800">
                    R$ {discountAmount.toLocaleString("pt-BR", { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Preço de Venda Final */}
            <div className="p-6 bg-calcularq-orange/10 rounded-lg border-2 border-calcularq-orange">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-calcularq-orange">Preço de Venda Final:</span>
                <span className="text-3xl font-bold text-calcularq-orange">
                  R$ {finalSalePriceWithDiscount.toLocaleString("pt-BR", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              </div>
            </div>

            {/* Lucro estimado */}
            {profit !== null && (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-700">Lucro estimado:</span>
                  <span className={`text-2xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    R$ {profit.toLocaleString("pt-BR", { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Budget Button */}
      <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
        <SaveBudgetButton
          budgetData={{
            minHourlyRate,
            factors: factors.map(factor => ({
              id: factor.id,
              name: factor.name,
              weight: factor.weight,
              level: factorLevels[factor.id] || 0,
            })),
            areaIntervals,
            selections: factorLevels,
            estimatedHours,
            fixedExpenses,
            productiveHours,
            commercialDiscount,
            variableExpenses,
            results: {
              globalComplexity,
              adjustedHourlyRate,
              projectPrice,
              finalSalePrice,
            },
          }}
        />
        
        {/* Botão de Avaliação */}
        <a
          href="https://senja.io/p/calcularq/r/GRdv6A"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[#fc7338] hover:underline font-medium text-sm"
        >
          Avalie a Calcularq e ganhe um cupom de 25% para um colega
        </a>
      </div>
    </div>
  );
}
