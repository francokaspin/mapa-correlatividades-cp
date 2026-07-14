import { describe, it, expect } from "vitest";
import { getSubjectStatus, countGeneral, getProgressKey, migrateProgress } from "./evaluator.js";
import cpData from "./carreras/cp.js";
import {
  MATERIAS as RT_MATERIAS,
  OPTATIVAS as RT_OPTATIVAS,
  IDIOMA as RT_IDIOMA,
  HITO_INTERMEDIO,
} from "./carreras/rt.js";
import { MATERIAS as TS_MATERIAS, IDIOMA as TS_IDIOMA } from "./carreras/ts.js";

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
    expect(getProgressKey("sociologia")).toBe("sociales-map:sociologia");
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

    expect(migrated).toEqual({ a: ["eco", "tps1"], o: "app" });
    expect(JSON.parse(store["sociales-map:cp"])).toEqual({ a: ["eco", "tps1"], o: "app" });
    delete globalThis.localStorage;
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
