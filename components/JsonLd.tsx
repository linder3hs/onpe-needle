const BASE_URL = "https://onpe-needle.linderhassinger.dev";

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "ONPE Needle",
        description:
          "Dashboard en tiempo real de las Elecciones Generales Perú 2026 con datos oficiales de la ONPE.",
        inLanguage: "es-PE",
        publisher: {
          "@type": "Person",
          name: "linder3hs",
          url: "https://linderhassinger.dev",
        },
      },
      {
        "@type": "Event",
        "@id": `${BASE_URL}/#election`,
        name: "Elecciones Generales y Parlamento Andino Perú 2026",
        alternateName: "EG2026",
        description:
          "Elecciones Generales de la República del Perú 2026. Elección presidencial y parlamentaria.",
        startDate: "2026-04-11",
        endDate: "2026-04-11",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Country",
          name: "Perú",
          addressCountry: "PE",
        },
        organizer: {
          "@type": "GovernmentOrganization",
          name: "Oficina Nacional de Procesos Electorales",
          alternateName: "ONPE",
          url: "https://www.onpe.gob.pe",
        },
        about: {
          "@type": "GovernmentService",
          name: "Resultados Electorales Oficiales",
          url: BASE_URL,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${BASE_URL}/#app`,
        name: "ONPE Needle — Resultados en tiempo real",
        url: BASE_URL,
        applicationCategory: "NewsApplication",
        operatingSystem: "Any",
        inLanguage: "es-PE",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "PEN",
        },
        about: {
          "@id": `${BASE_URL}/#election`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
