"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bikesApi, maintenancesApi, weatherApi } from "@/lib/api";
import type { Bike, Maintenance, DashboardStats, WeatherForecast } from "@/types";
import StatsCard from "@/components/StatsCard";
import WeatherCard from "@/components/WeatherCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [city, setCity] = useState("Rio de Janeiro");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [bikes, maintenances] = await Promise.all([
          bikesApi.getAll(),
          maintenancesApi.getAll(),
        ]);

        const totalSpent = maintenances.reduce(
          (sum, m) => sum + (m.cost || 0),
          0
        );
        const averageCost =
          maintenances.length > 0
            ? totalSpent / maintenances.length
            : 0;

        const recentMaintenances = maintenances
          .sort(
            (a, b) =>
              new Date(b.service_date).getTime() -
              new Date(a.service_date).getTime()
          )
          .slice(0, 5);

        setStats({
          totalBikes: bikes.length,
          totalMaintenances: maintenances.length,
          totalSpent,
          averageCost,
          recentMaintenances,
        });
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      if (!city) return;
      setWeatherLoading(true);
      try {
        const forecast = await weatherApi.getForecast(city);
        setWeather(forecast);
      } catch (err: any) {
        console.error("Erro ao carregar previsão do tempo:", err);
        if (err.response?.status === 503) {
          setWeather(null);
        }
      } finally {
        setWeatherLoading(false);
      }
    }
    loadWeather();
  }, [city]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const monthlyData = stats.recentMaintenances.reduce(
    (acc, m) => {
      const month = format(new Date(m.service_date), "MMM", {
        locale: ptBR,
      });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.cost += m.cost || 0;
        existing.count += 1;
      } else {
        acc.push({ month, cost: m.cost || 0, count: 1 });
      }
      return acc;
    },
    [] as { month: string; cost: number; count: number }[]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visão geral do seu sistema de manutenção
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Bicicletas"
          value={stats.totalBikes}
          subtitle="Bicicletas cadastradas"
        />
        <StatsCard
          title="Manutenções"
          value={stats.totalMaintenances}
          subtitle="Total de serviços"
        />
        <StatsCard
          title="Total Gasto"
          value={`R$ ${stats.totalSpent.toFixed(2)}`}
          subtitle="Em manutenções"
        />
        <StatsCard
          title="Custo Médio"
          value={`R$ ${stats.averageCost.toFixed(2)}`}
          subtitle="Por manutenção"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gastos por Mês
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                name="Custo (R$)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Manutenções por Mês
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manutenções Recentes
          </h2>
          <Link
            href="/maintenances"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Oficina
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Custo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentMaintenances.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {format(new Date(m.service_date), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {m.service_type}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {m.workshop_name || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {m.cost ? `R$ ${m.cost.toFixed(2)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Previsão do Tempo
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Dias recomendados para pedalar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCity((e.target as HTMLInputElement).value);
                }
              }}
              placeholder="Cidade"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
            <button
              onClick={() => {
                const input = document.querySelector(
                  'input[type="text"]'
                ) as HTMLInputElement;
                if (input) setCity(input.value);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Buscar
            </button>
          </div>
        </div>

        {weatherLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Carregando previsão...
          </div>
        ) : weather && weather.days.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {weather.days.map((day) => (
              <WeatherCard key={day.date} day={day} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                API Key não configurada
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Para usar a previsão do tempo, configure a variável de ambiente{" "}
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                  OPENWEATHER_API_KEY
                </code>{" "}
                no backend. Obtenha uma chave gratuita em{" "}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  openweathermap.org
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
