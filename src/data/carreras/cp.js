const CARRERA_CP = {
  id: "cp",
  nombre: "Ciencia Política",
  plan: {
    general: [
      { id: "eco", n: "Economía", s: "Economía", req: [] },
      { id: "tps1", n: "Teoría Política y Social I", s: "Teo I", req: [] },
      { id: "fcp1", n: "Fundamentos de Ciencia Política I", s: "Fundamentos I", req: [] },
      { id: "fym", n: "Filosofía y Métodos de las Ciencias Sociales", s: "Filo y Métodos", req: [] },
      { id: "tdc", n: "Teoría y Derecho Constitucional", s: "Derecho Const.", req: [] },
      { id: "hc", n: "Historia Contemporánea", s: "H. Contemporánea", req: [] },

      { id: "tps2", n: "Teoría Política y Social II", s: "Teo II", req: ["tps1"] },
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
      { id: "id1", n: "Idioma · Nivel I", s: "Idioma I", req: [], min: 6 },
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
