import axios from 'axios';
import { config } from './configService';

interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const AUTH_TOKEN_KEY = '@dashboardLovable:token';
const AUTH_TOKEN_EXPIRY_KEY = '@dashboardLovable:tokenExpiry';

// Instância do Axios para autenticação
const authApi = axios.create({
  baseURL: config.AUTH_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


// Instância do Axios para as APIs do sistema
export const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const authService = {
  async loginWithService(): Promise<AuthToken> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.SERVICE_CLIENT_ID);
    params.append('client_secret', config.SERVICE_CLIENT_SECRET);

    try {
      const response = await authApi.post<AuthToken>(`/auth/realms/${config.AUTH_REALM}/protocol/openid-connect/token`, params);
      this.setToken(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login com serviço:', error);
      this.setFallbackToken();
      throw error;
    }
  },

  async login(username: string, password: string): Promise<AuthToken> {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', config.CLIENT_ID);
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await authApi.post<AuthToken>(`/auth/realms/${config.AUTH_REALM}/protocol/openid-connect/token`, params);
      this.setToken(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      this.setFallbackToken();
      throw error;
    }
  },

  setFallbackToken(): void {
    const mockToken: AuthToken = {
      access_token: config.FALLBACK_TOKEN,
      expires_in: 3600,
      token_type: 'Bearer'
    };
    this.setToken(mockToken);
  },

  setToken(token: AuthToken): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token.access_token);

    const expiryTime = Date.now() + (token.expires_in * 1000);
    localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  getToken(): string {
    return localStorage.getItem(AUTH_TOKEN_KEY) || config.FALLBACK_TOKEN;
  },

  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && (!this.isTokenExpired() || token === config.FALLBACK_TOKEN);
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
  },

  getAuthorizationHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  },
};

// Interceptor global para todas as requisições da API do sistema
api.interceptors.request.use(
  async (config) => {
    //console.log('url base no interceptr baseulr : ', config.baseURL);
    let token = authService.getToken();
    
    if (token && authService.isTokenExpired()) {
      try {
        await authService.loginWithService();
        token = authService.getToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor global para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica se é erro de autenticação e se não é uma retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta usar o token padrão se não estiver usando
        if (!originalRequest.headers.Authorization?.includes(config.FALLBACK_TOKEN)) {
          authService.setFallbackToken();
          originalRequest.headers.Authorization = `Bearer ${config.FALLBACK_TOKEN}`;
          return api(originalRequest);
        }
        
        // Se já estiver usando o token padrão, faz logout
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
      } catch (authError) {
        return Promise.reject(authError);
      }
    }

    return Promise.reject(error);
  }
);

export default authService;