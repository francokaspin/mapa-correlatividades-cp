/* Configuración de presentación por carrera (data-driven).
   Separado de los archivos de data (correlativas) a propósito:
   acá va SOLO cómo se muestra el plan, no qué pide cada materia. */

export const CP_UI = {
  eyebrow: "Ciencia Política · UBA Sociales · Plan 8558/17",
  countBase: "general",
  countLabel: "del ciclo general",
  milestones: [
    {
      at: 6,
      tick: "6 · idioma",
      pillOn: "Idioma habilitado",
      pillOff: (n) => `Idioma: faltan ${6 - n}`,
    },
    {
      at: 12,
      tick: "12 · c. orientado",
      pillOn: "12 para el orientado ✓",
      pillOff: (n) => `C. orientado: faltan ${12 - n}`,
    },
  ],
  blocks: [
    {
      planKey: "general",
      title: "Ciclo general",
      subtitle: "En el orden del mapa. Cada tarjeta te dice qué pide (las flechas directas) y qué abre.",
    },
    {
      planKey: "idioma",
      title: "Idioma",
      subtitle: "Tres niveles de un idioma a elección (inglés, francés, portugués, italiano o alemán).",
    },
    {
      planKey: "orientado",
      title: "Ciclo orientado",
      subtitle:
        "2 electivas + 2 seminarios + 1 taller. Pide 12 aprobadas del ciclo general y que entre ellas esté la materia cabecera de tu orientación.",
      orientaciones: true,
    },
  ],
  footer:
    "Correlativas según la caja curricular de la Res. (CS) N° 8558/17. Para cursar alcanza con tener la correlativa cursada (regularizada); el ciclo orientado exige 12 finales aprobados. Tu progreso queda guardado en este navegador.",
};

export const RT_UI = {
  eyebrow: "Relaciones del Trabajo · UBA Sociales",
  countBase: "general",
  countLabel: "del ciclo obligatorio",
  milestones: [
    {
      at: 6,
      tick: "6 · inglés",
      pillOn: "Inglés habilitado",
      pillOff: (n) => `Inglés: faltan ${6 - n}`,
    },
    {
      at: 14,
      tick: "14 · intermedio",
      pillOn: "Analista habilitado",
      pillOff: (n) => `Intermedio: faltan ${14 - n}`,
    },
    {
      at: 17,
      tick: "17 · optativas",
      pillOn: "Optativas habilitadas",
      pillOff: (n) => `Optativas: faltan ${17 - n}`,
    },
  ],
  blocks: [
    {
      planKey: "general",
      title: "Ciclo obligatorio",
      subtitle: "Las 24 materias obligatorias, en el orden del plan (agrupadas por cadena de correlativas).",
    },
    {
      planKey: "optativas",
      title: "Optativas",
      subtitle: "2 materias optativas. Se abren cuando aprobaste 17 del ciclo obligatorio (no adeudás más de 7).",
    },
    {
      planKey: "idioma",
      title: "Inglés",
      subtitle: "Tres niveles encadenados. El Nivel I se habilita con 6 materias de la carrera aprobadas.",
    },
  ],
  footer:
    "Correlativas según la tabla oficial de la carrera (Res. (CS) N° 1440/90 y Res. (CD) N° 1161/93). El título intermedio «Analista en Relaciones del Trabajo» (Res. (CS) N° 74/85) se habilita con 14 obligatorias aprobadas. Tu progreso queda guardado en este navegador.",
};
