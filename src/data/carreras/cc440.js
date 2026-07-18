/* ============================================================
   CIENCIAS DE LA COMUNICACIÓN · UBA Sociales — PLAN 440/90
   DATA DE CORRELATIVAS · Estado: VERIFICADA contra fuentes
   oficiales · pendiente de auditoría de Franco.

   PLAN: Res. (CS) Nº 440/90 ("plan viejo" / "plan 440").
   CORRELATIVIDADES: Res. Nº 5396/09.
   VIGENCIA: plan A EXTINGUIR. Desde 2024 rige el plan 504/23
   (Res. CS 504/2023) para ingresantes. Permanecen en el 440:
   quienes tenían más de 24 aprobadas al cambio, y quienes con
   6-24 optaron por quedarse. Reincorporaciones van al plan
   nuevo salvo 28+ aprobadas (sin contar idioma) o deber solo
   la tesina (o tesina + una materia).

   FUENTES (consultadas 14/07/2026):
   1. Página oficial de correlatividades de la carrera
      ("Correlatividades establecidas en la Resolución Nº 5396/09"):
      https://comunicacion.sociales.uba.ar/correlatividades/
   2. Página oficial del plan de estudios, pestaña "Plan 440-90"
      (segunda transcripción independiente del mismo régimen):
      https://comunicacion.sociales.uba.ar/plan-de-estudios/
   3. Texto del plan Res. 440/90 (estructura, orientaciones, tesina):
      https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2013/03/plan-de-estudios-vigente.pdf
      (¡ojo!: el archivo se llama "vigente" pero es el plan viejo)
   4. Reglas de transición al plan nuevo (pase, reincorporación):
      https://comunicacion.sociales.uba.ar/plan-nuevo-pase-y-recomendaciones/

   VERIFICACIÓN: cotejo programático entre las transcripciones
   de las fuentes 1 y 2 — tronco 101-126: 26/26 idénticas; grafo
   sin ciclos; arranque = las 11 materias con requisito CBC.

   TABLA OFICIAL TRANSCRIPTA (Res. 5396/09 · tronco común):
   ------------------------------------------------------------
   101 Teorías y prácticas de la comunicación I           CBC
   102 Semiótica I (de los géneros contemporáneos)        CBC
   103 Principales corrientes del pensamiento contemp.    CBC
   104 Metodología y técnicas de la investigación social  CBC
   105 Historia social general I                          CBC
   106 Antropología social y cultural                     CBC
   107 Taller de expresión I                              CBC
   108 Taller de radiofonía (módulo radio)                CBC
   109 Historia social argentina y latinoamericana II     105
   110 Teorías y prácticas de la comunicación II          101·106
   111 Elementos de economía y concepciones del desarr.   CBC
   112 Semiótica II (semiótica de los medios)             102
   113 Derecho a la información                           CBC
   114 Historia general de los medios y sist. de comunic. 105
   115 Taller de introducción a la informática...         101
   116 Taller de expresión II (audiovisual)               CBC
   117 Psicología y comunicación                          102·112
   118 Teorías y prácticas de la comunicación III         101·102·104·106·110·112
   119 Políticas y planificación de la comunicación       113·105·114
   120 Seminario de diseño gráfico y publicidad           101·102·112
   121 Seminario de cultura popular y cultura masiva      101·106·110
   122 Seminario de informática y sociedad                101·106·110
   123 Taller de expresión III                            107·108·116
   124 Taller de comunicación comunitaria                 107
   125 Taller de comunicación publicitaria                107
   126 Taller de comunicación periodística                107
   --- Orientaciones (todas sus materias) ----------------------
   Gate común: 14 aprobadas incluyendo 107 y (124 ó 125 ó 126)
   Políticas y Planificación: además la 119                [★a]
   --- Idiomas -------------------------------------------------
   Nivel I (inglés 991 / francés 994 / italiano 997): CBC y 6 materias
   Niveles II y III: encadenados por idioma

   NOTAS DE INTERPRETACIÓN:
   [★a] La página oficial de correlatividades (fuente 1, la que
        lleva el número de la Res. 5396/09 en el título) exige
        para la orientación Políticas y Planificación "14
        incluyendo 107, 119 y (124 ó 125 ó 126)". La página del
        plan (fuente 2) omite la 119 para esa orientación.
        Se adopta la fuente 1 (más específica y pedagógicamente
        consistente: la orientación continúa la materia 119 del
        tronco). Confianza media: confirmar contra SIU.
   [★b] Sociología de la Educación (orientación Comunicación y
        Procesos Educativos): cód. 551 en fuente 1, 511 en
        fuente 2. Se adopta 551 (fuente 1). El código no afecta
        el grafo; confirmar contra SIU/oferta.
   [c]  La "Optativa o seminario" de cada orientación se modela
        como cupo genérico con el mismo gate de la orientación
        (así figura en la tabla oficial). Periodismo permite
        elegir Historia del Arte..., una materia de otra
        orientación o un seminario; Procesos Educativos y
        Políticas y Planificación llevan DOS cupos optativos;
        las demás, uno.
   [d]  Idiomas: la tabla 5396/09 lista inglés, francés e
        italiano (códs. 991-999). El texto del plan de 1985
        mencionaba también alemán; se adopta la tabla de
        correlatividades vigente para el 440 (3 idiomas).
   [e]  Tesina: se realiza en el ámbito del Taller de la
        orientación; sin umbral numérico propio → hito
        informativo, no cuenta como materia.
   [f]  Profesorado (códs. 10520-20501): fuera de alcance del
        mapa de la licenciatura; queda anotado por si se suma.
   [g]  Cuenta del título: 26 tronco + 6 de una orientación =
        32 materias; + 3 niveles de idioma (no cuentan en las
        32); + tesina.
   ============================================================ */

/* ---- MAPEO AL MOTOR (agregado al entrar al repo) --------------
   La data verificada de arriba entra intacta: ids, cod, nombres,
   req, umbrales y comentarios se conservan tal cual. Cambia solo
   el NOMBRE de los campos, para hablar el mismo idioma que
   cp.js / rt.js / ts.js / socio.js (ver src/data/SCHEMA.md):

     nombre → n            (nombre completo, valor idéntico)
     materias → TRONCO · orientaciones → ORIENTACIONES + ORIENTADO
     idioma { niveles: 3 } → IDIOMA (3 niveles encadenados) [d]
     hitos → (infoPill de la Tesina, se arma en ui.js) [e]
     notaPie → NOTA_PIE (lo consume el footer en ui.js)
     totalMaterias → TOTAL_MATERIAS (26 tronco + 6 orient. = 32) [g]

   MAPEO del gate de orientación (umbral intacto, otra forma):
     El régimen pone el gate UNA vez ("14 incluyendo 107 y un
     taller"); el motor lo pide POR MATERIA. Se define el umbral
     como constante GATE y se referencia en el req de cada materia
     de orientación. Políticas y Planificación usa GATE_PYP, que
     suma la 119 [★a]. Es el mismo umbral, distribuido 1:1.

   Campos AGREGADOS (presentación, no son data de la resolución):
     s   = nombre corto para las metalíneas de las tarjetas. El
           motor lo exige; el archivo raíz no lo traía. Escritos a
           mano, mismo criterio que las otras carreras. AUDITAR.
     id  = clave del motor. El tronco ya la traía; las materias de
           orientación NO (la resolución las lista por cód/nombre):
           se generan con prefijo de orientación (per_/cpe_/opp_/
           ccom_/pyp_) para que sean únicas en el grafo (varias
           orientaciones comparten cód, p. ej. 221 y 139).
     ori = a qué orientación pertenece la tarjeta (filtra la grilla
           y el conteo de la barra; patrón selector). AGREGADO.
   -------------------------------------------------------------- */

const NOMBRE = "Cs. de la Comunicación · Plan 440/90";
const TITULO = "Licenciatura en Ciencias de la Comunicación";
const PLAN = "Res. (CS) Nº 440/90 — a extinguir (desde 2024 rige el 504/23 para ingresantes)";
const REGIMEN_CORRELATIVAS = "Res. Nº 5396/09";

const NOTA_PIE =
  "Plan a extinguir: aplica a quienes permanecieron en el plan 440 tras la reforma de 2023. Las correlativas de la tabla se exigen aprobadas según el régimen de la Res. 5396/09.";

// Tronco común: 26 materias (orden de la tabla oficial 101→126)
const TRONCO = [
  { id: "tpc1", cod: 101, n: "Teorías y prácticas de la comunicación I",              s: "TyPC I",              anual: true, req: [] },
  { id: "sem1", cod: 102, n: "Semiótica I (de los géneros contemporáneos)",           s: "Semiótica I",         anual: true, req: [] },
  { id: "pcpc", cod: 103, n: "Principales corrientes del pensamiento contemporáneo",  s: "Ppales. Corrientes",  req: [] },
  { id: "meto", cod: 104, n: "Metodología y técnicas de la investigación social",     s: "Metodología",         req: [] },
  { id: "hsg1", cod: 105, n: "Historia social general I",                             s: "H. Social General I", req: [] },
  { id: "antr", cod: 106, n: "Antropología social y cultural",                        s: "Antropología",        req: [] },
  { id: "te1",  cod: 107, n: "Taller de expresión I",                                 s: "T. Expresión I",      anual: true, req: [] },
  { id: "trad", cod: 108, n: "Taller de radiofonía (módulo radio)",                   s: "T. Radiofonía",       req: [] },
  { id: "hsal", cod: 109, n: "Historia social argentina y latinoamericana II",        s: "H. Soc. Arg. y Lat.", req: ["hsg1"] },
  { id: "tpc2", cod: 110, n: "Teorías y prácticas de la comunicación II",             s: "TyPC II",             req: ["tpc1", "antr"] },
  { id: "econ", cod: 111, n: "Elementos de economía y concepciones del desarrollo",   s: "Elem. de Economía",   req: [] },
  { id: "sem2", cod: 112, n: "Semiótica II (semiótica de los medios)",                s: "Semiótica II",        req: ["sem1"] },
  { id: "dinf", cod: 113, n: "Derecho a la información",                              s: "Derecho a la Inf.",   req: [] },
  { id: "hmed", cod: 114, n: "Historia general de los medios y sistemas de comunicación", s: "H. de los Medios", req: ["hsg1"] },
  { id: "tinf", cod: 115, n: "Taller de introducción a la informática, a la telemática y al procesamiento de datos", s: "T. de Informática", req: ["tpc1"] },
  { id: "te2",  cod: 116, n: "Taller de expresión II (audiovisual)",                  s: "T. Expresión II",     anual: true, req: [] },
  { id: "psic", cod: 117, n: "Psicología y comunicación",                             s: "Psico. y Comunic.",   req: ["sem1", "sem2"] },
  { id: "tpc3", cod: 118, n: "Teorías y prácticas de la comunicación III",            s: "TyPC III",            req: ["tpc1", "sem1", "meto", "antr", "tpc2", "sem2"] },
  { id: "pypc", cod: 119, n: "Políticas y planificación de la comunicación",          s: "Pol. y Planif.",      req: ["dinf", "hsg1", "hmed"] },
  { id: "sdgp", cod: 120, n: "Seminario de diseño gráfico y publicidad",              s: "Sem. Diseño Gráfico", req: ["tpc1", "sem1", "sem2"] },
  { id: "scpm", cod: 121, n: "Seminario de cultura popular y cultura masiva",         s: "Sem. Cult. Popular",  req: ["tpc1", "antr", "tpc2"] },
  { id: "sinf", cod: 122, n: "Seminario de informática y sociedad",                   s: "Sem. Inf. y Soc.",    req: ["tpc1", "antr", "tpc2"] },
  { id: "te3",  cod: 123, n: "Taller de expresión III",                               s: "T. Expresión III",    anual: true, req: ["te1", "trad", "te2"] },
  { id: "tcc",  cod: 124, n: "Taller de comunicación comunitaria",                    s: "T. Com. Comunitaria", req: ["te1"] },
  { id: "tcpu", cod: 125, n: "Taller de comunicación publicitaria",                   s: "T. Com. Publicitaria", req: ["te1"] },
  { id: "tcpe", cod: 126, n: "Taller de comunicación periodística",                   s: "T. Com. Periodística", req: ["te1"] },
];

// Gate común de las orientaciones (evaluador: umbral con inclusión + grupo OR).
// "Tener aprobadas 14 materias incluyendo 107 y (124 ó 125 ó 126)".
const GATE = { min: 14, of: "general", includes: ["te1", { or: ["tcc", "tcpu", "tcpe"] }] };
// Políticas y Planificación: el mismo gate + la 119 (pypc) [★a].
const GATE_PYP = { min: 14, of: "general", includes: ["te1", { or: ["tcc", "tcpu", "tcpe"] }, "pypc"] };

// Cabeceras del selector (una orientación a elegir). No son materias:
// no hay cabecera que aprobar, el ingreso es por umbral (GATE).
const ORIENTACIONES = [
  { id: "per",  label: "Periodismo",                            s: "Periodismo" },
  { id: "cpe",  label: "Comunicación y Procesos Educativos",    s: "Procesos Educativos" },
  { id: "opp",  label: "Opinión Pública y Publicidad",          s: "Opinión Pública" },
  { id: "ccom", label: "Comunicación Comunitaria",              s: "Com. Comunitaria" },
  { id: "pyp",  label: "Políticas y Planificación",             s: "Pol. y Planif.", nota: "★ pide además Pol. y planificación (119)" },
];

// Materias de las orientaciones (6 c/u). Se muestran/cuentan solo las
// de la orientación elegida (campo `ori`). Todas gatean por GATE
// (pyp por GATE_PYP). Los cupos "Optativa o seminario" son tarjetas
// genéricas con su comentario del archivo [c].
const ORIENTADO = [
  // —— Periodismo ——
  { id: "per_tsp",  cod: 127, ori: "per", n: "Teorías sobre el periodismo",                 s: "Teorías del Periodismo", req: [GATE] },
  { id: "per_pap1", cod: 128, ori: "per", n: "Planificación de la actividad periodística I", s: "Planif. Period. I",      req: [GATE] },
  { id: "per_pap2", cod: 129, ori: "per", n: "Planificación de la actividad periodística II", s: "Planif. Period. II",    req: [GATE] },
  { id: "per_dip",  cod: 130, ori: "per", n: "Diseño de la información periodística",         s: "Diseño Info. Period.",   req: [GATE] },
  { id: "per_opt",  ori: "per", optativa: true, n: "Optativa o seminario", s: "Optativa/Seminario", req: [GATE],
    nota: "Historia del Arte y su relación con los medios, una materia de otra orientación, o un seminario optativo. [c]" },
  { id: "per_tall", cod: 132, ori: "per", anual: true, n: "Taller de orientación en periodismo", s: "Taller de Periodismo", req: [GATE] },

  // —— Comunicación y Procesos Educativos ——
  { id: "cpe_cyed",  cod: 221, ori: "cpe", n: "Comunicación y educación",       s: "Com. y Educación",      req: [GATE] },
  { id: "cpe_socedu", cod: 551, ori: "cpe", n: "Sociología de la educación",    s: "Socio. de la Educ.",    req: [GATE] }, // [★b]
  { id: "cpe_tecedu", cod: 135, ori: "cpe", n: "Tecnologías educativas",        s: "Tec. Educativas",       req: [GATE] },
  { id: "cpe_opt1",  ori: "cpe", optativa: true, n: "Optativa o seminario (1 de 2)", s: "Optativa/Sem. 1", req: [GATE],
    nota: "Combinaciones: 2 de {Análisis institucional, Teoría y técnicas de grupo, Metodología del planeamiento en comunicación}; o 1 de esas + 1 seminario; o 2 seminarios. [c]" },
  { id: "cpe_opt2",  ori: "cpe", optativa: true, n: "Optativa o seminario (2 de 2)", s: "Optativa/Sem. 2", req: [GATE] },
  { id: "cpe_tall",  cod: 140, ori: "cpe", anual: true, n: "Taller de orientación en comunicación y procesos educativos", s: "Taller Proc. Educ.", req: [GATE] },

  // —— Opinión Pública y Publicidad ——
  { id: "opp_com",  cod: 141, ori: "opp", n: "Comercialización",                              s: "Comercialización",  req: [GATE] },
  { id: "opp_plm",  cod: 143, ori: "opp", n: "Planificación de medios",                       s: "Planif. de Medios", req: [GATE] },
  { id: "opp_tiop", cod: 144, ori: "opp", n: "Técnicas de investigación en opinión pública y mercado", s: "Téc. Op. Pública", req: [GATE] },
  { id: "opp_camp", cod: 230, ori: "opp", n: "Campañas publicitarias",                        s: "Campañas Public.",  req: [GATE] },
  { id: "opp_opt",  ori: "opp", optativa: true, n: "Optativa o seminario", s: "Optativa/Seminario", req: [GATE],
    nota: "Una materia de otra orientación o un seminario optativo. [c]" },
  { id: "opp_tall", cod: 145, ori: "opp", anual: true, n: "Taller de orientación en opinión pública y publicidad", s: "Taller Op. Pública", req: [GATE] },

  // —— Comunicación Comunitaria ——
  { id: "ccom_prom", cod: 146, ori: "ccom", n: "Promoción de las actividades comunitarias",   s: "Prom. Comunitaria", req: [GATE] },
  { id: "ccom_ai",   cod: 137, ori: "ccom", n: "Análisis institucional",                      s: "Análisis Instituc.", req: [GATE] },
  { id: "ccom_mpc",  cod: 139, ori: "ccom", n: "Metodología del planeamiento en comunicación", s: "Metod. Planeam.",   req: [GATE] },
  { id: "ccom_cyed", cod: 221, ori: "ccom", n: "Comunicación y educación",                    s: "Com. y Educación",  req: [GATE] },
  { id: "ccom_opt",  ori: "ccom", optativa: true, n: "Optativa o seminario", s: "Optativa/Seminario", req: [GATE],
    nota: "Una materia de otra orientación o un seminario optativo. [c]" },
  { id: "ccom_tall", cod: 147, ori: "ccom", anual: true, n: "Taller de orientación en comunicación y promoción comunitaria", s: "Taller Com. Comunit.", req: [GATE] },

  // —— Políticas y Planificación de la Comunicación (gate + 119) [★a] ——
  { id: "pyp_mpc", cod: 139, ori: "pyp", n: "Metodología del planeamiento en comunicación", s: "Metod. Planeam.",   req: [GATE_PYP] },
  { id: "pyp_tep", cod: 148, ori: "pyp", n: "Teorías del estado y la planificación",         s: "T. del Estado",     req: [GATE_PYP] },
  { id: "pyp_lc",  cod: 149, ori: "pyp", n: "Legislación comparada",                         s: "Legisl. Comparada", req: [GATE_PYP] },
  { id: "pyp_opt1", ori: "pyp", optativa: true, n: "Optativa o seminario (1 de 2)", s: "Optativa/Sem. 1", req: [GATE_PYP],
    nota: "Economía de la información + 1 seminario; o 2 seminarios. [c]" },
  { id: "pyp_opt2", ori: "pyp", optativa: true, n: "Optativa o seminario (2 de 2)", s: "Optativa/Sem. 2", req: [GATE_PYP] },
  { id: "pyp_tall", cod: 154, ori: "pyp", anual: true, n: "Taller de orientación en políticas y planificación de la comunicación", s: "Taller Pol. y Planif.", req: [GATE_PYP] },
];

// Idiomas: 3 niveles de UN idioma (inglés / francés / italiano) [d].
// Nivel I con 6 materias del tronco aprobadas (patrón RT); II y III encadenados.
const IDIOMA = [
  { id: "idi1", n: "Idioma · Nivel I",   s: "Idioma I",   req: [], min: 6 },
  { id: "idi2", n: "Idioma · Nivel II",  s: "Idioma II",  req: ["idi1"] },
  { id: "idi3", n: "Idioma · Nivel III", s: "Idioma III", req: ["idi2"] },
];

const IDIOMA_COMENTARIO =
  "Nivel I (991/994/997) pide CBC y 6 materias aprobadas; II y III encadenados. Tres niveles de un mismo idioma (inglés, francés o italiano).";

// Hito informativo: tesina en el taller de la orientación [e].
// Sin umbral numérico propio → pill informativa, no cuenta como materia.
const TESINA = {
  id: "tesina",
  n: "Tesina",
  comentario:
    "Se realiza en el ámbito del Taller de la orientación, con apoyos pedagógicos. Sin umbral numérico propio: pill informativa.",
};

// 26 tronco + 6 de la orientación elegida = 32. Idioma y tesina por fuera. [g]
const TOTAL_MATERIAS = 32;

export {
  NOMBRE,
  TITULO,
  PLAN,
  REGIMEN_CORRELATIVAS,
  NOTA_PIE,
  TRONCO,
  GATE,
  GATE_PYP,
  ORIENTACIONES,
  ORIENTADO,
  IDIOMA,
  IDIOMA_COMENTARIO,
  TESINA,
  TOTAL_MATERIAS,
};
