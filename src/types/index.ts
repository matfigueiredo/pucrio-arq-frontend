export interface Bike {
  id: number;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  created_at: string;
  updated_at?: string;
}

export interface BikeCreate {
  brand: string;
  model: string;
  year?: number;
  color?: string;
}

export interface BikeUpdate {
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
}

export interface Maintenance {
  id: number;
  bike_id: number;
  service_type: string;
  description?: string;
  cost?: number;
  workshop_name?: string;
  workshop_cep?: string;
  workshop_address?: string;
  service_date: string;
  created_at: string;
  updated_at?: string;
  bike?: Bike;
}

export interface MaintenanceCreate {
  bike_id: number;
  service_type: string;
  description?: string;
  cost?: number;
  workshop_name?: string;
  workshop_cep?: string;
  workshop_address?: string;
  service_date: string;
}

export interface MaintenanceUpdate {
  service_type?: string;
  description?: string;
  cost?: number;
  workshop_name?: string;
  workshop_cep?: string;
  workshop_address?: string;
  service_date?: string;
}

export interface Address {
  cep: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface DashboardStats {
  totalBikes: number;
  totalMaintenances: number;
  totalSpent: number;
  averageCost: number;
  recentMaintenances: Maintenance[];
}

export interface WeatherDay {
  date: string;
  temperature: number;
  min_temp: number;
  max_temp: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  description: string;
  icon: string;
  is_good_for_cycling: boolean;
}

export interface WeatherForecast {
  city: string;
  days: WeatherDay[];
}

export interface GoodCyclingDays {
  city: string;
  good_days: WeatherDay[];
}
