const ONPE_BASE = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";

export interface ONPECandidate {
  nombreAgrupacionPolitica: string;
  codigoAgrupacionPolitica: string;
  nombreCandidato: string;
  dniCandidato: string;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
  porcentajeVotosEmitidos: number;
}

export function candidatePhotoUrl(dni: string): string {
  return `https://resultadoelectoral.onpe.gob.pe/assets/img-reales/candidatos/${dni}.jpg`;
}

export function partyLogoUrl(codigo: string): string {
  return `https://resultadoelectoral.onpe.gob.pe/assets/img-reales/partidos/${codigo.padStart(8, "0")}.jpg`;
}

export interface ONPETotals {
  actasContabilizadas: number;
  contabilizadas: number;
  totalActas: number;
  totalVotosEmitidos: number;
  totalVotosValidos: number;
  fechaActualizacion: number;
}

export interface ONPEMesas {
  mesasInstaladas: number;
  mesasNoInstaladas: number;
  mesasPendientes: number;
}

export const EXCLUDED_CODES = ["80", "81"];

export async function fetchTotals(): Promise<ONPETotals> {
  const url =
    typeof window !== "undefined"
      ? "/api/onpe/totals"
      : `${ONPE_BASE}/resumen-general/totales?idEleccion=10&tipoFiltro=eleccion`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ONPE totals error: ${res.status}`);
  const json = await res.json();
  return json.data as ONPETotals;
}

export async function fetchCandidates(): Promise<ONPECandidate[]> {
  const url =
    typeof window !== "undefined"
      ? "/api/onpe/candidates"
      : `${ONPE_BASE}/eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ONPE candidates error: ${res.status}`);
  const json = await res.json();
  const all = json.data as ONPECandidate[];
  return all.filter((c) => !EXCLUDED_CODES.includes(c.codigoAgrupacionPolitica));
}

export async function fetchMesas(): Promise<ONPEMesas> {
  const url =
    typeof window !== "undefined"
      ? "/api/onpe/mesas"
      : `${ONPE_BASE}/mesa/totales?tipoFiltro=eleccion`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ONPE mesas error: ${res.status}`);
  const json = await res.json();
  return json.data as ONPEMesas;
}

export function shortName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  if (parts.length >= 4) return `${parts[0]} ${parts[2]} ${parts[3]}`;
  return fullName;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("es-PE");
}
