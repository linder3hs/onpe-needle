import { NextResponse } from "next/server";

const BASE_URL = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "es-PE,es;q=0.9",
  "Content-Type": "application/json",
  Referer: "https://resultadoelectoral.onpe.gob.pe/main/resumen",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

export async function GET() {
  try {
    const res = await fetch(
      `${BASE_URL}/eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion`,
      { cache: "no-store", headers: HEADERS }
    );
    if (!res.ok) {
      return NextResponse.json({ error: `ONPE ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "ONPE unavailable" }, { status: 502 });
  }
}
