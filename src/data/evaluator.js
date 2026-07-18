export function getProgressKey(carreraId) {
  return `sociales-map:${carreraId}`;
}

export function migrateProgress(carreraId, oldKey = "cp8558_progreso_v1") {
  const key = getProgressKey(carreraId);
  const rawNew = localStorage.getItem(key);
  if (rawNew) {
    return parseProgress(rawNew);
  }

  const rawOld = localStorage.getItem(oldKey);
  if (!rawOld) {
    return null;
  }

  const progress = parseProgress(rawOld);
  if (!progress) {
    return null;
  }

  localStorage.setItem(key, JSON.stringify(progress));
  return progress;
}

// Parsea el progreso guardado a la forma canónica { a, o, n }.
// MIGRACIÓN ADITIVA: los formatos viejos (array suelto, { a, o } sin notas,
// y la legacyKey de CP) se leen sin perder nada; `n` arranca en {} cuando no
// existía. Nunca descarta `a` ni `o`.
export function parseProgress(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { a: parsed, o: null, n: {} };
    }
    if (parsed && typeof parsed === "object") {
      return {
        a: Array.isArray(parsed.a) ? parsed.a : [],
        o: parsed.o ?? null,
        n: parsed.n && typeof parsed.n === "object" ? parsed.n : {},
      };
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Junta todas las notas cargadas en un solo array de números. Una entrada de
// `n` es un número (materia común) o un array (tarjeta-grupo: una nota por
// cupo, con huecos null en los cupos sin cargar). Solo cuentan los números:
// un grupo aprobado con 2 de 6 notas aporta 2, igual que una materia común
// sin nota aporta 0. Cero magia.
export function collectNotas(n) {
  const vals = [];
  for (const v of Object.values(n || {})) {
    if (typeof v === "number" && Number.isFinite(v)) {
      vals.push(v);
    } else if (Array.isArray(v)) {
      for (const x of v) {
        if (typeof x === "number" && Number.isFinite(x)) vals.push(x);
      }
    }
  }
  return vals;
}

// Media simple de las notas cargadas. Devuelve null si no hay ninguna (para
// que el promedio sea invisible en estado vacío).
export function averageOf(n) {
  const vals = collectNotas(n);
  if (!vals.length) return null;
  return vals.reduce((acc, v) => acc + v, 0) / vals.length;
}

// Valida y normaliza una nota tipeada: número 4–10 con hasta 2 decimales.
// Fuera de rango, vacío o basura → null (no cuenta / borra la nota).
export function normalizeNota(raw) {
  if (raw === "" || raw == null) return null;
  const v = Number(raw);
  if (!Number.isFinite(v)) return null;
  if (v < 4 || v > 10) return null;
  return Math.round(v * 100) / 100;
}

export function countGeneral(okSet, generalIds) {
  return generalIds.reduce((count, id) => count + (okSet.has(id) ? 1 : 0), 0);
}

export function getAllIds(plan) {
  return [
    ...plan.general.map((it) => it.id),
    ...plan.idioma.map((it) => it.id),
    ...plan.orientado.map((it) => it.id),
  ];
}

export function getSubjectStatus(subject, okSet, context) {
  if (okSet.has(subject.id)) {
    return "ok";
  }

  const requirements = buildRequirements(subject);
  const satisfied = requirements.every((requirement) => evaluateRequirement(requirement, okSet, context));
  return satisfied ? "go" : "no";
}

export function buildRequirements(subject) {
  const requirements = [];
  if (Array.isArray(subject.req)) {
    requirements.push(...subject.req);
  }
  if (typeof subject.min === "number") {
    requirements.push({ min: subject.min, of: "general" });
  }
  if (typeof subject.countdown === "number") {
    requirements.push({ countdown: subject.countdown });
  }
  return requirements;
}

export function evaluateRequirement(requirement, okSet, context) {
  if (typeof requirement === "string") {
    return okSet.has(requirement);
  }

  if (!requirement || typeof requirement !== "object") {
    return true;
  }

  if (Array.isArray(requirement)) {
    return requirement.every((item) => evaluateRequirement(item, okSet, context));
  }

  if (requirement.or) {
    return requirement.or.some((item) => evaluateRequirement(item, okSet, context));
  }

  if (requirement.and) {
    return requirement.and.every((item) => evaluateRequirement(item, okSet, context));
  }

  if (requirement.orientation === true) {
    if (context.orientation) {
      return okSet.has(context.orientation);
    }
    return Array.isArray(context.orientationIds)
      ? context.orientationIds.some((id) => okSet.has(id))
      : false;
  }

  if (typeof requirement.min === "number") {
    const items = getCountItems(requirement, context);
    const satisfied = items.filter((item) => evaluateRequirement(item, okSet, context)).length;
    const includes = Array.isArray(requirement.includes) ? requirement.includes : [];
    return satisfied >= requirement.min && includes.every((item) => evaluateRequirement(item, okSet, context));
  }

  if (typeof requirement.countdown === "number") {
    return context.remainingCount <= requirement.countdown;
  }

  return false;
}

export function getCountItems(requirement, context) {
  if (requirement.of === "general") {
    return context.generalIds.map((id) => id);
  }
  if (Array.isArray(requirement.of) && requirement.of.length > 0) {
    return requirement.of;
  }
  return context.generalIds.map((id) => id);
}

export function extractDirectIds(requirement) {
  if (typeof requirement === "string") {
    return [requirement];
  }
  if (!requirement || typeof requirement !== "object") {
    return [];
  }
  if (Array.isArray(requirement)) {
    return requirement.flatMap((item) => extractDirectIds(item));
  }
  if (requirement.or) {
    return requirement.or.flatMap((item) => extractDirectIds(item));
  }
  if (requirement.and) {
    return requirement.and.flatMap((item) => extractDirectIds(item));
  }
  if (Array.isArray(requirement.includes)) {
    return requirement.includes.flatMap((item) => extractDirectIds(item));
  }
  return [];
}

export function renderRequirementSummary(requirement, labelForId) {
  if (typeof requirement === "string") {
    return labelForId(requirement);
  }
  if (!requirement || typeof requirement !== "object") {
    return "";
  }
  if (Array.isArray(requirement)) {
    return requirement.map((item) => renderRequirementSummary(item, labelForId)).filter(Boolean).join(" · ");
  }
  if (requirement.or) {
    return `(${requirement.or.map((item) => renderRequirementSummary(item, labelForId)).filter(Boolean).join(" ó ")})`;
  }
  if (requirement.and) {
    return requirement.and.map((item) => renderRequirementSummary(item, labelForId)).filter(Boolean).join(" · ");
  }
  if (typeof requirement.min === "number") {
    const includes = Array.isArray(requirement.includes) ? requirement.includes : [];
    const includeText = includes.map((item) => renderRequirementSummary(item, labelForId)).filter(Boolean).join(" y ");
    return `al menos ${requirement.min} materias${includeText ? ` incluyendo ${includeText}` : ""}`;
  }
  if (typeof requirement.countdown === "number") {
    return `cuando falten ${requirement.countdown} materias para el título`;
  }
  return "";
}

export function getPlanItemIds(plan) {
  return [...new Set(getAllIds(plan))];
}
