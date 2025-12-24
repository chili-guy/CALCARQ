// Sistema de banco de dados local usando localStorage

export interface User {
  id: string;
  email: string;
  password: string; // Em produção, isso deve ser hash
  name: string;
  hasPaid: boolean;
  paymentDate?: string;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  clientName?: string;
  projectName?: string;
  data: {
    minHourlyRate: number;
    factors: Array<{ id: string; name: string; weight: number; level: number }>;
    areaIntervals: Array<{ min: number; max: number | null; level: number }>;
    selections: Record<string, number>;
    estimatedHours: number;
    variableExpenses: Array<{ id: string; name: string; value: number }>;
    results: {
      globalComplexity: number;
      adjustedHourlyRate: number;
      projectPrice: number;
      finalSalePrice: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

class LocalDatabase {
  private usersKey = 'calcularq_users';
  private budgetsKey = 'calcularq_budgets';
  private currentUserKey = 'calcularq_current_user';

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  createUser(email: string, password: string, name: string): User {
    const users = this.getUsers();
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // Em produção, usar hash (bcrypt)
      name,
      hasPaid: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  }

  // Authentication
  login(email: string, password: string): User {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }
    if (user.password !== password) {
      throw new Error('Email ou senha incorretos');
    }
    this.setCurrentUser(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  // Budgets
  getBudgets(userId: string): Budget[] {
    const data = localStorage.getItem(this.budgetsKey);
    const allBudgets: Budget[] = data ? JSON.parse(data) : [];
    return allBudgets.filter(b => b.userId === userId);
  }

  saveBudget(budget: Budget): void {
    const data = localStorage.getItem(this.budgetsKey);
    const budgets: Budget[] = data ? JSON.parse(data) : [];
    
    const existingIndex = budgets.findIndex(b => b.id === budget.id);
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    
    localStorage.setItem(this.budgetsKey, JSON.stringify(budgets));
  }

  deleteBudget(budgetId: string, userId: string): void {
    const data = localStorage.getItem(this.budgetsKey);
    const budgets: Budget[] = data ? JSON.parse(data) : [];
    const filtered = budgets.filter(b => !(b.id === budgetId && b.userId === userId));
    localStorage.setItem(this.budgetsKey, JSON.stringify(filtered));
  }

  getBudgetById(budgetId: string, userId: string): Budget | undefined {
    const budgets = this.getBudgets(userId);
    return budgets.find(b => b.id === budgetId);
  }

  // Payment
  updateUserPayment(userId: string, hasPaid: boolean, stripeCustomerId?: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].hasPaid = hasPaid;
      users[userIndex].paymentDate = hasPaid ? new Date().toISOString() : undefined;
      if (stripeCustomerId) {
        users[userIndex].stripeCustomerId = stripeCustomerId;
      }
      this.saveUsers(users);
      
      // Atualizar usuário atual se for o mesmo
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(users[userIndex]);
      }
    }
  }
}

export const db = new LocalDatabase();
