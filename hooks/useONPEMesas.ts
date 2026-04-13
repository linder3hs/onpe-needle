"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMesas, ONPEMesas } from "@/lib/onpe";

export function useONPEMesas() {
  return useQuery<ONPEMesas>({
    queryKey: ["onpe-mesas"],
    queryFn: fetchMesas,
    staleTime: 25_000,
    refetchInterval: 30_000,
    retry: 3,
    placeholderData: (prev) => prev,
  });
}
