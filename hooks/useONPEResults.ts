"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCandidates, ONPECandidate } from "@/lib/onpe";

export function useONPEResults() {
  return useQuery<ONPECandidate[]>({
    queryKey: ["onpe-candidates"],
    queryFn: fetchCandidates,
    staleTime: 25_000,
    refetchInterval: 30_000,
    retry: 3,
    placeholderData: (prev) => prev,
  });
}
