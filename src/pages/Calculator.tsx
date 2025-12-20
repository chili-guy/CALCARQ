import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Layers, Wallet } from "lucide-react";

import Header from "../components/pricing/Header";
import SectionTitle from "../components/pricing/SectionTitle";
import FactorCard from "../components/pricing/FactorCard";
import FinancialInputs from "../components/pricing/FinancialInputs";
import ResultCard from "../components/pricing/ResultCard";
import AdvancedSettings from "../components/pricing/AdvancedSettings";

import {
  DEFAULT_FACTORS,
  calculateGlobalComplexity,
  calculateProjectValue,
  validateInputs,
} from "../components/pricing/PricingEngine";

export default function Calculator() {
  // Estado dos fatores (com pesos configuráveis)
  const [factors, setFactors] = useState(DEFAULT_FACTORS);
  
  // Estado das seleções do usuário
  const [selections, setSelections] = useState<Record<string, number>>({});
  
  // Parâmetros financeiros
  const [hourlyRate, setHourlyRate] = useState(150);
  const [estimatedHours, setEstimatedHours] = useState(40);

  // Handlers
  const handleSelectionChange = useCallback((factorId: string, value: number) => {
    setSelections(prev => ({
      ...prev,
      [factorId]: value
    }));
  }, []);

  const handleFactorWeightChange = useCallback((factorId: string, weight: number) => {
    setFactors(prev => 
      prev.map(f => f.id === factorId ? { ...f, weight } : f)
    );
  }, []);

  const handleResetWeights = useCallback(() => {
    setFactors(DEFAULT_FACTORS);
  }, []);

  // Cálculos em tempo real
  const results = useMemo(() => {
    const globalComplexity = calculateGlobalComplexity(factors, selections);
    return calculateProjectValue(hourlyRate, estimatedHours, globalComplexity);
  }, [factors, selections, hourlyRate, estimatedHours]);

  // Validação
  const errors = useMemo(() => {
    return validateInputs(hourlyRate, estimatedHours);
  }, [hourlyRate, estimatedHours]);

  const isValid = errors.length === 0 && Object.keys(selections).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header mais compacto */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Header />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content - Layout melhorado */}
          <div className="xl:col-span-8 space-y-6">
            {/* Seção 1: Fatores de Complexidade */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-6 lg:p-8 shadow-sm"
            >
              <SectionTitle 
                icon={Layers}
                title="Fatores de Complexidade"
                description="Configure os parâmetros do projeto"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {factors.map((factor, index) => (
                  <motion.div
                    key={factor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <FactorCard
                      factor={factor}
                      value={selections[factor.id]}
                      onChange={handleSelectionChange}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Seção 2: Parâmetros Financeiros */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-6 lg:p-8 shadow-sm"
            >
              <SectionTitle 
                icon={Wallet}
                title="Parâmetros Financeiros"
                description="Defina os valores base do projeto"
              />
              
              <FinancialInputs
                hourlyRate={hourlyRate}
                estimatedHours={estimatedHours}
                onHourlyRateChange={setHourlyRate}
                onEstimatedHoursChange={setEstimatedHours}
              />
            </motion.section>

            {/* Seção 3: Configurações Avançadas */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm"
            >
              <AdvancedSettings
                factors={factors}
                onFactorWeightChange={handleFactorWeightChange}
                onResetWeights={handleResetWeights}
              />
            </motion.section>
          </div>

          {/* Sidebar: Resultado - Sticky para melhor UX */}
          <div className="xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="sticky top-24"
            >
              <ResultCard results={results} isValid={isValid} />
              
              {/* Helper Text */}
              {!isValid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-amber-700">
                    {Object.keys(selections).length === 0 
                      ? "Selecione pelo menos um fator de complexidade para calcular o valor."
                      : errors.join(". ")}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer mais discreto */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400"
        >
          <p>
            Calculadora de Precificação para Projetos de Arquitetura
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
