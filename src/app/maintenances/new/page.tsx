"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { maintenancesApi, bikesApi, addressApi } from "@/lib/api";
import type { MaintenanceCreate, Bike, Address } from "@/types";
import AlertModal from "@/components/AlertModal";

export default function NewMaintenancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [formData, setFormData] = useState<MaintenanceCreate>({
    bike_id: 0,
    service_type: "",
    description: "",
    cost: undefined,
    workshop_name: "",
    workshop_cep: "",
    workshop_address: "",
    service_date: new Date().toISOString().split("T")[0],
  });
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    async function loadBikes() {
      try {
        const data = await bikesApi.getAll();
        setBikes(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, bike_id: data[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBikes();
  }, []);

  async function handleCepSearch() {
    if (!formData.workshop_cep) return;

    setLoadingCep(true);
    try {
      const address = await addressApi.getByCep(
        formData.workshop_cep.replace(/\D/g, "")
      );
      setFormData((prev) => ({
        ...prev,
        workshop_address: `${address.logradouro || ""}, ${address.bairro || ""}, ${address.localidade || ""} - ${address.uf || ""}`.trim(),
      }));
    } catch (err) {
      setAlertModal({
        isOpen: true,
        message: "CEP não encontrado. Verifique o CEP e tente novamente.",
      });
    } finally {
      setLoadingCep(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await maintenancesApi.create({
        ...formData,
        service_date: new Date(formData.service_date).toISOString(),
      });
      router.push("/maintenances");
    } catch (err) {
      setAlertModal({
        isOpen: true,
        message: "Erro ao criar manutenção. Verifique os dados e tente novamente.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Nova Manutenção
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bicicleta *
          </label>
          <select
            required
            value={formData.bike_id}
            onChange={(e) =>
              setFormData({ ...formData, bike_id: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value={0}>Selecione uma bicicleta</option>
            {bikes.map((bike) => (
              <option key={bike.id} value={bike.id}>
                {bike.brand} {bike.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Serviço *
          </label>
          <input
            type="text"
            required
            value={formData.service_type}
            onChange={(e) =>
              setFormData({ ...formData, service_type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data do Serviço *
          </label>
          <input
            type="date"
            required
            value={formData.service_date}
            onChange={(e) =>
              setFormData({ ...formData, service_date: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custo (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.cost || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome da Oficina
          </label>
          <input
            type="text"
            value={formData.workshop_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, workshop_name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CEP da Oficina
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.workshop_cep || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workshop_cep: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="00000000"
              maxLength={8}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={handleCepSearch}
              disabled={loadingCep || !formData.workshop_cep}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
            >
              {loadingCep ? "..." : "Buscar"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço da Oficina
          </label>
          <input
            type="text"
            value={formData.workshop_address || ""}
            onChange={(e) =>
              setFormData({ ...formData, workshop_address: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: "" })}
        title="Aviso"
        message={alertModal.message}
        variant="error"
      />
    </div>
  );
}

