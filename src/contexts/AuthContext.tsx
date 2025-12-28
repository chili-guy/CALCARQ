import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, db } from "@/lib/database";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = db.getCurrentUser();
      
      if (currentUser) {
        // Sincronizar com backend
        try {
          await api.syncUser(currentUser.id, currentUser.email, currentUser.name);
          
          // Buscar status de pagamento atualizado
          const paymentStatus = await api.getPaymentStatus(currentUser.id);
          
          // Atualizar usuário local com dados do backend
          if (paymentStatus.hasPaid !== currentUser.hasPaid) {
            db.updateUserPayment(currentUser.id, paymentStatus.hasPaid);
            const updatedUser = db.getCurrentUser();
            setUser(updatedUser);
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Erro ao sincronizar com backend:", error);
          // Em caso de erro, usar dados locais
          setUser(currentUser);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = db.login(email, password);
    setUser(loggedUser);
    // Sincronizar com backend após login
    try {
      await api.syncUser(loggedUser.id, loggedUser.email, loggedUser.name);
    } catch (error) {
      console.error("Erro ao sincronizar usuário após login:", error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const newUser = db.createUser(email, password, name);
    db.setCurrentUser(newUser);
    setUser(newUser);
    // Sincronizar com backend após registro
    try {
      await api.syncUser(newUser.id, newUser.email, newUser.name);
    } catch (error) {
      console.error("Erro ao sincronizar usuário após registro:", error);
    }
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser = db.getCurrentUser();
    
    if (currentUser) {
      try {
        // Buscar status atualizado do backend
        const paymentStatus = await api.getPaymentStatus(currentUser.id);
        
        console.log(`🔄 RefreshUser - Backend: hasPaid=${paymentStatus.hasPaid}, Local: hasPaid=${currentUser.hasPaid}`);
        
        // Atualizar localmente se necessário
        if (paymentStatus.hasPaid !== currentUser.hasPaid) {
          console.log(`📝 Atualizando pagamento local: ${currentUser.hasPaid} → ${paymentStatus.hasPaid}`);
          db.updateUserPayment(
            currentUser.id, 
            paymentStatus.hasPaid,
            paymentStatus.stripeCustomerId || undefined
          );
        }
        
        const updatedUser = db.getCurrentUser();
        if (updatedUser) {
          console.log(`✅ Usuário atualizado no contexto: hasPaid=${updatedUser.hasPaid}`);
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        // Em caso de erro, usar dados locais
        setUser(currentUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
