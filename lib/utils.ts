export function formatPct(n: number, decimals = 2): string {
  return n.toFixed(decimals) + "%";
}

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function computeNeedleAngle(
  candidates: { porcentajeVotosValidos: number }[]
): number {
  if (!candidates || candidates.length < 3) return 0;
  const sorted = [...candidates].sort(
    (a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos
  );
  const second = sorted[1]?.porcentajeVotosValidos ?? 0;
  const third = sorted[2]?.porcentajeVotosValidos ?? 0;
  const gap = second - third;
  // Gap of 5+ points = very certain (100%), 0 gap = 50%
  const certainty = Math.min(100, 50 + gap * 10);
  return certainty;
}

export function needleLabel(certainty: number): string {
  if (certainty < 55) return "INCIERTO";
  if (certainty < 70) return "SEGUNDA VUELTA PROBABLE";
  if (certainty < 85) return "SEGUNDA VUELTA MUY PROBABLE";
  return "SEGUNDA VUELTA DEFINIDA";
}

export function needleColor(certainty: number): string {
  if (certainty < 55) return "#e63946";
  if (certainty < 70) return "#ffd60a";
  if (certainty < 85) return "#f4a261";
  return "#2dc653";
}

export function partyColor(idx: number): string {
  const colors = [
    "#e63946",
    "#ffd60a",
    "#2dc653",
    "#4cc9f0",
    "#f77f00",
    "#7b2d8b",
    "#06d6a0",
    "#ef233c",
  ];
  return colors[idx % colors.length];
}
