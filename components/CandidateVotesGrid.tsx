"use client";

import { motion } from "framer-motion";
import { ONPECandidate, shortName, candidatePhotoUrl, partyLogoUrl, formatNumber } from "@/lib/onpe";
import { partyColor } from "@/lib/utils";

interface CandidateVotesGridProps {
  candidates: ONPECandidate[];
}

export default function CandidateVotesGrid({ candidates }: CandidateVotesGridProps) {
  const top4 = [...candidates]
    .sort((a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {top4.map((c, idx) => {
        const color = partyColor(idx);
        const name = shortName(c.nombreCandidato);
        const photoUrl = c.dniCandidato ? candidatePhotoUrl(c.dniCandidato) : null;
        const logoUrl = partyLogoUrl(c.codigoAgrupacionPolitica);
        const prevVotos = idx > 0 ? top4[idx - 1].totalVotosValidos : null;
        const delta = prevVotos !== null ? prevVotos - c.totalVotosValidos : null;

        return (
          <motion.div
            key={c.codigoAgrupacionPolitica}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, type: "spring", stiffness: 200, damping: 25 }}
            className="rounded-lg p-3 flex flex-col gap-2"
            style={{ backgroundColor: color + "0d", border: `1px solid ${color}22` }}
          >
            {/* Foto + badge + rank */}
            <div className="flex items-center gap-2">
              <div className="relative shrink-0 w-8 h-8">
                {photoUrl && (
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden border border-white/10"
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
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full overflow-hidden border border-white/20 bg-black">
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
              <span className="text-secondary font-mono text-[10px] leading-none">
                #{idx + 1}
              </span>
            </div>

            {/* Nombre */}
            <span className="text-white text-[11px] font-medium leading-tight line-clamp-2">
              {name}
            </span>

            {/* Votos absolutos — número grande */}
            <span
              className="font-bold font-mono leading-none"
              style={{
                color,
                fontSize: "clamp(18px, 2.5vw, 26px)",
              }}
            >
              {formatNumber(c.totalVotosValidos)}
            </span>

            {/* Porcentaje secundario */}
            <span
              className="font-mono text-[11px] leading-none"
              style={{ color: color + "cc" }}
            >
              {c.porcentajeVotosValidos.toFixed(2)}%
            </span>

            {/* Delta con el anterior */}
            {delta !== null && (
              <span className="font-mono text-[10px] text-secondary leading-none">
                ~ -{formatNumber(delta)}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
