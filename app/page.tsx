"use client";

import { useONPEResults } from "@/hooks/useONPEResults";
import { useONPETotals } from "@/hooks/useONPETotals";
import { useONPEMesas } from "@/hooks/useONPEMesas";
import CandidateRanking from "@/components/CandidateRanking";
import CandidateVotesGrid from "@/components/CandidateVotesGrid";
import ProgressBar from "@/components/ProgressBar";
import LiveStats from "@/components/LiveStats";
import ShareButton from "@/components/ShareButton";
import RefreshIndicator from "@/components/RefreshIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { shortName, candidatePhotoUrl, partyLogoUrl } from "@/lib/onpe";

export default function Home() {
  const {
    data: candidates,
    isFetching: fetchingCandidates,
    isError: errorCandidates,
  } = useONPEResults();

  const {
    data: totals,
    isFetching: fetchingTotals,
    isError: errorTotals,
  } = useONPETotals();

  const { data: mesas } = useONPEMesas();

  const isFetching = fetchingCandidates || fetchingTotals;
  const hasError = errorCandidates || errorTotals;
  const hasData = candidates && totals;

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Watermark background text */}
      {totals && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "clamp(6rem, 25vw, 22rem)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.025)",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            {totals.actasContabilizadas.toFixed(1)}%
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Live dot */}
            <div className="flex items-center gap-2">
              <div
                className="live-dot w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--accent-red)" }}
              />
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{
                  color: "var(--accent-red)",
                  fontFamily: "var(--font-dm-mono), monospace",
                }}
              >
                EN VIVO
              </span>
            </div>

            <div
              style={{
                width: 1,
                height: 16,
                backgroundColor: "var(--border)",
              }}
            />

            <div>
              <h1
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-mono), monospace" }}
              >
                ONPE · Elecciones Generales Perú 2026
              </h1>
            </div>
          </div>

          <RefreshIndicator isFetching={isFetching} lastUpdated={totals?.fechaActualizacion} />
        </header>

        {/* Error banner */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-3 flex items-center gap-2 text-sm"
              style={{ borderColor: "var(--accent-gold)", fontFamily: "var(--font-dm-mono), monospace" }}
            >
              <span style={{ color: "var(--accent-gold)" }}>⚠</span>
              <span className="text-secondary">
                Error conectando con ONPE. Mostrando últimos datos conocidos.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {!hasData && !hasError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 rounded-full"
              style={{
                borderColor: "var(--accent-red)",
                borderTopColor: "transparent",
              }}
            />
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-dm-mono), monospace",
              }}
            >
              Conectando con ONPE...
            </p>
          </div>
        )}

        {hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress bar — top of page, most important */}
            <div className="card p-5">
              <ProgressBar totals={totals} />
            </div>

            {/* Candidates + Needle: stacked on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top candidates — left on desktop, first on mobile */}
              <div className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    Resultados por candidato
                  </h2>
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    % votos válidos
                  </span>
                </div>
                <CandidateRanking candidates={candidates} limit={8} />
              </div>

              {/* Top 4 votos absolutos — right on desktop, below on mobile */}
              <div className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    Top 6 en votos
                  </h2>
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    votos válidos
                  </span>
                </div>
                <CandidateVotesGrid candidates={candidates} />
              </div>
            </div>

            {/* Live stats */}
            <div>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-dm-mono), monospace",
                }}
              >
                Estadísticas en tiempo real
              </h2>
              <LiveStats totals={totals} mesas={mesas} />
            </div>

            {/* Top 2 candidates spotlight */}
            {candidates.length >= 2 && (
              <div className="card p-5">
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  Candidatos a Segunda Vuelta
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[...candidates]
                    .sort((a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos)
                    .slice(0, 2)
                    .map((c, idx) => (
                      <motion.div
                        key={c.codigoAgrupacionPolitica}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card-elevated p-4 text-center space-y-3"
                      >
                        {/* Rank label */}
                        <div
                          className="text-xs uppercase tracking-widest"
                          style={{
                            color: idx === 0 ? "var(--accent-gold)" : "var(--text-secondary)",
                            fontFamily: "var(--font-dm-mono), monospace",
                          }}
                        >
                          {idx === 0 ? "1° LUGAR" : "2° LUGAR"}
                        </div>

                        {/* Photos */}
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            {/* Candidate photo */}
                            <div
                              className="w-16 h-16 rounded-full overflow-hidden border-2 mx-auto"
                              style={{
                                borderColor: idx === 0 ? "var(--accent-gold)" : "var(--border)",
                                backgroundColor: "var(--bg-elevated)",
                              }}
                            >
                              {c.dniCandidato && (
                                <img
                                  src={candidatePhotoUrl(c.dniCandidato)}
                                  alt={shortName(c.nombreCandidato)}
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                            {/* Party logo badge */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-black bg-black">
                              <img
                                src={partyLogoUrl(c.codigoAgrupacionPolitica)}
                                alt={c.nombreAgrupacionPolitica}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Percentage */}
                        <div
                          className="text-3xl font-black"
                          style={{
                            fontFamily: "var(--font-playfair), Playfair Display, serif",
                            color: idx === 0 ? "var(--accent-gold)" : "var(--text-primary)",
                          }}
                        >
                          {c.porcentajeVotosValidos.toFixed(2)}%
                        </div>

                        {/* Name */}
                        <div className="text-sm font-medium leading-tight">
                          {shortName(c.nombreCandidato)}
                        </div>

                        {/* Party */}
                        <div
                          className="text-xs"
                          style={{
                            color: "var(--text-secondary)",
                            fontFamily: "var(--font-dm-mono), monospace",
                          }}
                        >
                          {c.nombreAgrupacionPolitica}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="card p-5">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-dm-mono), monospace",
                }}
              >
                Compartir resultados
              </h2>
              <ShareButton totals={totals} candidates={candidates} />
            </div>

            {/* Footer */}
            <footer
              className="text-center text-xs pb-6"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-dm-mono), monospace",
              }}
            >
              Datos: ONPE API pública · Actualización automática cada 30s ·
              No afiliado a la ONPE
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
