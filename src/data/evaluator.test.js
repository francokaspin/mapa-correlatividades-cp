import { describe, it, expect } from "vitest";
import { getSubjectStatus, countGeneral, getProgressKey, migrateProgress } from "./evaluator.js";
import { CARRERAS } from "./carreras/index.js";
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
