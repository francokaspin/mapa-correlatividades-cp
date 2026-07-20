/* ============================================================
   CIENCIA POLÍTICA · UBA Sociales — PLAN 8558/17
   DATA DE CORRELATIVAS · Estado: VERIFICADA contra la fuente
   oficial · pendiente de auditoría de Franco.

   FUENTE: Res. CS 8558/17 (EXP-UBA 85.775/2016), PDF oficial:
   http://cienciapolitica.sociales.uba.ar/wp-content/uploads/sites/6/2019/04/PLAN-NUEVO-DE-CP-8558-17.pdf
   Caja curricular: pp. 7-8 del anexo (págs. 8-9 del PDF).
   Régimen del Ciclo Orientado: p. 9 del anexo (pág. 10).
   Verificación 2026-07-20, multi-método, 22/22.

   TABLA OFICIAL (Ciclo General, correlativas por número de
   asignatura):
   ------------------------------------------------------------
   7  Filosofía y Métodos de las Cs. Sociales   CBC Completo
   8  Metodología de la Inv. en C. Política I   7
   9  Metodología de la Inv. en C. Política II  7, 8
   10 Economía                                  CBC Completo
   11 Teoría y Derecho Constitucional           CBC Completo
   12 Filosofía                                 7
   13 Historia Contemporánea                    CBC Completo
   14 Historia Latinoamericana                  CBC Completo
   15 Historia Argentina                        CBC Completo
   16 Teoría Política y Social I                CBC Completo
   17 Teoría Política y Social II               16
   18 Teoría Sociológica                        16
   19 Teoría Política Contemporánea             13, 16, 17, 18
   20 Fundamentos de Ciencia Política I         CBC Completo
   21 Fundamentos de Ciencia Política II        20
   22 Sociología Política                       13, 20, 21
   23 Sistemas Políticos Comparados             7, 8, 9, 13, 20, 21, 22
   24 Teoría de las Relaciones Internacionales  7, 8, 9, 13, 16, 17, 18, 19, 20
   25 Opinión Pública                           7, 8, 9, 13, 16, 17, 18, 20, 22
   26 Administración y Políticas Públicas       7, 8, 9, 10, 13, 16, 17, 18, 19, 21, 22
   27 Política Argentina                        13, 15, 20, 21, 22, 23
   28 Política Latinoamericana                  7, 8, 9, 13, 14, 20, 21, 22

   MAPEO número→id: 7=fym 8=met1 9=met2 10=eco 11=tdc 12=filo
   13=hc 14=hl 15=ha 16=tps1 17=tps2 18=tsoc 19=tpc 20=fcp1
   21=fcp2 22=spol 23=spc 24=rrii 25=op 26=app 27=pa 28=pl

   CICLO ORIENTADO (29-33, textual p. 9 del anexo): "deben tener
   aprobadas por lo menos 12 (doce) asignaturas del Ciclo
   General, entre las que debe estar incluida la asignatura
   'cabecera' de la orientación respectiva". Cabeceras:
   EAyPP→26 · Pol. Comparada→23 · Pol. Latinoamericana→28 ·
   RRII→24 · OP y Análisis Político→25 · Teoría Política→19.
   Cada orientación ofrece 3 electivas, se eligen 2; 1 taller;
   2 seminarios (libres u autorizados a pedido).

   NOTAS:
   [a] Régimen fino: la resolución permite cursar con la
       correlativa CURSADA; el mapa modela APROBADA (conservador:
       nunca habilita de más). Para el Orientado la resolución sí
       exige "aprobadas".
   [b] La orientación NO es obligatoria: se puede cursar
       electivas de distintas orientaciones cumpliendo la
       cabecera de cada una. El mapa simplifica con orientación
       seleccionada.
   [c] Idioma: 3 niveles, SIN gate en la 8558/17 ni en la página
       del plan. La resolución define el requisito sin umbral
       ("REQUISITO: Un idioma a elección entre inglés, francés,
       italiano, alemán o portugués"); el min:6 que traía id1 no
       tenía fuente y se eliminó (Nivel I disponible desde el
       inicio; II y III encadenados por nivel). La regla de 6
       materias existe en RT y CC con fuente propia; en Sociología
       el régimen es explícitamente libre.
   ============================================================ */

const CARRERA_CP = {
  id: "cp",
  nombre: "Ciencia Política",
  plan: {
    general: [
      { id: "eco", n: "Economía", s: "Economía", req: [] },
      { id: "tps1", n: "Teoría Política y Social I", s: "Teopol I", req: [] },
      { id: "fcp1", n: "Fundamentos de Ciencia Política I", s: "Fundamentos I", req: [] },
      { id: "fym", n: "Filosofía y Métodos de las Ciencias Sociales", s: "Filo y Métodos", req: [] },
      { id: "tdc", n: "Teoría y Derecho Constitucional", s: "Derecho Const.", req: [] },
      { id: "hc", n: "Historia Contemporánea", s: "H. Contemporánea", req: [] },

      { id: "tps2", n: "Teoría Política y Social II", s: "Teopol II", req: ["tps1"] },
      { id: "tsoc", n: "Teoría Sociológica", s: "T. Sociológica", req: ["tps1"] },
      { id: "fcp2", n: "Fundamentos de Ciencia Política II", s: "Fundamentos II", req: ["fcp1"] },
      { id: "met1", n: "Metodología de la Investigación en Ciencia Política I", s: "Metodología I", req: ["fym"] },
      { id: "filo", n: "Filosofía", s: "Filosofía", req: ["fym"] },
      { id: "ha", n: "Historia Argentina", s: "H. Argentina", req: [] },
      { id: "pa", n: "Política Argentina", s: "Pol. Argentina", req: ["hc", "ha", "fcp1", "fcp2", "spol", "spc"] },

      { id: "tpc", n: "Teoría Política Contemporánea", s: "Teo. Contemporánea", req: ["hc", "tps1", "tps2", "tsoc"] },
      { id: "spol", n: "Sociología Política", s: "Socio. Política", req: ["hc", "fcp1", "fcp2"] },
      { id: "met2", n: "Metodología de la Investigación en Ciencia Política II", s: "Metodología II", req: ["fym", "met1"] },
      { id: "hl", n: "Historia Latinoamericana", s: "H. Latinoamericana", req: [] },
      { id: "pl", n: "Política Latinoamericana", s: "Pol. Latinoamericana", req: ["fym", "met1", "met2", "hc", "hl", "fcp1", "fcp2", "spol"] },

      { id: "app", n: "Administración y Políticas Públicas", s: "Admin. y Pol. Públicas", req: ["fym", "met1", "met2", "eco", "hc", "tps1", "tps2", "tsoc", "tpc", "fcp2", "spol"] },
      { id: "rrii", n: "Teoría de las Relaciones Internacionales", s: "RRII", req: ["fym", "met1", "met2", "hc", "tps1", "tps2", "tsoc", "tpc", "fcp1"] },
      { id: "op", n: "Opinión Pública", s: "Opinión Pública", req: ["fym", "met1", "met2", "hc", "tps1", "tps2", "tsoc", "fcp1", "spol"] },
      { id: "spc", n: "Sistemas Políticos Comparados", s: "Sist. Pol. Comparados", req: ["fym", "met1", "met2", "hc", "fcp1", "fcp2", "spol"] },
    ],

    idioma: [
      { id: "id1", n: "Idioma · Nivel I", s: "Idioma I", req: [] },
      { id: "id2", n: "Idioma · Nivel II", s: "Idioma II", req: ["id1"] },
      { id: "id3", n: "Idioma · Nivel III", s: "Idioma III", req: ["id2"] },
    ],

    orientado: [
      {
        id: "ele1",
        n: "Materia electiva 1",
        s: "Electiva 1",
        orientado: true,
        req: [
          {
            min: 12,
            of: "general",
            includes: [{ orientation: true }],
          },
        ],
      },
      {
        id: "ele2",
        n: "Materia electiva 2",
        s: "Electiva 2",
        orientado: true,
        req: [
          {
            min: 12,
            of: "general",
            includes: [{ orientation: true }],
          },
        ],
      },
      {
        id: "sem1",
        n: "Seminario 1",
        s: "Seminario 1",
        orientado: true,
        req: [
          {
            min: 12,
            of: "general",
            includes: [{ orientation: true }],
          },
        ],
      },
      {
        id: "sem2",
        n: "Seminario 2",
        s: "Seminario 2",
        orientado: true,
        req: [
          {
            min: 12,
            of: "general",
            includes: [{ orientation: true }],
          },
        ],
      },
      {
        id: "tao",
        n: "Taller de orientación",
        s: "Taller",
        orientado: true,
        req: [
          {
            min: 12,
            of: "general",
            includes: [{ orientation: true }],
          },
        ],
      },
    ],

    orientaciones: [
      { id: "app", label: "Estado, Admin. y Pol. Públicas" },
      { id: "spc", label: "Política Comparada" },
      { id: "pl", label: "Política Latinoamericana" },
      { id: "rrii", label: "Relaciones Internacionales" },
      { id: "op", label: "Opinión Pública y Análisis Político" },
      { id: "tpc", label: "Teoría Política" },
    ],
  },
};

export default CARRERA_CP;
