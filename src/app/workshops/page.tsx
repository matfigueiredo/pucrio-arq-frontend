"use client";

import { useState } from "react";
import { addressApi } from "@/lib/api";
import type { Address } from "@/types";

export default function WorkshopsPage() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!cep) return;

    setLoading(true);
    setError(null);
    setAddress(null);

    try {
      const cleanedCep = cep.replace(/\D/g, "");
      if (cleanedCep.length !== 8) {
        setError("CEP deve conter 8 dígitos");
        return;
      }

      const data = await addressApi.getByCep(cleanedCep);
      setAddress(data);
    } catch (err) {
      setError("CEP não encontrado ou inválido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Buscar Oficinas
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Encontre oficinas próximas através do CEP
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CEP
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
              placeholder="00000000"
              maxLength={8}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !cep}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {address && !address.erro && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Endereço Encontrado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  CEP
                </p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {address.cep}
                </p>
              </div>
              {address.logradouro && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Logradouro
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {address.logradouro}
                  </p>
                </div>
              )}
              {address.bairro && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bairro
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {address.bairro}
                  </p>
                </div>
              )}
              {address.localidade && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cidade
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {address.localidade}
                  </p>
                </div>
              )}
              {address.uf && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Estado
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {address.uf}
                  </p>
                </div>
              )}
              {address.complemento && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Complemento
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {address.complemento}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Dica:</strong> Use este endereço ao cadastrar uma
                manutenção para facilitar a localização da oficina.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

