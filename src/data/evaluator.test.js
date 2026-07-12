import { describe, it, expect } from "vitest";
import { getSubjectStatus, countGeneral, getProgressKey } from "./evaluator.js";
import cpData from "./carreras/cp.js";

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

  it("expone la clave de persistencia por carrera", () => {
    expect(getProgressKey("cp")).toBe("sociales-map:cp");
    expect(getProgressKey("sociologia")).toBe("sociales-map:sociologia");
  });
});
