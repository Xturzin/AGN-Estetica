"use client";

import { useState } from "react";

export interface CEPData {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface UseCEPResult {
  data: CEPData | null;
  error: string | null;
  loading: boolean;
  lookup: (cep: string) => Promise<void>;
  reset: () => void;
}

export function useCEP(): UseCEPResult {
  const [data, setData] = useState<CEPData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(cep: string): Promise<void> {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("CEP inválido");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cep/${cleanCep}`);
      const json = (await res.json()) as {
        data: CEPData | null;
        error: { message: string } | null;
      };
      if (json.error) {
        setError(json.error.message);
        setData(null);
      } else {
        setData(json.data);
      }
    } catch {
      setError("Erro ao consultar CEP");
    } finally {
      setLoading(false);
    }
  }

  function reset(): void {
    setData(null);
    setError(null);
  }

  return { data, error, loading, lookup, reset };
}