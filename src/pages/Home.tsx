import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Layers, 
  Settings2, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { createPageUrl } from "@/utils";
import PlansSection from "@/components/PlansSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export default function Home() {
  const features = [
    {
      icon: Layers,
      title: "Fatores Configuráveis",
      description: "6 fatores de complexidade com pesos personalizáveis"
    },
    {
      icon: Calculator,
      title: "Cálculo Preciso",
      description: "Média ponderada para índice de complexidade global"
    },
    {
      icon: TrendingUp,
      title: "Tempo Real",
      description: "Resultados atualizados instantaneamente"
    },
    {
      icon: Settings2,
      title: "Personalização Total",
      description: "Ajuste pesos e parâmetros conforme sua necessidade"
    }
  ];

  const factorsList = [
    "Área Construída",
    "Etapa do Projeto", 
    "Nível de Detalhamento",
    "Exigência Técnica",
    "Exigência Burocrática",
    "Acompanhamento"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />

      <div className="relative">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Background Image with Opacity */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden opacity-25 pointer-events-none"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 rounded-3xl pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center max-w-3xl mx-auto z-10"
          >
            <Badge 
              variant="outline" 
              className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Ferramenta Profissional
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Precifique seus projetos de arquitetura com{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
                precisão
              </span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Calculadora inteligente baseada em fatores de complexidade. 
              Determine o valor justo do seu trabalho em segundos.
            </p>

            <Link to={createPageUrl("Calculator")}>
              <Button 
                size="lg" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Começar a Calcular
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Factors Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Fatores de Complexidade
                </h2>
                <p className="text-slate-400 mb-6">
                  Nossa calculadora considera 6 fatores essenciais para 
                  determinar a complexidade real do seu projeto.
                </p>
                <Link to={createPageUrl("Calculator")}>
                  <Button 
                    className="bg-white text-slate-900 border-2 border-white hover:bg-slate-50 hover:border-slate-200 shadow-lg font-semibold px-6 py-3"
                  >
                    Experimentar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {factorsList.map((factor, index) => (
                  <motion.div
                    key={factor}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-white text-sm">{factor}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Plans Section */}
        <PlansSection />

        {/* Formula Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Como Funciona
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <FormulaStep 
                number="1" 
                title="Complexidade Global"
                formula="Σ(nível × peso) / Σ(pesos)"
              />
              <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
              <FormulaStep 
                number="2" 
                title="Valor-hora Técnica"
                formula="Hora Mínima × Complexidade"
              />
              <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
              <FormulaStep 
                number="3" 
                title="Valor Final"
                formula="Hora Técnica × Horas Estimadas"
              />
            </div>
          </motion.div>
        </div>

        {/* Reviews Carousel */}
        <ReviewsCarousel />
      </div>
    </div>
  );
}

function FormulaStep({ number, title, formula }: { number: string; title: string; formula: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 w-full md:w-auto">
      <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
        {number}
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <code className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
        {formula}
      </code>
    </div>
  );
}
