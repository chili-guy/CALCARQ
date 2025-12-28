// API client para comunicação com o backend

// Em produção (Railway), se VITE_API_URL não estiver configurado,
// usar a URL atual (mesmo domínio) já que frontend e backend estão juntos
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se estiver em produção (não localhost), usar URL relativa
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return ''; // URL relativa (mesmo domínio)
  }
  
  // Desenvolvimento local
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export interface PaymentStatus {
  userId: string;
  hasPaid: boolean;
  paymentDate: string | null;
  stripeCustomerId: string | null;
}

export interface SyncUserResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    hasPaid: boolean;
    paymentDate: string | null;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async getPaymentStatus(userId: string): Promise<PaymentStatus> {
    return this.request<PaymentStatus>(`/api/user/${userId}/payment-status`);
  }

  async syncUser(userId: string, email: string, name: string): Promise<SyncUserResponse> {
    return this.request<SyncUserResponse>('/api/user/sync', {
      method: 'POST',
      body: JSON.stringify({ userId, email, name }),
    });
  }

  async verifyPayment(userId: string, sessionId?: string, paymentIntentId?: string): Promise<{ success: boolean; hasPaid: boolean; message: string }> {
    return this.request('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ userId, sessionId, paymentIntentId }),
    });
  }

  async createCheckoutSession(userId: string, email: string, name: string): Promise<{ sessionId: string; url: string }> {
    return this.request('/api/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({ userId, email, name }),
    });
  }

  async getLogs(limit: number = 100): Promise<any> {
    return this.request(`/api/logs?limit=${limit}`);
  }

  async getStats(): Promise<any> {
    return this.request('/api/stats');
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; userId: string; email: string; message: string }> {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
