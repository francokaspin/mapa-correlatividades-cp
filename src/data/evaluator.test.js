import { describe, it, expect } from "vitest";
import {
  getSubjectStatus,
  countGeneral,
  getProgressKey,
  migrateProgress,
  parseProgress,
  averageOf,
  collectNotas,
  normalizeNota,
  formatAR,
} from "./evaluator.js";
import { CARRERAS, landingEntries } from "./carreras/index.js";
import {
  TRONCO as CC440_TRONCO,
  ORIENTADO as CC440_ORIENTADO,
  ORIENTACIONES as CC440_ORIENTACIONES,
  IDIOMA as CC440_IDIOMA,
  TOTAL_MATERIAS as CC440_TOTAL,
} from "./carreras/cc440.js";
import {
  COMUNICACIONAL as CC504_COMUNICACIONAL,
  TALLERES as CC504_TALLERES,
  CSOCIALES as CC504_CSOCIALES,
  PROBLEMATICA as CC504_PROBLEMATICA,
  PPP1 as CC504_PPP1,
  PPP2 as CC504_PPP2,
  INTRODUCTORIAS as CC504_INTRODUCTORIAS,
  APLICADAS as CC504_APLICADAS,
  ESPECIFICAS as CC504_ESPECIFICAS,
  SEMINARIOS as CC504_SEMINARIOS,
  TALLER_TIF as CC504_TALLER_TIF,
  IDIOMA as CC504_IDIOMA,
  COMUNICACIONAL_IDS,
  TALLERES_IDS,
  CSOCIALES_IDS,
  PROBLEMATICA_IDS,
  CICLO_INICIAL_IDS,
} from "./carreras/cc504.js";
import cpData from "./carreras/cp.js";
import {
  MATERIAS as RT_MATERIAS,
  OPTATIVAS as RT_OPTATIVAS,
  IDIOMA as RT_IDIOMA,
  HITO_INTERMEDIO,
} from "./carreras/rt.js";
import { MATERIAS as TS_MATERIAS, IDIOMA as TS_IDIOMA } from "./carreras/ts.js";
import {
  MATERIAS as SOCIO_MATERIAS,
  OPTATIVAS as SOCIO_OPTATIVAS,
  IDIOMA as SOCIO_IDIOMA,
  HITOS as SOCIO_HITOS,
  TOTAL_MATERIAS as SOCIO_TOTAL,
} from "./carreras/socio.js";

const contextForPlan = (plan, okSet, orientation) => ({
  generalIds: plan.general.map((m) => m.id),
  remainingCount: getRemainingCount(plan, okSet),
  orientation,
});

function getRemainingCount(plan, okSet) {
  const allIds = [...plan.general, ...plan.idioma, ...plan.orientado].map((m) => m.id);
  return allIds.filter((id) => !okSet.has(id)).length;
}

describe("evaluator", () => {
  it("resuelve grupos OR correctamente", () => {
    const plan = {
      general: [],
      idioma: [],
      orientado: [],
    };
    const subject = { id: "s", req: [{ or: ["a", "b", "c"] }] };
    const okSet = new Set(["b"]);
    const status = getSubjectStatus(subject, okSet, contextForPlan(plan, okSet));
    expect(status).toBe("go");
  });

  it("resuelve umbral con inclusión correctamente", () => {
    const plan = {
      general: [
        { id: "x" },
        { id: "y" },
        { id: "z" },
        { id: "a" },
      ],
      idioma: [],
      orientado: [],
    };
    const subject = {
      id: "s",
      req: [
        {
          min: 2,
          of: ["x", "y", "z", "a"],
          includes: ["x", { or: ["y", "z"] }],
        },
      ],
    };
    const okSet = new Set(["x", "y"]);
    const status = getSubjectStatus(subject, okSet, contextForPlan(plan, okSet));
    expect(status).toBe("go");
  });

  it("resuelve cuenta regresiva correctamente", () => {
    const plan = {
      general: [
        { id: "a" },
        { id: "b" },
        { id: "c" },
      ],
      idioma: [],
      orientado: [],
    };
    const subject = { id: "s", req: [{ countdown: 1 }] };
    let okSet = new Set(["a", "b"]);
    expect(getSubjectStatus(subject, okSet, contextForPlan(plan, okSet))).toBe("go");

    okSet = new Set(["a"]);
    expect(getSubjectStatus(subject, okSet, contextForPlan(plan, okSet))).toBe("no");
  });

  it("mantiene el estado actual de CP para algunos casos conocidos", () => {
    const plan = cpData.plan;
    const okSet = new Set(["eco", "tps1", "fcp1", "fym", "tdc", "hc"]);
    const context = contextForPlan(plan, okSet);

    expect(countGeneral(okSet, plan.general.map((m) => m.id))).toBe(6);
    expect(getSubjectStatus(plan.general.find((m) => m.id === "tps2"), okSet, context)).toBe("go");
    expect(getSubjectStatus(plan.general.find((m) => m.id === "fcp2"), okSet, context)).toBe("go");
    expect(getSubjectStatus(plan.general.find((m) => m.id === "pa"), okSet, context)).toBe("no");
    expect(getSubjectStatus(plan.idioma.find((m) => m.id === "id1"), okSet, context)).toBe("go");
    expect(getSubjectStatus(plan.idioma.find((m) => m.id === "id2"), okSet, context)).toBe("no");
  });

  it("CP: Idioma Nivel I no tiene gate de materias; II y III encadenados (sin fuente en la 8558/17)", () => {
    const plan = cpData.plan;
    const [id1, id2, id3] = plan.idioma;
    const vacio = new Set();
    const ctx = contextForPlan(plan, vacio);

    // Nivel I: req vacío y sin min → disponible desde el estado vacío
    expect(id1.req).toEqual([]);
    expect(id1.min).toBeUndefined();
    expect(getSubjectStatus(id1, vacio, ctx)).toBe("go");

    // II y III siguen encadenados por nivel
    expect(getSubjectStatus(id2, vacio, ctx)).toBe("no");
    expect(getSubjectStatus(id2, new Set(["id1"]), contextForPlan(plan, new Set(["id1"])))).toBe("go");
    expect(getSubjectStatus(id3, new Set(["id1"]), contextForPlan(plan, new Set(["id1"])))).toBe("no");
    expect(getSubjectStatus(id3, new Set(["id1", "id2"]), contextForPlan(plan, new Set(["id1", "id2"])))).toBe("go");

    // Anti-regresión: los gates de idioma CON fuente propia se conservan
    const ing1 = RT_IDIOMA.find((m) => m.cod === 991); // RT: min 6 con fuente
    expect(ing1.min).toBe(6);
    const cc504Idi1 = CC504_IDIOMA[0]; // CC504: gate propio (min 6, en req)
    expect(cc504Idi1.req.some((r) => r && r.min === 6)).toBe(true);
    const [socioId1] = SOCIO_IDIOMA; // Sociología: régimen libre, Nivel I sin min
    expect(socioId1.min).toBeUndefined();
    expect(socioId1.req).toEqual([]);
  });

  it("CP: el ciclo orientado pide 12 del general + la cabecera de la orientación", () => {
    const plan = cpData.plan;
    const ele1 = plan.orientado.find((m) => m.id === "ele1");
    const generalIds = plan.general.map((m) => m.id);
    const orientationIds = plan.orientaciones.map((o) => o.id);
    const ctx = (okSet, orientation = null) => ({ generalIds, orientation, orientationIds, remainingCount: 0 });

    // 12 aprobadas SIN cabecera → bloqueada
    const doceSinCab = new Set(generalIds.filter((id) => !orientationIds.includes(id)).slice(0, 12));
    expect(countGeneral(doceSinCab, generalIds)).toBe(12);
    expect(getSubjectStatus(ele1, doceSinCab, ctx(doceSinCab, null))).toBe("no");

    // 12 aprobadas incluyendo la cabecera "app" → disponible
    const doceConCab = new Set([...generalIds.filter((id) => id !== "app").slice(0, 11), "app"]);
    expect(countGeneral(doceConCab, generalIds)).toBe(12);
    expect(getSubjectStatus(ele1, doceConCab, ctx(doceConCab, "app"))).toBe("go");
    expect(getSubjectStatus(ele1, doceConCab, ctx(doceConCab, null))).toBe("go");

    // 11 aprobadas (aunque incluyan la cabecera) → bloqueada
    const onceConCab = new Set([...generalIds.filter((id) => id !== "app").slice(0, 10), "app"]);
    expect(countGeneral(onceConCab, generalIds)).toBe(11);
    expect(getSubjectStatus(ele1, onceConCab, ctx(onceConCab, "app"))).toBe("no");
  });

  it("expone la clave de persistencia por carrera", () => {
    expect(getProgressKey("cp")).toBe("sociales-map:cp");
    expect(getProgressKey("socio")).toBe("sociales-map:socio");
  });

  it("migra la clave vieja de CP a sociales-map:cp sin perder avance", () => {
    const store = {};
    globalThis.localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
    };
    store["cp8558_progreso_v1"] = JSON.stringify({ a: ["eco", "tps1"], o: "app" });

    const migrated = migrateProgress("cp", "cp8558_progreso_v1");

    // Migración ADITIVA: a/o intactos, n arranca vacío (no había notas).
    expect(migrated).toEqual({ a: ["eco", "tps1"], o: "app", n: {} });
    expect(JSON.parse(store["sociales-map:cp"])).toEqual({ a: ["eco", "tps1"], o: "app", n: {} });
    delete globalThis.localStorage;
  });
});

// ---- Notas y promedio ----
describe("notas y promedio", () => {
  it("parseProgress migra el array suelto sumando n:{} sin perder a", () => {
    expect(parseProgress(JSON.stringify(["a", "b"]))).toEqual({ a: ["a", "b"], o: null, n: {} });
  });

  it("parseProgress migra {a,o} viejo sumando n:{} (aditivo, intacto)", () => {
    expect(parseProgress(JSON.stringify({ a: ["a"], o: "per" }))).toEqual({
      a: ["a"],
      o: "per",
      n: {},
    });
  });

  it("parseProgress conserva n cuando ya existe (formato nuevo)", () => {
    const raw = JSON.stringify({ a: ["met1"], o: null, n: { met1: 8 } });
    expect(parseProgress(raw)).toEqual({ a: ["met1"], o: null, n: { met1: 8 } });
  });

  it("parseProgress ignora un n corrupto y lo deja en {}", () => {
    const raw = JSON.stringify({ a: ["x"], o: null, n: "roto" });
    expect(parseProgress(raw)).toEqual({ a: ["x"], o: null, n: {} });
  });

  it("migrateProgress conserva las notas ya guardadas en el formato nuevo", () => {
    const store = {};
    globalThis.localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
    };
    store["sociales-map:socio"] = JSON.stringify({ a: ["met1"], o: null, n: { met1: 9 } });
    expect(migrateProgress("socio")).toEqual({ a: ["met1"], o: null, n: { met1: 9 } });
    delete globalThis.localStorage;
  });

  it("averageOf: media simple a partir de materias comunes", () => {
    expect(averageOf({ a: 8, b: 7, c: 10 })).toBeCloseTo(8.3333, 4);
  });

  it("averageOf: null cuando no hay ninguna nota (invisible en vacío)", () => {
    expect(averageOf({})).toBe(null);
    expect(averageOf(undefined)).toBe(null);
  });

  it("averageOf: una tarjeta-grupo aporta cada nota cargada como una", () => {
    // Especiales aprobada con 2 de 6 notas → cuentan 2, no 1 ni 6.
    expect(collectNotas({ espec: [8, 7, null, null, null, null] })).toEqual([8, 7]);
    // Grupo (2 notas) + común (1 nota) → promedio sobre 3 valores.
    expect(averageOf({ espec: [8, 7], met1: 9 })).toBeCloseTo(8, 5);
  });

  it("averageOf: excluye cupos vacíos y valores no numéricos", () => {
    expect(collectNotas({ espec: [null, 6, null], teor: [], x: null })).toEqual([6]);
    expect(averageOf({ espec: [null, 6, null], teor: [], x: null })).toBe(6);
  });

  it("averageOf: un grupo sin ninguna nota no altera el promedio", () => {
    // Aprobaste Especiales pero no cargaste notas → no cuenta (como común sin nota).
    expect(averageOf({ espec: [null, null], met1: 8 })).toBe(8);
  });

  it("normalizeNota: acepta 4–10 con decimales; rechaza fuera de rango y basura", () => {
    expect(normalizeNota("8")).toBe(8);
    expect(normalizeNota("8.5")).toBe(8.5);
    expect(normalizeNota("7.256")).toBe(7.26); // redondeo a 2 decimales
    expect(normalizeNota("4")).toBe(4);
    expect(normalizeNota("10")).toBe(10);
    expect(normalizeNota("3.9")).toBe(null); // < 4
    expect(normalizeNota("10.1")).toBe(null); // > 10
    expect(normalizeNota("")).toBe(null); // borrar → sale del promedio
    expect(normalizeNota("abc")).toBe(null);
    expect(normalizeNota(null)).toBe(null);
  });

  it("normalizeNota: acepta la coma es-AR igual que el punto", () => {
    // El público es-AR usa coma; el teclado mobile la ofrece.
    expect(normalizeNota("7,5")).toBe(7.5);
    expect(normalizeNota("7.5")).toBe(7.5);
    expect(normalizeNota("8,25")).toBe(8.25);
    expect(normalizeNota("10,0")).toBe(10);
    expect(normalizeNota("3,9")).toBe(null); // < 4, también con coma
    expect(normalizeNota(",")).toBe(null);
    expect(normalizeNota(".")).toBe(null);
    expect(normalizeNota(" 8,5 ")).toBe(8.5); // tolera espacios del autofill
  });

  it("formatAR: coma decimal, enteros sin decimales (solo presentación)", () => {
    expect(formatAR(8)).toBe("8");
    expect(formatAR(7.5)).toBe("7,5");
    expect(formatAR(8.25)).toBe("8,25");
    expect(formatAR(10)).toBe("10");
    expect(formatAR(null)).toBe("");
    expect(formatAR(NaN)).toBe("");
  });
});

// ---- Relaciones del Trabajo (data real de rt.js) ----
const RT_ALL = [...RT_MATERIAS, ...RT_OPTATIVAS, ...RT_IDIOMA];
const RT_GENERAL_IDS = RT_MATERIAS.map((m) => m.id);
const rtCtx = (okSet) => ({
  generalIds: RT_GENERAL_IDS,
  orientation: null,
  orientationIds: [],
  remainingCount: RT_ALL.filter((m) => !okSet.has(m.id)).length,
});
const rtGoCods = (okSet) =>
  RT_MATERIAS.filter((m) => getSubjectStatus(m, okSet, rtCtx(okSet)) === "go")
    .map((m) => m.cod)
    .sort((a, b) => a - b);
const rtFirst = (n) => new Set(RT_GENERAL_IDS.slice(0, n));

describe("Relaciones del Trabajo", () => {
  it("(a) al arrancar, las disponibles son exactamente 901, 903, 905, 908, 925, 927", () => {
    expect(rtGoCods(new Set())).toEqual([901, 903, 905, 908, 925, 927]);
  });

  it("(b) 919 (T. y Comp. Organizacional) se bloquea hasta aprobar 911+912+913+918", () => {
    const tco = RT_MATERIAS.find((m) => m.cod === 919);
    const reqIds = ["adp3", "comp", "psit", "sot"]; // 911, 912, 913, 918
    expect(getSubjectStatus(tco, new Set(), rtCtx(new Set()))).toBe("no");
    const casi = new Set(reqIds.slice(0, 3));
    expect(getSubjectStatus(tco, casi, rtCtx(casi))).toBe("no");
    const completo = new Set(reqIds);
    expect(getSubjectStatus(tco, completo, rtCtx(completo))).toBe("go");
  });

  it("(c) 921 (Seguridad Social) pide 914 y 916", () => {
    const dss = RT_MATERIAS.find((m) => m.cod === 921);
    const soloUno = new Set(["dapt"]); // 914
    expect(getSubjectStatus(dss, soloUno, rtCtx(soloUno))).toBe("no");
    const ambos = new Set(["dapt", "rt"]); // 914, 916
    expect(getSubjectStatus(dss, ambos, rtCtx(ambos))).toBe("go");
  });

  it("(d) las optativas se abren recién con 17 aprobadas del ciclo obligatorio", () => {
    const opt = RT_OPTATIVAS[0];
    const con16 = rtFirst(16);
    expect(getSubjectStatus(opt, con16, rtCtx(con16))).toBe("no");
    const con17 = rtFirst(17);
    expect(getSubjectStatus(opt, con17, rtCtx(con17))).toBe("go");
  });

  it("(e) Inglés I se habilita con 6 materias de la carrera aprobadas", () => {
    const ing1 = RT_IDIOMA.find((m) => m.cod === 991);
    const con5 = rtFirst(5);
    expect(getSubjectStatus(ing1, con5, rtCtx(con5))).toBe("no");
    const con6 = rtFirst(6);
    expect(getSubjectStatus(ing1, con6, rtCtx(con6))).toBe("go");
  });

  it("(f) el hito de título intermedio se enciende con 14 obligatorias aprobadas", () => {
    expect(HITO_INTERMEDIO.min).toBe(14);
    expect(countGeneral(rtFirst(13), RT_GENERAL_IDS) >= HITO_INTERMEDIO.min).toBe(false);
    expect(countGeneral(rtFirst(14), RT_GENERAL_IDS) >= HITO_INTERMEDIO.min).toBe(true);
  });
});

// ---- Trabajo Social (data real de ts.js) ----
const TS_ALL = [...TS_MATERIAS, ...TS_IDIOMA];
const TS_GENERAL_IDS = TS_MATERIAS.map((m) => m.id);
const tsCtx = (okSet) => ({
  generalIds: TS_GENERAL_IDS,
  orientation: null,
  orientationIds: [],
  remainingCount: TS_ALL.filter((m) => !okSet.has(m.id)).length,
});
const tsStatus = (subject, okSet) => getSubjectStatus(subject, okSet, tsCtx(okSet));
const tsGoNros = (okSet) =>
  TS_MATERIAS.filter((m) => tsStatus(m, okSet) === "go")
    .map((m) => m.nro)
    .sort((a, b) => a - b);
const tsFirst = (n) => new Set(TS_GENERAL_IDS.slice(0, n));
const tsByNro = (nro) => TS_MATERIAS.find((m) => m.nro === nro);

describe("Trabajo Social", () => {
  it("(a) al arrancar, las disponibles son exactamente 1,2,3,4,5,6,9,10,15", () => {
    expect(tsGoNros(new Set())).toEqual([1, 2, 3, 4, 5, 6, 9, 10, 15]);
  });

  it("(b) Taller IV (31) se bloquea hasta Taller III + Política Social + Dim. Instrumental + TS Familias", () => {
    const tal4 = tsByNro(31);
    const reqIds = ["tal3", "polsoc", "dimins", "familias"]; // 23, 16, 21, 25
    expect(tsStatus(tal4, new Set())).toBe("no");
    const casi = new Set(reqIds.slice(0, 3));
    expect(tsStatus(tal4, casi)).toBe("no");
    const completo = new Set(reqIds);
    expect(tsStatus(tal4, completo)).toBe("go");
  });

  it("(c) Seminario de Investigación Final (29) pide Antropología I + Sociodemográficos + Taller III", () => {
    const semfin = tsByNro(29);
    const reqIds = ["antro1", "sociodem", "tal3"]; // 15, 20, 23
    expect(tsStatus(semfin, new Set(reqIds.slice(0, 2)))).toBe("no");
    expect(tsStatus(semfin, new Set(reqIds))).toBe("go");
  });

  it("(d) las 2 electivas (27, 33) y la optativa (30) piden Problemas Soc. Arg. + Taller II", () => {
    const cards = [27, 33, 30].map(tsByNro);
    const soloUno = new Set(["psa"]); // 12
    cards.forEach((c) => expect(tsStatus(c, soloUno)).toBe("no"));
    const ambos = new Set(["psa", "tal2"]); // 12, 14
    cards.forEach((c) => expect(tsStatus(c, ambos)).toBe("go"));
  });

  it("(e) Idioma I se habilita con 6 materias aprobadas", () => {
    const idi1 = TS_IDIOMA.find((m) => m.id === "idi1");
    expect(tsStatus(idi1, tsFirst(5))).toBe("no");
    expect(tsStatus(idi1, tsFirst(6))).toBe("go");
  });

  it("(f) el grafo de correlativas no tiene ciclos y todas las req existen", () => {
    const ids = new Set(TS_GENERAL_IDS);
    const byId = Object.fromEntries(TS_MATERIAS.map((m) => [m.id, m]));
    // integridad referencial: toda req por id apunta a una materia existente
    TS_MATERIAS.forEach((m) =>
      (m.req || [])
        .filter((r) => typeof r === "string")
        .forEach((r) => expect(ids.has(r)).toBe(true))
    );
    // detección de ciclos por DFS
    const estado = {};
    let ciclo = false;
    const visitar = (id) => {
      if (estado[id] === 1) {
        ciclo = true;
        return;
      }
      if (estado[id] === 2) return;
      estado[id] = 1;
      (byId[id]?.req || []).filter((r) => typeof r === "string").forEach(visitar);
      estado[id] = 2;
    };
    TS_MATERIAS.forEach((m) => visitar(m.id));
    expect(ciclo).toBe(false);
    expect(TS_MATERIAS).toHaveLength(33);
  });
});

// ---- Sociología (data real de socio.js) ----
// Plan Res. (CS) 2282/88 · correlativas Res. (CD) 186/2024 (vigente 2º cuat. 2024).
const SOCIO_ALL = [...SOCIO_MATERIAS, ...SOCIO_OPTATIVAS, ...SOCIO_IDIOMA];
const SOCIO_GENERAL_IDS = SOCIO_MATERIAS.map((m) => m.id);
const socioCtx = (okSet) => ({
  generalIds: SOCIO_GENERAL_IDS,
  orientation: null,
  orientationIds: [],
  remainingCount: SOCIO_ALL.filter((m) => !okSet.has(m.id)).length,
});
const socioStatus = (subject, okSet) => getSubjectStatus(subject, okSet, socioCtx(okSet));
const socioGoCods = (okSet) =>
  SOCIO_MATERIAS.filter((m) => socioStatus(m, okSet) === "go")
    .map((m) => m.cod)
    .sort((a, b) => a - b);
const socioByCod = (cod) => SOCIO_MATERIAS.find((m) => m.cod === cod);
const socioGrupo = (id) => SOCIO_OPTATIVAS.find((o) => o.id === id);

describe("Sociología", () => {
  it("(a) al arrancar, las disponibles son exactamente 251, 252, 253, 256", () => {
    expect(socioGoCods(new Set())).toEqual([251, 252, 253, 256]);
  });

  it("(b) Metodología I (258) se bloquea hasta 251+255+256", () => {
    const met1 = socioByCod(258);
    expect(socioStatus(met1, new Set())).toBe("no");
    // 251 + 256, falta Epistemología (255)
    const casi = new Set(["sg", "eco2"]);
    expect(socioStatus(met1, casi)).toBe("no");
    // 251 + 255 + 256 → se abre
    const completo = new Set(["sg", "epi", "eco2"]);
    expect(socioStatus(met1, completo)).toBe("go");
  });

  it("(b bis) REGRESIÓN anti-typo [a]: 254 NO reemplaza a 255 en Metodología I", () => {
    // La Res. 186/2024 tipea "Epistemología de las Ciencias Sociales (Cód. 254)":
    // el nombre es la 255 y el código es un error de tipeo (254 = HCS I).
    // Si alguien "corrige" la data al código literal, este test se cae.
    const met1 = socioByCod(258);
    const conHcs1 = new Set(["sg", "hcs1", "eco2"]); // 251 + 254 + 256
    expect(socioStatus(met1, conHcs1)).toBe("no");
    const conEpi = new Set(["sg", "epi", "eco2"]); // 251 + 255 + 256
    expect(socioStatus(met1, conEpi)).toBe("go");
    // y la req apunta a Epistemología por id, no a HCS I
    expect(met1.req).toEqual(["sg", "epi", "eco2"]);
    expect(socioByCod(255).id).toBe("epi");
    expect(socioByCod(255).n).toBe("Epistemología de las Ciencias Sociales");
  });

  it("(c) Metodología III (264) se abre solo con 261 — sin 260 (cambio 2024)", () => {
    const met3 = socioByCod(264);
    expect(socioStatus(met3, new Set())).toBe("no");
    // el régimen viejo pedía además Sociología Sistemática (260): ya no
    const soloMet2 = new Set(["met2"]); // 261
    expect(socioStatus(met3, soloMet2)).toBe("go");
    expect(met3.req).toEqual(["met2"]);
    expect(met3.req).not.toContain("ssis");
  });

  it("(d) Análisis de la Sociedad Argentina (265) pide 262+254, no 260", () => {
    const asa = socioByCod(265);
    const soloHsa = new Set(["hsa"]); // 262
    expect(socioStatus(asa, soloHsa)).toBe("no");
    // 260 no ayuda: el régimen 2024 pide HCS I (254)
    const conSsis = new Set(["hsa", "ssis"]); // 262 + 260
    expect(socioStatus(asa, conSsis)).toBe("no");
    const correcto = new Set(["hsa", "hcs1"]); // 262 + 254
    expect(socioStatus(asa, correcto)).toBe("go");
    expect(asa.req).not.toContain("ssis");
  });

  it("(e) Sociologías Especiales piden 257+258 y Teorías Sociológicas 258+260", () => {
    const espec = socioGrupo("espec");
    const teor = socioGrupo("teor");

    // Especiales: HCS II (257) + Metodología I (258)
    expect(socioStatus(espec, new Set(["hcs2"]))).toBe("no");
    expect(socioStatus(espec, new Set(["met1"]))).toBe("no");
    expect(socioStatus(espec, new Set(["hcs2", "met1"]))).toBe("go");

    // Teorías: Metodología I (258) + Sociología Sistemática (260)
    expect(socioStatus(teor, new Set(["met1"]))).toBe("no");
    expect(socioStatus(teor, new Set(["ssis"]))).toBe("no");
    expect(socioStatus(teor, new Set(["met1", "ssis"]))).toBe("go");

    // son req fijos, no umbrales de N materias
    expect(espec.min).toBeUndefined();
    expect(teor.min).toBeUndefined();
    // cupos del tramo optativo
    expect(espec.cantidad).toBe(6);
    expect(teor.cantidad).toBe(3);
    // matiz [c]: Teorías pide las correlativas APROBADAS, Especiales no
    expect(teor.reqAprobadas).toBe(true);
    expect(espec.reqAprobadas).toBeUndefined();
  });

  it("(f) Psicología Social (266) pide solo 260", () => {
    const psoc = socioByCod(266);
    expect(psoc.req).toEqual(["ssis"]);
    expect(socioStatus(psoc, new Set())).toBe("no");
    expect(socioStatus(psoc, new Set(["ssis"]))).toBe("go");
  });

  it("(g) el grafo de correlativas no tiene ciclos y todas las req existen", () => {
    const ids = new Set(SOCIO_ALL.map((m) => m.id));
    const byId = Object.fromEntries(SOCIO_ALL.map((m) => [m.id, m]));
    // integridad referencial: toda req por id apunta a un item existente
    SOCIO_ALL.forEach((m) =>
      (m.req || [])
        .filter((r) => typeof r === "string")
        .forEach((r) => expect(ids.has(r)).toBe(true))
    );
    // los hitos también apuntan a materias reales
    SOCIO_HITOS.forEach((h) => h.req.forEach((r) => expect(ids.has(r)).toBe(true)));
    // detección de ciclos por DFS
    const estado = {};
    let ciclo = false;
    const visitar = (id) => {
      if (estado[id] === 1) {
        ciclo = true;
        return;
      }
      if (estado[id] === 2) return;
      estado[id] = 1;
      (byId[id]?.req || []).filter((r) => typeof r === "string").forEach(visitar);
      estado[id] = 2;
    };
    SOCIO_ALL.forEach((m) => visitar(m.id));
    expect(ciclo).toBe(false);
    expect(SOCIO_MATERIAS).toHaveLength(16);
  });

  it("(h) la barra suma 25: 16 obligatorias + 6 especiales + 3 teorías", () => {
    const peso = (it) => (typeof it.cantidad === "number" ? it.cantidad : 1);
    const contadas = [...SOCIO_MATERIAS, ...SOCIO_OPTATIVAS];
    expect(contadas.reduce((acc, it) => acc + peso(it), 0)).toBe(25);
    expect(SOCIO_TOTAL).toBe(25);
    // idioma y 200 hs corren por fuera del conteo
    expect(SOCIO_IDIOMA).toHaveLength(3);
    expect(SOCIO_IDIOMA.every((n) => typeof n.cantidad === "undefined")).toBe(true);
  });

  it("(i) Idioma Nivel I no tiene gate de materias; II y III encadenados", () => {
    const [n1, n2, n3] = SOCIO_IDIOMA;
    // Nivel I: solo CBC → disponible desde el arranque, sin min de materias
    expect(n1.req).toEqual([]);
    expect(n1.min).toBeUndefined();
    expect(socioStatus(n1, new Set())).toBe("go");
    // II y III encadenados por nivel
    expect(socioStatus(n2, new Set())).toBe("no");
    expect(socioStatus(n2, new Set(["idi1"]))).toBe("go");
    expect(socioStatus(n3, new Set(["idi1"]))).toBe("no");
    expect(socioStatus(n3, new Set(["idi1", "idi2"]))).toBe("go");
  });

  it("(j) el hito de 200 hs pide Metodología I + Soc. Sistemática, sin conteo", () => {
    const horas = SOCIO_HITOS.find((h) => h.id === "horasinv");
    expect(horas.req).toEqual(["met1", "ssis"]);
    expect(horas.reqAprobadas).toBe(true);
    // no es materia: no pesa ni entra en la grilla
    expect(horas.cantidad).toBeUndefined();
    expect(SOCIO_ALL.some((m) => m.id === "horasinv")).toBe(false);
  });

  it("(k) el registro publica Sociología activa en #/socio con storage sociales-map:socio", () => {
    const socio = CARRERAS.find((c) => c.id === "socio");
    expect(socio).toBeDefined();
    expect(socio.estado).toBe("activa");
    expect(socio.nombre).toBe("Sociología");
    expect(getProgressKey(socio.id)).toBe("sociales-map:socio");
    expect(socio.data.plan.general).toHaveLength(16);
    expect(socio.data.plan.optativas).toHaveLength(2);
    expect(socio.data.plan.idioma).toHaveLength(3);
    // el footer arrastra la notaPie del archivo, con la excepción de "aprobadas"
    expect(socio.data.ui.footer).toContain("APROBADAS");
    // ya no existe el placeholder "sociologia"
    expect(CARRERAS.some((c) => c.id === "sociologia")).toBe(false);
  });
});

// ---- Ciencias de la Comunicación · Plan 440/90 (data real de cc440.js) ----
// Plan Res. (CS) 440/90 · correlativas Res. 5396/09 · a extinguir.
const CC440_ALL = [...CC440_TRONCO, ...CC440_ORIENTADO, ...CC440_IDIOMA];
const CC440_TRONCO_IDS = CC440_TRONCO.map((m) => m.id);
const cc440Ctx = (okSet) => ({
  generalIds: CC440_TRONCO_IDS,
  orientation: null,
  orientationIds: CC440_ORIENTACIONES.map((o) => o.id),
  remainingCount: CC440_ALL.filter((m) => !okSet.has(m.id)).length,
});
const cc440Status = (subject, okSet) => getSubjectStatus(subject, okSet, cc440Ctx(okSet));
const cc440GoCods = (okSet) =>
  CC440_TRONCO.filter((m) => cc440Status(m, okSet) === "go")
    .map((m) => m.cod)
    .sort((a, b) => a - b);
const cc440ByCod = (cod) => CC440_TRONCO.find((m) => m.cod === cod);
const cc440Mat = (id) => CC440_ORIENTADO.find((m) => m.id === id);
// 14 del tronco SIN ninguno de los talleres 124/125/126 (el "incluyendo" del gate).
const TRONCO_SIN_TALLERES = CC440_TRONCO_IDS.filter((id) => !["tcc", "tcpu", "tcpe"].includes(id));
const CATORCE_SIN_TALLER = new Set(TRONCO_SIN_TALLERES.slice(0, 14));
// 14 del tronco CON un taller (124) y con 107, pero SIN la 119 (pypc).
const CATORCE_CON_TALLER = new Set([...TRONCO_SIN_TALLERES.slice(0, 13), "tcc"]);

describe("Cs. de la Comunicación · Plan 440/90", () => {
  it("(a) al arrancar, las disponibles son exactamente las 11 con requisito CBC", () => {
    expect(cc440GoCods(new Set())).toEqual([101, 102, 103, 104, 105, 106, 107, 108, 111, 113, 116]);
  });

  it("(b) 110 (TyPC II) pide 101 + 106", () => {
    const tpc2 = cc440ByCod(110);
    expect(tpc2.req).toEqual(["tpc1", "antr"]);
    expect(cc440Status(tpc2, new Set(["tpc1"]))).toBe("no");
    expect(cc440Status(tpc2, new Set(["tpc1", "antr"]))).toBe("go");
  });

  it("(c) 118 (TyPC III) pide 101+102+104+106+110+112", () => {
    const tpc3 = cc440ByCod(118);
    expect(tpc3.req).toEqual(["tpc1", "sem1", "meto", "antr", "tpc2", "sem2"]);
    const casi = new Set(["tpc1", "sem1", "meto", "antr", "tpc2"]); // falta sem2 (112)
    expect(cc440Status(tpc3, casi)).toBe("no");
    expect(cc440Status(tpc3, new Set(["tpc1", "sem1", "meto", "antr", "tpc2", "sem2"]))).toBe("go");
  });

  it("(d) 123 (Taller de expresión III) pide 107+108+116", () => {
    const te3 = cc440ByCod(123);
    expect(te3.req).toEqual(["te1", "trad", "te2"]);
    expect(cc440Status(te3, new Set(["te1", "trad"]))).toBe("no");
    expect(cc440Status(te3, new Set(["te1", "trad", "te2"]))).toBe("go");
  });

  it("(e) las orientaciones piden 14 incluyendo 107 y uno de {124,125,126}", () => {
    const mats = ["per_tsp", "cpe_cyed", "opp_com", "ccom_prom"].map(cc440Mat);
    // 14 aprobadas sin ningún taller comunitario/publicitario/periodístico → el "incluyendo" muerde
    expect(countGeneral(CATORCE_SIN_TALLER, CC440_TRONCO_IDS)).toBe(14);
    mats.forEach((m) => expect(cc440Status(m, CATORCE_SIN_TALLER)).toBe("no"));
    // 14 con un taller (124) → abren
    expect(countGeneral(CATORCE_CON_TALLER, CC440_TRONCO_IDS)).toBe(14);
    mats.forEach((m) => expect(cc440Status(m, CATORCE_CON_TALLER)).toBe("go"));
    // 13 (una menos) aunque incluya el taller → siguen bloqueadas
    const trece = new Set([...TRONCO_SIN_TALLERES.slice(0, 12), "tcc"]);
    expect(countGeneral(trece, CC440_TRONCO_IDS)).toBe(13);
    expect(cc440Status(mats[0], trece)).toBe("no");
  });

  it("(f) con el gate común pero sin la 119, Políticas y Planificación sigue bloqueada; las otras 4 abren", () => {
    const pyp = CC440_ORIENTADO.filter((m) => m.ori === "pyp");
    // el gate común está cumplido (CATORCE_CON_TALLER no incluye pypc/119)
    expect(CATORCE_CON_TALLER.has("pypc")).toBe(false);
    pyp.forEach((m) => expect(cc440Status(m, CATORCE_CON_TALLER)).toBe("no"));
    // las otras cuatro abren con ese mismo set
    ["per_tsp", "cpe_cyed", "opp_com", "ccom_prom"].forEach((id) =>
      expect(cc440Status(cc440Mat(id), CATORCE_CON_TALLER)).toBe("go")
    );
    // sumando la 119 → Políticas y Planificación abre
    const con119 = new Set([...CATORCE_CON_TALLER, "pypc"]);
    pyp.forEach((m) => expect(cc440Status(m, con119)).toBe("go"));
  });

  it("(g) Idioma Nivel I se abre con 6 del tronco; II y III encadenados", () => {
    const [idi1, idi2, idi3] = CC440_IDIOMA;
    expect(cc440Status(idi1, new Set(CC440_TRONCO_IDS.slice(0, 5)))).toBe("no");
    expect(cc440Status(idi1, new Set(CC440_TRONCO_IDS.slice(0, 6)))).toBe("go");
    expect(cc440Status(idi2, new Set(CC440_TRONCO_IDS.slice(0, 6)))).toBe("no");
    expect(cc440Status(idi2, new Set([...CC440_TRONCO_IDS.slice(0, 6), "idi1"]))).toBe("go");
    expect(cc440Status(idi3, new Set([...CC440_TRONCO_IDS.slice(0, 6), "idi1"]))).toBe("no");
    expect(cc440Status(idi3, new Set([...CC440_TRONCO_IDS.slice(0, 6), "idi1", "idi2"]))).toBe("go");
  });

  it("(h) el grafo del tronco no tiene ciclos y todas las req existen", () => {
    const ids = new Set(CC440_TRONCO_IDS);
    const byId = Object.fromEntries(CC440_TRONCO.map((m) => [m.id, m]));
    CC440_TRONCO.forEach((m) =>
      (m.req || []).filter((r) => typeof r === "string").forEach((r) => expect(ids.has(r)).toBe(true))
    );
    const estado = {};
    let ciclo = false;
    const visitar = (id) => {
      if (estado[id] === 1) {
        ciclo = true;
        return;
      }
      if (estado[id] === 2) return;
      estado[id] = 1;
      (byId[id]?.req || []).filter((r) => typeof r === "string").forEach(visitar);
      estado[id] = 2;
    };
    CC440_TRONCO.forEach((m) => visitar(m.id));
    expect(ciclo).toBe(false);
    expect(CC440_TRONCO).toHaveLength(26);
  });

  it("(i) barra 32 = 26 tronco + 6 de una orientación; cada orientación tiene 6", () => {
    expect(CC440_TOTAL).toBe(32);
    expect(CC440_ORIENTADO).toHaveLength(30);
    CC440_ORIENTACIONES.forEach((o) =>
      expect(CC440_ORIENTADO.filter((m) => m.ori === o.id)).toHaveLength(6)
    );
    // las materias de orientación no tienen flechas string entre sí (gate por umbral)
    expect(CC440_ORIENTADO.every((m) => m.req.every((r) => typeof r === "object"))).toBe(true);
  });

  it("(j) el registro agrupa los dos planes bajo Comunicación (5 tarjetas en la landing)", () => {
    const cc440 = CARRERAS.find((c) => c.id === "cc440");
    const cc504 = CARRERAS.find((c) => c.id === "cc504");
    expect(cc440.estado).toBe("activa");
    expect(cc504.estado).toBe("activa"); // activado en Fase B
    expect(cc440.grupo).toBe("comunicacion");
    expect(cc504.grupo).toBe("comunicacion");
    expect(cc440.color).toBe("#8E9CF0");
    expect(cc504.color).toBe("#8E9CF0");
    expect(getProgressKey("cc440")).toBe("sociales-map:cc440");
    expect(getProgressKey("cc504")).toBe("sociales-map:cc504");
    // ya no existe el placeholder viejo
    expect(CARRERAS.some((c) => c.id === "comunicacion")).toBe(false);
    // landing: cinco tarjetas, una es el grupo Comunicación → #/comunicacion
    const cards = landingEntries();
    expect(cards).toHaveLength(5);
    const grupo = cards.find((e) => e.tipo === "grupo");
    expect(grupo.href).toBe("#/comunicacion");
    expect(cc440.data.plan.general).toHaveLength(26);
    expect(cc440.data.plan.orientaciones).toHaveLength(5);
  });
});

// ---- Ciencias de la Comunicación · Plan 504/23 (data real de cc504.js) ----
// Plan Res. (CS) 504/2023 · correlativas por tramos y umbrales.
const cc504Ctx = () => ({
  generalIds: CICLO_INICIAL_IDS,
  orientation: null,
  orientationIds: ["cic_int", "cic_pro", "cic_inv"],
  remainingCount: 999, // 504 no usa countdown
});
const s504 = (subject, okSet) => getSubjectStatus(subject, okSet, cc504Ctx());
const peso504 = (it) => (it.requisito ? 0 : typeof it.cantidad === "number" ? it.cantidad : 1);
const totalPesos504 = (arr) => arr.reduce((a, m) => a + peso504(m), 0);
const introDe = (ori) => CC504_INTRODUCTORIAS.find((m) => m.ori === ori);
const aplicDe = (ori) => CC504_APLICADAS.find((m) => m.ori === ori);
const especDe = (ori) => CC504_ESPECIFICAS.find((m) => m.ori === ori);

describe("Cs. de la Comunicación · Plan 504/23", () => {
  it("(a) arranque: 18 disponibles (9 comunicacional + 4 talleres + 5 cs. sociales); Problemática bloqueada", () => {
    const disponibles = [...CC504_COMUNICACIONAL, ...CC504_TALLERES, ...CC504_CSOCIALES].filter(
      (m) => s504(m, new Set()) === "go"
    );
    expect(disponibles).toHaveLength(18);
    CC504_PROBLEMATICA.forEach((m) => expect(s504(m, new Set())).toBe("no"));
  });

  it("(b) Problemática pide 7 del Ciclo Inicial incluyendo ≥1 taller", () => {
    const sinTaller = new Set([...COMUNICACIONAL_IDS.slice(0, 5), ...CSOCIALES_IDS.slice(0, 2)]); // 7, sin taller
    expect(sinTaller.size).toBe(7);
    expect(s504(CC504_PROBLEMATICA[0], sinTaller)).toBe("no");
    const conTaller = new Set([...COMUNICACIONAL_IDS.slice(0, 4), ...CSOCIALES_IDS.slice(0, 2), "tesc"]); // 7, 1 taller
    expect(conTaller.size).toBe(7);
    expect(s504(CC504_PROBLEMATICA[0], conTaller)).toBe("go");
  });

  it("(c) PPP I pide 2 talleres + 4 de otras áreas, con ≥2 del Área Comunicacional", () => {
    const c1 = new Set(["tesc", "trgp", ...CSOCIALES_IDS.slice(0, 3), COMUNICACIONAL_IDS[0]]); // 2 tall + 3 cs + 1 com
    expect(s504(CC504_PPP1, c1)).toBe("no"); // falta ≥2 comunicacional
    const c2 = new Set(["tesc", "trgp", ...COMUNICACIONAL_IDS.slice(0, 2), ...CSOCIALES_IDS.slice(0, 2)]); // 2 tall + 2 com + 2 cs
    expect(s504(CC504_PPP1, c2)).toBe("go");
  });

  it("(d) Introductorias piden 10 del inicial + 2 talleres + PPP I (lectura inclusiva [★a])", () => {
    const diez = new Set([...COMUNICACIONAL_IDS.slice(0, 6), ...CSOCIALES_IDS.slice(0, 2), "tesc", "trgp"]); // 10, 2 talleres
    expect(diez.size).toBe(10);
    const intro = introDe("cic_int");
    expect(s504(intro, diez)).toBe("no"); // falta PPP I
    expect(s504(intro, new Set([...diez, "ppp1"]))).toBe("go"); // marcando PPP I → abre
    // con 9 (una menos) + ppp1 → sigue bloqueada
    const nueve = new Set([...COMUNICACIONAL_IDS.slice(0, 5), ...CSOCIALES_IDS.slice(0, 2), "tesc", "trgp", "ppp1"]);
    expect(s504(intro, nueve)).toBe("no");
  });

  it("(e) Aplicadas piden 2 introductorias del ciclo; Específicas piden 3 aplicadas", () => {
    const aplic = aplicDe("cic_int");
    expect(s504(aplic, new Set(["edpc"]))).toBe("no"); // solo 1 introductoria
    expect(s504(aplic, new Set(["edpc", "poc"]))).toBe("go"); // 2 introductorias
    const espec = especDe("cic_int");
    expect(s504(espec, new Set(["cic", "decp"]))).toBe("no"); // solo 2 aplicadas
    expect(s504(espec, new Set(["cic", "decp", "mcpa"]))).toBe("go"); // 3 aplicadas
  });

  it("(f) Taller de TIF: el grupo Seminarios cuenta como 2 materias hacia el ≥3", () => {
    const ttif = CC504_TALLER_TIF[0];
    // 2 específicas solas = 2 < 3 → bloqueado
    expect(s504(ttif, new Set(["tedu", "iasc"]))).toBe("no");
    // Seminarios solos (grupo = 2 materias) = 2 < 3 → bloqueado
    expect(s504(ttif, new Set(["sem"]))).toBe("no");
    // DISCRIMINANTE: 1 específica + grupo Seminarios (1 + 2) = 3 → abre
    expect(s504(ttif, new Set(["tedu", "sem"]))).toBe("go");
    // 2 específicas + grupo Seminarios (2 + 2) = 4 → abre
    expect(s504(ttif, new Set(["tedu", "iasc", "sem"]))).toBe("go");
  });

  it("(g) las 5 de Cs. Sociales suman SOLO 3 a la barra (tope de bloque)", () => {
    const marcadas5 = CC504_CSOCIALES.reduce((a, m) => a + peso504(m), 0); // si se marcan las 5
    expect(marcadas5).toBe(5);
    expect(Math.min(marcadas5, 3)).toBe(3); // el motor suma min(aprobadas, cap)
    const cc504 = CARRERAS.find((c) => c.id === "cc504");
    expect(cc504.data.ui.blocks.find((b) => b.planKey === "csociales").cap).toBe(3);
    expect(cc504.data.ui.countGroups.find((g) => g.key === "csociales").cap).toBe(3);
  });

  it("(h) la barra llega a 30 exactos; las PPP (peso 0) no la mueven", () => {
    const cc504 = CARRERAS.find((c) => c.id === "cc504");
    const plan = cc504.data.plan;
    const capFor = (g) => (g.cap != null ? g.cap : totalPesos504(plan[g.key]));
    const total = cc504.data.ui.countGroups.reduce((a, g) => a + capFor(g), 0);
    expect(total).toBe(30);
    // PPP I y II están fuera del conteo y pesan 0
    expect(cc504.data.ui.countGroups.some((g) => g.key === "ppp1" || g.key === "ppp2")).toBe(false);
    expect(peso504(CC504_PPP1)).toBe(0);
    expect(peso504(CC504_PPP2)).toBe(0);
    // seminarios pesa 2, taller TIF pesa 1
    expect(totalPesos504(CC504_SEMINARIOS)).toBe(2);
    expect(totalPesos504(CC504_TALLER_TIF)).toBe(1);
  });

  it("(i) Idioma Nivel I con 6 del Ciclo Inicial; II y III encadenados", () => {
    const [idi1, idi2, idi3] = CC504_IDIOMA;
    expect(s504(idi1, new Set(CICLO_INICIAL_IDS.slice(0, 5)))).toBe("no");
    expect(s504(idi1, new Set(CICLO_INICIAL_IDS.slice(0, 6)))).toBe("go");
    expect(s504(idi2, new Set(CICLO_INICIAL_IDS.slice(0, 6)))).toBe("no");
    expect(s504(idi2, new Set([...CICLO_INICIAL_IDS.slice(0, 6), "idi1"]))).toBe("go");
    expect(s504(idi3, new Set([...CICLO_INICIAL_IDS.slice(0, 6), "idi1", "idi2"]))).toBe("go");
  });

  it("(j) cc504 activo bajo el grupo Comunicación; TIF como pill que se enciende sola", () => {
    const cc504 = CARRERAS.find((c) => c.id === "cc504");
    expect(cc504.estado).toBe("activa");
    expect(cc504.color).toBe("#8E9CF0");
    expect(cc504.grupo).toBe("comunicacion");
    expect(getProgressKey("cc504")).toBe("sociales-map:cc504");
    const plan = cc504.data.plan;
    expect(plan.comunicacional).toHaveLength(9);
    expect(plan.talleres).toHaveLength(4);
    expect(plan.csociales).toHaveLength(5);
    expect(plan.problematica).toHaveLength(3);
    expect(plan.introductorias).toHaveLength(13); // 5 + 4 + 4
    expect(plan.aplicadas).toHaveLength(20); // 5 + 8 + 7
    expect(plan.especificas).toHaveLength(10); // 3 + 4 + 3
    expect(plan.orientaciones).toHaveLength(3);
    const tif = cc504.data.ui.infoPills.find((p) => p.whenComplete);
    expect(tif).toBeDefined();
    expect(tif.req).toEqual(["ppp1", "ppp2", "idi3"]);
    // la landing sigue en cinco tarjetas (Comunicación es una)
    expect(landingEntries()).toHaveLength(5);
    // integridad: toda req por string apunta a un id existente del plan
    const allIds = new Set(
      [
        ...plan.comunicacional, ...plan.talleres, ...plan.csociales, ...plan.problematica,
        ...plan.ppp1, ...plan.introductorias, ...plan.aplicadas, ...plan.especificas,
        ...plan.ppp2, ...plan.seminarios, ...plan.tallertif, ...plan.idioma,
      ].map((m) => m.id)
    );
    [...plan.idioma].forEach((m) =>
      (m.req || []).filter((r) => typeof r === "string").forEach((r) => expect(allIds.has(r)).toBe(true))
    );
  });

  it("(k) PPP I: las '4 de otras áreas' excluyen talleres → 2 talleres + 2 comunicacionales sigue bloqueada", () => {
    // 2 talleres cumplen el ≥2 de talleres, pero las 'otras áreas' son solo 2
    // comunicacionales (< 4): PPP I sigue bloqueada.
    const soloComun = new Set(["tesc", "trgp", COMUNICACIONAL_IDS[0], COMUNICACIONAL_IDS[1]]);
    expect(s504(CC504_PPP1, soloComun)).toBe("no");
    // sumando 2 de otras áreas (cs. sociales) → 4 otras áreas ≥ 2 comunic. → abre
    const conCuatro = new Set([...soloComun, CSOCIALES_IDS[0], CSOCIALES_IDS[1]]);
    expect(s504(CC504_PPP1, conCuatro)).toBe("go");
    // el `of` del umbral de 4 excluye los talleres e incluye comunicacional + cs. sociales + problemática
    const of4 = CC504_PPP1.req.find((r) => r.min === 4).of;
    TALLERES_IDS.forEach((t) => expect(of4).not.toContain(t));
    [...COMUNICACIONAL_IDS, ...CSOCIALES_IDS, ...PROBLEMATICA_IDS].forEach((id) =>
      expect(of4).toContain(id)
    );
  });
});

// ---- Accesibilidad del acento ----
// El acento ES el fondo de página y el texto encima es negro (--negro #121210).
// TS ya se subió a 4.64:1 por esto; que ninguna carrera baje de AA.
describe("acentos de carrera", () => {
  const luminancia = (hex) => {
    const canal = (c) => {
      const v = parseInt(c, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const r = canal(hex.slice(1, 3));
    const g = canal(hex.slice(3, 5));
    const b = canal(hex.slice(5, 7));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contraste = (a, b) => {
    const [hi, lo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it("todas las carreras activas llegan a AA (4.5:1) con el texto negro", () => {
    CARRERAS.filter((c) => c.estado === "activa").forEach((c) => {
      expect(contraste(c.color, "#121210")).toBeGreaterThanOrEqual(4.5);
    });
  });

  it("Sociología usa el orquídea #C77DFF", () => {
    const socio = CARRERAS.find((c) => c.id === "socio");
    expect(socio.color).toBe("#C77DFF");
    expect(contraste(socio.color, "#121210")).toBeGreaterThan(6.9);
  });
});
