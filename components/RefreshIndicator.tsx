"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface RefreshIndicatorProps {
  isFetching: boolean;
  lastUpdated?: number;
}

export default function RefreshIndicator({ isFetching, lastUpdated }: RefreshIndicatorProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isFetching) {
      setCountdown(30);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFetching, lastUpdated]);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-secondary">
      <AnimatePresence mode="wait">
        {isFetching ? (
          <motion.div
            key="fetching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-accent-gold border-t-transparent rounded-full"
              style={{ borderColor: "#ffd60a", borderTopColor: "transparent" }}
            />
            <span style={{ color: "#ffd60a" }}>Actualizando...</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1"
          >
            <span>Próxima actualización en</span>
            <span className="text-white tabular-nums">{countdown}s</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
