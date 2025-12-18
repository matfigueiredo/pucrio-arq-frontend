"use client";

import { useEffect, useState } from "react";
import { bikesApi, maintenancesApi } from "@/lib/api";
import type { Bike, Maintenance, DashboardStats } from "@/types";
import StatsCard from "@/components/StatsCard";
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
}
