"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ONPECandidate } from "@/lib/onpe";
import { computeNeedleAngle, needleColor, needleLabel } from "@/lib/utils";

interface NeedleProps {
  candidates: ONPECandidate[];
}

const W = 320;
const H = 180;
const CX = W / 2;
const CY = H - 20;
const R_OUTER = 140;
const R_INNER = 80;
const R_NEEDLE = 130;

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function arcPath(startDeg: number, endDeg: number, rOuter: number, rInner: number) {
  const s1 = polarToXY(startDeg, rOuter);
  const e1 = polarToXY(endDeg, rOuter);
  const s2 = polarToXY(endDeg, rInner);
  const e2 = polarToXY(startDeg, rInner);
  return `M ${s1.x} ${s1.y} A ${rOuter} ${rOuter} 0 0 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${rInner} ${rInner} 0 0 0 ${e2.x} ${e2.y} Z`;
}

const SEGMENTS = [
  { start: 0, end: 36, color: "#e63946aa" },
  { start: 36, end: 72, color: "#f4823caa" },
  { start: 72, end: 108, color: "#ffd60aaa" },
  { start: 108, end: 144, color: "#8bc34aaa" },
  { start: 144, end: 180, color: "#2dc653aa" },
];

export default function Needle({ candidates }: NeedleProps) {
  const certainty = useMemo(() => computeNeedleAngle(candidates), [candidates]);
  const color = needleColor(certainty);
  const label = needleLabel(certainty);

  // certainty 0-100 → angle 0-180 degrees on the gauge
  const needleAngleDeg = (certainty / 100) * 180;
  const needleTip = polarToXY(needleAngleDeg, R_NEEDLE);

  // Get top 2 candidates for display
  const sorted = [...candidates]
    .sort((a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos)
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs font-mono text-secondary uppercase tracking-widest">
        PROBABILIDAD DE SEGUNDA VUELTA
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-xs"
        style={{ overflow: "visible" }}
      >
        {/* Arc segments */}
        {SEGMENTS.map((seg, i) => (
          <path
            key={i}
            d={arcPath(seg.start, seg.end, R_OUTER, R_INNER)}
            fill={seg.color}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Tick marks */}
        {[0, 45, 90, 135, 180].map((deg) => {
          const inner = polarToXY(deg, R_OUTER - 2);
          const outer = polarToXY(deg, R_OUTER + 8);
          return (
            <line
              key={deg}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        <text x={CX - R_OUTER - 4} y={CY + 4} fill="#e63946" fontSize="9" textAnchor="end" fontFamily="DM Mono, monospace">INCIERTO</text>
        <text x={CX + R_OUTER + 4} y={CY + 4} fill="#2dc653" fontSize="9" textAnchor="start" fontFamily="DM Mono, monospace">DEFINIDO</text>

        {/* Animated needle */}
        <motion.line
          x1={CX}
          y1={CY}
          animate={{ x2: needleTip.x, y2: needleTip.y }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Needle base circle */}
        <circle cx={CX} cy={CY} r="8" fill={color} />
        <circle cx={CX} cy={CY} r="4" fill="#0a0a0f" />

        {/* Certainty percentage */}
        <motion.text
          x={CX}
          y={CY - 28}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="Playfair Display, serif"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {certainty.toFixed(0)}%
        </motion.text>
      </svg>

      {/* Label */}
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-mono font-bold tracking-widest uppercase"
        style={{ color }}
      >
        {label}
      </motion.div>

      {/* Top 2 candidates */}
      {sorted.length >= 2 && (
        <div className="flex gap-6 text-xs font-mono">
          <div className="text-center">
            <div className="text-secondary">1°</div>
            <div className="text-white font-bold">
              {sorted[0].porcentajeVotosValidos.toFixed(1)}%
            </div>
          </div>
          <div className="text-center text-secondary">vs</div>
          <div className="text-center">
            <div className="text-secondary">2°</div>
            <div className="text-white font-bold">
              {sorted[1].porcentajeVotosValidos.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
