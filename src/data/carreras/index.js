import cpData from "./cp.js";
import { MATERIAS as RT_MATERIAS, OPTATIVAS as RT_OPTATIVAS, IDIOMA as RT_IDIOMA } from "./rt.js";
import { MATERIAS as TS_MATERIAS, IDIOMA as TS_IDIOMA } from "./ts.js";
import {
  MATERIAS as SOCIO_MATERIAS,
  OPTATIVAS as SOCIO_OPTATIVAS,
  IDIOMA as SOCIO_IDIOMA,
} from "./socio.js";
import { CP_UI, RT_UI, TS_UI, SOCIO_UI } from "./ui.js";

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
  {
    id: "comunicacion",
    nombre: "Ciencias de la Comunicación",
    color: "#E85DCC",
    estado: "en-preparacion",
    data: null,
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
