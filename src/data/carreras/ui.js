/* Configuración de presentación por carrera (data-driven).
   Separado de los archivos de data (correlativas) a propósito:
   acá va SOLO cómo se muestra el plan, no qué pide cada materia.

   Sociología importa dos cosas de su data en vez de repetirlas acá
   (la nota al pie y el req del hito de 200 hs): son texto y requisitos
   verificados contra la resolución, y duplicarlos los deja derivar. */

import { NOTA_PIE as SOCIO_NOTA_PIE, HITOS as SOCIO_HITOS } from "./socio.js";
import { NOTA_PIE as CC440_NOTA_PIE, TESINA as CC440_TESINA } from "./cc440.js";

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
      tick: "14 · interm.",
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

export const TS_UI = {
  eyebrow: "Trabajo Social · UBA Sociales · Plan 5962/12",
  countBase: "general",
  countLabel: "de la carrera",
  milestones: [
    {
      at: 6,
      tick: "6 · idioma",
      pillOn: "Idioma habilitado",
      pillOff: (n) => `Idioma: faltan ${6 - n}`,
    },
  ],
  // Pills informativas: sin gate ni tick en la barra (no tienen umbral
  // numérico). La Tesina/TIF es requisito final del título pero sus
  // condiciones están en el reglamento de TIF, no en el cuadro.
  infoPills: [{ label: "Tesina (TIF) · requisito final" }],
  blocks: [
    {
      planKey: "general",
      title: "Materias",
      subtitle:
        "Las 33 materias del plan, en el orden del cuadro oficial. Los cuatro talleres son anuales. Electivas y optativa son materias comunes con sus correlativas.",
    },
    {
      planKey: "idioma",
      title: "Idioma",
      subtitle: "Tres niveles encadenados de inglés o portugués. El Nivel I se habilita con 6 materias aprobadas.",
    },
  ],
  footer:
    "Correlativas según el cuadro oficial de la carrera (Res. (CS) N° 5962/12). En Trabajo Social alcanza con tener la correlativa CURSADA (regularizada), no aprobada con final. La Tesina de grado (TIF) es el requisito final del título; sus condiciones están en el reglamento de TIF. Tu progreso queda guardado en este navegador.",
};

// Hito de las 200 hs: el req sale de la data (met1 + ssis), no se escribe acá.
const HORAS_INV = SOCIO_HITOS.find((h) => h.id === "horasinv");

export const SOCIO_UI = {
  eyebrow: "Sociología · UBA Sociales · Plan 2282/88",
  countBase: "general",
  // La barra cuenta las 16 obligatorias + los 9 cupos del tramo optativo = 25.
  // El idioma y las 200 hs corren por fuera del conteo (así lo fija el plan).
  countKeys: ["general", "optativas"],
  countLabel: "de la carrera",
  // Sociología no tiene umbrales de N materias: todos los req son fijos.
  // Sin milestones no hay marcas en la barra.
  milestones: [],
  infoPills: [
    {
      req: HORAS_INV.req,
      label: `${HORAS_INV.n} · pide Metodología I + Soc. Sistemática aprobadas`,
      labelOn: `${HORAS_INV.n} · habilitadas`,
    },
  ],
  blocks: [
    {
      planKey: "general",
      title: "Materias obligatorias",
      subtitle:
        "Las 16 obligatorias, en el orden del mapa oficial de la carrera (numeración 1-16). Régimen de correlatividades Res. (CD) N° 186/2024.",
    },
    {
      planKey: "optativas",
      title: "Tramo optativo",
      subtitle:
        "Dos grupos con cupos: 6 Sociologías Especiales y 3 Teorías Sociológicas. No son umbrales de materias — cada grupo pide sus correlativas fijas. Marcá el grupo cuando lo tengas completo.",
    },
    {
      planKey: "idioma",
      title: "Idioma",
      subtitle:
        "Tres niveles encadenados de un mismo idioma a elección (francés o inglés). El Nivel I no pide materias previas: arranca con el CBC.",
    },
  ],
  footer: `${SOCIO_NOTA_PIE} Tu progreso queda guardado en este navegador.`,
};

export const CC440_UI = {
  eyebrow: "Ciencias de la Comunicación · UBA Sociales · Plan 440/90 · a extinguir",
  // La base que resuelve los { min, of: "general" } es el tronco (26).
  countBase: "general",
  // La barra suma el tronco (26) + la orientación elegida (6) = 32. El motor
  // cuenta solo la orientación activa de `orientado` (ver MapaCarrera).
  countKeys: ["general", "orientado"],
  countLabel: "de la carrera",
  milestones: [
    {
      at: 6,
      tick: "6 · idioma",
      pillOn: "Idioma habilitado",
      pillOff: (n) => `Idioma: faltan ${6 - n}`,
    },
    {
      at: 14,
      tick: "14 · orientación",
      pillOn: "Orientaciones habilitadas",
      pillOff: (n) => `Orientación: faltan ${14 - n}`,
    },
  ],
  // Tesina: hito sin umbral numérico → pill informativa (sin tick ni conteo).
  infoPills: [{ label: `${CC440_TESINA.n} · en el taller de la orientación` }],
  blocks: [
    {
      planKey: "general",
      title: "Tronco común",
      subtitle:
        "Las 26 materias del tronco, en el orden de la tabla oficial (101→126). Régimen de correlatividades Res. Nº 5396/09.",
    },
    {
      planKey: "orientado",
      title: "Orientación",
      subtitle:
        "Elegí una de las cinco. Sus 6 materias se abren con 14 aprobadas incluyendo Taller de expresión I (107) y uno de los talleres de comunicación (124/125/126). Políticas y Planificación pide además la 119 [★].",
      orientaciones: true,
    },
    {
      planKey: "idioma",
      title: "Idioma",
      subtitle:
        "Tres niveles de un mismo idioma (inglés, francés o italiano). El Nivel I se habilita con 6 materias del tronco aprobadas.",
    },
  ],
  footer: `${CC440_NOTA_PIE} El ingreso a cada orientación exige 14 aprobadas del tronco incluyendo Taller de expresión I y uno de los talleres 124/125/126; Políticas y Planificación exige ADEMÁS Políticas y planificación de la comunicación (119) [★]. La Tesina se realiza en el ámbito del Taller de la orientación. Tu progreso queda guardado en este navegador.`,
};
