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

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

// Bus Station types
export interface BusStation {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  is_active: boolean;
  facilities?: string;
  created_at: string;
}

// Bus Route types
export interface BusRoute {
  id: number;
  route_number: string;
  route_name: string;
  origin_station_id: number;
  destination_station_id: number;
  distance_km: number;
  estimated_duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

// Bus types
export interface Bus {
  id: number;
  bus_number: string;
  license_plate: string;
  route_id: number;
  capacity: number;
  current_latitude?: number;
  current_longitude?: number;
  status: string;
  driver_name?: string;
  driver_phone?: string;
  last_updated: string;
  created_at: string;
}

// Schedule types
export interface BusSchedule {
  id: number;
  bus_id: number;
  departure_time: string;
  estimated_arrival_time: string;
  actual_departure_time?: string;
  actual_arrival_time?: string;
  current_occupancy: number;
  is_cancelled: boolean;
  delay_minutes: number;
  created_at: string;
}

// Ticket types
export interface Ticket {
  id: number;
  ticket_number: string;
  user_id: number;
  schedule_id: number;
  fare_type: string;
  quantity: number;
  total_price_etb: number;
  booking_time: string;
  travel_date: string;
  status: string;
  qr_code?: string;
  boarding_station_id: number;
  destination_station_id: number;
  // Additional fields from API
  route_number?: string;
  destination?: string;
  boardingStop?: string;
  seat_numbers?: string[];
  bus_number?: string;
  departure_time?: string;
  arrival_time?: string;
  payment_method?: string;
  price_etb?: number;
}

// Fare types
export interface FarePrice {
  id: number;
  route_id: number;
  fare_type: string;
  price_etb: number;
  is_active: boolean;
  created_at: string;
}

// Bus Arrival for upcoming arrivals
export interface BusArrival {
  id: string;
  route_number: string;
  destination: string;
  destination_station_id: number;
  origin_station_id: number;
  arrival_time: string;
  minutes_away: number;
  occupancy: string;
  accessible: boolean;
  bus_id: number;
  schedule_id: number;
}

// Buses API
export const busesApi = {
  async getStations(): Promise<BusStation[]> {
    return fetchApi<BusStation[]>('/api/buses/stations');
  },

  async getStation(id: number): Promise<BusStation> {
    return fetchApi<BusStation>(`/api/buses/stations/${id}`);
  },

  async getRoutes(): Promise<BusRoute[]> {
    return fetchApi<BusRoute[]>('/api/buses/routes');
  },

  async getRoute(id: number): Promise<BusRoute> {
    return fetchApi<BusRoute>(`/api/buses/routes/${id}`);
  },

  async getBuses(routeId?: number): Promise<Bus[]> {
    const url = routeId ? `/api/buses?route_id=${routeId}` : '/api/buses';
    return fetchApi<Bus[]>(url);
  },

  async getUpcomingArrivals(limit?: number): Promise<BusArrival[]> {
    const url = limit
      ? `/api/buses/schedules/upcoming?limit=${limit}`
      : '/api/buses/schedules/upcoming';
    return fetchApi<BusArrival[]>(url);
  },

  async getSchedule(id: number): Promise<BusSchedule> {
    return fetchApi<BusSchedule>(`/api/buses/schedules/${id}`);
  },

  async getSeats(busId: number, scheduleId?: number): Promise<unknown> {
    const url = scheduleId
      ? `/api/buses/${busId}/seats?schedule_id=${scheduleId}`
      : `/api/buses/${busId}/seats`;
    return fetchApi<unknown>(url);
  },
};

// Tickets API
export const ticketsApi = {
  async getMyTickets(): Promise<Ticket[]> {
    return fetchApi<Ticket[]>('/api/tickets/my-tickets');
  },

  async getTicket(id: number): Promise<Ticket> {
    return fetchApi<Ticket>(`/api/tickets/${id}`);
  },

  async getFarePrices(routeId: number): Promise<FarePrice[]> {
    return fetchApi<FarePrice[]>(`/api/tickets/fares/routes/${routeId}`);
  },

  async bookTicket(data: {
    schedule_id: number;
    fare_type: string;
    quantity: number;
    boarding_station_id: number;
    destination_station_id: number;
    selected_seat_ids?: number[];
    standing_count?: number;
  }): Promise<unknown> {
    return fetchApi<unknown>('/api/tickets/book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async reserveSeats(data: { schedule_id: number; seat_ids: number[] }): Promise<unknown> {
    return fetchApi<unknown>('/api/tickets/reserve-seats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default authApi;
