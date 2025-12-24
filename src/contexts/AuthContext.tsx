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
  };

  const register = async (email: string, password: string, name: string) => {
    const newUser = db.createUser(email, password, name);
    db.setCurrentUser(newUser);
    setUser(newUser);
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
        
        // Atualizar localmente se necessário
        if (paymentStatus.hasPaid !== currentUser.hasPaid) {
          db.updateUserPayment(currentUser.id, paymentStatus.hasPaid);
        }
        
        const updatedUser = db.getCurrentUser();
        setUser(updatedUser);
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
