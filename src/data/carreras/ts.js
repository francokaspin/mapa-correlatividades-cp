/* ============================================================
   TRABAJO SOCIAL · UBA Sociales — DATA DE CORRELATIVAS
   Plan de estudios Res. (CS) N° 5962/2012 — VIGENTE.
   Estado: VERIFICADA contra fuentes oficiales · pendiente de
   auditoría de Franco antes de entrar al repo.

   FUENTES (consultadas 14/07/2026):
   1. Cuadro oficial de correlatividades de la carrera (imagen,
      publicado 2023, vigente hoy en la página oficial):
      https://trabajosocial.sociales.uba.ar/correlatividades/
      → wp-content/uploads/sites/13/2023/10/Cuadro-de-correlatividades-01.jpg
   2. Resolución (CS) N° 5962/2012 (EXP-UBA 28.643/2012), tablas de
      correlatividades en págs. 23-27 del PDF oficial:
      https://trabajosocial.sociales.uba.ar/wp-content/uploads/sites/13/2016/03/Resolucion-CS-Plan-5962-2012.pdf
   3. Estructura del plan (inventario de trayectos y materias):
      https://trabajosocial.sociales.uba.ar/plan-de-estudios/
   Verificación: cuadro leído por cuadrantes + OCR + zoom quirúrgico
   en celdas ambiguas; cotejado programáticamente número por número
   (33/33, sin ciclos) y cruzado contra la Resolución.

   ⚠ TRAMPA DETECTADA Y DESCARTADA: el PDF "Plan-de-estudios.pdf"
   (upload 2016) que sigue online corresponde al PLAN VIEJO
   (materias "Trabajo Social I-II", "Metodología I-IV", "Niveles de
   Intervención") y NO coincide con el ejemplo de la propia página
   oficial. No usar como fuente.

   ── CUADRO OFICIAL (fuente 1) transcripto para auditar ─────────
   El n° entre paréntesis = materias que hay que tener CURSADAS.
   N° | Materia                                        | Requiere
    1 | Epistemología de las Ciencias Sociales         | CBC
    2 | Historia Social Argentina                      | CBC
    3 | Fundamentos e Historia del Trabajo Social I    | CBC
    4 | Sociología II                                  | CBC
    5 | Taller I (anual)                               | CBC
    6 | Economía Política                              | CBC
    7 | Metodología de la Investigación I              | 1
    8 | Fundamentos e Historia del Trabajo Social II   | 3
    9 | Estado y Políticas Públicas                    | CBC
   10 | Psicología Institucional                       | CBC
   11 | Metodología de la Investigación II             | 7
   12 | Problemas Sociales Argentinos                  | 2, 6
   13 | Trabajo Social, Territorio y Comunidad         | 8, 6, 9
   14 | Taller II (anual)                              | 5, 3, 7
   15 | Antropología Social I                          | CBC
   16 | Política Social                                | 9, 12
   17 | Trabajo Social y Planificación Social          | 8, 9
   18 | Trabajo Social, Procesos Grupales e Instituc.  | 8, 7
   19 | Teoría Social Latinoamericana                  | 4, 12
   20 | Estudios Socio-demográficos                    | 11, 9   [★]
   21 | Dimensión Instrumental del Trabajo Social      | 8
   22 | Filosofía Social                               | 10
   23 | Taller III (anual)                             | 13, 14, 17
   24 | Psicología del Desarrollo y la Subjetividad    | 3
   25 | Trabajo Social, Familias y Vida Cotidiana      | 8, 15
   26 | Planificación en Escenarios Reg. y Nacionales  | 20, 17
   27 | Materia Electiva 1                             | 12, 14
   28 | Derecho                                        | 3, 14
   29 | Seminario de Investigación Final               | 15, 20, 23  [★]
   30 | Materia Optativa                               | 12, 14  [★]
   31 | Taller IV (anual)                              | 23, 16, 21, 25
   32 | Antropología Social II                         | 15
   33 | Materia Electiva 2                             | 12, 14
   ────────────────────────────────────────────────────────────────
   [★] = celdas de confianza media: el cuadro 2023 es nítido pero el
   escaneo de la Res. es ambiguo justo ahí (p.ej. en la n°20 la Res.
   podría leerse "Metodología I"; el cuadro dice 11 = Metodología II).
   Se codificó lo que dice el cuadro (comunicación oficial vigente).
   Ideal: que un/a estudiante de TS las confirme contra SIU Guaraní.

   NOTAS DE INTERPRETACIÓN (auditar):
   a) Régimen "blando": acá las correlativas piden la materia CURSADA
      (regularizada), no aprobada con final — lo dice la página
      oficial. Mismo criterio de marcado que CP.
   b) Idioma: 3 niveles, inglés O portugués (solo esas dos opciones).
      Nivel I con 6 materias aprobadas (régimen de la facultad).
   c) Tesina de grado (TIF): requisito final del título. Sus
      requisitos operativos están en el reglamento de TIF (no en el
      cuadro), así que va como HITO informativo, sin gate inventado.
   d) Aliases: la página del plan llama "Pensamiento Social
      Latinoamericano" a la n°19 y "Trabajo Social y Planificación"
      a la n°17; el cuadro usa los nombres de esta tabla. Usamos el
      cuadro (es lo que ven los estudiantes).
   e) Existe un régimen ESPECIAL para "optantes plan 5962-2012"
      (cohortes del plan viejo que optaron pasarse). Fuera de
      alcance: no se modela.
   f) Reforma en discusión (2024-): al 14/07/2026 el plan publicado
      como vigente por la carrera sigue siendo Res. 5962/2012.

   Campos: mismo formato que cp.js/rt.js; si SCHEMA.md usa otros
   nombres, mapear 1:1 SIN tocar el contenido. `anual: true` marca
   los talleres (dato de display).
   ============================================================ */

const MATERIAS = [
  // —— arranque (solo CBC) ——
  { id: "fhts1",  nro: 3,  n: "Fundamentos e Historia del Trabajo Social I", s: "Fundamentos I", req: [] },
  { id: "epi",    nro: 1,  n: "Epistemología de las Ciencias Sociales", s: "Epistemología", req: [] },
  { id: "soc2",   nro: 4,  n: "Sociología II", s: "Sociología II", req: [] },
  { id: "hsa",    nro: 2,  n: "Historia Social Argentina", s: "H. Social Argentina", req: [] },
  { id: "ecopol", nro: 6,  n: "Economía Política", s: "Eco. Política", req: [] },
  { id: "eypp",   nro: 9,  n: "Estado y Políticas Públicas", s: "Estado y Pol. Públicas", req: [] },
  { id: "psinst", nro: 10, n: "Psicología Institucional", s: "Psico. Institucional", req: [] },
  { id: "antro1", nro: 15, n: "Antropología Social I", s: "Antropología I", req: [] },
  { id: "tal1",   nro: 5,  n: "Taller Nivel I", s: "Taller I", req: [], anual: true },
  // —— cadena Trabajo Social ——
  { id: "fhts2",  nro: 8,  n: "Fundamentos e Historia del Trabajo Social II", s: "Fundamentos II", req: ["fhts1"] },
  { id: "tsplan", nro: 17, n: "Trabajo Social y Planificación Social", s: "TS y Planificación", req: ["fhts2", "eypp"] },
  { id: "grupos", nro: 18, n: "Trabajo Social, Procesos Grupales e Institucionales", s: "TS Grupos e Instituciones", req: ["fhts2", "met1"] },
  { id: "terr",   nro: 13, n: "Trabajo Social, Territorio y Comunidad", s: "TS Territorio", req: ["fhts2", "ecopol", "eypp"] },
  { id: "familias", nro: 25, n: "Trabajo Social, Familias y Vida Cotidiana", s: "TS Familias", req: ["fhts2", "antro1"] },
  { id: "dimins", nro: 21, n: "Dimensión Instrumental del Trabajo Social", s: "Dim. Instrumental", req: ["fhts2"] },
  // —— metodología e investigación ——
  { id: "met1",   nro: 7,  n: "Metodología de la Investigación I", s: "Metodología I", req: ["epi"] },
  { id: "met2",   nro: 11, n: "Metodología de la Investigación II", s: "Metodología II", req: ["met1"] },
  { id: "sociodem", nro: 20, n: "Estudios Socio-demográficos", s: "Sociodemográficos", req: ["met2", "eypp"] },
  { id: "planesc", nro: 26, n: "Planificación en Escenarios Regionales y Nacionales", s: "Planif. en Escenarios", req: ["sociodem", "tsplan"] },
  // —— socio-histórico-político ——
  { id: "psa",    nro: 12, n: "Problemas Sociales Argentinos", s: "Problemas Soc. Arg.", req: ["hsa", "ecopol"] },
  { id: "polsoc", nro: 16, n: "Política Social", s: "Política Social", req: ["eypp", "psa"] },
  { id: "tsl",    nro: 19, n: "Teoría Social Latinoamericana", s: "T. Social Latinoam.", req: ["soc2", "psa"] },
  { id: "antro2", nro: 32, n: "Antropología Social II", s: "Antropología II", req: ["antro1"] },
  // —— formación general ——
  { id: "filsoc", nro: 22, n: "Filosofía Social", s: "Filosofía Social", req: ["psinst"] },
  { id: "psdes",  nro: 24, n: "Psicología del Desarrollo y la Subjetividad", s: "Psico. del Desarrollo", req: ["fhts1"] },
  { id: "der",    nro: 28, n: "Derecho", s: "Derecho", req: ["fhts1", "tal2"] },
  // —— talleres (anuales) y cierre ——
  { id: "tal2",   nro: 14, n: "Taller Nivel II", s: "Taller II", req: ["tal1", "fhts1", "met1"], anual: true },
  { id: "tal3",   nro: 23, n: "Taller Nivel III", s: "Taller III", req: ["terr", "tal2", "tsplan"], anual: true },
  { id: "tal4",   nro: 31, n: "Taller Nivel IV", s: "Taller IV", req: ["tal3", "polsoc", "dimins", "familias"], anual: true },
  { id: "semfin", nro: 29, n: "Seminario de Investigación Final", s: "Seminario Final", req: ["antro1", "sociodem", "tal3"] },
  // —— electivas y optativa ——
  { id: "ele1",   nro: 27, n: "Materia electiva 1", s: "Electiva 1", req: ["psa", "tal2"] },
  { id: "ele2",   nro: 33, n: "Materia electiva 2", s: "Electiva 2", req: ["psa", "tal2"] },
  { id: "opt1",   nro: 30, n: "Materia optativa", s: "Optativa", req: ["psa", "tal2"] },
];

// Idioma: 3 niveles, inglés o portugués. Nivel I con 6 materias
// aprobadas (régimen de la facultad).
const IDIOMA = [
  { id: "idi1", n: "Idioma · Nivel I (inglés o portugués)", s: "Idioma I", req: [], min: 6 },
  { id: "idi2", n: "Idioma · Nivel II", s: "Idioma II", req: ["idi1"] },
  { id: "idi3", n: "Idioma · Nivel III", s: "Idioma III", req: ["idi2"] },
];

// HITO informativo (ver nota c): la Tesina de grado (TIF) es el
// requisito final del título; sus condiciones operativas están en
// el reglamento de TIF, no en el cuadro de correlativas.
const HITO_TESINA = { titulo: "Tesina de grado (TIF)" };

export { MATERIAS, IDIOMA, HITO_TESINA };
