import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";

import MinimumHourCalculator from "../components/calculator/MinimumHourCalculator";
import ComplexityConfig from "../components/calculator/ComplexityConfig";
import AreaFactorCard from "../components/calculator/AreaFactorCard";
import FactorCard from "../components/pricing/FactorCard";
import FinalCalculation from "../components/calculator/FinalCalculation";

import {
  DEFAULT_FACTORS,
  DEFAULT_AREA_INTERVALS,
  calculateGlobalComplexity,
  calculateProjectValue,
  calculateAreaLevel,
  Factor,
  AreaInterval,
} from "../components/pricing/PricingEngine";
import { createPageUrl } from "@/utils";

export default function Calculator() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const budgetId = searchParams.get("budget");

  // Seção 1: Hora Técnica Mínima
  const [minHourlyRate, setMinHourlyRate] = useState<number | null>(null);
  const [fixedExpenses, setFixedExpenses] = useState<Array<{ id: string; name: string; value: number }>>([]);
  const [productiveHours, setProductiveHours] = useState(0);
  
  // Seção 2: Configurações
  const [factors, setFactors] = useState<Factor[]>(DEFAULT_FACTORS);
  const [areaIntervals, setAreaIntervals] = useState<AreaInterval[]>(DEFAULT_AREA_INTERVALS);
  
  // Seção 3: Análise de Complexidade
  const [area, setArea] = useState<number | null>(null);
  const [selections, setSelections] = useState<Record<string, number>>({});
  
  // Seção 4: Cálculo Final
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [commercialDiscount, setCommercialDiscount] = useState(0); // 0 a 100 (%)
  const [variableExpenses, setVariableExpenses] = useState<Array<{ id: string; name: string; value: number }>>([]);

  // Carregar cálculo salvo se houver ID na URL
  useEffect(() => {
    if (budgetId && user) {
      const budget = db.getBudgetById(budgetId, user.id);
      if (budget) {
        setMinHourlyRate(budget.data.minHourlyRate);
        setFactors(budget.data.factors.map(f => {
          const defaultFactor = DEFAULT_FACTORS.find(df => df.id === f.id);
          return {
            ...defaultFactor!,
            weight: f.weight,
          };
        }));
        setAreaIntervals(budget.data.areaIntervals);
        setSelections(budget.data.selections);
        setEstimatedHours(budget.data.estimatedHours);
        setVariableExpenses(budget.data.variableExpenses);
        if (budget.data.commercialDiscount !== undefined) {
          setCommercialDiscount(budget.data.commercialDiscount);
        }
        if (budget.data.fixedExpenses) {
          setFixedExpenses(budget.data.fixedExpenses);
        }
        if (budget.data.productiveHours !== undefined) {
          setProductiveHours(budget.data.productiveHours);
        }
        
        // Encontrar área do fator área
        const areaFactor = budget.data.factors.find(f => f.id === "area");
        if (areaFactor) {
          // Tentar encontrar a área baseada no nível
          const interval = budget.data.areaIntervals.find(i => i.level === areaFactor.level);
          if (interval) {
            setArea(interval.min + (interval.max || interval.min) / 2);
          }
        }
      }
    }
  }, [budgetId, user]);

  // Handlers
  const handleMinHourRateCalculate = useCallback((rate: number) => {
    setMinHourlyRate(rate);
  }, []);

  const handleFactorWeightChange = useCallback((factorId: string, weight: number) => {
    setFactors(prev => 
      prev.map(f => f.id === factorId ? { ...f, weight } : f)
    );
  }, []);

  const handleResetWeights = useCallback(() => {
    setFactors(DEFAULT_FACTORS);
  }, []);

  const handleAreaChange = useCallback((newArea: number) => {
    setArea(newArea);
    if (newArea > 0) {
      const level = calculateAreaLevel(newArea, areaIntervals);
      setSelections(prev => ({ ...prev, area: level }));
    }
  }, [areaIntervals]);

  const handleAreaLevelChange = useCallback((level: number) => {
    setSelections(prev => ({ ...prev, area: level }));
  }, []);

  const handleSelectionChange = useCallback((factorId: string, value: number) => {
    setSelections(prev => ({
      ...prev,
      [factorId]: value
    }));
  }, []);

  // Cálculos
  const globalComplexity = useMemo(() => {
    return calculateGlobalComplexity(factors, selections);
  }, [factors, selections]);

  const results = useMemo(() => {
    if (!minHourlyRate || minHourlyRate <= 0) {
      return null;
    }
    const totalVariableExpenses = variableExpenses.reduce((sum, exp) => sum + exp.value, 0);
    return calculateProjectValue(
      minHourlyRate,
      estimatedHours,
      globalComplexity,
      totalVariableExpenses
    );
  }, [minHourlyRate, estimatedHours, globalComplexity, variableExpenses]);

  // Calcular valores para o card de resultados
  const totalVariableExpensesForDisplay = variableExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const projectPriceWithDiscount = results ? results.projectPrice * (1 - commercialDiscount / 100) : 0;
  const discountAmount = results ? results.projectPrice * (commercialDiscount / 100) : 0;
  const finalSalePriceWithDiscount = projectPriceWithDiscount + totalVariableExpensesForDisplay;
  const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const fixedCostPerHour = productiveHours > 0 ? totalFixedExpenses / productiveHours : 0;
  const profit = productiveHours > 0 && results
    ? projectPriceWithDiscount - (fixedCostPerHour * estimatedHours)
    : null;

  const areaFactor = factors.find(f => f.id === "area");
  const otherFactors = factors.filter(f => f.id !== "area");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-calcularq-blue mb-3">
            Calculadora de Precificação
          </h1>
          <p className="text-lg text-slate-600">
            Insira suas despesas fixas, calibre os fatores de complexidade e adicione os custos
            variáveis para chegar a um preço justo, que remunera corretamente a dificuldade do seu trabalho.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal: Conteúdo */}
          <div className="lg:col-span-2 space-y-8">
          {/* Seção 1: Calculadora da Hora Técnica Mínima */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MinimumHourCalculator
              onCalculate={handleMinHourRateCalculate}
              initialMinHourRate={minHourlyRate || undefined}
              onFixedExpensesChange={setFixedExpenses}
              onProductiveHoursChange={setProductiveHours}
            />
          </motion.section>

          {/* Seção 2: Configurações da Calculadora de Complexidade */}
          {minHourlyRate && minHourlyRate > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ComplexityConfig
                factors={factors}
                onFactorWeightChange={handleFactorWeightChange}
                onResetWeights={handleResetWeights}
              />
            </motion.section>
          )}

          {/* Seção 3: Análise de Complexidade */}
          {minHourlyRate && minHourlyRate > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-calcularq-blue/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-calcularq-blue" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-calcularq-blue">
                      Análise de Complexidade
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Selecione as características do projeto específico que está precificando
                    </p>
                  </div>
                </div>

                {/* Nota sobre instruções */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Precisa de apoio na classificação?</strong> Para entender os critérios técnicos e os exemplos práticos por trás de cada Fator e Valor,{" "}
                    <a 
                      href={createPageUrl("Manual")} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      acesse o manual de instruções
                    </a>
                    .
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Área de Projeto com Régua */}
                  {areaFactor && (
                    <AreaFactorCard
                      area={area}
                      onAreaChange={handleAreaChange}
                      onLevelChange={handleAreaLevelChange}
                      intervals={areaIntervals}
                      onIntervalsChange={setAreaIntervals}
                    />
                  )}

                  {/* Outros Fatores */}
                  {otherFactors.map((factor) => (
                    <FactorCard
                      key={factor.id}
                      factor={factor}
                      value={selections[factor.id]}
                      onChange={handleSelectionChange}
                    />
                  ))}
                </div>

                {/* Resumo dos Níveis de Complexidade - Movido para o final da seção */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Níveis de Complexidade dos Fatores:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(selections).map(([factorId, level]) => {
                      const factor = factors.find(f => f.id === factorId);
                      const factorName = factor ? factor.name : factorId;
                      return (
                        <div key={factorId} className="text-sm">
                          <span className="text-blue-700">{factorName}:</span>{" "}
                          <span className="font-semibold text-blue-900">Nível {level}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Seção 4: Cálculo Final do Preço */}
          {minHourlyRate && minHourlyRate > 0 && results && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FinalCalculation
                minHourlyRate={minHourlyRate}
                globalComplexity={results.globalComplexity}
                adjustedHourlyRate={results.adjustedHourlyRate}
                estimatedHours={estimatedHours}
                onEstimatedHoursChange={setEstimatedHours}
                commercialDiscount={commercialDiscount}
                onCommercialDiscountChange={setCommercialDiscount}
                variableExpenses={variableExpenses}
                onVariableExpensesChange={setVariableExpenses}
                projectPrice={results.projectPrice}
                finalSalePrice={results.finalSalePrice}
                factorLevels={selections}
                factors={factors}
                areaIntervals={areaIntervals}
                fixedExpenses={fixedExpenses}
                productiveHours={productiveHours}
              />
            </motion.section>
          )}

          {/* Mensagem inicial */}
          {(!minHourlyRate || minHourlyRate <= 0) && (
            <div className="text-center py-12">
              <p className="text-slate-500">
                Preencha os dados acima para continuar.
              </p>
            </div>
          )}
          </div>

          {/* Coluna Lateral: Resultados Fixos */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-calcularq-blue mb-6">Resultados do Cálculo</h3>
                
                {results ? (
                  <div className="space-y-3">
                    {/* Preço do Projeto */}
                    <div className="p-4 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-calcularq-blue">Preço do Projeto:</span>
                        <span className="text-lg font-bold text-calcularq-blue">
                          R$ {results.projectPrice.toLocaleString("pt-BR", { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Total de Despesas Variáveis */}
                    {totalVariableExpensesForDisplay > 0 && (
                      <div className="p-4 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-calcularq-blue">Total de Despesas Variáveis:</span>
                          <span className="text-lg font-bold text-calcularq-blue">
                            R$ {totalVariableExpensesForDisplay.toLocaleString("pt-BR", { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Valor do Desconto */}
                    {discountAmount > 0 && (
                      <div className="p-4 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-calcularq-blue">Valor do Desconto:</span>
                          <span className="text-lg font-bold text-calcularq-blue">
                            R$ {discountAmount.toLocaleString("pt-BR", { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Preço de Venda Final */}
                    <div className="p-4 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-calcularq-blue">Preço de Venda Final:</span>
                        <span className="text-lg font-bold text-calcularq-blue">
                          R$ {finalSalePriceWithDiscount.toLocaleString("pt-BR", { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Lucro Estimado */}
                    {profit !== null && (
                      <div className="p-4 bg-calcularq-blue/10 rounded-lg border border-calcularq-blue/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-calcularq-blue">Lucro Estimado:</span>
                          <span className="text-lg font-bold text-calcularq-blue">
                            R$ {profit.toLocaleString("pt-BR", { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">
                      Preencha os campos para ver o resultado
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
