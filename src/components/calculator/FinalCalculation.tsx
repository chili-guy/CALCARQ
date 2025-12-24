import { Calculator, DollarSign, Clock, TrendingUp } from "lucide-react";
import ExpenseCard, { Expense } from "./ExpenseCard";
import SaveBudgetButton from "./SaveBudgetButton";
import { useState } from "react";

interface FinalCalculationProps {
  minHourlyRate: number;
  globalComplexity: number;
  adjustedHourlyRate: number;
  estimatedHours: number;
  onEstimatedHoursChange: (hours: number) => void;
  variableExpenses: Expense[];
  onVariableExpensesChange: (expenses: Expense[]) => void;
  projectPrice: number;
  finalSalePrice: number;
  factorLevels: Record<string, number>;
  factors: Array<{ id: string; name: string; weight: number }>;
  areaIntervals: Array<{ min: number; max: number | null; level: number }>;
}

export default function FinalCalculation({
  minHourlyRate,
  globalComplexity,
  adjustedHourlyRate,
  estimatedHours,
  onEstimatedHoursChange,
  variableExpenses,
  onVariableExpensesChange,
  projectPrice,
  finalSalePrice,
  factorLevels,
  factors,
  areaIntervals,
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

  const totalVariableExpenses = variableExpenses.reduce((sum, exp) => sum + exp.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-calcularq-blue/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-calcularq-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-calcularq-blue">
            Cálculo Final do Preço
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualize o preço final do projeto considerando a complexidade
          </p>
        </div>
      </div>

      <div className="space-y-6">
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
              <span className="text-sm text-slate-600">Horas Estimadas</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.5"
              value={estimatedHours || ""}
              onChange={(e) => onEstimatedHoursChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue text-lg font-bold text-calcularq-blue"
              placeholder="0"
            />
          </div>
        </div>

        {/* Níveis de Complexidade dos Fatores */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Níveis de Complexidade dos Fatores:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(factorLevels).map(([factorId, level]) => (
              <div key={factorId} className="text-sm">
                <span className="text-blue-700">{factorId}:</span>{" "}
                <span className="font-semibold text-blue-900">Nível {level}</span>
              </div>
            ))}
          </div>
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

        {/* Resultados Finais */}
        <div className="space-y-4">
          <div className="p-6 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-calcularq-blue">Preço de Projeto:</span>
              <span className="text-2xl font-bold text-calcularq-blue">
                R$ {projectPrice.toLocaleString("pt-BR", { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Hora Técnica Ajustada × Horas Estimadas
            </p>
          </div>

          <div className="p-6 bg-calcularq-orange/10 rounded-lg border-2 border-calcularq-orange">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-calcularq-orange">Preço de Venda Final:</span>
              <span className="text-3xl font-bold text-calcularq-orange">
                R$ {finalSalePrice.toLocaleString("pt-BR", { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Preço de Projeto + Despesas Variáveis
            </p>
          </div>
        </div>

        {/* Save Budget Button */}
        <div className="mt-6 pt-6 border-t border-slate-200">
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
              variableExpenses,
              results: {
                globalComplexity,
                adjustedHourlyRate,
                projectPrice,
                finalSalePrice,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
