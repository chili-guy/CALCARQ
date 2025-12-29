import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { createPageUrl } from "@/utils";
import { api } from "@/lib/api";
import { db } from "@/lib/database";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token inválido. Verifique o link recebido por email.");
    }
  }, [token]);

  // Atualizar favicon e título
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "/favicon.png";
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = "image/png";
      newLink.href = "/favicon.png";
      document.head.appendChild(newLink);
    }
    document.title = "Redefinir Senha - Calcularq";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      // Validar token e obter informações do usuário
      const response = await api.resetPassword(token, password);

      if (response.success) {
        // Verificar se o usuário existe no localStorage
        let user = db.getUserById(response.userId);
        
        if (!user) {
          // Se o usuário não existe, verificar se existe pelo email
          console.warn('⚠️ Usuário não encontrado pelo userId. Buscando pelo email...');
          user = db.getUserByEmail(response.email);
          
          if (user) {
            // Se encontrou pelo email, atualizar o userId para corresponder
            console.log('✅ Usuário encontrado pelo email. Atualizando userId...');
            const users = db.getUsers();
            const userIndex = users.findIndex(u => u.email === response.email);
            if (userIndex >= 0) {
              users[userIndex].id = response.userId;
              db.saveUsers(users);
              user = users[userIndex];
            }
          } else {
            // Se não encontrou, criar novo usuário
            console.warn('⚠️ Usuário não encontrado. Criando novo usuário no localStorage...');
            try {
              user = db.createUser(
                response.email,
                password, // Senha já será a nova senha
                response.email.split('@')[0] // Nome padrão baseado no email
              );
              // Atualizar o userId para corresponder ao do backend
              if (user.id !== response.userId) {
                const users = db.getUsers();
                const userIndex = users.findIndex(u => u.id === user!.id);
                if (userIndex >= 0) {
                  users[userIndex].id = response.userId;
                  db.saveUsers(users);
                  user = users[userIndex];
                }
              }
              console.log('✅ Usuário criado no localStorage com nova senha.');
            } catch (error) {
              console.error('❌ Erro ao criar usuário:', error);
              // Se falhar (ex: email já existe), tentar atualizar a senha do usuário existente
              const existingUser = db.getUserByEmail(response.email);
              if (existingUser) {
                console.log('✅ Usuário existente encontrado. Atualizando senha...');
                db.updateUserPassword(existingUser.id, password);
                // Atualizar userId se necessário
                if (existingUser.id !== response.userId) {
                  const users = db.getUsers();
                  const userIndex = users.findIndex(u => u.id === existingUser.id);
                  if (userIndex >= 0) {
                    users[userIndex].id = response.userId;
                    db.saveUsers(users);
                  }
                }
              }
            }
          }
        }
        
        // Atualizar senha no localStorage (garantir que está atualizada)
        console.log('🔄 Atualizando senha para userId:', response.userId);
        db.updateUserPassword(response.userId, password);
        
        // Verificar se a atualização foi bem-sucedida
        const updatedUser = db.getUserById(response.userId);
        if (updatedUser) {
          console.log('✅ Senha atualizada com sucesso. Usuário encontrado no localStorage.');
          console.log('✅ Email:', updatedUser.email);
          console.log('✅ Você pode fazer login com este email e a nova senha.');
        } else {
          // Tentar buscar pelo email como fallback
          const userByEmail = db.getUserByEmail(response.email);
          if (userByEmail) {
            console.log('✅ Usuário encontrado pelo email. Senha atualizada.');
            console.log('✅ Email:', userByEmail.email);
            console.log('✅ Você pode fazer login com este email e a nova senha.');
          } else {
            console.error('❌ ERRO: Usuário não encontrado no localStorage após atualização!');
            console.error('❌ Isso pode acontecer se o localStorage foi limpo ou se você está em um dispositivo diferente.');
          }
        }

        setSuccess(true);

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate(createPageUrl("Login"));
        }, 3000);
      } else {
        setError("Token inválido ou expirado.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-calcularq-blue mb-4">
              Senha Redefinida!
            </h1>
            <p className="text-slate-600 mb-6">
              Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
            </p>
            <Link
              to={createPageUrl("Login")}
              className="text-calcularq-blue hover:underline"
            >
              Ir para login agora →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
              <img src="/Logomarca Branca Calcularq.png" alt="Calcularq" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-calcularq-blue mb-2">
              Redefinir Senha
            </h1>
            <p className="text-slate-600">
              Digite sua nova senha abaixo
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-calcularq-blue focus:border-calcularq-blue"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-calcularq-blue hover:bg-[#002366] text-white py-6 text-lg font-semibold"
            >
              {isLoading ? "Processando..." : "Redefinir Senha"}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to={createPageUrl("Login")}
              className="text-sm text-slate-500 hover:text-calcularq-blue"
            >
              ← Voltar para Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

