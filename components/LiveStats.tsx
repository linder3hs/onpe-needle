"use client";

import { motion } from "framer-motion";
import { ONPETotals } from "@/lib/onpe";
import { formatNumber } from "@/lib/onpe";
import { ONPEMesas } from "@/lib/onpe";

interface LiveStatsProps {
  totals: ONPETotals;
  mesas?: ONPEMesas;
}

function StatCard({
  label,
  value,
  sub,
  color = "white",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-3 flex flex-col gap-1"
    >
      <div className="text-xs font-mono text-secondary uppercase tracking-wider">{label}</div>
      <div className="text-xl font-mono font-bold" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-xs font-mono text-secondary">{sub}</div>}
    </motion.div>
  );
}

export default function LiveStats({ totals, mesas }: LiveStatsProps) {
  const totalMesas = mesas
    ? mesas.mesasInstaladas + mesas.mesasPendientes
    : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <StatCard
        label="Votos emitidos"
        value={formatNumber(totals.totalVotosEmitidos)}
        color="#4cc9f0"
      />
      <StatCard
        label="Votos válidos"
        value={formatNumber(totals.totalVotosValidos)}
        color="#2dc653"
      />
      <StatCard
        label="Actas procesadas"
        value={formatNumber(totals.contabilizadas)}
        sub={`de ${formatNumber(totals.totalActas)}`}
        color="#ffd60a"
      />
      {mesas && (
        <>
          <StatCard
            label="Mesas instaladas"
            value={formatNumber(mesas.mesasInstaladas)}
            color="#06d6a0"
          />
          <StatCard
            label="Mesas pendientes"
            value={formatNumber(mesas.mesasPendientes)}
            color="#f77f00"
          />
          {totalMesas && (
            <StatCard
              label="Total mesas"
              value={formatNumber(totalMesas)}
              color="#adb5bd"
            />
          )}
        </>
      )}
    </div>
  );
}
