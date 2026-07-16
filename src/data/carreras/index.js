import cpData from "./cp.js";
import { MATERIAS as RT_MATERIAS, OPTATIVAS as RT_OPTATIVAS, IDIOMA as RT_IDIOMA } from "./rt.js";
import { MATERIAS as TS_MATERIAS, IDIOMA as TS_IDIOMA } from "./ts.js";
import {
  MATERIAS as SOCIO_MATERIAS,
  OPTATIVAS as SOCIO_OPTATIVAS,
  IDIOMA as SOCIO_IDIOMA,
} from "./socio.js";
import {
  TRONCO as CC440_TRONCO,
  ORIENTADO as CC440_ORIENTADO,
  ORIENTACIONES as CC440_ORIENTACIONES,
  IDIOMA as CC440_IDIOMA,
} from "./cc440.js";
import { CP_UI, RT_UI, TS_UI, SOCIO_UI, CC440_UI } from "./ui.js";

// Acento único de Ciencias de la Comunicación (los dos planes lo comparten).
// Periwinkle: hue 231°, contraste 7.29:1 con el texto negro (>AA), y la mayor
// separación de tono (41°) contra los otros cuatro acentos y los tres estados.
const COMUNICACION_ACCENT = "#8E9CF0";

export const CARRERAS = [
  {
    id: "cp",
    nombre: "Ciencia Política",
    color: "#C8D62B",
    estado: "activa",
    data: { plan: cpData.plan, ui: CP_UI, legacyKey: "cp8558_progreso_v1" },
  },
  {
    id: "socio",
    nombre: "Sociología",
    // Orquídea. El #5B6DEB del placeholder no llegaba a AA con el texto negro
    // sobre el fondo de acento (4.32:1); este da 6.97:1.
    color: "#C77DFF",
    estado: "activa",
    data: {
      plan: { general: SOCIO_MATERIAS, optativas: SOCIO_OPTATIVAS, idioma: SOCIO_IDIOMA },
      ui: SOCIO_UI,
    },
  },
  // Ciencias de la Comunicación = UNA carrera con DOS planes vigentes. En la
  // landing es una sola tarjeta (grupo "comunicacion") que lleva al selector
  // #/comunicacion; cada plan tiene su ruta y su storage propios.
  {
    id: "cc504",
    nombre: "Cs. de la Comunicación · Plan 504/23",
    color: COMUNICACION_ACCENT,
    estado: "en-preparacion", // se activa en la Fase B
    grupo: "comunicacion",
    data: null,
  },
  {
    id: "cc440",
    nombre: "Cs. de la Comunicación · Plan 440/90",
    color: COMUNICACION_ACCENT,
    estado: "activa",
    grupo: "comunicacion",
    data: {
      plan: {
        general: CC440_TRONCO,
        orientado: CC440_ORIENTADO,
        orientaciones: CC440_ORIENTACIONES,
        idioma: CC440_IDIOMA,
      },
      ui: CC440_UI,
    },
  },
  {
    id: "rt",
    nombre: "Relaciones del Trabajo",
    color: "#22B8D6",
    estado: "activa",
    data: {
      plan: { general: RT_MATERIAS, optativas: RT_OPTATIVAS, idioma: RT_IDIOMA },
      ui: RT_UI,
    },
  },
  {
    id: "ts",
    nombre: "Trabajo Social",
    color: "#E03B8F",
    estado: "activa",
    data: {
      plan: { general: TS_MATERIAS, idioma: TS_IDIOMA },
      ui: TS_UI,
    },
  },
];

// Grupos de carreras que comparten UNA tarjeta en la landing y un paso
// intermedio de selección. Hoy: Comunicación (dos planes vigentes). La guía
// de transición sale de los headers de cc504.js / cc440.js (reglas de pase).
export const GRUPOS = {
  comunicacion: {
    id: "comunicacion",
    nombre: "Ciencias de la Comunicación",
    color: COMUNICACION_ACCENT,
    eyebrow: "Ciencias de la Comunicación · UBA Sociales",
    titulo: "Elegí tu plan",
    intro:
      "Una carrera, dos planes vigentes conviviendo. Elegí el tuyo según cuándo entraste y cuántas materias tenías al cambio de 2023.",
    // Cada opción referencia una carrera del registro (estado/ruta salen de ahí).
    opciones: [
      {
        id: "cc504",
        marca: null,
        quien:
          "Ingresaste en 2024 o después; o venías del plan viejo y pasaste al nuevo (tenías menos de 6 aprobadas, o entre 6 y 24 y optaste por pasarte).",
      },
      {
        id: "cc440",
        marca: "A extinguir",
        quien:
          "Tenías más de 24 aprobadas al cambio de 2023, o entre 6 y 24 y optaste por quedarte en el plan viejo.",
      },
    ],
  },
};

// La tarjeta que representa a cada carrera en la landing: una por carrera
// suelta, y una sola por grupo (a la primera aparición de sus integrantes).
export function landingEntries() {
  const vistos = new Set();
  const salida = [];
  for (const c of CARRERAS) {
    if (c.grupo) {
      if (vistos.has(c.grupo)) continue;
      vistos.add(c.grupo);
      const g = GRUPOS[c.grupo];
      salida.push({ tipo: "grupo", id: g.id, nombre: g.nombre, href: `#/${g.id}` });
    } else {
      salida.push({
        tipo: "carrera",
        id: c.id,
        nombre: c.nombre,
        estado: c.estado,
        href: `#/${c.id}`,
      });
    }
  }
  return salida;
}
