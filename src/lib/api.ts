// API client para comunicação com o backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  async getLogs(limit: number = 100): Promise<any> {
    return this.request(`/api/logs?limit=${limit}`);
  }

  async getStats(): Promise<any> {
    return this.request('/api/stats');
  }
}

export const api = new ApiClient(API_BASE_URL);
