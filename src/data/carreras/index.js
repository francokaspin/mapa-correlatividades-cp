import cpData from "./cp.js";
import { MATERIAS as RT_MATERIAS, OPTATIVAS as RT_OPTATIVAS, IDIOMA as RT_IDIOMA } from "./rt.js";
import { MATERIAS as TS_MATERIAS, IDIOMA as TS_IDIOMA } from "./ts.js";
import { CP_UI, RT_UI, TS_UI } from "./ui.js";

export const CARRERAS = [
  {
    id: "cp",
    nombre: "Ciencia Política",
    color: "#C8D62B",
    estado: "activa",
    data: { plan: cpData.plan, ui: CP_UI, legacyKey: "cp8558_progreso_v1" },
  },
  {
    id: "sociologia",
    nombre: "Sociología",
    color: "#5B6DEB",
    estado: "en-preparacion",
    data: null,
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
    color: "#D42E86",
    estado: "activa",
    data: {
      plan: { general: TS_MATERIAS, idioma: TS_IDIOMA },
      ui: TS_UI,
    },
  },
];
