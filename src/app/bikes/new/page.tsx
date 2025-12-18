"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bikesApi } from "@/lib/api";
import type { BikeCreate } from "@/types";
import AlertModal from "@/components/AlertModal";

export default function NewBikePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [formData, setFormData] = useState<BikeCreate>({
    brand: "",
    model: "",
    year: undefined,
    color: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await bikesApi.create({
        ...formData,
        year: formData.year || undefined,
        color: formData.color || undefined,
      });
      router.push("/bikes");
    } catch (err) {
      setAlertModal({
        isOpen: true,
        message: "Erro ao criar bicicleta. Verifique os dados e tente novamente.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Nova Bicicleta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Marca *
          </label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo *
          </label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ano
          </label>
          <input
            type="number"
            min="1900"
            max="2100"
            value={formData.year || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                year: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <input
            type="text"
            value={formData.color || ""}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
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
        title="Erro"
        message={alertModal.message}
        variant="error"
      />
    </div>
  );
}

