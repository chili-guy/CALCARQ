import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_28E9AM9Ke6nGaYRdCS73G01";
const POLL_INTERVAL = 3000; // Verificar a cada 3 segundos
const MAX_POLL_ATTEMPTS = 60; // Máximo de 3 minutos

export default function Payment() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkoutWindowRef = useRef<Window | null>(null);

  // Verificar se já pagou
  useEffect(() => {
    if (user?.hasPaid) {
      navigate(createPageUrl("Calculator"), { replace: true });
    }
  }, [user, navigate]);

  // Verificar se veio do Stripe (success)
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId && user) {
      verifyPaymentWithSession(sessionId);
    }
  }, [searchParams, user]);

  // Limpar interval ao desmontar
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const verifyPaymentWithSession = async (sessionId: string) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const result = await api.verifyPayment(user.id, sessionId);
      
      if (result.success && result.hasPaid) {
        await refreshUser(); // Atualizar contexto do backend
        setStatus("success");
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate(createPageUrl("Calculator"), { replace: true });
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!user) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    if (pollAttempts >= MAX_POLL_ATTEMPTS) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setStatus("error");
      setIsProcessing(false);
      return;
    }

    try {
      const paymentStatus = await api.getPaymentStatus(user.id);
      
      if (paymentStatus.hasPaid) {
        // Pagamento confirmado!
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        await refreshUser();
        setStatus("success");
        setIsProcessing(false);
        
        setTimeout(() => {
          navigate(createPageUrl("Calculator"), { replace: true });
        }, 2000);
      } else {
        setPollAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao verificar status de pagamento:", error);
      setPollAttempts(prev => prev + 1);
    }
  };

  const handleStripeCheckout = async () => {
    if (!user) {
      navigate(createPageUrl("Login"), { replace: true });
      return;
    }

    // Sincronizar usuário com backend antes do pagamento
    try {
      await api.syncUser(user.id, user.email, user.name);
    } catch (error) {
      console.error("Erro ao sincronizar usuário:", error);
    }

    // Abrir Stripe Checkout em nova aba
    const checkoutUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${user.id}`;
    checkoutWindowRef.current = window.open(
      checkoutUrl,
      "_blank",
      "width=600,height=700"
    );

    if (!checkoutWindowRef.current) {
      alert("Por favor, permita pop-ups para este site para realizar o pagamento.");
      return;
    }

    setIsProcessing(true);
    setPollAttempts(0);
    setStatus("pending");

    // Iniciar polling para verificar status de pagamento
    pollIntervalRef.current = setInterval(() => {
      checkPaymentStatus();
    }, POLL_INTERVAL);

    // Verificar imediatamente também
    checkPaymentStatus();

    // Monitorar quando a janela fechar
    const checkClosed = setInterval(() => {
      if (checkoutWindowRef.current?.closed) {
        clearInterval(checkClosed);
        // Continuar verificando por mais alguns segundos caso o webhook ainda não tenha processado
        setTimeout(() => {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (status === "pending") {
            setIsProcessing(false);
            // Verificar uma última vez
            checkPaymentStatus();
          }
        }, 5000);
      }
    }, 1000);

    // Timeout de segurança (5 minutos)
    setTimeout(() => {
      clearInterval(checkClosed);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (checkoutWindowRef.current && !checkoutWindowRef.current.closed) {
        checkoutWindowRef.current.close();
      }
      if (status === "pending") {
        setIsProcessing(false);
      }
    }, 300000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Você precisa estar logado para realizar o pagamento</p>
          <Button
            onClick={() => navigate(createPageUrl("Login"))}
            className="bg-calcularq-blue hover:bg-[#002366] text-white"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-calcularq-blue mb-2">
            Pagamento Confirmado!
          </h2>
          <p className="text-slate-600 mb-6">
            Seu acesso à calculadora foi liberado. Redirecionando...
          </p>
          <Loader className="w-6 h-6 animate-spin text-calcularq-blue mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Erro no Pagamento
          </h2>
          <p className="text-slate-600 mb-6">
            Ocorreu um erro ao processar seu pagamento. Tente novamente.
          </p>
          <Button
            onClick={handleStripeCheckout}
            className="bg-calcularq-blue hover:bg-[#002366] text-white"
          >
            Tentar Novamente
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-calcularq-blue/10 flex items-center justify-center mx-auto mb-4">
              <img src="/logo.png" alt="Calcularq" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-calcularq-blue mb-4">
              Acesso à Calculadora
            </h1>
            <p className="text-lg text-slate-600">
              Para acessar a calculadora Calcularq, é necessário realizar o pagamento único.
            </p>
          </div>

          <div className="bg-calcularq-blue/5 border border-calcularq-blue/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-calcularq-blue mb-4">
              O que você recebe:
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Acesso completo à calculadora de precificação</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Salvamento ilimitado de orçamentos</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Histórico completo de seus projetos</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Acesso permanente à sua conta</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={handleStripeCheckout}
              disabled={isProcessing}
              className="bg-calcularq-orange hover:bg-[#e69400] text-white px-8 py-6 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Realizar Pagamento"
              )}
            </Button>
            <p className="text-sm text-slate-500 mt-4">
              Pagamento seguro processado pela Stripe
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Após o pagamento, você será redirecionado automaticamente para a calculadora.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
