/* ============================================================
   SOCIOLOGÍA · UBA Sociales — DATA DE CORRELATIVAS
   Estado: VERIFICADA contra fuentes oficiales · pendiente de
   auditoría de Franco antes de entrar al repo.

   PLAN VIGENTE: Res. (CS) Nº 2282/88.
   RÉGIMEN DE CORRELATIVIDADES: Res. (CD) Nº 186/2024
   (RESCD-2024-186-E-UBA-DCT_FSOC, firmada 14/5/2024; aprobada por
   unanimidad en Junta el 27/3/2024 y en Consejo Directivo el
   30/4/2024; vigente desde el 2º cuatrimestre 2024).
   ¡OJO!: la tabla vieja (correlatcs.doc, Res. 1440/90 + 1161/93)
   quedó DEROGADA por este régimen. No usar.

   FUENTES (consultadas 14/07/2026):
   1. Resolución (CD) 186/2024 — texto digital firmado (GDE):
      https://sociologia.sociales.uba.ar/wp-content/uploads/sites/7/2024/05/RESCD-2024-186-E-UBA-DCT_FSOC-1.pdf
   2. Tabla oficial en la página del plan de estudios:
      https://sociologia.sociales.uba.ar/plan-de-estudios/
   3. Anuncio oficial del cambio (detalla qué cambió y por qué):
      https://sociologia.sociales.uba.ar/2024/06/19/conoce-el-nuevo-mapa-de-correlatividades-que-se-implementara-el-segundo-cuatrimestre/
   4. PNG oficial del mapa (numeración visual 1-16 + flechas):
      https://sociologia.sociales.uba.ar/wp-content/uploads/sites/7/2024/06/CORRELATIVIDADES.png
   5. Plan de estudios 2282/88 (escaneado; idioma y 200 hs):
      https://sociologia.sociales.uba.ar/wp-content/uploads/sites/7/2024/05/Plan-de-estudios-Sociologia.pdf

   VERIFICACIÓN: lectura visual del PNG por cuadrantes + OCR +
   cotejo programático triple (resolución-por-nombres vs tabla
   HTML-por-códigos vs anuncio-de-cambios aplicado a la base
   vieja reducida a aristas directas): 16/16 idénticas, los
   cambios coinciden EXACTAMENTE con los 4 anunciados, grafo sin
   ciclos, arranque = {251, 252, 253, 256}.

   TABLA OFICIAL TRANSCRIPTA (Res. CD 186/2024, para auditar):
   ------------------------------------------------------------
   251 Sociología General                        CBC
   252 Filosofía                                 CBC
   253 Historia Social Moderna y Contemporánea   CBC
   256 Economía II                               CBC
   254 Historia del Conocimiento Sociológico I   251 · 252
   255 Epistemología de las Ciencias Sociales    252
   257 Historia del Conocimiento Sociológico II  254            [b]
   259 Historia Social Latinoamericana           253 · 256
   262 Historia Social Argentina                 259
   260 Sociología Sistemática                    257
   258 Metodología I                             251 · 255 · 256 [a]
   261 Metodología II                            258
   264 Metodología III                           261
   265 Análisis de la Sociedad Argentina         262 · 254
   263 Sociología Política                       260 · 253 · 256
   266 Psicología Social                         260
   --- Optativas ----------------------------------------------
   6 Sociologías Especiales                      257 · 258
   3 Teorías Sociológicas                        260 · 258      [c]
   Seminarios/Talleres de Investigación (200 hs) 260 · 258      [c]
   Idioma (un idioma: francés o inglés)          CBC            [d]

   NOTAS DE INTERPRETACIÓN:
   [a] La resolución escribe "Epistemología de las Ciencias
       Sociales (Cód. 254)": el NOMBRE es la materia 255 y el
       código tipeado corresponde a HCS I. Resuelto por nombre:
       4 fuentes coinciden en Epistemología (el nombre en la
       propia resolución, el anuncio oficial, la tabla HTML del
       sitio y el PNG, que rotula Metodología I con "correlativas
       1, 4 y 6" = Soc. General + Economía II + Epistemología).
       El código 254 es un error de tipeo del documento.
   [b] La resolución rotula esta fila "527": error de tipeo por
       257. El nombre es inequívoco.
   [c] La resolución no distingue cursada/aprobada; la tabla del
       sitio oficial marca "(Aprobadas)" SOLO para Teorías
       Sociológicas y Horas de Investigación (258 y 260 con final
       aprobado). El vínculo es certero; el matiz aprobada-vs-
       cursada tiene confianza media [★]: confirmar contra SIU.
   [d] El plan 2282/88 exige LOS TRES NIVELES de un idioma a
       elegir entre inglés y francés (sección E del plan). El
       régimen de correlatividades le fija como requisito solo el
       CBC (Nivel I arranca sin materias previas; II y III
       encadenados por nivel).
   [e] Régimen general FSOC: la correlativa CURSADA (regularizada)
       habilita a cursar; APROBADA se exige para rendir final.
       Footer de la carrera: mismo criterio que CP/RT salvo el
       matiz [c] para Teorías y Horas de Investigación.
   [f] Orden del array = numeración visual 1-16 del PNG oficial.
   [g] Hay reforma del plan de estudios EN PROCESO (borrador 2025;
       cronograma de votación fijado para 2026). Al 14/07/2026 la
       página oficial del plan sigue publicando 2282/88 +
       Res. CD 186/2024 como vigentes, y el propio borrador prevé
       que los estudiantes actuales permanezcan en el 2282/88.
       Vigilar: si se aprueba e implementa, habrá que sumar el
       plan nuevo (convivirían ambos).
   ============================================================ */

/* ---- MAPEO AL MOTOR (agregado al entrar al repo) --------------
   La data verificada de arriba entra intacta: ids, cod, nombres,
   req, cantidades y comentarios se conservan tal cual. Lo único
   que cambia es el NOMBRE de los campos, para hablar el mismo
   idioma que cp.js / rt.js / ts.js (ver src/data/SCHEMA.md):

     nombre  → n     (nombre completo, valor idéntico)
     materias → MATERIAS · optativas → OPTATIVAS · hitos → HITOS
     idioma { niveles: 3 } → IDIOMA, expandido a los 3 niveles
                             encadenados que describe la nota [d]
     notaPie → NOTA_PIE (lo consume el footer en ui.js)
     totalMaterias → TOTAL_MATERIAS (16 + 6 + 3 = 25)

   Campo AGREGADO (presentación, no es data de la resolución):
     s = nombre corto para las metalíneas de las tarjetas
         ("Te falta: …", "Pedía: …", "Abre: …"). El motor lo exige;
         socio.js no lo traía. Abreviaturas escritas a mano, mismo
         criterio que las otras tres carreras. AUDITAR.
   -------------------------------------------------------------- */

const NOMBRE = "Sociología";
const TITULO = "Licenciatura en Sociología";
const PLAN = "Res. (CS) Nº 2282/88";
const REGIMEN_CORRELATIVAS = "Res. (CD) Nº 186/2024 — vigente desde 2º cuatrimestre 2024";

// Nota al pie (criterio general FSOC + matiz [c]):
const NOTA_PIE =
  "Las correlativas piden la materia cursada (regularizada) para cursar y aprobada para rendir final. Excepción publicada por la carrera: Teorías Sociológicas y las Horas de Investigación piden Metodología I y Sociología Sistemática APROBADAS.";

// 16 obligatorias — orden visual del PNG oficial (numeración 1-16) [f]
const MATERIAS = [
  { id: "sg",   cod: 251, n: "Sociología General",                        s: "Soc. General",             req: [] },
  { id: "fil",  cod: 252, n: "Filosofía",                                 s: "Filosofía",                req: [] },
  { id: "hsmc", cod: 253, n: "Historia Social Moderna y Contemporánea",   s: "H. Social Mod. y Contemp.", req: [] },
  { id: "eco2", cod: 256, n: "Economía II",                               s: "Economía II",              req: [] },
  { id: "hcs1", cod: 254, n: "Historia del Conocimiento Sociológico I",   s: "HCS I",                    req: ["sg", "fil"] },
  { id: "epi",  cod: 255, n: "Epistemología de las Ciencias Sociales",    s: "Epistemología",            req: ["fil"] },
  { id: "hcs2", cod: 257, n: "Historia del Conocimiento Sociológico II",  s: "HCS II",                   req: ["hcs1"] },            // [b]
  { id: "met1", cod: 258, n: "Metodología I",                             s: "Metodología I",            req: ["sg", "epi", "eco2"] }, // [a]
  { id: "hsl",  cod: 259, n: "Historia Social Latinoamericana",           s: "H. Social Latinoam.",      req: ["hsmc", "eco2"] },
  { id: "ssis", cod: 260, n: "Sociología Sistemática",                    s: "Soc. Sistemática",         req: ["hcs2"] },
  { id: "met2", cod: 261, n: "Metodología II",                            s: "Metodología II",           req: ["met1"] },
  { id: "hsa",  cod: 262, n: "Historia Social Argentina",                 s: "H. Social Argentina",      req: ["hsl"] },
  { id: "met3", cod: 264, n: "Metodología III",                           s: "Metodología III",          req: ["met2"] },
  { id: "asa",  cod: 265, n: "Análisis de la Sociedad Argentina",         s: "Análisis Soc. Argentina",  req: ["hsa", "hcs1"] },
  { id: "spol", cod: 263, n: "Sociología Política",                       s: "Soc. Política",            req: ["ssis", "hsmc", "eco2"] },
  { id: "psoc", cod: 266, n: "Psicología Social",                         s: "Psicología Social",        req: ["ssis"] },
];

// Tramo optativo: grupos de N cupos con requisitos fijos (tarjetas-grupo, no umbrales).
// `cantidad` = cuántas materias representa la tarjeta: pesa N en la barra (ver SCHEMA.md).
const OPTATIVAS = [
  {
    id: "espec",
    n: "Sociologías Especiales",
    s: "Soc. Especiales",
    cantidad: 6,
    req: ["hcs2", "met1"],
    comentario: "Seis materias a elegir. Piden HCS II y Metodología I (cursadas).",
  },
  {
    id: "teor",
    n: "Teorías Sociológicas",
    s: "Teorías Sociológicas",
    cantidad: 3,
    req: ["met1", "ssis"],
    reqAprobadas: true, // [c] [★] confirmar contra SIU
    comentario:
      "Tres materias a elegir. La carrera indica Metodología I y Sociología Sistemática APROBADAS. [★]",
  },
];

// Idioma: tres niveles de UN idioma a elección (francés o inglés) [d].
// El plan lo describe declarativamente (niveles: 3, reqNivel1: []); acá se
// expande a los 3 niveles encadenados que pide el motor. Nivel I sin gate:
// req [] = solo CBC. Corre por fuera del conteo de la barra.
const IDIOMA = [
  { id: "idi1", n: "Idioma · Nivel I",   s: "Idioma I",   req: [] },
  { id: "idi2", n: "Idioma · Nivel II",  s: "Idioma II",  req: ["idi1"] },
  { id: "idi3", n: "Idioma · Nivel III", s: "Idioma III", req: ["idi2"] },
];

const IDIOMA_COMENTARIO =
  "El plan exige los tres niveles de un mismo idioma a elegir entre inglés y francés. Nivel I no pide materias; II y III encadenados.";

// Hito informativo (no es materia, no cuenta en la barra).
// Se dibuja como pill sin tick ni conteo; se enciende al cumplir su req.
const HITOS = [
  {
    id: "horasinv",
    n: "Horas de Investigación (200 hs)",
    req: ["met1", "ssis"],
    reqAprobadas: true, // [c] [★] confirmar contra SIU
    comentario:
      "200 horas mediante Seminarios y/o Talleres de investigación. Se habilitan con Metodología I y Sociología Sistemática aprobadas. [★] Pill informativa: no suma al conteo de materias.",
  },
];

// Cuenta regresiva del título: 16 obligatorias + 6 especiales + 3 teorías = 25 materias.
// Idioma (3 niveles) y 200 hs de investigación corren por fuera del conteo.
const TOTAL_MATERIAS = 25;

export {
  NOMBRE,
  TITULO,
  PLAN,
  REGIMEN_CORRELATIVAS,
  NOTA_PIE,
  MATERIAS,
  OPTATIVAS,
  IDIOMA,
  IDIOMA_COMENTARIO,
  HITOS,
  TOTAL_MATERIAS,
};
