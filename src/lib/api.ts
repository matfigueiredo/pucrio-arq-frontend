import axios from "axios";
import type {
  Bike,
  BikeCreate,
  BikeUpdate,
  Maintenance,
  MaintenanceCreate,
  MaintenanceUpdate,
  Address,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

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

