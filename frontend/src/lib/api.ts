const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7077';

function getAuthToken(): string | null {
  return localStorage.getItem('smartbus_token');
}

function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('smartbus_token', token);
  } else {
    localStorage.removeItem('smartbus_token');
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  avatar?: string;
  location?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.access_token);
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.access_token);
    return response;
  },

  async getMe(): Promise<User> {
    return fetchApi<User>('/api/auth/me');
  },

  async refresh(): Promise<AuthResponse> {
    const response = await fetchApi<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
    });
    setAuthToken(response.access_token);
    return response;
  },

  logout(): void {
    setAuthToken(null);
  },
};

export default authApi;