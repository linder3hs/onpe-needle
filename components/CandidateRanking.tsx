"use client";

import { motion } from "framer-motion";
import { ONPECandidate, shortName, candidatePhotoUrl, partyLogoUrl } from "@/lib/onpe";
import { partyColor } from "@/lib/utils";

interface CandidateRankingProps {
  candidates: ONPECandidate[];
  limit?: number;
}

export default function CandidateRanking({ candidates, limit = 8 }: CandidateRankingProps) {
  const sorted = [...candidates]
    .sort((a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos)
    .slice(0, limit);

  const max = sorted[0]?.porcentajeVotosValidos ?? 1;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((c, idx) => {
        const pct = c.porcentajeVotosValidos;
        const barWidth = (pct / max) * 100;
        const color = partyColor(idx);
        const name = shortName(c.nombreCandidato);
        const photoUrl = c.dniCandidato ? candidatePhotoUrl(c.dniCandidato) : null;
        const logoUrl = partyLogoUrl(c.codigoAgrupacionPolitica);

        const prevPct = idx > 0 ? sorted[idx - 1].porcentajeVotosValidos : null;
        const gap = prevPct !== null ? (prevPct - pct).toFixed(2) : null;

        return (
          <div key={c.codigoAgrupacionPolitica}>
            {gap !== null && (
              <div className="flex justify-end">
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color }}
                >
                  ~ {gap}
                </span>
              </div>
            )}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, type: "spring", stiffness: 200, damping: 25 }}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <span className="text-secondary font-mono text-xs w-5 text-right shrink-0">
              {idx + 1}
            </span>

            {/* Candidate photo + party logo */}
            <div className="relative shrink-0 w-9 h-9">
              {/* Candidate photo */}
              {photoUrl && (
                <div
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/10"
                  style={{ backgroundColor: color + "33" }}
                >
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              {/* Party logo — small badge bottom-right */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full overflow-hidden border border-white/20 bg-black">
                <img
                  src={logoUrl}
                  alt={c.nombreAgrupacionPolitica}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Bar + name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1 gap-2">
                <span className="text-white text-sm font-medium truncate">{name}</span>
                <span
                  className="font-mono text-sm font-bold shrink-0"
                  style={{ color }}
                >
                  {pct.toFixed(2)}%
                </span>
              </div>

              <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.06 }}
                />
              </div>

              <div className="text-secondary text-xs font-mono mt-0.5 truncate">
                {c.nombreAgrupacionPolitica}
              </div>
            </div>
          </motion.div>
          </div>
        );
      })}
    </div>
  );
}
