# 🗳️ ONPE Needle — Claude Code Prompt
> Elecciones Generales Perú 2026 · Dashboard en tiempo real estilo NYT

---

## Objetivo

Construir un dashboard web de resultados electorales en vivo para las **Elecciones Generales Perú 2026**, inspirado en el "Needle" del New York Times. El producto debe ser una **Single Page Application** visualmente impactante, que consuma la API pública de la ONPE en tiempo real y presente los datos de forma clara, elegante y compartible.

---

## Stack

- **Framework**: Next.js 15 (App Router) con TypeScript
- **Estilos**: Tailwind CSS + CSS custom properties
- **Gráficos**: Recharts (barras, líneas) + D3 (gauge/needle)
- **Animaciones**: Framer Motion
- **Estado**: React Query (`@tanstack/react-query`) con refetch automático cada 30s
- **Deploy**: Vercel (vercel.json incluido)
- **Fonts**: Google Fonts via `next/font`

---

## API Endpoints de la ONPE (todos públicos, sin auth)

> Base: `https://resultadoelectoral.onpe.gob.pe/presentacion-backend`

### 1. Avance de actas (el más importante — polling cada 30s)
```
GET /resumen-general/totales?idEleccion=10&tipoFiltro=eleccion
```
**Respuesta clave:**
```json
{
  "data": {
    "actasContabilizadas": 17.684,     // % de actas procesadas
    "contabilizadas": 16405,           // actas procesadas (número)
    "totalActas": 92766,               // total de actas
    "totalVotosEmitidos": 3873945,
    "totalVotosValidos": 3442503,
    "fechaActualizacion": 1776048459310  // timestamp Unix ms
  }
}
```

### 2. Resultados por candidato (polling cada 30s)
```
GET /eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion
```
**Respuesta clave:**
```json
{
  "data": [
    {
      "nombreAgrupacionPolitica": "RENOVACIÓN POPULAR",
      "codigoAgrupacionPolitica": "35",
      "nombreCandidato": "RAFAEL BERNARDO LÓPEZ ALIAGA CAZORLA",
      "totalVotosValidos": 719010,
      "porcentajeVotosValidos": 20.886,   // sobre votos válidos
      "porcentajeVotosEmitidos": 18.56    // sobre votos emitidos
    }
    // ... 36 candidatos total
  ]
}
```
> ⚠️ El array incluye entradas especiales: `codigoAgrupacionPolitica === "80"` = votos en blanco, `"81"` = votos nulos. Filtrarlos para los rankings de candidatos.

### 3. Estado de mesas
```
GET /mesa/totales?tipoFiltro=eleccion
```
```json
{
  "data": {
    "mesasInstaladas": 17023,
    "mesasNoInstaladas": 0,
    "mesasPendientes": 75743
  }
}
```

### 4. Proceso electoral activo
```
GET /proceso/proceso-electoral-activo
```
```json
{
  "data": {
    "id": 2,
    "nombre": "ELECCIONES GENERALES Y PARLAMENTO ANDINO 2026",
    "acronimo": "EG2026",
    "idEleccionPrincipal": 10
  }
}
```

### 5. Mapa de calor por región (opcional para v2)
```
GET /resumen-general/mapa-calor?idEleccion=10&tipoFiltro=total
```

---

## Arquitectura de componentes

```
app/
├── page.tsx                    # Layout raíz
├── layout.tsx
├── api/
│   └── onpe/
│       └── route.ts            # Proxy para evitar CORS (si lo hubiera)
components/
├── Needle.tsx                  # ⭐ El gauge animado (componente estrella)
├── CandidateRanking.tsx        # Barras horizontales con animación
├── ProgressBar.tsx             # Avance de actas
├── LiveStats.tsx               # Estadísticas en tiempo real
├── LastUpdated.tsx             # Timestamp de última actualización
├── HorseRaceChart.tsx          # Líneas históricas (opcional, v2)
└── ShareButton.tsx             # Botón compartir WhatsApp/Twitter
hooks/
├── useONPEResults.ts           # React Query — candidatos
├── useONPETotals.ts            # React Query — avance actas
└── useONPEMesas.ts             # React Query — mesas
lib/
├── onpe.ts                     # Fetch helpers + types
└── utils.ts
```

---

## Componente Estrella: The Needle (gauge)

El gauge debe mostrar la probabilidad estimada de que **López Aliaga pase a segunda vuelta** basado en la tendencia actual de votos válidos.

**Lógica del gauge:**
- Usar los datos de `porcentajeVotosValidos` de los top 3 candidatos
- Calcular el "gap" entre el 2do y 3er lugar → cuanto mayor el gap, más certeza
- Escalar a 0–100% de probabilidad de definición de segunda vuelta
- La aguja debe animarse con Framer Motion (`animate`, `spring`) cada vez que lleguen nuevos datos

**Implementación D3 + React:**
```tsx
// SVG semicircular con arco D3, aguja SVG animada con Framer Motion
// Colores: rojo (incierto) → amarillo (probable) → verde (definido)
// Mostrar: "LIDERANDO", "SEGUNDA VUELTA PROBABLE", "SEGUNDA VUELTA DEFINIDA"
```

---

## Diseño visual

### Paleta
```css
--bg-primary: #0a0a0f;          /* negro azulado profundo */
--bg-card: #12121a;
--bg-elevated: #1a1a26;
--accent-red: #e63946;           /* rojo ONPE */
--accent-gold: #ffd60a;          /* amarillo peruano */
--accent-green: #2dc653;
--text-primary: #f8f9fa;
--text-secondary: #adb5bd;
--border: rgba(255,255,255,0.08);
```

### Tipografía
```
Display: "Playfair Display" (números grandes, porcentajes)
UI: "DM Mono" (estadísticas, timestamps)
Body: "DM Sans" (nombres, texto general)
```

### Estética: "Electoral War Room"
- Fondo oscuro casi negro con sutil textura de ruido (CSS `filter: url(#noise)`)
- Números grandes con animación de contador (`react-countup` o CSS)
- Cards con borde sutil, sin sombras duras — efecto "pantalla de monitoreo"
- Línea roja animada pulsante en el header ("EN VIVO")
- El porcentaje de actas contabilizadas: tipografía monospace enorme al fondo como "watermark"

---

## Features requeridos (MVP)

### 🔴 MUST HAVE
1. **Header** — Logo ONPE + "EN VIVO" pulsante + nombre del proceso
2. **Needle gauge** — Probabilidad de segunda vuelta de los top 2, animada
3. **Top 5 candidatos** — Barras horizontales animadas, ordenadas por `porcentajeVotosValidos`
4. **Progress bar de actas** — `actasContabilizadas` % con número de actas y timestamp
5. **Auto-refresh** — React Query refetch cada 30 segundos, con indicador visual de "actualizando"
6. **Responsive** — Mobile-first, optimizado para compartir en WhatsApp
7. **Share button** — WhatsApp (wa.me/?text=...) y Twitter/X con snapshot del estado actual

### 🟡 NICE TO HAVE (v2)
8. **Horse race chart** — Línea de tiempo del porcentaje de cada candidato (guardar snapshots en localStorage)
9. **Candidatos completos** — Tabla colapsable con los 34 candidatos
10. **Estado de mesas** — Mini widget con instaladas/pendientes

---

## Tipos TypeScript

```typescript
interface ONPECandidate {
  nombreAgrupacionPolitica: string;
  codigoAgrupacionPolitica: string;
  nombreCandidato: string;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
  porcentajeVotosEmitidos: number;
}

interface ONPETotals {
  actasContabilizadas: number;    // porcentaje
  contabilizadas: number;         // número
  totalActas: number;
  totalVotosEmitidos: number;
  totalVotosValidos: number;
  fechaActualizacion: number;     // Unix ms
}

interface ONPEMesas {
  mesasInstaladas: number;
  mesasNoInstaladas: number;
  mesasPendientes: number;
}

// Candidatos reales (excluir códigos "80" y "81")
const EXCLUDED_CODES = ["80", "81"];
```

---

## Consideraciones técnicas

### CORS
Los endpoints de ONPE devuelven `Access-Control-Allow-Origin: *` — no es necesario proxy. Verificar en producción. Si hay issues, crear `/api/onpe/[endpoint]/route.ts` como proxy en Next.js.

### Rate limiting
No está documentado, pero ser conservador: **máximo 1 request cada 30s por endpoint**. React Query con `staleTime: 25_000, refetchInterval: 30_000`.

### Error handling
Si la API falla, mostrar el **último dato conocido** con badge "Datos pueden estar desactualizados" + timestamp del último dato exitoso. No mostrar pantalla de error vacía.

### Performance
- Imágenes: ninguna (todo SVG/CSS)
- Bundle: evitar librerías pesadas. D3 solo importar lo necesario (`d3-shape`, `d3-scale`)
- ISR: no aplica (todo client-side por naturaleza del polling)

---

## Estructura de archivos esperada

```
onpe-needle/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Needle.tsx
│   ├── CandidateRanking.tsx
│   ├── ProgressBar.tsx
│   ├── LiveStats.tsx
│   └── ShareButton.tsx
├── hooks/
│   ├── useONPEResults.ts
│   └── useONPETotals.ts
├── lib/
│   ├── onpe.ts
│   └── utils.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Vercel config

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

---

## Instrucciones finales para Claude Code

1. Crear el proyecto Next.js 15 con TypeScript y Tailwind desde cero (`npx create-next-app`)
2. Instalar dependencias: `recharts framer-motion @tanstack/react-query d3-shape d3-scale react-countup`
3. Implementar todos los hooks con React Query primero
4. Construir el Needle SVG animado — este es el componente más importante, dedicar tiempo aquí
5. Construir el ranking de candidatos con barras animadas
6. Integrar layout responsive
7. Probar que el polling funcione correctamente
8. Configurar para deploy en Vercel

**El criterio de éxito es**: abrir la URL en el celular mientras estás viendo Canal N y que los números cambien solos cada 30 segundos, con el gauge moviéndose dramáticamente. La gente tiene que querer compartirlo por WhatsApp.
