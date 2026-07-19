import { describe, it, expect } from "vitest";
import { OFERTA_CC504, ofertaDeSlot } from "./cc504.js";
import { SEMINARIOS } from "../carreras/cc504.js";

// Oferta concreta (capa 2) de Seminarios Optativos 2.ºC 2026. Tests de
// aceptación con la data real + casos anti-typo. NO tocan la regla del plan.

const sem = ofertaDeSlot(OFERTA_CC504, "sem");

describe("oferta cc504 · estructura", () => {
  it("el período vigente es 2026-2C y existe", () => {
    expect(OFERTA_CC504.vigente).toBe("2026-2C");
    expect(OFERTA_CC504.periodos["2026-2C"]).toBeTruthy();
  });

  it("cita la fuente oficial y la fecha de consulta", () => {
    const p = OFERTA_CC504.periodos["2026-2C"];
    expect(p.fuente).toContain("comunicacion.sociales.uba.ar/seminarios");
    expect(p.consulta).toBe("2026-07-19");
  });

  it("el slot `sem` de la oferta coincide con el id del slot-grupo del plan", () => {
    // La tarjeta-grupo del plan (regla, intocable) se llama `sem`; la oferta
    // llena EXACTAMENTE ese id. Si alguien renombra uno, este test lo caza.
    expect(SEMINARIOS[0].id).toBe("sem");
    expect(OFERTA_CC504.periodos["2026-2C"].slots.sem).toBeTruthy();
  });
});

describe("oferta cc504 · contenido 2.ºC 2026", () => {
  it("trae 23 seminarios (6 optativos + 17 TIF)", () => {
    expect(sem).toHaveLength(23);
    expect(sem.filter((s) => s.tif)).toHaveLength(17);
    expect(sem.filter((s) => !s.tif)).toHaveLength(6);
  });

  it("cada seminario tiene id, título, docente, modalidad y PDF", () => {
    for (const s of sem) {
      expect(typeof s.id).toBe("string");
      expect(s.id.length).toBeGreaterThan(0);
      expect(typeof s.titulo).toBe("string");
      expect(s.titulo.length).toBeGreaterThan(0);
      expect(typeof s.docente).toBe("string");
      expect(s.docente.length).toBeGreaterThan(0);
      expect(["VIRTUAL", "PRESENCIAL"]).toContain(s.modalidad);
      expect(s.pdf).toMatch(/^https:\/\/comunicacion\.sociales\.uba\.ar\/.+\.pdf$/);
    }
  });

  it("los ids son únicos (clave de storage estable)", () => {
    const ids = sem.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("oferta cc504 · anti-typo", () => {
  it("ningún título tiene espacios dobles ni bordes con espacio", () => {
    for (const s of sem) {
      expect(s.titulo).toBe(s.titulo.trim());
      expect(s.titulo).not.toMatch(/\s{2,}/);
    }
  });

  it("los ids son alfanuméricos sin espacios ni acentos (como el nombre de archivo)", () => {
    for (const s of sem) expect(s.id).toMatch(/^[A-Za-z]+$/);
  });

  it("`tif` es booleano true cuando está, nunca otra cosa", () => {
    for (const s of sem) {
      if ("tif" in s) expect(s.tif).toBe(true);
    }
  });

  it("[★] discrepancia Gesualdi conservada a propósito (página vs PDF)", () => {
    // La página escribe 'Gesuladi'; el PDF se llama Gesualdi.pdf. Queda como
    // punto ABIERTO documentado: el id sigue el archivo, el docente la página.
    // Si esto cambia sin una fuente que lo confirme, el test avisa.
    const g = sem.find((s) => s.id === "Gesualdi");
    expect(g).toBeTruthy();
    expect(g.docente).toBe("Gesuladi");
    expect(g.pdf).toContain("Gesualdi.pdf");
  });
});

describe("oferta cc504 · degradación limpia", () => {
  it("un slot sin oferta devuelve []", () => {
    expect(ofertaDeSlot(OFERTA_CC504, "noexiste")).toEqual([]);
  });
  it("una oferta nula/rota devuelve [] (no rompe el render)", () => {
    expect(ofertaDeSlot(null, "sem")).toEqual([]);
    expect(ofertaDeSlot({}, "sem")).toEqual([]);
    expect(ofertaDeSlot({ vigente: "x", periodos: {} }, "sem")).toEqual([]);
  });
});
