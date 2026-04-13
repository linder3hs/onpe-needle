"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTotals, ONPETotals } from "@/lib/onpe";

export function useONPETotals() {
  return useQuery<ONPETotals>({
    queryKey: ["onpe-totals"],
    queryFn: fetchTotals,
    staleTime: 25_000,
    refetchInterval: 30_000,
    retry: 3,
    placeholderData: (prev) => prev,
  });
}
