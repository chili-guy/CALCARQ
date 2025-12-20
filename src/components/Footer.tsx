import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Calculator, Mail } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link 
              to={createPageUrl("Home")}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">
                Calcularq
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculadora inteligente de precificação para projetos de arquitetura. 
              Determine o valor justo do seu trabalho com base em fatores de complexidade 
              configuráveis e parâmetros personalizáveis.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-4 h-4" />
              <span>contato@calcularq.com.br</span>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to={createPageUrl("Home")}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to={createPageUrl("Calculator")}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Calculadora
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Sobre
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              O Calcularq é uma ferramenta profissional desenvolvida para arquitetos 
              e profissionais da área calcular com precisão o valor de seus projetos, 
              considerando múltiplos fatores de complexidade e personalização.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              <p>© {new Date().getFullYear()} <span className="text-white font-semibold">calcularq.com.br</span>. Todos os direitos reservados.</p>
            </div>
            <div className="text-xs text-slate-600">
              <p>Desenvolvido com precisão para profissionais de arquitetura</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

