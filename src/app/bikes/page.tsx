"use client";

import { useEffect, useState } from "react";
import { bikesApi } from "@/lib/api";
import type { Bike } from "@/types";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    bikeId: number | null;
  }>({ isOpen: false, bikeId: null });
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  useEffect(() => {
    loadBikes();
  }, []);

  async function loadBikes() {
    try {
      const data = await bikesApi.getAll();
      setBikes(data);
    } catch (err) {
      setError("Erro ao carregar bicicletas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(id: number) {
    setDeleteModal({ isOpen: true, bikeId: id });
  }

  async function handleDelete() {
    if (!deleteModal.bikeId) return;

    try {
      await bikesApi.delete(deleteModal.bikeId);
      await loadBikes();
      setDeleteModal({ isOpen: false, bikeId: null });
    } catch (err) {
      setDeleteModal({ isOpen: false, bikeId: null });
      setAlertModal({
        isOpen: true,
        message: "Erro ao excluir bicicleta. Tente novamente.",
      });
      console.error(err);
    }
  }

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
            Bicicletas
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie suas bicicletas
          </p>
        </div>
        <Link
          href="/bikes/new"
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
        >
          Nova Bicicleta
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {bikes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma bicicleta cadastrada
          </p>
          <Link
            href="/bikes/new"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Cadastrar primeira bicicleta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {bike.brand} {bike.model}
              </h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {bike.year && <p>Ano: {bike.year}</p>}
                {bike.color && <p>Cor: {bike.color}</p>}
              </div>
              <div className="mt-6 flex gap-2">
                <Link
                  href={`/bikes/${bike.id}/edit`}
                  className="flex-1 px-4 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => openDeleteModal(bike.id)}
                  className="flex-1 px-4 py-2 text-center border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, bikeId: null })}
        onConfirm={handleDelete}
        title="Excluir Bicicleta"
        message="Tem certeza que deseja excluir esta bicicleta? Esta ação não pode ser desfeita."
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

