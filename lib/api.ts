// API клиент для работы с бэкендом через Next.js API routes
const API_BASE_URL = '/api';

export interface User {
  id: number;
  nickname: string;
  created_at: string;
}

export interface ApiResponse<T> {
  message?: string;
  users?: User[];
  error?: string;
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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Получить всех пользователей
  async getUsers(): Promise<User[]> {
    const response = await this.request<{ users: User[] }>('/users');
    return response.users;
  }

  // Добавить нового пользователя
  async addUser(nickname: string): Promise<{ message: string; users: User[] }> {
    const response = await this.request<{ message: string; users: User[] }>('/users', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
    return response;
  }


  // Проверить здоровье API
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.request<{ status: string; message: string }>('/health');
    return response;
  }
}

// Создаем экземпляр API клиента
export const apiClient = new ApiClient(API_BASE_URL);
