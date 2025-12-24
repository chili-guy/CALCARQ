import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      if (user.hasPaid) {
        navigate(createPageUrl("Calculator"), { replace: true });
      } else {
        navigate(createPageUrl("Payment"), { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError("Nome é obrigatório");
          setIsLoading(false);
          return;
        }
        await register(email, password, name);
      }
      navigate(createPageUrl("Calculator"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar operação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-calcularq-blue mb-4">
              <img src="/logo.png" alt="Calcularq" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-calcularq-blue mb-2">
              {isLogin ? "Entrar" : "Criar Conta"}
            </h1>
            <p className="text-slate-600">
              {isLogin 
                ? "Acesse sua conta para usar a calculadora e salvar seus orçamentos"
                : "Crie sua conta gratuitamente para acessar a calculadora"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue"
                    placeholder="Seu nome"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-calcularq-blue hover:bg-[#002366] text-white py-6 text-lg font-semibold"
            >
              {isLoading ? (
                "Processando..."
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Entrar
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Criar Conta
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-calcularq-blue hover:underline"
            >
              {isLogin 
                ? "Não tem uma conta? Criar conta"
                : "Já tem uma conta? Fazer login"
              }
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link
              to={createPageUrl("Home")}
              className="text-sm text-slate-500 hover:text-calcularq-blue"
            >
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
