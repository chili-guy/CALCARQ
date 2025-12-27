import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calculator, Home, BookOpen, LogIn, LogOut, User, History } from "lucide-react";
import Footer from "./Footer";
import LegalModal from "./LegalModal";
import { useAuth } from "@/contexts/AuthContext";
import { termsContent, privacyContent } from "@/lib/legalContent";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const navigation = [
    { name: "Home", page: "Home", icon: Home },
    { name: "Calculadora", page: "Calculator", icon: Calculator },
  ];

  // Determina a página atual baseado na rota
  const getCurrentPageName = () => {
    const path = location.pathname.toLowerCase();
    if (path === "/" || path === "/home" || path.includes("home")) {
      return "Home";
    }
    if (path.includes("calculator") || path === "/calculator") {
      return "Calculator";
    }
    if (path.includes("manual") || path === "/manual") {
      return "Manual";
    }
    return "";
  };

  const currentPageName = getCurrentPageName();
      <div>
        <h2 class="text-2xl font-bold text-calcularq-blue mb-4">TERMOS E CONDIÇÕES GERAIS DE USO E LICENCIAMENTO DE SOFTWARE</h2>
        <p class="text-sm text-slate-500 mb-6">Versão 1.0 | Data de Vigência: [Inserir Data de Lançamento]</p>
        <p class="text-slate-700 mb-4">
          O presente Instrumento de Termos e Condições Gerais de Uso ("Termos") regula o
          licenciamento de uso do software CALCULARQ, disponibilizado por PEDRO AFONSO
          MAIA PIRES, pessoa física, doravante denominado LICENCIANTE.
        </p>
        <p class="text-slate-700 mb-6">
          A aceitação destes Termos é indispensável para a utilização da plataforma. Ao realizar o
          pagamento e acessar o sistema, o indivíduo, doravante denominado LICENCIADO (ou
          USUÁRIO), declara ter lido, compreendido e aceito integralmente as disposições aqui
          contidas.
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">1. DO OBJETO</h3>
        <p class="text-slate-700 mb-3">
          O presente contrato tem por objeto a concessão de uma licença de uso de software
          (modalidade SaaS - Software as a Service), em caráter oneroso, pessoal, intransferível e
          não exclusivo.
        </p>
        <p class="text-slate-700">
          O software CALCULARQ consiste em uma ferramenta digital de precificação de projetos
          arquitetônicos, permitindo ao LICENCIADO realizar cálculos e armazenar o histórico dos
          orçamentos gerados, mediante inserção de dados próprios.
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">2. DA VIGÊNCIA E MODALIDADE DE ACESSO</h3>
        <p class="text-slate-700 mb-3">
          O acesso ao software é concedido mediante a modalidade de pagamento único, regido
          pelas seguintes disposições de vigência e perenidade:
        </p>
        <div class="space-y-3 text-slate-700">
          <div>
            <p class="font-semibold mb-1">2.1. Garantia Mínima de Disponibilidade</p>
            <p>
              O LICENCIANTE assegura a manutenção do serviço e o acesso irrestrito à plataforma pelo
              período mínimo de 06 (seis) meses, contados a partir da data de confirmação do
              pagamento.
            </p>
          </div>
          <div>
            <p class="font-semibold mb-1">2.2. Vigência Estendida (Life of the Software)</p>
            <p>
              Após o decurso do período de garantia mínima supramencionado, a licença de uso
              permanecerá válida por prazo indeterminado, vigorando enquanto o software estiver
              operacional e disponibilizado pelo LICENCIANTE na rede mundial de computadores
              (modelo conhecido internacionalmente como "Life of the Software").
            </p>
          </div>
          <div>
            <p class="font-semibold mb-1">2.3. Descontinuidade do Serviço</p>
            <p>
              O LICENCIANTE reserva-se o direito de encerrar as operações da plataforma a qualquer
              momento após o cumprimento do período de garantia mínima de 06 (seis) meses.
              Na hipótese de encerramento definitivo das atividades, o LICENCIADO será notificado
              através do endereço de e-mail cadastrado ou por aviso na plataforma, com antecedência
              mínima de 30 (trinta) dias, para que possa realizar a extração de seus dados e relatórios.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">3. DO PREÇO E FORMA DE PAGAMENTO</h3>
        <p class="text-slate-700 mb-3">
          Em contrapartida à licença de uso concedida, o LICENCIADO pagará o valor único vigente
          na data da contratação, divulgado na página oficial do produto.
        </p>
        <p class="text-slate-700 mb-3">
          O processamento das transações financeiras é realizado integralmente pela empresa Stripe
          Inc. O LICENCIANTE não armazena dados bancários ou números de cartão de crédito em
          seus servidores.
        </p>
        <p class="text-slate-700">
          A liberação do acesso ao software ocorrerá de forma automática e imediata após a
          confirmação do pagamento pela instituição financeira.
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">4. DA POLÍTICA DE ARREPENDIMENTO E REEMBOLSO</h3>
        <div class="space-y-3 text-slate-700">
          <div>
            <p class="font-semibold mb-1">4.1. Direito de Arrependimento (7 Dias)</p>
            <p>
              Em estrita observância ao Artigo 49 do Código de Defesa do Consumidor (Lei nº
              8.078/1990), é assegurado ao LICENCIADO o direito de desistir da contratação no prazo de
              até 07 (sete) dias corridos, a contar da data da compra.
            </p>
            <p class="mt-2">
              Nesta hipótese, o LICENCIADO deverá formalizar o pedido de cancelamento através do
              e-mail atendimento.calcularq@gmail.com, sendo garantido o reembolso integral do valor
              pago.
            </p>
          </div>
          <div>
            <p class="font-semibold mb-1">4.2. Reembolso por Descontinuidade Precoce</p>
            <p>
              Caso o LICENCIANTE encerre as atividades da plataforma antes de completado o período
              de garantia mínima de 06 (seis) meses previsto na Cláusula 2.1, o LICENCIADO terá direito
              ao reembolso integral do valor pago, independentemente do tempo de uso já usufruído.
            </p>
          </div>
          <div>
            <p class="font-semibold mb-1">4.3. Ausência de Reembolso Após Prazo Legal</p>
            <p>
              Decorrido o prazo legal de 07 (sete) dias, e salvo a exceção de descontinuidade precoce
              prevista no item anterior, não caberá reembolso por mera desistência, ressalvados os
              direitos de garantia legal e vícios ocultos previstos no Código de Defesa do Consumidor.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">5. DAS LIMITAÇÕES DE RESPONSABILIDADE</h3>
        <p class="text-slate-700 mb-3">
          O CALCULARQ é uma ferramenta instrumental de auxílio ao cálculo. O LICENCIANTE não
          presta serviços de consultoria financeira, contábil ou jurídica.
        </p>
        <p class="text-slate-700 mb-3">
          O LICENCIADO reconhece expressamente que é o único e exclusivo responsável pela
          inserção dos dados e pela interpretação dos resultados gerados.
        </p>
        <p class="text-slate-700 mb-3">
          O LICENCIANTE não se responsabiliza por prejuízos financeiros decorrentes de
          orçamentos elaborados com base na ferramenta, recusa de propostas comerciais por parte
          dos clientes do LICENCIADO ou erros de cálculo provenientes de dados imprecisos
          inseridos pelo LICENCIADO.
        </p>
        <p class="text-slate-700 mb-3">
          O software é fornecido "no estado em que se encontra" (as is), sem garantias implícitas de
          adequação a um fim específico ou de rentabilidade garantida, ressalvadas as garantias
          legais obrigatórias previstas no Código de Defesa do Consumidor.
        </p>
        <p class="text-slate-700 mb-3">
          Não serão consideradas violações à garantia de disponibilidade as interrupções
          temporárias necessárias para manutenções técnicas programadas, atualizações de
          segurança ou melhorias na plataforma, desde que não impliquem na descontinuidade
          definitiva do serviço.
        </p>
        <p class="text-slate-700">
          A limitação de responsabilidade aqui prevista não se aplica aos casos de dolo, culpa grave
          ou falhas estruturais do sistema que impeçam a utilização da plataforma durante o período
          de garantia mínima, ressalvadas as janelas de manutenção supracitadas.
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">6. DA PROPRIEDADE INTELECTUAL</h3>
        <p class="text-slate-700 mb-3">
          Todos os direitos de propriedade intelectual relativos ao software, incluindo seu
          código-fonte, banco de dados, design, interface gráfica, logomarca e metodologia de
          cálculo, são de titularidade exclusiva do LICENCIANTE.
        </p>
        <p class="text-slate-700 mb-3">
          É vedado ao LICENCIADO ceder, sublicenciar, vender, alugar ou transferir sua conta a
          terceiros.
        </p>
        <p class="text-slate-700">
          É vedado realizar engenharia reversa, descompilação ou desmontagem do software, bem
          como utilizar técnicas de data mining ou bots para extração de dados da plataforma.
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">7. DA PROTEÇÃO DE DADOS E PRIVACIDADE</h3>
        <p class="text-slate-700 mb-3">
          O tratamento dos dados pessoais do LICENCIADO e dos dados de terceiros inseridos na
          plataforma reger-se-á pela Política de Privacidade, parte integrante e indissociável destes
          Termos.
        </p>
        <p class="text-slate-700">
          Ao utilizar a funcionalidade de "Histórico de Orçamentos", o LICENCIADO declara possuir
          as devidas autorizações legais para inserir dados de seus clientes na plataforma,
          assumindo a posição de Controlador desses dados perante a Lei Geral de Proteção de
          Dados (LGPD).
        </p>
      </div>

      <div>
        <h3 class="text-xl font-bold text-calcularq-blue mb-3">8. DAS DISPOSIÇÕES GERAIS E FORO</h3>
        <p class="text-slate-700 mb-3">
          O LICENCIANTE poderá alterar os presentes Termos visando sua adequação a novas
          legislações ou funcionalidades do sistema.
        </p>
        <p class="text-slate-700 mb-3">
          As alterações relevantes serão comunicadas ao LICENCIADO, por e-mail ou aviso na
          plataforma, com antecedência mínima de 15 (quinze) dias. Caso o LICENCIADO não
          concorde com as modificações substanciais, poderá optar pela rescisão do contrato.
        </p>
        <p class="text-slate-700 mb-3">
          Fica estabelecido que eventuais alterações contratuais não afetarão direitos adquiridos,
          valores já pagos ou garantias de disponibilidade já iniciadas.
        </p>
        <p class="text-slate-700">
          Para dirimir quaisquer controvérsias oriundas deste contrato, fica eleito o foro da Comarca
          de domicílio do LICENCIADO (Consumidor), em conformidade com o Artigo 101, I, do
          Código de Defesa do Consumidor.
        </p>
      </div>
  const currentPageName = getCurrentPageName();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Logo completa em vez de logomarca */}
            <Link 
              to={createPageUrl("Home")}
              className="flex items-center"
            >
              <img 
                src="/logo-calcularq.png" 
                alt="Calcularq" 
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? "bg-calcularq-blue text-white" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-calcularq-blue"
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* User Menu */}
              {user ? (
                <>
                  {/* Manual - só para usuários que pagaram */}
                  {user.hasPaid && (
                    <Link
                      to={createPageUrl("Manual")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPageName === "Manual"
                          ? "bg-calcularq-blue text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-calcularq-blue"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Manual</span>
                    </Link>
                  )}
                  <Link
                    to="/budgets"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-calcularq-blue transition-all"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">Meus Cálculos</span>
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-calcularq-blue transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </>
              ) : (
                <Link
                  to={createPageUrl("Login")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-calcularq-blue transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Legal Modals */}
      <LegalModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Termos e Condições Gerais de Uso"
        content={termsContent}
      />
      
      <LegalModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Política de Privacidade e Proteção de Dados Pessoais"
        content={privacyContent}
      />
    </div>
  );
}
