import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Elecciones Perú 2026 EN VIVO — Resultados en tiempo real";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0f",
          padding: "60px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: live badge + branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#e6394620",
              border: "1px solid #e63946",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#e63946",
              }}
            />
            <span
              style={{
                color: "#e63946",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              EN VIVO
            </span>
          </div>
          <span style={{ color: "#adb5bd", fontSize: 16, letterSpacing: "0.05em" }}>
            ONPE · DATOS OFICIALES
          </span>
        </div>

        {/* Center: main title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Peru flag stripe */}
            <div
              style={{
                width: 8,
                height: 120,
                borderRadius: 4,
                background: "linear-gradient(to bottom, #e63946, #ffd60a, #e63946)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  color: "#f8f9fa",
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Elecciones Perú
              </span>
              <span
                style={{
                  color: "#ffd60a",
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                2026
              </span>
            </div>
          </div>

          <p
            style={{
              color: "#adb5bd",
              fontSize: 24,
              margin: 0,
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            Resultados en tiempo real con datos oficiales de la ONPE.
            Actualización automática cada 30 segundos.
          </p>
        </div>

        {/* Bottom: URL */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              color: "#adb5bd",
              fontSize: 20,
              fontFamily: "monospace",
              letterSpacing: "0.02em",
            }}
          >
            onpe-needle.linderhassinger.dev
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {["PRESIDENCIAL", "SEGUNDA VUELTA", "TIEMPO REAL"].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: "#1a1a26",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  color: "#adb5bd",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
