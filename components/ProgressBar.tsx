"use client";

import { motion } from "framer-motion";
import { ONPETotals, formatNumber } from "@/lib/onpe";

interface ProgressBarProps {
  totals: ONPETotals;
}

// Import formatTimestamp from utils
function fmt(ms: number) {
  return new Date(ms).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ProgressBar({ totals }: ProgressBarProps) {
  const pct = totals.actasContabilizadas;
  const isSmall = pct < 1;

  return (
    <div className="space-y-3">
      {/* Big percentage watermark */}
      <div className="relative">
        <div
          className="text-[5rem] sm:text-[7rem] font-mono font-black leading-none select-none pointer-events-none"
          style={{
            color: "rgba(255,255,255,0.04)",
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        >
          {pct.toFixed(1)}%
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-mono font-black text-white">
              {isSmall ? pct.toFixed(3) : pct.toFixed(3)}%
            </span>
            <span className="text-secondary text-sm font-mono">actas contabilizadas</span>
          </div>

          {/* Bar */}
          <div className="h-2 bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #e63946, #ffd60a, #2dc653)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(pct, 0.5)}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-xs font-mono text-secondary">
            <span>
              <span className="text-white font-bold">{formatNumber(totals.contabilizadas)}</span>
              {" / "}
              {formatNumber(totals.totalActas)} actas
            </span>
            <span>
              <span className="text-white font-bold">{formatNumber(totals.totalVotosValidos)}</span>{" "}
              votos válidos
            </span>
          </div>
        </div>
      </div>

      {/* Update time */}
      <div className="text-xs font-mono text-secondary">
        Actualizado a las{" "}
        <span className="text-white">{fmt(totals.fechaActualizacion)}</span>
      </div>
    </div>
  );
}
