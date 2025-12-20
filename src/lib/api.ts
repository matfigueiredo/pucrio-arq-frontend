import axios from "axios";
import type {
  Bike,
  BikeCreate,
  BikeUpdate,
  Maintenance,
  MaintenanceCreate,
  MaintenanceUpdate,
  Address,
  WeatherForecast,
  GoodCyclingDays,
} from "@/types";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? process.env.API_URL || "http://backend:8000/api/v1"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!isServer) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isServer) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const bikesApi = {
  getAll: async (): Promise<Bike[]> => {
    const response = await api.get<Bike[]>("/bikes");
    return response.data;
  },

  getById: async (id: number): Promise<Bike> => {
    const response = await api.get<Bike>(`/bikes/${id}`);
    return response.data;
  },

  create: async (data: BikeCreate): Promise<Bike> => {
    const response = await api.post<Bike>("/bikes", data);
    return response.data;
  },

  update: async (id: number, data: BikeUpdate): Promise<Bike> => {
    const response = await api.put<Bike>(`/bikes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/bikes/${id}`);
  },
};

export const maintenancesApi = {
  getAll: async (): Promise<Maintenance[]> => {
    const response = await api.get<Maintenance[]>("/maintenances");
    return response.data;
  },

  getById: async (id: number): Promise<Maintenance> => {
    const response = await api.get<Maintenance>(`/maintenances/${id}`);
    return response.data;
  },

  getByBikeId: async (bikeId: number): Promise<Maintenance[]> => {
    const response = await api.get<Maintenance[]>(
      `/maintenances/bike/${bikeId}`
    );
    return response.data;
  },

  create: async (data: MaintenanceCreate): Promise<Maintenance> => {
    const response = await api.post<Maintenance>("/maintenances", data);
    return response.data;
  },

  update: async (
    id: number,
    data: MaintenanceUpdate
  ): Promise<Maintenance> => {
    const response = await api.put<Maintenance>(`/maintenances/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/maintenances/${id}`);
  },
};

export const addressApi = {
  getByCep: async (cep: string): Promise<Address> => {
    const response = await api.get<Address>(`/address/${cep}`);
    return response.data;
  },
};

export const authApi = {
  requestCode: async (email: string): Promise<void> => {
    await api.post("/auth/request-code", { email });
  },

  verifyCode: async (email: string, code: string): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>("/auth/verify-code", {
      email,
      code,
    });
    return response.data;
  },
};

export const weatherApi = {
  getForecast: async (city: string): Promise<WeatherForecast> => {
    const response = await api.get<WeatherForecast>("/weather/forecast", {
      params: { city },
    });
    return response.data;
  },

  getGoodCyclingDays: async (city: string): Promise<GoodCyclingDays> => {
    const response = await api.get<GoodCyclingDays>("/weather/good-days", {
      params: { city },
    });
    return response.data;
  },
};

