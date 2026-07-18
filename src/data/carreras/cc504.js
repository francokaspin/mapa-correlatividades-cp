/* ============================================================
   CIENCIAS DE LA COMUNICACIÓN · UBA Sociales — PLAN 504/23
   DATA DE CORRELATIVAS · Estado: VERIFICADA contra fuentes
   oficiales · pendiente de auditoría de Franco.

   PLAN VIGENTE: Res. (CS) Nº 504/2023 (RESCS-2023-504-E-UBA-REC),
   aprobada por el Consejo Superior el 26/4/2023, implementada
   desde 2024. Es el plan de TODOS los ingresantes desde 2024
   (los estudiantes previos con <6 aprobadas pasaron automático;
   6-24 pudieron optar; >24 permanecen en el 440/90).
   Correlatividades: sección j) del propio plan (Anexo de la
   RESCS-2023-504) — acá el régimen viene POR TRAMOS con
   umbrales, no por materia individual.

   FUENTES (consultadas 14/07/2026):
   1. Res. (CS) 504/2023 + Anexo (texto digital, secciones f, g,
      h, i, j y k):
      https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2023/05/RESCS-2023-504-E-UBA-REC_yANEXO.pdf
   2. Página oficial del plan (pestaña "Plan Nuevo 504-23"):
      https://comunicacion.sociales.uba.ar/plan-de-estudios/
   3. Información del nuevo plan (implementación, equivalencias):
      https://comunicacion.sociales.uba.ar/informacion-nuevo-plan-estudios/
   4. Pase y recomendaciones (reglas de transición 440→504):
      https://comunicacion.sociales.uba.ar/plan-nuevo-pase-y-recomendaciones/
   5. Díptico oficial del plan (referencia visual):
      https://comunicacion.sociales.uba.ar/wp-content/uploads/sites/16/2024/08/Diptico-Plan-de-Estudios-Carrera-de-Ciencias-de-la-Comunicacion-cc-copy-imagenes-0-scaled.jpg

   VERIFICACIÓN: extracción por pdftotext del texto digital de la
   resolución (sección j completa) + cotejo contra la página
   oficial del plan: listas de materias por área y todos los
   umbrales coinciden. Sección g) confirma la cuenta del título.

   RÉGIMEN OFICIAL TRANSCRIPTO (Res. CS 504/2023, sección j):
   ------------------------------------------------------------
   Área Comunicacional (9, todas):                       CBC
   Talleres de la Práctica Comunicacional (4, todos):    CBC
   Área Ciencias Sociales (3 de 5):                      CBC
   Seminarios Problemática del Campo (2 de 3):  7 materias
                              aprobadas y 1 taller del C. Inicial
   Práctica Pre-Profesional I:  2 talleres aprobados + 4 materias
        de las otras áreas del Ciclo Inicial, siendo al menos 2
        del Campo Comunicacional                          [b]
   Ciclo Orientado (elegir 1 de 3: Intervención /
     Producción / Investigación):
     · Introductorias (3 de las listadas): al menos 10 materias
       aprobadas y 2 talleres aprobados del Ciclo Inicial,
       incluyendo la PPP inicial                          [★a]
     · Recorrido Aplicado (4): 2 Introductorias aprobadas del
       mismo ciclo
     · Específicas (2): 3 aprobadas del Recorrido Aplicado
     · PPP II: 2 Introductorias aprobadas del ciclo
   Seminarios Ad Hoc / Optativos (2): 3 aprobadas del
     Recorrido Aplicado
   Taller de TIF: al menos 3 aprobadas entre Específicas
     y/o Seminarios Ad Hoc
   TIF: TODO el Ciclo Inicial y Orientado aprobado (incluye
     PPP 1 y 2) + requisito de idioma aprobado
   Idioma: 3 niveles de un idioma a elegir entre francés,
     inglés, alemán, italiano y portugués                 [c]

   NOTAS DE INTERPRETACIÓN:
   [★a] "Al menos 10 materias aprobadas y 2 talleres aprobados
        del ciclo inicial incluyendo la práctica pre-profesional
        inicial": la resolución no aclara si los 2 talleres
        cuentan dentro de las 10 (lectura inclusiva: 10 en total,
        de las cuales ≥2 talleres) o se suman (lectura disjunta:
        10 + 2 = 12). Se adopta la LECTURA INCLUSIVA por defecto
        (umbral 10 con ≥2 talleres + PPP I), marcada [★] para
        confirmar contra SIU. El evaluador ya soporta "N
        incluyendo X".
   [b]  PPP I: "al menos 2 materias del Campo Comunicacional" se
        interpreta como Área Comunicacional (las 9). La lectura
        alternativa (Seminarios de Problemática del Campo) es
        inviable: esos seminarios exigen 7 aprobadas y la PPP I
        solo requiere 6 en total. Interpretación firme por
        factibilidad; documentada igual.
   [c]  El gate del idioma ("pueden cursarse una vez aprobadas
        seis materias más el CBC") figura en la página oficial
        del plan pero NO en la sección j) de la resolución. Se
        adopta con fuente=sitio oficial (coincide con el régimen
        de idiomas del plan 440 y del CLE de Sociales). Nivel I
        con 6; II y III encadenados.
   [d]  Materias marcadas (*) en la resolución pueden cursarse
        por estudiantes de cualquier ciclo orientado: Estado,
        Democracia y Políticas de Comunicación (Intervención);
        Técnicas de Investigación en Opinión Pública
        (Producción); Políticas de la Convergencia
        (Investigación). Además: puede tomarse 1 aplicada de
        otro ciclo (**) y 1 específica de otro ciclo (***).
   [e]  Cuenta del título (sección g): CBC + 18 del Ciclo
        Inicial (9 Comunicacional + 4 talleres + 3 de CsSoc +
        2 de Problemática) + 12 del Orientado (3 Introductorias
        + 4 Aplicadas + 2 Específicas + 2 Seminarios + Taller
        TIF) = 30 materias; PPP I, PPP II, TIF e idioma son
        requisitos por fuera del conteo.
   [f]  Los estudiantes del 440 que pasan al 504 llevan
        equivalencias automáticas (sección k de la resolución:
        cambios de denominación 1:1, p. ej. TyPC I → Teorías de
        la Comunicación). No afecta esta data; es dato de
        onboarding para usuarios que migraron.
   ============================================================ */

/* ---- MAPEO AL MOTOR (agregado al entrar al repo) --------------
   La data verificada de arriba entra intacta: ids, nombres,
   umbrales (7/10/2/4/3…) y comentarios se conservan tal cual.
   Cambia el NOMBRE de los campos y la FORMA de los umbrales, para
   que el motor genérico los resuelva (ver src/data/SCHEMA.md):

     nombre → n            (nombre completo, valor idéntico)
     req por tramos → req por materia. El régimen pone el umbral
       UNA vez por tramo; el motor lo pide por materia. Se define
       cada umbral como constante y se referencia en el req de
       las materias del tramo. Los umbrales NO cambian:
         { min: 7, incluyendo: [{grupo:"talleres", min:1}] }
           → { min: 7, of: CICLO_INICIAL_IDS, includes: [{or: TALLERES_IDS}] }
         gateOrientado { min:10, incluyendo:[{talleres:2}, "ppp1"] }
           → { min:10, of: CICLO_INICIAL_IDS, includes:[{min:2, of:TALLERES_IDS}, "ppp1"] }
         { introductoriasMismoCiclo: 2 } → { min:2, of: INTRO_IDS[ciclo] }
         { aplicadas: 3 } → { min:3, of: APLICADAS_IDS[ciclo] }
         { especificasOSeminarios: 3 } → { min:3, of:[...específicas, "sem", "sem"] }
           (la tarjeta-grupo "sem" son 2 materias → cuenta como 2 en el umbral)
       Los topes por bloque (Cs. Sociales 3/5, Problemática 2/3,
       Introductorias 3, Aplicadas 4, Específicas 2) van en el UI
       como `cap`; el motor suma min(aprobadas, cap) a la barra.

   Campos AGREGADOS (presentación, no son data de la resolución):
     s   = nombre corto para las metalíneas. AUDITAR.
     ori = ciclo orientado de la tarjeta (filtra grilla y barra).
     requisito = las PPP: se marcan y gatean, peso 0 (no suman).
     `cap` en el UI = tope de conteo del tramo (materias con
       nombre propio que el estudiante elige; suma hasta el tope).

   OJO: los ids de ciclo se prefijan `cic_` (cic_int/cic_pro/
   cic_inv) para NO chocar en el grafo plano con la materia `inv`
   (La Investigación en Comunicación) del Área Comunicacional.
   Los nombres/labels de los ciclos quedan intactos.

   La flexibilidad cross-ciclo (materias (*), (**), (***)) queda
   como COPY en v1 (badge "Compartida" + footer), SIN lógica: la
   data la trae (`compartida: true`) pero el motor no la aplica.
   -------------------------------------------------------------- */

const NOMBRE = "Cs. de la Comunicación · Plan 504/23";
const TITULO = "Licenciatura en Ciencias de la Comunicación";
const PLAN = "Res. (CS) Nº 504/2023 — vigente para ingresantes desde 2024";
const REGIMEN_CORRELATIVAS = "Res. (CS) Nº 504/2023, Anexo sección j";

const NOTA_PIE =
  "Las correlatividades del plan 504/23 son por tramos y umbrales de materias APROBADAS, no por materia individual. Celdas [★]: confirmá contra SIU.";

// ---- Pools de ids para los umbrales (los ids son los del archivo raíz) ----
const COMUNICACIONAL_IDS = ["tcom", "pcpc", "cycu", "semi", "hmed", "dcom", "inv", "ppc", "smed"];
const TALLERES_IDS = ["tesc", "trgp", "trad", "tavi"];
const CSOCIALES_IDS = ["mtis", "hsg", "hsal", "epol", "antc"];
const PROBLEMATICA_IDS = ["cpcm", "tcs", "cis"];
const CICLO_INICIAL_IDS = [...COMUNICACIONAL_IDS, ...TALLERES_IDS, ...CSOCIALES_IDS, ...PROBLEMATICA_IDS];
// "otras áreas del Ciclo Inicial" = todo menos los talleres (para PPP I) [b].
const OTRAS_AREAS_IDS = [...COMUNICACIONAL_IDS, ...CSOCIALES_IDS, ...PROBLEMATICA_IDS];

const INTRO_IDS = {
  cic_int: ["edpc", "poc", "plan", "cec", "isc"],
  cic_pro: ["eec", "pgec", "eeea", "tiop"],
  cic_inv: ["pcon", "tspc", "epis", "psic"],
};
const APLICADAS_IDS = {
  cic_int: ["cic", "decp", "mcpa", "ccc", "pcee"],
  cic_pro: ["trg", "trr", "trav", "tip", "tct", "come", "plme", "crea"],
  cic_inv: ["pcul", "dsr", "epc", "epo", "esty", "ayr", "pctl"],
};
const ESPECIFICAS_IDS = {
  cic_int: ["tedu", "iasc", "lcom"],
  cic_pro: ["pps", "dyc", "camp", "ncav"],
  cic_inv: ["harm", "pic", "pced"],
};
const ALL_INTRO_IDS = [...INTRO_IDS.cic_int, ...INTRO_IDS.cic_pro, ...INTRO_IDS.cic_inv];
const ALL_APLICADAS_IDS = [...APLICADAS_IDS.cic_int, ...APLICADAS_IDS.cic_pro, ...APLICADAS_IDS.cic_inv];
const ALL_ESPECIFICAS_IDS = [...ESPECIFICAS_IDS.cic_int, ...ESPECIFICAS_IDS.cic_pro, ...ESPECIFICAS_IDS.cic_inv];

// ---- Umbrales del régimen (sección j), en la forma del motor ----
const GATE_PROBLEMATICA = { min: 7, of: CICLO_INICIAL_IDS, includes: [{ or: TALLERES_IDS }] };
const GATE_ORIENTADO = { min: 10, of: CICLO_INICIAL_IDS, includes: [{ min: 2, of: TALLERES_IDS }, "ppp1"] }; // [★a]
const reqAplicadas = (ciclo) => ({ min: 2, of: INTRO_IDS[ciclo] });
const reqEspecificas = (ciclo) => ({ min: 3, of: APLICADAS_IDS[ciclo] });
const REQ_SEMINARIOS = { min: 3, of: ALL_APLICADAS_IDS };
// "≥3 aprobadas entre Específicas y/o Seminarios": el régimen cuenta MATERIAS
// aprobadas y la tarjeta-grupo "sem" representa DOS (los dos seminarios). Va dos
// veces en `of` para que, marcada, aporte 2 al umbral (1 específica + Seminarios
// = 3 → abre; Seminarios solos = 2 → no alcanza).
const REQ_TALLER_TIF = { min: 3, of: [...ALL_ESPECIFICAS_IDS, "sem", "sem"] };

// ================= CICLO INICIAL (18 a aprobar) =================

// Área Comunicacional: se aprueban las 9. Req: CBC.
const COMUNICACIONAL = [
  { id: "tcom", n: "Teorías de la Comunicación", s: "Teorías de la Comunic.", req: [] },
  { id: "pcpc", n: "Principales Corrientes del Pensamiento Contemporáneo", s: "Ppales. Corrientes", req: [] },
  { id: "cycu", n: "Comunicación y Cultura", s: "Comunicación y Cultura", req: [] },
  { id: "semi", n: "Semiótica", s: "Semiótica", req: [] },
  { id: "hmed", n: "Historia de los Medios", s: "H. de los Medios", req: [] },
  { id: "dcom", n: "Derecho a la Comunicación", s: "Derecho a la Comunic.", req: [] },
  { id: "inv", n: "La Investigación en Comunicación", s: "Investigación en Com.", req: [] },
  { id: "ppc", n: "Políticas Públicas de Comunicación", s: "Pol. Públicas de Com.", req: [] },
  { id: "smed", n: "Semiótica de los Medios", s: "Semiótica de los Medios", req: [] },
];

// Talleres de la Práctica Comunicacional: se aprueban los 4. Req: CBC.
const TALLERES = [
  { id: "tesc", n: "Taller de Escritura", s: "T. de Escritura", req: [] },
  { id: "trgp", n: "Taller de Redacción y Géneros Periodísticos", s: "T. Redacción y G. Period.", req: [] },
  { id: "trad", n: "Taller Radial", s: "T. Radial", req: [] },
  { id: "tavi", n: "Taller Audiovisual", s: "T. Audiovisual", req: [] },
];

// Área Ciencias Sociales: se aprueban 3 de 5 (tope 3 en el UI). Req: CBC.
const CSOCIALES = [
  { id: "mtis", n: "Metodologías y Técnicas de la Investigación Social", s: "Metod. y Téc. Inv. Social", req: [] },
  { id: "hsg", n: "Historia Social General", s: "H. Social General", req: [] },
  { id: "hsal", n: "Historia Social Argentina y Latinoamericana", s: "H. Soc. Arg. y Latinoam.", req: [] },
  { id: "epol", n: "Economía Política", s: "Economía Política", req: [] },
  { id: "antc", n: "Antropología y Comunicación", s: "Antropología y Com.", req: [] },
];

// Seminarios Problemática del Campo: se aprueban 2 de 3 (tope 2).
// Req: 7 aprobadas del Ciclo Inicial incluyendo ≥1 taller.
const PROBLEMATICA = [
  { id: "cpcm", n: "Cultura Popular y Cultura de Masas", s: "Cult. Popular y de Masas", req: [GATE_PROBLEMATICA] },
  { id: "tcs", n: "Técnica, Cultura y Sociedad", s: "Técnica, Cultura y Soc.", req: [GATE_PROBLEMATICA] },
  { id: "cis", n: "Cuerpo, Imagen y Sentido", s: "Cuerpo, Imagen y Sentido", req: [GATE_PROBLEMATICA] },
];

// Práctica Pre-Profesional I (requisito de cursada, peso 0) [b].
// Req: 2 talleres + 4 materias de otras áreas del C. Inicial, ≥2 del Comunicacional.
const PPP1 = {
  id: "ppp1",
  n: "Práctica Pre-Profesional I",
  s: "PPP I",
  requisito: true,
  req: [
    { min: 2, of: TALLERES_IDS },
    { min: 4, of: OTRAS_AREAS_IDS },
    { min: 2, of: COMUNICACIONAL_IDS },
  ],
  nota: "Requisito de graduación (no cuenta como materia). 2 talleres + 4 materias de otras áreas, ≥2 del Área Comunicacional.",
};

// ================= CICLO ORIENTADO (elegir 1; 12 al conteo + PPP II) =================

// Cabeceras del selector (un ciclo a elegir). Sin cabecera-materia: el ingreso
// a las Introductorias es por umbral (GATE_ORIENTADO). Ids `cic_` [ver MAPEO].
const CICLOS = [
  { id: "cic_int", label: "Intervención", s: "Intervención" },
  { id: "cic_pro", label: "Producción", s: "Producción" },
  { id: "cic_inv", label: "Investigación", s: "Investigación" },
];

// Introductorias (3 al conteo por ciclo). Gate: GATE_ORIENTADO [★a].
const INTRODUCTORIAS = [
  // — Intervención —
  { id: "edpc", ori: "cic_int", compartida: true, n: "Estado, Democracia y Políticas de Comunicación", s: "Estado, Dem. y Pol. Com.", req: [GATE_ORIENTADO] }, // (*) [d]
  { id: "poc", ori: "cic_int", n: "Procesos Organizacionales y Comunicación", s: "Proc. Organiz. y Com.", req: [GATE_ORIENTADO] },
  { id: "plan", ori: "cic_int", n: "Planificación en Comunicación", s: "Planif. en Com.", req: [GATE_ORIENTADO] },
  { id: "cec", ori: "cic_int", n: "Comunicación, Educación y Cultura", s: "Com., Educ. y Cultura", req: [GATE_ORIENTADO] },
  { id: "isc", ori: "cic_int", n: "Intervención Social y Comunicación", s: "Interv. Social y Com.", req: [GATE_ORIENTADO] },
  // — Producción —
  { id: "eec", ori: "cic_pro", n: "Editorialidad y Estrategias de Comunicación", s: "Editorial. y Estrat. Com.", req: [GATE_ORIENTADO] },
  { id: "pgec", ori: "cic_pro", n: "Planificación y Gestión de Emprendimientos Comunicacionales", s: "Planif. y Gest. Emprend.", req: [GATE_ORIENTADO] },
  { id: "eeea", ori: "cic_pro", n: "Elementos y Estructuras de la Expresión Audiovisual", s: "Elem. y Estr. Expr. AV", req: [GATE_ORIENTADO] },
  { id: "tiop", ori: "cic_pro", compartida: true, n: "Técnicas de Investigación en Opinión Pública", s: "Téc. Inv. Op. Pública", req: [GATE_ORIENTADO] }, // (*) [d]
  // — Investigación —
  { id: "pcon", ori: "cic_inv", compartida: true, n: "Políticas de la Convergencia", s: "Pol. de la Convergencia", req: [GATE_ORIENTADO] }, // (*) [d]
  { id: "tspc", ori: "cic_inv", n: "Teoría Social y Problemas de la Comunicación", s: "Teoría Social y Prob. Com.", req: [GATE_ORIENTADO] },
  { id: "epis", ori: "cic_inv", n: "Epistemología de la Comunicación", s: "Epistemología de la Com.", req: [GATE_ORIENTADO] },
  { id: "psic", ori: "cic_inv", n: "Psicología y Comunicación", s: "Psicología y Com.", req: [GATE_ORIENTADO] },
];

// Recorrido Aplicado (4 al conteo por ciclo). Req: 2 Introductorias del mismo ciclo.
const APLICADAS = [
  // — Intervención —
  { id: "cic", ori: "cic_int", n: "Comunicación Institucional y Corporativa", s: "Com. Instit. y Corp.", req: [reqAplicadas("cic_int")] },
  { id: "decp", ori: "cic_int", n: "Diseño Estratégico de la Comunicación en Políticas Públicas", s: "Diseño Estrat. Com. PP", req: [reqAplicadas("cic_int")] },
  { id: "mcpa", ori: "cic_int", n: "Medios de Comunicación Comunitarios, Populares y Alternativos", s: "Medios Com., Pop. y Alt.", req: [reqAplicadas("cic_int")] },
  { id: "ccc", ori: "cic_int", n: "Comunicación y Cultura Comunitaria", s: "Com. y Cult. Comunit.", req: [reqAplicadas("cic_int")] },
  { id: "pcee", ori: "cic_int", n: "Prácticas Comunicacionales en Entornos Educativos", s: "Prácticas Com. Educ.", req: [reqAplicadas("cic_int")] },
  // — Producción —
  { id: "trg", ori: "cic_pro", n: "Taller de Realización Gráfica", s: "T. Realiz. Gráfica", req: [reqAplicadas("cic_pro")] },
  { id: "trr", ori: "cic_pro", n: "Taller de Realización Radial", s: "T. Realiz. Radial", req: [reqAplicadas("cic_pro")] },
  { id: "trav", ori: "cic_pro", n: "Taller de Realización Audiovisual", s: "T. Realiz. Audiovisual", req: [reqAplicadas("cic_pro")] },
  { id: "tip", ori: "cic_pro", n: "Taller de Investigación Periodística", s: "T. Inv. Periodística", req: [reqAplicadas("cic_pro")] },
  { id: "tct", ori: "cic_pro", n: "Taller de Comunicación Transmedia", s: "T. Com. Transmedia", req: [reqAplicadas("cic_pro")] },
  { id: "come", ori: "cic_pro", n: "Comercialización", s: "Comercialización", req: [reqAplicadas("cic_pro")] },
  { id: "plme", ori: "cic_pro", n: "Planificación de Medios", s: "Planif. de Medios", req: [reqAplicadas("cic_pro")] },
  { id: "crea", ori: "cic_pro", n: "Creatividad Publicitaria", s: "Creatividad Public.", req: [reqAplicadas("cic_pro")] },
  // — Investigación —
  { id: "pcul", ori: "cic_inv", n: "Procesos Culturales", s: "Procesos Culturales", req: [reqAplicadas("cic_inv")] },
  { id: "dsr", ori: "cic_inv", n: "Discursos y Semiótica de Redes", s: "Discursos y Sem. Redes", req: [reqAplicadas("cic_inv")] },
  { id: "epc", ori: "cic_inv", n: "Economía Política de la Comunicación", s: "Econ. Pol. de la Com.", req: [reqAplicadas("cic_inv")] },
  { id: "epo", ori: "cic_inv", n: "Espacio Público y Opinión", s: "Espacio Púb. y Opinión", req: [reqAplicadas("cic_inv")] },
  { id: "esty", ori: "cic_inv", n: "Estética y Comunicación", s: "Estética y Com.", req: [reqAplicadas("cic_inv")] },
  { id: "ayr", ori: "cic_inv", n: "Audiencias y Recepción", s: "Audiencias y Recepción", req: [reqAplicadas("cic_inv")] },
  { id: "pctl", ori: "cic_inv", n: "Políticas Culturales", s: "Políticas Culturales", req: [reqAplicadas("cic_inv")] },
];

// Específicas (2 al conteo por ciclo). Req: 3 aprobadas del Recorrido Aplicado.
const ESPECIFICAS = [
  // — Intervención —
  { id: "tedu", ori: "cic_int", n: "Tecnologías Educativas", s: "Tecnologías Educativas", req: [reqEspecificas("cic_int")] },
  { id: "iasc", ori: "cic_int", n: "Investigación-Acción Socio-Comunitaria", s: "Inv-Acción Socio-Com.", req: [reqEspecificas("cic_int")] },
  { id: "lcom", ori: "cic_int", n: "Legislación Comparada", s: "Legislación Comparada", req: [reqEspecificas("cic_int")] },
  // — Producción —
  { id: "pps", ori: "cic_pro", n: "Periodismo, Política y Sociedad", s: "Periodismo, Pol. y Soc.", req: [reqEspecificas("cic_pro")] },
  { id: "dyc", ori: "cic_pro", n: "Diseño y Comunicación", s: "Diseño y Com.", req: [reqEspecificas("cic_pro")] },
  { id: "camp", ori: "cic_pro", n: "Campañas Publicitarias", s: "Campañas Public.", req: [reqEspecificas("cic_pro")] },
  { id: "ncav", ori: "cic_pro", n: "La Narración en la Cultura Audiovisual", s: "Narración Cult. AV", req: [reqEspecificas("cic_pro")] },
  // — Investigación —
  { id: "harm", ori: "cic_inv", n: "Historia del Arte y su Relación con los Medios Masivos de Comunicación", s: "H. del Arte y Medios", req: [reqEspecificas("cic_inv")] },
  { id: "pic", ori: "cic_inv", n: "Políticas Internacionales de Comunicación", s: "Pol. Internac. de Com.", req: [reqEspecificas("cic_inv")] },
  { id: "pced", ori: "cic_inv", n: "Pantallas, Cultura y Educación en la Era Digital", s: "Pantallas, Cult. y Educ.", req: [reqEspecificas("cic_inv")] },
];

// PPP II (requisito de cursada, peso 0): 2 Introductorias aprobadas del ciclo.
const PPP2 = {
  id: "ppp2",
  n: "Práctica Pre-Profesional II",
  s: "PPP II",
  requisito: true,
  req: [{ min: 2, of: ALL_INTRO_IDS }],
  nota: "60 hs de práctica asistida, tutoreada por cátedras del ciclo. No cuenta como materia.",
};

// Seminarios Ad Hoc / Optativos: 2, con 3 aplicadas aprobadas (tarjeta-grupo ×2).
const SEMINARIOS = [
  {
    id: "sem",
    n: "Seminarios Ad Hoc / Optativos",
    s: "Seminarios",
    cantidad: 2,
    req: [REQ_SEMINARIOS],
    nota: "Dos seminarios. Oferta renovada anualmente (1er y 2do cuatrimestre y verano). Piden 3 aprobadas del Recorrido Aplicado.",
  },
];

// Taller de TIF (materia, cuenta 1): ≥3 aprobadas entre Específicas y/o Seminarios.
const TALLER_TIF = [
  {
    id: "ttif",
    n: "Taller de Trabajo Integrador Final",
    s: "Taller de TIF",
    req: [REQ_TALLER_TIF],
    nota: "Hay un Taller de TIF por orientación; puede cursarse el de cualquier ciclo. Pide 3 aprobadas entre Específicas y Seminarios.",
  },
];

// TIF (requisito final): TODO el plan + PPP I y II + idioma. Pill informativa que
// se enciende sola al completar todo (whenComplete + PPP + idioma en ui.js).
const TIF = {
  id: "tif",
  n: "Trabajo Integrador Final",
  req: ["ppp1", "ppp2", "idi3"],
  nota: "Última instancia de la carrera. Requiere todo el Ciclo Inicial y Orientado aprobado (incluye PPP I y II) y el idioma aprobado.",
};

// Idioma: 3 niveles de UN idioma entre 5 opciones [c]. Nivel I con 6 del C. Inicial.
const IDIOMA = [
  { id: "idi1", n: "Idioma · Nivel I", s: "Idioma I", req: [{ min: 6, of: CICLO_INICIAL_IDS }] },
  { id: "idi2", n: "Idioma · Nivel II", s: "Idioma II", req: ["idi1"] },
  { id: "idi3", n: "Idioma · Nivel III", s: "Idioma III", req: ["idi2"] },
];

const IDIOMA_COMENTARIO =
  "Tres niveles (o examen global libre) de un mismo idioma a elegir entre francés, inglés, alemán, italiano y portugués. Nivel I con CBC + 6 materias aprobadas (fuente: sitio oficial); II y III encadenados.";

// 18 del Ciclo Inicial + 12 del Orientado (incluye Taller TIF y 2 seminarios) = 30 [e].
// PPP I, PPP II, TIF e idioma corren por fuera del conteo.
const TOTAL_MATERIAS = 30;

export {
  NOMBRE,
  TITULO,
  PLAN,
  REGIMEN_CORRELATIVAS,
  NOTA_PIE,
  COMUNICACIONAL,
  TALLERES,
  CSOCIALES,
  PROBLEMATICA,
  PPP1,
  CICLOS,
  INTRODUCTORIAS,
  APLICADAS,
  ESPECIFICAS,
  PPP2,
  SEMINARIOS,
  TALLER_TIF,
  TIF,
  IDIOMA,
  IDIOMA_COMENTARIO,
  TOTAL_MATERIAS,
  // pools y umbrales (para tests / auditoría)
  COMUNICACIONAL_IDS,
  TALLERES_IDS,
  CSOCIALES_IDS,
  PROBLEMATICA_IDS,
  CICLO_INICIAL_IDS,
  INTRO_IDS,
  APLICADAS_IDS,
  ESPECIFICAS_IDS,
  GATE_ORIENTADO,
};
