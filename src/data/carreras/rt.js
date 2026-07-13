/* ============================================================
   RELACIONES DEL TRABAJO · UBA Sociales — DATA DE CORRELATIVAS
   Estado: VERIFICADA contra fuentes oficiales · pendiente de
   auditoría de Franco antes de entrar al repo.

   FUENTES (consultadas 12-13/07/2026):
   1. Tabla oficial de correlatividades de la carrera:
      https://relacionesdeltrabajo.sociales.uba.ar/mapa-correlatividades/
      (Res. (CS) N° 1440/90 y Res. (CD) N° 1161/93 — PDFs linkeados ahí)
   2. FAQ oficial de la carrera (optativas y título intermedio):
      https://relacionesdeltrabajo.sociales.uba.ar/estudiantes/
   3. Plan de estudios Res. (CS) N° 74/85 (título intermedio, 3
      especialidades) — vigencia "1985/1993-ACTUAL" según el
      certificado del Depto. de Alumnos publicado por la facultad.
   Verificación: transcripción cotejada programáticamente código
   por código contra la fuente 1 (24/24 sin diferencias). El flyer
   estudiantil (La UES/CECSo/Generación RT) coincide en estructura
   y reglas especiales; se usó solo como cross-check, no como fuente.

   —— TABLA OFICIAL (fuente 1, literal) para auditar ——————————————
   Cód | Materia                                    | Requiere
   901 | Principios de la Sociología del Trabajo    | CBC Completo
   925 | Economía Política I                        | CBC Completo
   926 | Economía Política II                       | 925
   903 | Administración de Empresas                 | CBC Completo
   904 | Administración de Personal I               | 903
   905 | Derecho del Trabajo I                      | CBC Completo
   927 | Estadística Aplicada I                     | CBC Completo
   928 | Estadística Aplicada II                    | 927
   907 | Economía del Trabajo                       | 926
   908 | Historia Social Contemporánea              | CBC Completo
   909 | Derecho del Trabajo II                     | 905
   910 | Administración de Personal II              | 904 · 928
   911 | Administración de Personal III             | 910
   912 | Computación y Sistemas de Información      | 928
   913 | Psicología del Trabajo                     | 903
   914 | Derecho Administ. y Procesal del Trabajo   | 909
   915 | Estructura Económica y Social Argentina    | 908 · 926 · 928
   916 | Relaciones del Trabajo                     | 907 · 914
   917 | Condiciones y Medio Ambiente del Trabajo   | 907 · 909
   918 | Sociología del Trabajo                     | 901
   919 | Teoría y Comportamiento Organizacional     | 911 · 912 · 913 · 918
   920 | Metodología de la Invest. y la Evaluación  | 901 · 913 · 928
   921 | Derecho de la Seguridad Social             | 914 · 916
   922 | Historia del Movimiento Obrero Nac. e Int. | 915
       | Materia Optativa I y II                    | Cuando falten 7 materias
   991 | Inglés I                                   | 6 materias de la carrera
   992 | Inglés II                                  | 991
   993 | Inglés III                                 | 992
   ————————————————————————————————————————————————————————————

   NOTAS DE INTERPRETACIÓN (auditar):
   a) Optativas: la FAQ oficial precisa "no adeudar más de siete (7)
      materias del Ciclo Obligatorio" — con 24 obligatorias, se
      habilitan con 17 aprobadas. El flyer dice lo mismo ("falten 7
      del ciclo obligatorio"). Codificado como min: 17.
   b) Idioma: en RT es inglés específicamente (tabla oficial 991-993
      y FAQ: "los idiomas, en nuestro caso Inglés"). Nivel I con 6
      materias de la carrera aprobadas.
   c) Título intermedio (Analista en RT, Res. CS 74/85): la FAQ
      oficial habilita a anotarse a la especialidad con "14 materias
      aprobadas del Ciclo Obligatorio correspondientes al 1er y 2do
      año (sin considerar idiomas)". Propuesto como HITO informativo
      (como idioma/orientado en CP), sin modelar las 9 materias de
      especialidad: no están en el régimen de correlativas y
      duplicarían la complejidad. Si los usuarios de RT lo piden,
      se modela completo en una v2.

   Campos: mismo formato que cp.js; si el SCHEMA.md del refactor
   usa otros nombres, se mapean 1:1 SIN tocar el contenido.
   ============================================================ */

const MATERIAS = [
  // —— cadena Administración ——
  { id: "adme", cod: 903, n: "Administración de Empresas", s: "Adm. de Empresas", req: [] },
  { id: "adp1", cod: 904, n: "Administración de Personal I", s: "Adm. Personal I", req: ["adme"] },
  { id: "adp2", cod: 910, n: "Administración de Personal II", s: "Adm. Personal II", req: ["adp1", "est2"] },
  { id: "adp3", cod: 911, n: "Administración de Personal III", s: "Adm. Personal III", req: ["adp2"] },
  // —— psico / socio ——
  { id: "psl",  cod: 901, n: "Principios de la Sociología del Trabajo", s: "Ppios. Socio. Trabajo", req: [] },
  { id: "psit", cod: 913, n: "Psicología del Trabajo", s: "Psico. del Trabajo", req: ["adme"] },
  { id: "sot",  cod: 918, n: "Sociología del Trabajo", s: "Socio. del Trabajo", req: ["psl"] },
  { id: "tco",  cod: 919, n: "Teoría y Comportamiento Organizacional", s: "T. y Comp. Organizacional", req: ["adp3", "comp", "psit", "sot"] },
  // —— cadena Economía ——
  { id: "ecp1", cod: 925, n: "Economía Política I", s: "Eco. Política I", req: [] },
  { id: "ecp2", cod: 926, n: "Economía Política II", s: "Eco. Política II", req: ["ecp1"] },
  { id: "ect",  cod: 907, n: "Economía del Trabajo", s: "Eco. del Trabajo", req: ["ecp2"] },
  { id: "meto", cod: 920, n: "Metodología de la Investigación y la Evaluación", s: "Metodología", req: ["psl", "psit", "est2"] },
  // —— cadena Estadística ——
  { id: "est1", cod: 927, n: "Estadística Aplicada I", s: "Estadística I", req: [] },
  { id: "est2", cod: 928, n: "Estadística Aplicada II", s: "Estadística II", req: ["est1"] },
  { id: "comp", cod: 912, n: "Computación y Sistemas de Información", s: "Computación", req: ["est2"] },
  { id: "rt",   cod: 916, n: "Relaciones del Trabajo", s: "Relaciones del Trabajo", req: ["ect", "dapt"] },
  // —— cadena Historia / estructura ——
  { id: "hsc",  cod: 908, n: "Historia Social Contemporánea", s: "H. Social Contemp.", req: [] },
  { id: "eesa", cod: 915, n: "Estructura Económica y Social Argentina", s: "Estructura Ec. y Soc. Arg.", req: ["hsc", "ecp2", "est2"] },
  { id: "hmo",  cod: 922, n: "Historia del Movimiento Obrero Nacional e Internacional", s: "H. Mov. Obrero", req: ["eesa"] },
  { id: "cmat", cod: 917, n: "Condiciones y Medio Ambiente del Trabajo", s: "CyMAT", req: ["ect", "dt2"] },
  // —— cadena Derecho ——
  { id: "dt1",  cod: 905, n: "Derecho del Trabajo I", s: "Derecho del Trabajo I", req: [] },
  { id: "dt2",  cod: 909, n: "Derecho del Trabajo II", s: "Derecho del Trabajo II", req: ["dt1"] },
  { id: "dapt", cod: 914, n: "Derecho Administrativo y Procesal del Trabajo", s: "D. Adm. y Procesal", req: ["dt2"] },
  { id: "dss",  cod: 921, n: "Derecho de la Seguridad Social", s: "D. Seguridad Social", req: ["dapt", "rt"] },
];

// 2 optativas: se habilitan cuando no se adeudan más de 7 de las 24
// obligatorias → 17 aprobadas (fuente 2). No son las materias del
// título intermedio (la FAQ lo aclara explícitamente).
const OPTATIVAS = [
  { id: "opt1", n: "Materia optativa 1", s: "Optativa 1", min: 17 },
  { id: "opt2", n: "Materia optativa 2", s: "Optativa 2", min: 17 },
];

// Idioma: inglés obligatorio, 3 niveles. Nivel I con 6 materias
// de la carrera aprobadas (fuentes 1 y 2).
const IDIOMA = [
  { id: "ing1", cod: 991, n: "Inglés · Nivel I", s: "Inglés I", req: [], min: 6 },
  { id: "ing2", cod: 992, n: "Inglés · Nivel II", s: "Inglés II", req: ["ing1"] },
  { id: "ing3", cod: 993, n: "Inglés · Nivel III", s: "Inglés III", req: ["ing2"] },
];

// HITO informativo (propuesta, ver nota c): con 14 aprobadas del
// ciclo obligatorio podés anotarte a la especialidad del título
// intermedio "Analista en Relaciones del Trabajo" (Res. CS 74/85;
// 3 especialidades de 3 materias c/u: Capacitación · Remuneraciones
// · Organización y Adm. en Asociaciones Profesionales de Trabajadores).
const HITO_INTERMEDIO = { min: 14, titulo: "Analista en Relaciones del Trabajo" };

export { MATERIAS, OPTATIVAS, IDIOMA, HITO_INTERMEDIO };
