"use client";

import { useEffect, useState } from "react";
import { maintenancesApi, bikesApi } from "@/lib/api";
import type { Maintenance, Bike } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

export default function MaintenancesPage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBikeId, setFilterBikeId] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    maintenanceId: number | null;
  }>({ isOpen: false, maintenanceId: null });
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [maintenancesData, bikesData] = await Promise.all([
        maintenancesApi.getAll(),
        bikesApi.getAll(),
      ]);
      setMaintenances(maintenancesData);
      setBikes(bikesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(id: number) {
    setDeleteModal({ isOpen: true, maintenanceId: id });
  }

  async function handleDelete() {
    if (!deleteModal.maintenanceId) return;

    try {
      await maintenancesApi.delete(deleteModal.maintenanceId);
      await loadData();
      setDeleteModal({ isOpen: false, maintenanceId: null });
    } catch (err) {
      setDeleteModal({ isOpen: false, maintenanceId: null });
      setAlertModal({
        isOpen: true,
        message: "Erro ao excluir manutenção. Tente novamente.",
      });
      console.error(err);
    }
  }

  const filteredMaintenances = maintenances.filter((m) => {
    if (filterBikeId && m.bike_id !== parseInt(filterBikeId)) return false;
    if (filterType && !m.service_type.toLowerCase().includes(filterType.toLowerCase())) return false;
    return true;
  });

  const sortedMaintenances = [...filteredMaintenances].sort(
    (a, b) =>
      new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manutenções
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Histórico completo de manutenções
          </p>
        </div>
        <Link
          href="/maintenances/new"
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
        >
          Nova Manutenção
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={filterBikeId}
          onChange={(e) => setFilterBikeId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Todas as bicicletas</option>
          {bikes.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.brand} {bike.model}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrar por tipo de serviço..."
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {sortedMaintenances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma manutenção encontrada
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMaintenances.map((maintenance) => {
            const bike = bikes.find((b) => b.id === maintenance.bike_id);
            return (
              <div
                key={maintenance.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {maintenance.service_type}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(maintenance.service_date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {bike && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {bike.brand} {bike.model}
                      </p>
                    )}
                    {maintenance.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {maintenance.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {maintenance.workshop_name && (
                        <span>Oficina: {maintenance.workshop_name}</span>
                      )}
                      {maintenance.cost && (
                        <span className="font-semibold">
                          R$ {maintenance.cost.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/maintenances/${maintenance.id}/edit`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => openDeleteModal(maintenance.id)}
                      className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, maintenanceId: null })
        }
        onConfirm={handleDelete}
        title="Excluir Manutenção"
        message="Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: "" })}
        title="Erro"
        message={alertModal.message}
        variant="error"
      />
    </div>
  );
}

